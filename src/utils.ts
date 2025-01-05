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

export function formatVariables(variables: Record<string, unknown>) {
  return Object.entries(variables)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => {
      let formattedValue = value
      if (Object.prototype.toString.call(formattedValue) === '[object Date]') {
        formattedValue = Math.round((formattedValue as Date).getTime() / 1000)
      }
      return `${key}=${encodeURI(formattedValue as string)}`
    })
    .join('&')
}

export function toDate(ts: number) {
  return new Date(ts * 1000)
}

export function toTimestamp(date: Date) {
  return date.getTime() / 1000
}
