#!/usr/bin/env node

const fs = require('fs')
const http = require('http')
const Ora = require('ora')
const fileName = process.argv[2]
const hostName = process.argv[3]
const spinner = new Ora({
  text: 'checking',
})

spinner.start()

if (typeof process.argv[2] === 'undefined') {
  console.error('argument #1 is required')
  process.exit(1)
}

if (typeof process.argv[3] === 'undefined') {
  console.error('argument #2 is required')
  process.exit(1)
}

const getFilePath = (item) => {
  let path = item.replace(/"/g, '')
  path = path.replace('virtual=', '')

  return path
}

const checkFileExist = (path) => {
  http.get({
    host: hostName,
    path: path
  }, (res) => {

    setTimeout(() => {
      spinner.stop()

      if (res.statusCode === 404) {
        console.log(path)
      }
	}, 2000)
  })
}

fs.readFile(fileName, 'utf8', (err, data) => {
  if (err) throw err

  const results = data.match(/virtual="([^"]*")/g)
  results.forEach((item) => {
    path = getFilePath(item)
    checkFileExist(path)
  })
})
