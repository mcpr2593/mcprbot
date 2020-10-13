var fs       = require('fs')
var ttsId    = require('node-gtts')('id')
var ttsEn    = require('node-gtts')('en')
var needle   = require('needle')
var moment   = require('moment-timezone')
var api_link = 'https://api.i-tech.id/anim/' // Link API https://api.i-tech.id/
var api_key  = 'xzYmRq-EYvmGr-117MD1-cKgfgI-s2kLbI' // API KEY Dari https://api.i-tech.id/

const getBase64 = (file) => new Promise((resolve, reject) => {
  let files  = fs.readFileSync(file)
  let result = files.toString('base64')
  resolve(result)
})

const randomwibu = async (text) => new Promise((resolve, reject) => {
    var url = 'wibu?key='
    needle(api_link + url + api_key, (err, resp, body) => {
      resolve([body])
    })
  })


  module.exports = { 
    getBase64,
    randomwibu
    
   }