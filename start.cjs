const { fork } = require('child_process')
const [ major ] = process.versions.node.split('.')

console.log('running on node %s\n', process.versions.node)

if (major >= 14) {
  fork('./index.js')
} else {
  fork('./main.cjs')
}
