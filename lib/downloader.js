var needle   = require('needle')
var api_key = 'API-KEY' // API KEY Dari https://api.i-tech.id/
const { getVideoMeta } = require('tiktok-scraper')
const { fetchJson } = require('../utils/fetcher')
const { promisify } = require('util')
const { instagram, twitter } = require('video-url-link')
const igGetInfo = promisify(instagram.getInfo)
const twtGetInfo = promisify(twitter.getInfo)


/**
 * Get Tiktok Metadata
 *
 * @param  {String} url
 */
const tiktok = (url) => new Promise((resolve, reject) => {
    console.log('[:] Get metadata from =>', url)
    getVideoMeta(url, { noWaterMark: true, hdVideo: true })
        .then(async (result) => {
            console.log('[:] Get Video From', '@' + result.authorMeta.name, 'ID:', result.id)
            if (result.videoUrlNoWaterMark) {
                result.url = result.videoUrlNoWaterMark
                result.NoWaterMark = true
            } else {
                result.url = result.videoUrl
                result.NoWaterMark = false
            }
            resolve(result)
        }).catch((err) => {
            console.error(err)
            reject(err)
        })
})

/**
 * Get Instagram Metadata
 *
 * @param  {String} url
 */
const insta = (url) => new Promise((resolve, reject) => {
    console.log('[:] Get metadata from =>', url)
    const uri = url.replace(/\?.*$/g, '')
    igGetInfo(uri, {})
        .then((result) => resolve(result))
        .catch((err) => {
            console.error(err)
            reject(err)
        })
})

/**
 * Get Twitter Metadata
 *
 * @param  {String} url
 */
const tweet = (url) => new Promise((resolve, reject) => {
    console.log('[:] Get metadata from =>', url)
    twtGetInfo(url, {})
        .then((content) => resolve(content))
        .catch((err) => {
            console.error(err)
            reject(err)
        })
})

/**
 * Get Facebook Metadata
 *
 * @param  {String} url
 */
const facebook = (url) => new Promise((resolve, reject) => {
    console.log('[:] Get metadata from =>', url)
    const apikey = '3tgDBIOPAPl62b0zuaWNYog2wvRrc4V414AjMi5zdHbU4a'
    fetchJson('http://keepsaveit.com/api/?api_key=' + apikey + '&url=' + url, { method: 'GET' })
        .then((result) => {
            const key = result.code
            switch (key) {
            case 212:
                return reject('Access block for you, You have reached maximum 5 limit per minute hits, please stop extra hits.')
            case 101:
                return reject('API Key error : Your access key is wrong')
            case 102:
                return reject('Your Account is not activated.')
            case 103:
                return reject('Your account is suspend for some resons.')
            case 104:
                return reject('API Key error : You have not set your api_key in parameters.')
            case 111:
                return reject('Full access is not allow with DEMO API key.')
            case 112:
                return reject('Sorry, Something wrong, or an invalid link. Please try again or check your url.')
            case 113:
                return reject('Sorry this website is not supported.')
            case 404:
                return reject('The link you followed may be broken, or the page may have been removed.')
            case 405:
                return reject('You can\'t download media in private profile. Looks like the video you want to download is private and it is not accessible from our server.')
            default:
                return resolve(result)
            }
        }).catch((err) => {
            console.error(err)
            reject(err)
        })
})

const ytdL =  (type, link) => new Promise((resolve, reject) => {
    const url = 'https://api.i-tech.id/dl/yt?key=' + api_key
  
    switch (type) {
        case 'mp3':
            needle(url + '&link=' + link, (err, resp, body) => {
                try {
                    resolve([body])
                } catch (err) {
                    reject(err)
                }
            })
            break;
        case 'mp4':
            needle(url + '&link=' + link, (err, resp, body) => {
                try {
                    resolve([body])
                } catch (err) {
                    reject(err)
                }
            })
            break;
        default:
            break;
    }
})

const Stalker = async (username) => new Promise((resolve, reject) => {
  var url = 'https://api.i-tech.id/dl/stalk?key=' + api_key
    needle(url + '&username=' + username, (err, resp, body) => {
      resolve([body])
    })
})

module.exports = {
    tiktok,
    insta,
    tweet,
    facebook,
    ytdL,
    Stalker
}
