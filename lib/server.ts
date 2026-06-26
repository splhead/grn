import { auth } from './auth'
import { headers } from 'next/headers'

export async function getSession() {
  const requestHeaders = await headers()

  try {
    return await auth.api.getSession({
      headers: requestHeaders
    })
  } catch (error) {
    console.error('Failed to get auth session', error)
    return null
  }
}
