var needle   = require('needle')
var api_key = 'API-KEY' // API KEY Dari https://api.i-tech.id/

const bs64 = (options, text) => new Promise((resolve, reject) => {
  var url = 'https://api.i-tech.id/hash/bs64?key=' + api_key

  try {
    switch (options) {
      case 'enc':
        needle(url + '&type=encode&string=' + text, (err, resp, body) => {
          resolve([body])
        })
        break;
      case 'dec':
        needle(url + '&type=decode&string=' + text, (err, resp, body) => {
          resolve([body])
        })
        break;
      default:
        console.log('[:] Pilih type hash: \n\n*enc* untuk encode \n*dec* untuk decode')
        break;
    }
  } catch (err) {
    reject(err)
  }
})

const hash = (options, text) => new Promise((resolve, reject) => {
  var url = 'https://api.i-tech.id/hash'

  try {
    switch (options) {
      case 'sha1':
        needle(url + '/sha?key=' + api_key + '&type=sha1&string=' + text, (err, resp, body) => {
          resolve([body])
        })
        break;
      case 'sha256':
        needle(url + '/sha?key=' + api_key + '&type=sha256&string=' + text, (err, resp, body) => {
          resolve([body])
        })
        break;
      case 'sha512':
        needle(url + '/sha?key=' + api_key + '&type=sha512&string=' + text, (err, resp, body) => {
          resolve([body])
        })
        break;
      case 'md5':
        needle(url + '/md5?key=' + api_key + '&string=' + text, (err, resp, body) => {
          resolve([body])
        })
        break;
      case 'bcrypt':
        needle(url + '/bcrypt?key=' + api_key + '&string=' + text, (err, resp, body) => {
          resolve([body])
        })
        break;
      default:
        console.log('[:] 👋 Sepertinya error, ketik '*!help*' untuk melihat menu.')
        break;
    }
  } catch (err) {
    reject(err)
  }
})

module.exports = { bs64, hash }