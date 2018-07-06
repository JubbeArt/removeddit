// const SnuOwnd = require('snudown-js')

// const markdown = SnuOwnd.getParser()

// Flatten arrays one level
export const flatten = arr => arr.reduce(
  (accumulator, value) => accumulator.concat(value),
  []
)

// Same as: array => Set => array
export const unique = arr => arr.filter((value, index) => arr.indexOf(value) === index)

// Everything in arr1 that is not in arr2
export const difference = (arr1, arr2) => arr1.filter(x => !arr2.includes(x))

// Take on big array and split it into an array of chunks with correct size
export const chunk = (arr, size) => {
  const chunks = []
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size))
  }
  return chunks
}

// Make multiple requests to the same url, with an array of data (usually comment IDs)
// This is needed since there is a limit on how long a url can be
export const fetchMultiple = (url, arr, header, size = 100) => {
  const subArrays = chunk(arr, size)

  return Promise.all(subArrays.map(subArr => fetch(url + subArr.join(), header)))
}

export const jsonMultiple = responses => Promise.all(responses.map(resp => resp.json()))

// Change bases
export const toBase36 = number => parseInt(number, 10).toString(36)
export const toBase10 = numberString => parseInt(numberString, 36)

// Reddits way of indicating that something is deleted
export const isDeleted = textBody => textBody === '[deleted]'

// Reddits way of indicating that something is deleted
export const isRemoved = textBody => textBody === '[removed]'

// Default thumbnails for reddit threads
export const redditThumbnails = ['self', 'default', 'image', 'nsfw']

// Parse comments
export const parse = text => markdown.render(text)

// UTC to "Reddit time format" (e.g. 5 hours ago, just now, etc...)
export function prettyDate (createdUTC) {
  const currentUTC = Math.floor((new Date()).getTime() / 1000)
  const secondDiff = currentUTC - createdUTC
  const dayDiff = Math.floor(secondDiff / 86400)

  if (dayDiff < 0) return ''
  if (dayDiff === 0) {
    if (secondDiff < 10) return 'just now'
    if (secondDiff < 60) return `${secondDiff} seconds ago`
    if (secondDiff < 120) return 'a minute ago'
    if (secondDiff < 3600) return `${Math.floor(secondDiff / 60)} minutes ago`
    if (secondDiff < 7200) return 'an hour ago'
    if (secondDiff < 86400) return `${Math.floor(secondDiff / 3600)} hours ago`
  }
  if (dayDiff < 7) return `${dayDiff} days ago`
  if (dayDiff < 31) return `${Math.floor(dayDiff / 7)} weeks ago`
  if (dayDiff < 365) return `${Math.floor(dayDiff / 30)} months ago`
  return `${Math.floor(dayDiff / 365)} years ago`
}

// Reddit format for scores, e.g. 12000 => 12k
export function prettyScore (score) {
  if (score >= 100000) {
    return `${(score / 1000).toFixed(0)}k`
  } else if (score >= 10000) {
    return `${(score / 1000).toFixed(1)}k`
  }

  return score
}

// Filter comments
export const showFunctions = {
  all: comment => true,
  removedDeleted: comment => comment.removed === true || comment.deleted === true,
  removed: comment => comment.removed === true,
  deleted: comment => comment.deleted === true
}

// Sorting for comments
export const sortFunctions = {
  top: (commentA, commentB) => {
    if (commentA.score > commentB.score) return -1
    if (commentA.score < commentB.score) return 1
    return 0
  },
  bottom: (commentA, commentB) => {
    if (commentA.score < commentB.score) return -1
    if (commentA.score > commentB.score) return 1
    return 0
  },
  new: (commentA, commentB) => {
    if (commentA.created_utc > commentB.created_utc) return -1
    if (commentA.created_utc < commentB.created_utc) return 1
    return 0
  },
  old: (commentA, commentB) => {
    if (commentA.created_utc < commentB.created_utc) return -1
    if (commentA.created_utc > commentB.created_utc) return 1
    return 0
  }

}
