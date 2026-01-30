const fs = require('fs')
const path = require('path')

const root = __dirname
const outDir = path.join(root, 'dist')

function shouldSkip(name) {
  return ['dist', '.git', 'node_modules'].includes(name)
}

fs.rmSync(outDir, { recursive: true, force: true })
fs.mkdirSync(outDir, { recursive: true })

function copyRecursive(src, dest) {
  const stat = fs.statSync(src)
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true })
    for (const entry of fs.readdirSync(src)) {
      if (shouldSkip(entry)) continue
      copyRecursive(path.join(src, entry), path.join(dest, entry))
    }
  } else {
    fs.copyFileSync(src, dest)
  }
}

for (const entry of fs.readdirSync(root)) {
  if (shouldSkip(entry)) continue
  copyRecursive(path.join(root, entry), path.join(outDir, entry))
}

console.log('Build done: static files copied to dist/')

