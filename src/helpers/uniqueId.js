const crypto = typeof window !== 'undefined' && (window.crypto || window.msCrypto)

const cryptoRandom = () => {
  const expo = Math.pow(2, -52)
  const mantissa = crypto
    .getRandomValues(new Uint32Array(2))
    .reduce((mts, n, i) => (!i ? n * Math.pow(2, 20) : n >>> 12) + mts, 0)

  return expo * mantissa
}

const rng = !crypto ? Math.random : cryptoRandom
const pickFromString = (str = 'abcdefghijklmnopqrstuvwxyz') => str[Math.floor(rng() * str.length)]

export const uniqueId = (length = 8) => {
  const cryptoLength = length <= 4 ? 3 : length - 1
  const makeChar = c => (c === '0' ? Math.floor(rng() * 16) : (Math.floor(rng() * 16) & 0x3) | 0x8).toString(16)
  const xyChain = Array.from(Array(cryptoLength)).map(() => pickFromString('01'))
  return pickFromString() + xyChain.join('').replace(/\d/g, makeChar)
}
