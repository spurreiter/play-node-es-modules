import { sumUp } from './sumup.js'

// ---- obtain __dirname, __filename - snippet needs to be added to each file
// where variables are required.
import url from 'url'
import { dirname } from 'path'

const dirfilename = () => {
  const isESM = typeof __filename === 'undefined'
  const _filename = isESM
    ? url.fileURLToPath(import.meta.url)
    : __filename
  const _dirname = isESM
    ? dirname(_filename)
    : __dirname
  return { _dirname, _filename }
}
// ----

sumUp(3,4,5)

console.log(dirfilename())
