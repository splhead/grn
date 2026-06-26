import { createHash } from 'crypto'
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/server'

export const runtime = 'nodejs'

const MAX_IMAGE_SIZE = 8 * 1024 * 1024

function getCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim()
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim()
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim()

  if (!cloudName || !apiKey || !apiSecret) {
    return null
  }

  return {
    cloudName,
    apiKey,
    apiSecret
  }
}

function createSignature(params: Record<string, string>, apiSecret: string) {
  const payload = Object.entries(params)
    .filter(([, value]) => value.trim() !== '')
    .sort(([firstKey], [secondKey]) => firstKey.localeCompare(secondKey))
    .map(([key, value]) => `${key}=${value}`)
    .join('&')

  return createHash('sha1')
    .update(`${payload}${apiSecret}`)
    .digest('hex')
}

export async function POST(request: Request) {
  const session = await getSession()

  if (!session?.user) {
    return NextResponse.json(
      { error: 'Voce precisa estar logado para enviar imagens.' },
      { status: 401 }
    )
  }

  const config = getCloudinaryConfig()

  if (!config) {
    return NextResponse.json(
      { error: 'Cloudinary nao esta configurado no servidor.' },
      { status: 500 }
    )
  }

  const formData = await request.formData()
  const file = formData.get('file')

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: 'Envie um arquivo de imagem valido.' },
      { status: 400 }
    )
  }

  if (!file.type.startsWith('image/')) {
    return NextResponse.json(
      { error: 'Apenas arquivos de imagem sao permitidos.' },
      { status: 400 }
    )
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return NextResponse.json(
      { error: 'A imagem deve ter no maximo 8 MB.' },
      { status: 400 }
    )
  }

  const timestamp = Math.round(Date.now() / 1000).toString()
  const uploadFolder = process.env.CLOUDINARY_UPLOAD_FOLDER?.trim()
  const uploadParams: Record<string, string> = {
    timestamp
  }
  const uploadFormData = new FormData()

  if (uploadFolder) {
    uploadParams.folder = uploadFolder
  }

  uploadFormData.set('file', file)
  uploadFormData.set('api_key', config.apiKey)
  Object.entries(uploadParams).forEach(([key, value]) => {
    uploadFormData.set(key, value)
  })
  uploadFormData.set(
    'signature',
    createSignature(uploadParams, config.apiSecret)
  )

  const cloudinaryResponse = await fetch(
    `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`,
    {
      body: uploadFormData,
      method: 'POST'
    }
  )

  const result = await cloudinaryResponse.json()

  if (!cloudinaryResponse.ok) {
    return NextResponse.json(
      {
        error:
          result?.error?.message ??
          'Nao foi possivel enviar a imagem para o Cloudinary.'
      },
      { status: cloudinaryResponse.status }
    )
  }

  return NextResponse.json({
    publicId: result.public_id,
    url: result.secure_url
  })
}
