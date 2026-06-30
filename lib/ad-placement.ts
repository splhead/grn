function getSeed(value: string) {
  return value.split('').reduce((seed, character) => {
    return (seed * 31 + character.charCodeAt(0)) % 9973
  }, 17)
}

const MIN_NEWS_BETWEEN_ADS = 2

function getNewsAdIndexes(seedKey: string, total: number) {
  const firstAdIndex = 1 + (getSeed(seedKey) % Math.min(2, total - 2))
  const candidateIndexes = [firstAdIndex, firstAdIndex + 4].filter(
    index => index > 0 && index < total - 1
  )

  return candidateIndexes.reduce<number[]>((indexes, candidateIndex) => {
    const previousIndex = indexes.at(-1)

    if (
      previousIndex !== undefined &&
      candidateIndex - previousIndex <= MIN_NEWS_BETWEEN_ADS
    ) {
      return indexes
    }

    return [...indexes, candidateIndex]
  }, [])
}

export function shouldShowNewsAd({
  index,
  seedKey,
  total
}: {
  index: number
  seedKey: string
  total: number
}) {
  if (total < 4 || index <= 0 || index >= total - 1) {
    return false
  }

  return getNewsAdIndexes(seedKey, total).includes(index)
}
