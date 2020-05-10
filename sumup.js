import { sum } from '@my/package'

export const sumUp = (...args) => {
  console.log('The sum of %s is %s', args.join(', '), sum(...args))
}
