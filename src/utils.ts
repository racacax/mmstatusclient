import { ranks } from './constants'

export function ordinalSuffixOf(i: number) {
  const j = i % 10,
    k = i % 100
  if (j === 1 && k !== 11) {
    return i + 'st'
  }
  if (j === 2 && k !== 12) {
    return i + 'nd'
  }
  if (j === 3 && k !== 13) {
    return i + 'rd'
  }
  return i + 'th'
}

export function getLocalDate(date: Date) {
  date = new Date(date.getTime())
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
  try {
    return date.toISOString().slice(0, 16)
  } catch (e) {
    return ''
  }
}

export function getEventValue(e: any) {
  return e?.target?.value ?? ''
}

export function randomItem<T>(e: T[]): T {
  return e[Math.floor(Math.random() * e.length)]
}

export function getRenderedRank(elo: number, rank: number | null, width: string) {
  for (let i = 0; i < ranks.length; i++) {
    const rankObj = ranks[i]
    if (
      (rankObj.minRank !== null && rank !== null && rank > rankObj.minRank) ||
      rankObj.minElo > elo
    ) {
      continue
    }
    return `<img style="width: ${width}" src="/images/${rankObj.image}" alt="${rankObj.name} image" /> ${rankObj.name}`
  }
  return ''
}
