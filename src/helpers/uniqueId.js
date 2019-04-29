const LENGTH = 10
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
const makeChar = c => (c === '0' ? Math.floor(rng() * 16) : (Math.floor(rng() * 16) & 0x3) | 0x8).toString(16)

export const uniqueId = () => {
  const cryptoChain = Array.from(Array(LENGTH - 1), () => pickFromString('01'))
  return pickFromString() + cryptoChain.join('').replace(/\d/g, makeChar)
}
