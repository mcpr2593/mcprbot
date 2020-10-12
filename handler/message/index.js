require('dotenv').config()
const { decryptMedia, Client } = require('@open-wa/wa-automate')
const moment = require('moment-timezone')
moment.tz.setDefault('Asia/Jakarta').locale('id')
const { downloader, cekResi, urlShortener, meme, translate, getLocationData } = require('../../lib')
const { msgFilter, color, processTime, isUrl } = require('../../utils')
const { uploadImages } = require('../../utils/fetcher')
const { bs64, hash } = require('../../lib/hash')
const {
    toxic,
    quotes,
    quotes2,
    quotes3,
    hilih,
    alay,
    ninja,
    QutesMaker,
    wikipedia,
    Brainly,
    cuaca,
    jamdunia,
    jadwalSholat,
    arti,
    lirik,
    jodoh,
    cekjodoh,
    Chord,
    bmkg,
    ssweb,
    jadwalTv,
    tvnow,
    sleep,
    shtlink

} = require('../../lib/tools')

const { menuId, menuEn } = require('./text') // Indonesian & English menu

module.exports = msgHandler = async (client = new Client(), message) => {
    try {
        const { type, id, from, t, sender, isGroupMsg, chat, caption, isMedia, mimetype, quotedMsg, quotedMsgObj, mentionedJidList } = message
        let { body } = message
        const { name, formattedTitle } = chat
        let { pushname, verifiedName, formattedName } = sender
        pushname = pushname || verifiedName || formattedName // verifiedName is the name of someone who uses a business account
        const botNumber = await client.getHostNumber() + '@c.us'
        const blockNumber = await client.getBlockedIds()
        const groupId = isGroupMsg ? chat.groupMetadata.id : ''
        const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : ''
        const groupMembers = isGroupMsg ? await client.getGroupMembersId(groupId) : ''
        const isGroupAdmins = groupAdmins.includes(sender.id) || false
        const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
        const ownerNumber = '6285156833669@c.us' // Nomor Owner Bot
        const minMem = 40 // Minimal Member Grub
        const BotName = 'MCPR_BOT 🤖' // Nama Bot Whatsapp
        const isOwner = sender.id === ownerNumber
        const isBlocked = blockNumber.includes(sender.id) === true

        function kapital (word) {
            return word.charAt(0).toUpperCase() + word.substr(1)
        }
        function replace(text) {
            return text.replace('@c.us', '')
        }

        const prefix = '!' || '#' || '' || '/' || '$'
        body = (type === 'chat' && body.slice(prefix.length)) ? body : ((type === 'image' && caption) && caption.slice(prefix.length)) ? caption : ''
        const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
        const arg = body.trim().substring(body.indexOf(' ') + 1)
        const args = body.trim().split(/ +/).slice(1)
        const restugbk = args.join(' ')
        const isCmd = body.slice(prefix.length)
        const uaOverride = process.env.UserAgent
        const url = args.length !== 0 ? args[0] : ''
        const isQuotedImage = quotedMsg && quotedMsg.type === 'image'

        const text = body.slice(prefix.length).trim().split(/ +/).splice(1).join(' ')
        const nomor = text.indexOf('62') === -1 ? text.replace('0', '62') + '@c.us' : text

        // Fiture Anti Spam Messages
        if (isCmd && msgFilter.isFiltered(from) && !isGroupMsg) { return console.log(color('[SPAM]', 'red'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname)) }
        if (isCmd && msgFilter.isFiltered(from) && isGroupMsg) { return console.log(color('[SPAM]', 'red'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(name || formattedTitle)) }
        if (!isCmd && !isGroupMsg) { return console.log('[RECV]', color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), 'Message from', color(pushname)) }
        if (!isCmd && isGroupMsg) { return console.log('[RECV]', color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), 'Message from', color(pushname), 'in', color(name || formattedTitle)) }
        if (isCmd && !isGroupMsg) { console.log(color('[EXEC]'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname)) }
        if (isCmd && isGroupMsg) { console.log(color('[EXEC]'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(name || formattedTitle)) }

        // Fiture Anti Spam Messages
        msgFilter.addFilter(from)
        if (isBlocked) return

        switch (command) {

        // Start List Daftar Menu Bot
        case 'help':
        case 'menu':
            await client.sendText(from, menuId.textMenu(pushname, BotName))
            break
        case 'grub':
            if (!isGroupMsg) return client.reply(from, '❌ Maaf, perintah ini hanya dapat dipakai didalam grub!', id)
            if (!isGroupAdmins) return client.reply(from, '❌ Gagal, perintah ini hanya dapat digunakan oleh admin grub!', id)
            await client.sendText(from, menuId.textGrub(name, BotName))
            break
        case 'tools':
            await client.sendText(from, menuId.textTools(BotName))
            break
        case 'downloader':
            await client.sendText(from, menuId.textDownload(BotName))
            break
        case 'encrypt':
            await client.sendText(from, menuId.textEnc(BotName))
            break
        case 'info':
            await client.sendText(from, menuId.textInfo(BotName))
            break
        case 'botinfo': {
            const loadedMsg = await client.getAmountOfLoadedMessages()
            const chatIds = await client.getAllChatIds()
            const groups = await client.getAllGroups()
            const battery = await client.getBatteryLevel()
            const charge = await client.getIsPlugged()
            let pesan = `🔰 -----[ *STATUS ${BotName}* ]----- 🔰\n\n*Loaded Messages:* ${loadedMsg} Messages\n*Total Grub:* ${groups.length} Room Chats\n*Total Personal Chat:* ${chatIds.length - groups.length} Chats\n*Total Semua Chat:* ${chatIds.length} Chats\n*Total Battery:* ${battery}%\n*Status Charge:* ${charge}\n\n🔰 -----[ *POWERED BY ${BotName}* ]----- 🔰`
            client.sendText(from, pesan)
            break
        }
        case 'githubsource':
            await client.sendText(from, menuId.textGithub(BotName))
            break
        case 'mowner':
            await client.sendText(from, menuId.textOwner(BotName))
            break
        case 'readme':
            await client.sendText(from, menuId.textReadme(BotName))
            break
        // End List Daftar Menu Bot

        // Start Menu Owner Bot
        case 'bc':
            if (!isOwner) return await client.reply(from, '❌ Maaf, perintah ini hanya untuk Owner bot!', id)
            let msgbc = body.slice(4)
            const chatz = await client.getAllChatIds()
            for (let ids of chatz) {
                var cvk = await client.getChatById(ids)
                if (!cvk.isReadOnly) await client.sendText(ids, `🔰 -----[ *BROADCAST BY ${BotName}* ]----- 🔰\n\n${msgbc}\n\n🔰 -----[ *POWERED BY ${BotName}* ]----- 🔰`)
            }
            await client.reply(from, '✅ Sukses gan, pesan broadcast telah terkirim.', id)
            break
        case 'leaveall':
            if (!isOwner) return await client.reply(from, '❌ Maaf, perintah ini hanya untuk Owner bot!', id)
            const allChats = await client.getAllChatIds()
            const allGroups = await client.getAllGroups()
            for (let gclist of allGroups) {
                await client.sendText(gclist.contact.id, `❌ Maaf bot sedang pembersihan, total chat aktif : ${allChats.length}\n\n Kalian bisa menginvite kembali setelah bot ini keluar.`)
                await client.leaveGroup(gclist.contact.id)
            }
            await client.reply(from, '✅ Sukses gan, bot telah keluar semua grub.', id)
            break
        case 'clearall':
            if (!isOwner) return await client.reply(from, '❌ Maaf, perintah ini hanya untuk Owner bot!', id)
            const allChatz = await client.getAllChats()
            for (let dchat of allChatz) {
                await client.deleteChat(dchat.id)
            }
            await client.reply(from, '✅ Sukses gan, membersihkan semua chat.', id)
            break
        case 'getss':
            if (!isOwner) return await client.reply(from, '❌ Maaf, perintah ini hanya untuk Owner bot!', id)
            const sesPic = await client.getSnapshot()
            client.sendFile(from, sesPic, 'session.png', '🍻 Nih gan screenshootnya.', id)
            break
        case 'listblock':
            let hih = `🔰 -----[ *BLOCK USERS BY ${BotName}* ]----- 🔰\n\n*Total:* ${blockNumber.length}\n\n`
            let index = 1
            for (let i of blockNumber) {
                hih += `*${index++}*. ${i.replace(/@c.us/g,'')}\n`
            }
            hih += `\n\n🔰 -----[ *POWERED BY ${BotName}* ]----- 🔰`
            await client.reply(from, hih, id).then(() => {
            console.log(`List block users telah dikirim. Loaded Processed for ${processTime(t, moment())} Second`)
            })
            break
        // End Menu Owner Bot

        // Start Menu Grub Bot
        case 'promote':
            if (!isGroupMsg) return await client.reply(from, '❌ Maaf, perintah hanya dapat dipakai di dalam grub!', id)
            if (!isGroupAdmins) return await client.reply(from, '❌ Gagal gan, anda bukan admin.', id)
            if (!isBotGroupAdmins) return await client.reply(from, '❌ Gagal gan, bot tidak punya akses sebagai admin.', id)
            if (mentionedJidList.length != 1) return client.reply(from, '❌ Gagal gan, bot tidak mengerti maksud anda.', id)
            if (groupAdmins.includes(mentionedJidList[0])) return await client.reply(from, '❌ Gagal gan, user tersebut sudah menjadi admin.', id)
            if (mentionedJidList[0] === botNumber) return await client.reply(from, '❌ Gagal gan, bot tidak mengerti maksud anda.', id)
            await client.promoteParticipant(groupId, mentionedJidList[0])
            await client.sendTextWithMentions(from, `✅ Sukses gan, *@${mentionedJidList[0].replace('@c.us', '')}* berhasil di promosikan sebagai admin.`)
            break
        case 'demote':
            if (!isGroupMsg) return client.reply(from, '❌ Maaf, perintah hanya dapat dipakai di dalam grub!', id)
            if (!isGroupAdmins) return client.reply(from, '❌ Gagal gan, anda bukan admin.', id)
            if (!isBotGroupAdmins) return client.reply(from, '❌ Gagal gan, bot tidak punya akses sebagai admin.', id)
            if (mentionedJidList.length !== 1) return client.reply(from, '❌ Gagal gan, bot tidak mengerti maksud anda.', id)
            if (!groupAdmins.includes(mentionedJidList[0])) return await client.reply(from, '❌ Gagal gan, user tersebut tidak menjadi admin.', id)
            if (mentionedJidList[0] === botNumber) return await client.reply(from, '❌ Gagal gan, bot tidak mengerti maksud anda.', id)
            await client.demoteParticipant(groupId, mentionedJidList[0])
            await client.sendTextWithMentions(from, `✅ Sukses gan, *@${mentionedJidList[0].replace('@c.us', '')}* berhasil di berhentikan sebagai admin.`)
            break
        case 'kick':
            if (!isGroupMsg) return client.reply(from, '❌ Maaf, perintah hanya dapat dipakai di dalam grub!', id)
            if (!isGroupAdmins) return client.reply(from, '❌ Gagal gan, anda bukan admin.', id)
            if (!isBotGroupAdmins) return client.reply(from, '❌ Gagal gan, bot tidak punya akses sebagai admin.', id)
            if (mentionedJidList.length === 0) return client.reply(from, '❌ Gagal gan, bot tidak mengerti maksud anda.', id)
            if (mentionedJidList[0] === botNumber) return await client.reply(from, '❌ Jangan iseng gan, bot tidak dapat di kick.', id)
            await client.sendTextWithMentions(from, `✅ Sukses gan, *${mentionedJidList.map(x => `@${x.replace('@c.us', '')}* berhasil di keluarkan.`).join('\n')}`)
            for (let i = 0; i < mentionedJidList.length; i++) {
                if (groupAdmins.includes(mentionedJidList[i])) return await client.sendText(from, '❌ Gagal gan, anda tidak bisa mengeluarkan admin grub.')
                await client.removeParticipant(groupId, mentionedJidList[i])
            }
            break
        case 'kickbot':
            if (!isGroupMsg) return client.reply(from, '❌ Maaf, perintah hanya dapat dipakai di dalam grub!', id)
            if (!isGroupAdmins) return client.reply(from, '❌ Gagal gan, anda bukan admin.', id)
            client.sendText(from, '✅ Sukses gan, bot telah dikeluarkan.').then(() => client.leaveGroup(groupId))
            break
        case 'add':
            if (!isGroupMsg) return client.reply(from, '❌ Maaf, perintah hanya dapat dipakai di dalam grub!', id)
            if (!isBotGroupAdmins) return client.reply(from, '❌ Gagal gan, bot tidak punya akses sebagai admin.', id)
            await client.addParticipant(groupId, [nomor])
            await client.sendText(from, `✅ Sukses gan, *${args[0]}* berhasil di tambahkan.`)
            break
        case 'delete':
            // if (!isGroupAdmins) return client.reply(from, '❌ Gagal gan, anda bukan admin.', id)
            if (!quotedMsg) return client.reply(from, '❌ Gagal gan, bot tidak mengerti maksud anda.', id)
            if (!quotedMsgObj.fromMe) return client.reply(from, '❌ Gagal gan, bot tidak mengerti maksud anda.', id)
            client.deleteMessage(quotedMsgObj.chatId, quotedMsgObj.id, false)
            break
        case 'getlink':
            if (!isGroupMsg) return client.reply(from, '❌ Maaf, perintah hanya dapat dipakai di dalam grub!', id)
            const linkgrub = await client.getGroupInviteLink(groupId)
            let msg = `*Link grub:* ${linkgrub}`
            client.reply(from, msg, id)
            break
        case 'dellink':
            if (!isGroupMsg) return client.reply(from, '❌ Maaf, perintah hanya dapat dipakai di dalam grub!', id)
            if (!isGroupAdmins) return client.reply(from, '❌ Gagal gan, anda bukan admin.', id)
            if (!isBotGroupAdmins) return client.reply(from, '❌ Gagal gan, bot tidak punya akses sebagai admin.', id)
            await client.revokeGroupInviteLink(groupId)
            let msgd = `✅ Sukses gan, link grub berhasil di rubah.`
            client.reply(from, msgd, id)
            break
        case 'tagall':
            if (!isGroupMsg) return await client.reply(from, '❌ Maaf, perintah hanya dapat dipakai di dalam grub!', id)
            if (!isGroupAdmins) return await client.reply(from, '❌ Gagal gan, anda bukan admin.', id)
            const groupMem = await client.getGroupMembers(groupId)
            let no = 1

            let hehe = `🔰 -----[ *TAG ALL BY ${BotName}* ]----- 🔰\n\n`
            for (let i = 0; i < groupMem.length; i++) {
                hehe += `*${no++}*. @${groupMem[i].id.replace(/@c.us/g, '')}\n`
            }
            hehe += `\n🔰 -----[ *POWERED BY ${BotName}* ]----- 🔰`
            await sleep(2000)
            await client.sendTextWithMentions(from, hehe)
            break
        case 'admin':
            if (!isGroupMsg) return await client.reply(from, '❌ Maaf, perintah hanya dapat dipakai di dalam grub!', id)
            let n = 1
            let mimin = `🔰 -----[ *ADMIN GRUB BY ${BotName}* ]----- 🔰\n\n`
            for (let admon of groupAdmins) {
                mimin += `*${n++}*. @${admon.replace(/@c.us/g, '')}\n` 
            }
            mimin += `\n🔰 -----[ *POWERED BY ${BotName}* ]----- 🔰`
            await sleep(2000)
            await client.sendTextWithMentions(from, mimin)
            break
        case 'owner':
            if (!isGroupMsg) return await client.reply(from, '❌ Maaf, perintah hanya dapat dipakai di dalam grub!', id)
            const Owner_ = chat.groupMetadata.owner
            await client.sendTextWithMentions(from, `👑 Owner Group Adalah : @${Owner_}`)
            break
        case 'kickall':
            if (!isGroupMsg) return await client.reply(from, '❌ Maaf, perintah hanya dapat dipakai di dalam grub!', id)
            const isGroupOwner = sender.id === chat.groupMetadata.owner
            if (!isGroupOwner) return await client.reply(from, '❌ Maaf, perintah ini hanya bisa di gunakan oleh Owner grub.', id)
            if (!isBotGroupAdmins) return await client.reply(from, '❌ Gagal gan, bot tidak punya akses sebagai admin.', id)
            const allMem = await client.getGroupMembers(groupId)
            for (let i = 0; i < allMem.length; i++) {
                if (groupAdmins.includes(allMem[i].id)) {
                    console.log('Upss this is Admin group')
                } else {
                    await client.removeParticipant(groupId, allMem[i].id)
                }
            }
            await client.reply(from, '✅ Sukses gan, semua member telah di kick.', id)
            break
        case 'botjoin':
            if (!args[0]) client.reply(from, '✅ *Contoh:* !botjoin https://chat.whatsapp.com/C3Dq5bTtLWp4MdkTuTg7o9', id)
            const inviteCode = args[0].replace('https://chat.whatsapp.com/', '')
            const check = await client.inviteInfo(inviteCode)
            if (args[0].match(/(https:)/gi)) {
                if (check.size < minMem) return await client.reply(from, `❌ Maaf, bot tidak dapat sembarangan masuk grub. Minimal anggota grub agar bot dapat masuk adalah ${minMem} member.`, id)
                if (check.status === 200) {
                    await client.joinGroupViaLink(inviteCode).then(() => client.reply(from, '🍻 Terimakasih, bot akan segera masuk!', id))
                } else {
                    await client.reply(from, '🔐 Sepertinya link group telah dibatalkan gan!', id)
                }
            } else {
                client.reply(from, '👊🤬 ini link apa gan ?', id)
            }
            break
        // End Menu Grub Bot

        // Start Menu Encrypt Bot
        case 'bs64':
            switch (args[0]) {
                case 'enc':
                    console.log(`Permintaan hash base64 encoder sedang di proses.`)
                    bs64('enc', args.splice(1).join(' ')).then(result => {
                        result.map(({ string, result }) => {
                            let msg = `🔰 -----[ *BASE64 ENCODE* ]----- 🔰\n\n*String:* ${string}\n*Result:* ${result}\n\n🔰 -----[ *POWERED BY ${BotName}* ]----- 🔰`
                            client.reply(from, msg, id).then(() => {
                            console.log(`Hash result telah dikirim. Loaded Processed for ${processTime(t, moment())} Second`)
                            }).catch((err) => console.log(err))
                        })
                    })
                    .catch(err => client.reply(from, err))
                    break;
                case 'dec':
                    console.log(`Permintaan hash base64 decoder sedang di proses.`)
                    bs64('dec', args.splice(1).join(' ')).then(result => {
                        result.map(({ string, result }) => {
                            let msg = `🔰 -----[ *BASE64 DECODE* ]----- 🔰\n\n*Encode:* ${string}\n*Result:* ${result}\n\n🔰 -----[ *POWERED BY ${BotName}* ]----- 🔰`
                            client.reply(from, msg, id).then(() => {
                            console.log(`Hash result telah dikirim. Loaded Processed for ${processTime(t, moment())} Second`)
                            }).catch((err) => console.log(err))
                        })
                    })
                    .catch(err => client.reply(from, err))
                    break;
                default:
                    client.reply(from, 'ℹ️ Pilih type hash: \n\n*enc* untuk encode \n*dec* untuk decode')
                    break;
            }
            break
        case 'hash':
            switch (args[0]) {
                case 'sha1':
                    console.log(`Permintaan hash sha1 sedang di proses.`)
                    hash('sha1', args.splice(1).join(' ')).then(result => {
                        result.map(({ string, result }) => {
                            let msg = `🔰 -----[ *SHA1 HASH GENERATOR* ]----- 🔰\n\n*String:* ${string}\n*Result:* ${result}\n\n🔰 -----[ *POWERED BY ${BotName}* ]----- 🔰`
                            client.reply(from, msg, id).then(() => {
                            console.log(`Hash result telah dikirim. Loaded Processed for ${processTime(t, moment())} Second`)
                            }).catch((err) => console.log(err))
                        })
                    })
                    .catch(err => client.reply(from, err))
                    break;
                case 'sha256':
                    console.log(`Permintaan hash sha256 sedang di proses.`)
                    hash('sha256', args.splice(1).join(' ')).then(result => {
                        result.map(({ string, result }) => {
                            let msg = `🔰 -----[ *SHA256 HASH GENERATOR* ]----- 🔰\n\n*String:* ${string}\n*Result:* ${result}\n\n🔰 -----[ *POWERED BY ${BotName}* ]----- 🔰`
                            client.reply(from, msg, id).then(() => {
                            console.log(`Hash result telah dikirim. Loaded Processed for ${processTime(t, moment())} Second`)
                            }).catch((err) => console.log(err))
                        })
                    })
                    .catch(err => client.reply(from, err))
                    break;
                case 'sha512':
                    console.log(`Permintaan hash sha512 sedang di proses.`)
                    hash('sha512', args.splice(1).join(' ')).then(result => {
                        result.map(({ string, result }) => {
                            let msg = `🔰 -----[ *SHA512 HASH GENERATOR* ]----- 🔰\n\n*String:* ${string}\n*Result:* ${result}\n\n🔰 -----[ *POWERED BY ${BotName}* ]----- 🔰`
                            client.reply(from, msg, id).then(() => {
                            console.log(`Hash result telah dikirim. Loaded Processed for ${processTime(t, moment())} Second`)
                            }).catch((err) => console.log(err))
                        })
                    })
                    .catch(err => client.reply(from, err))
                    break;
                case 'md5':
                    console.log(`Permintaan hash md5 sedang di proses.`)
                    hash('md5', args.splice(1).join(' ')).then(result => {
                        result.map(({ string, result }) => {
                            let msg = `🔰 -----[ *MD5 HASH GENERATOR* ]----- 🔰\n\n*String:* ${string}\n*Result:* ${result}\n\n🔰 -----[ *POWERED BY ${BotName}* ]----- 🔰`
                            client.reply(from, msg, id).then(() => {
                            console.log(`MD5 result telah dikirim. Loaded Processed for ${processTime(t, moment())} Second`)
                            }).catch((err) => console.log(err))
                        })
                    })
                    .catch(err => client.reply(from, err))
                    break;
                case 'bcrypt':
                    console.log(`Permintaan hash bcrypt sedang di proses.`)
                    hash('bcrypt', args.splice(1).join(' ')).then(result => {
                        result.map(({ string, result }) => {
                            let msg = `🔰 -----[ *BCRYPT HASH GENERATOR* ]----- 🔰\n\n*String:* ${string}\n*Result:* ${result}\n\n🔰 -----[ *POWERED BY ${BotName}* ]----- 🔰`
                            client.reply(from, msg, id).then(() => {
                            console.log(`Bcrypt result telah dikirim. Loaded Processed for ${processTime(t, moment())} Second`)
                            }).catch((err) => console.log(err))
                        })
                    })
                    .catch(err => client.reply(from, err))
                    break;

                default:
                    client.reply(from, '👋 Sepertinya error, ketik '*!help*' untuk melihat menu.')
                    break;
            }
            break
        // End Menu Encrypt Bot

        // Start Menu Downloader Bot
        case 'tiktokdl':
            if (args.length !== 1) return client.reply(from, '❌ Maaf, format yang anda masukkan salah atau tidak ditemukan.', id)
            if (!isUrl(url) && !url.includes('tiktok.com')) return client.reply(from, '❌ Maaf, link atau url tidak valid.', id)
            await client.reply(from, `🍻 Video sedang di proses, ditunggu aja gan.`, id)
            downloader.tiktok(url).then(async (videoMeta) => {
                const filename = videoMeta.authorMeta.name + '.mp4'
                const caps = `*Username:* ${videoMeta.authorMeta.name}\n*Song:* ${videoMeta.musicMeta.musicName}\n*View:* ${videoMeta.playCount.toLocaleString()}\n*Like:* ${videoMeta.diggCount.toLocaleString()}\n*Comment:* ${videoMeta.commentCount.toLocaleString()}\n*Share:* ${videoMeta.shareCount.toLocaleString()}\n*Caption:* ${videoMeta.text.trim() ? videoMeta.text : '-'}\n\n🔰 -----[ *POWERED BY ${BotName}* ]----- 🔰`
                await client.sendFileFromUrl(from, videoMeta.url, filename, videoMeta.NoWaterMark ? caps : `🔰 -----[ *TIKTOK DOWNLOADER* ]----- 🔰\n\n${caps}`, '', { headers: { 'User-Agent': 'okhttp/4.5.0', referer: 'https://www.tiktok.com/' } }, true)
                .then((serialized) => console.log(`Sukses Mengirim File dengan id: ${serialized} diproses selama ${processTime(t, moment())}`))
                .catch((err) => console.error(err))
            })
            .catch(() => client.reply(from, '❌ Proses gagal gan, link atau url tidak valid.', id))
            break
        case 'igdl':
            if (args.length !== 1) return client.reply(from, '❌ Maaf, format yang anda masukkan salah atau tidak ditemukan.', id)
            if (!isUrl(url) && !url.includes('instagram.com')) return client.reply(from, '❌ Maaf, link atau url tidak valid.', id)
            await client.reply(from, `🍻 Data sedang di proses, ditunggu aja gan.`, id)
            downloader.insta(url).then(async (data) => {
                if (data.type == 'GraphSidecar') {
                    if (data.image.length != 0) {
                        let msg = `🔰 -----[ *INSTAGRAM DOWNLOADER* ]----- 🔰\n\n*Result:* Foto yang anda minta sudah jadi gan.\n*Time Proses:* ${processTime(t, moment())} Second\n\n🔰 -----[ *POWERED BY ${BotName}* ]----- 🔰`
                        data.image.map((x) => client.sendFileFromUrl(from, x, 'photo.jpg', msg, null, null, true))
                        .then((serialized) => console.log(`Sukses1 Mengirim Foto dengan id: ${serialized} diproses selama ${processTime(t, moment())}`))
                        .catch((err) => console.error(err))
                    }
                    if (data.video.length != 0) {
                        let msg = `🔰 -----[ *INSTAGRAM DOWNLOADER* ]----- 🔰\n\n*Result:* Video yang anda minta sudah jadi gan.\n*Time Proses:* ${processTime(t, moment())} Second\n\n🔰 -----[ *POWERED BY ${BotName}* ]----- 🔰`
                        data.video.map((x) => client.sendFileFromUrl(from, x.videoUrl, 'video.mp4', msg, null, null, true))
                        .then((serialized) => console.log(`Sukses Mengirim Video dengan id: ${serialized} diproses selama ${processTime(t, moment())}`))
                        .catch((err) => console.error(err))
                    }
                } else if (data.type == 'GraphImage') {
                    let msg = `🔰 -----[ *INSTAGRAM DOWNLOADER* ]----- 🔰\n\n*Result:* Foto yang anda minta sudah jadi gan.\n*Time Proses:* ${processTime(t, moment())} Second\n\n🔰 -----[ *POWERED BY ${BotName}* ]----- 🔰`
                    client.sendFileFromUrl(from, data.image, 'photo.jpg', msg, null, null, true)
                    .then((serialized) => console.log(`Sukses Mengirim Foto dengan id: ${serialized} diproses selama ${processTime(t, moment())}`))
                    .catch((err) => console.error(err))
                } else if (data.type == 'GraphVideo') {
                    let msg = `🔰 -----[ *INSTAGRAM DOWNLOADER* ]----- 🔰\n\n*Result:* Video yang anda minta sudah jadi gan.\n*Time Proses:* ${processTime(t, moment())} Second\n\n🔰 -----[ *POWERED BY ${BotName}* ]----- 🔰`
                    client.sendFileFromUrl(from, data.video.videoUrl, 'video.mp4', msg, null, null, true)
                    .then((serialized) => console.log(`Sukses Mengirim Video dengan id: ${serialized} diproses selama ${processTime(t, moment())}`))
                    .catch((err) => console.error(err))
                }
            })
            .catch((err) => {
                if (err === 'Not a video') { return client.reply(from, '❌ Proses gagal gan, link atau url tidak valid.', id) }
                client.reply(from, '❌ Proses gagal gan, user private atau url tidak valid.', id)
            })
            break
        case 'stalk':
            if (!args[0]) {
                client.reply(from, '✅ *Contoh:* !stalk i_technologi', id)
            } else {
                console.log(`Search query instagram stalker.`)
                await client.reply(from, `🍻 Permintaan anda sedang di proses, ditunggu aja gan.`, id)
                downloader.Stalker(args.splice(0).join(' '))
                .then(body => {
                    body.map(({ code, username, nama, bio, followers, following, post, pic }) => {
                        if (code == '200') {
                            let msg = `🔰 -----[ *STALKER BY ${BotName}* ]----- 🔰\n\n*Username:* ${username}\n*Nama:* ${nama}\n*Followers:* ${followers}\n*Following:* ${following}\n*Total Post:* ${post}\n*Biodata:* ${bio}\n\n🔰 -----[ *POWERED BY ${BotName}* ]----- 🔰`
                            client.sendFileFromUrl(from, pic, 'instagram.jpg', msg).then(() => {
                                console.log(`Data stalker instagram telah dikirim. Loaded Processed for ${processTime(t, moment())} Second`)
                            })
                        }
                    })
                })
                .catch(err => client.reply(from, err))
            }
            break
        case 'twdl':
            if (args.length !== 1) return client.reply(from, '❌ Maaf, format yang anda masukkan salah atau tidak ditemukan.', id)
            if (!isUrl(url) & !url.includes('twitter.com') || url.includes('t.co')) return client.reply(from, '❌ Maaf, link atau url tidak valid.', id)
            await client.reply(from, `🍻 Data sedang di proses, ditunggu aja gan.`, id)
            downloader.tweet(url).then(async (data) => {
                if (data.type === 'video') {
                    const content = data.variants.filter(x => x.content_type !== 'application/x-mpegURL').sort((a, b) => b.bitrate - a.bitrate)
                    const result = await urlShortener(content[0].url)
                    console.log('Shortlink: ' + result)
                    let msg = `🔰 -----[ *TWITTER DOWNLOADER* ]----- 🔰\n\n*Link:* ${result}.\n*Time Proses:* ${processTime(t, moment())} Second\n\n🔰 -----[ *POWERED BY ${BotName}* ]----- 🔰`
                    await client.sendFileFromUrl(from, content[0].url, 'video.mp4', msg, null, null, true)
                    .then((serialized) => console.log(`Sukses Mengirim Video dengan id: ${serialized} diproses selama ${processTime(t, moment())}`))
                    .catch((err) => console.error(err))
                } else if (data.type === 'photo') {
                    for (let i = 0; i < data.variants.length; i++) {
                        let msg = `🔰 -----[ *TWITTER DOWNLOADER* ]----- 🔰\n\n*Result:* Foto yang anda minta sudah jadi gan.\n*Time Proses:* ${processTime(t, moment())} Second\n\n🔰 -----[ *POWERED BY ${BotName}* ]----- 🔰`
                        await client.sendFileFromUrl(from, data.variants[i], data.variants[i].split('/media/')[1], msg, null, null, true)
                        .then((serialized) => console.log(`Sukses Mengirim Foto dengan id: ${serialized} diproses selama ${processTime(t, moment())}`))
                        .catch((err) => console.error(err))
                    }
                }
            })
            .catch(() => client.reply(from, '❌ Proses gagal gan, link atau url tidak valid.', id))
            break
        case 'fbdl':
            if (args.length !== 1) return client.reply(from, '❌ Maaf, format yang anda masukkan salah atau tidak ditemukan.', id)
            if (!isUrl(url) && !url.includes('facebook.com')) return client.reply(from, '❌ Maaf, link atau url tidak valid.', id)
            await client.reply(from, '🍻 Data sedang di proses, ditunggu aja gan.', id)
            downloader.facebook(url).then(async (videoMeta) => {
                const title = videoMeta.response.title
                const thumbnail = videoMeta.response.thumbnail
                const links = videoMeta.response.links
                const shorts = []
                for (let i = 0; i < links.length; i++) {
                    const shortener = await urlShortener(links[i].url)
                    console.log('Shortlink: ' + shortener)
                    links[i].short = shortener
                    shorts.push(links[i])
                }
                const link = shorts.map((x) => `${x.resolution} Quality: ${x.short}`)
                let msg = `🔰 -----[ *FACEBOOK DOWNLOADER* ]----- 🔰\n\n*Title:* ${title}\n*Link:* ${link.join('\n')}\n*Time Proses:* ${processTime(t, moment())} Second\n\n🔰 -----[ *POWERED BY ${BotName}* ]----- 🔰`
                await client.sendFileFromUrl(from, thumbnail, 'videos.jpg', msg, null, null, true)
                .then((serialized) => console.log(`Sukses Mengirim File dengan id: ${serialized} diproses selama ${processTime(t, moment())}`))
                .catch((err) => console.error(err))
            })
            .catch(() => client.reply(from, '❌ Proses gagal gan, link atau url tidak valid.', id))
            break
        case 'ytdlmp3':
            if (!args[0]) {
                client.reply(from, '✅ *Contoh:* !ytdlmp3 https://youtu.be/tu_EPBLOsns', id)
            } else {

                if (!isUrl(url) && !url.includes('youtube.com')) return client.reply(from, '❌ Maaf, link atau url tidak valid.', id)
                console.log(`Mempersiapkan youtube downloader audio.`)
                await client.reply(from, `🍻 Audio sedang di proses, ditunggu aja gan.`, id)

                downloader.ytdL('mp3', args[0]).then(data => {
                    data.map(({ code, title, url_audio, minute, duration }) => {
                        if (code === '200') {
                            if (minute >= 10) {
                                let msg = `🔰 ---[ *YT AUDIO DOWNLOADER* ]--- 🔰\n\n*Title:* ${title}\n*Duration:* ${duration}\n*Link:* ${url}\n*Loaded Processed:* ${processTime(t, moment())}\n\nℹ️ Durasi audio lebih dari 10 menit, silahkan download link di atas gan.\n\n🔰 ---[ *POWERED BY ${BotName}* ]--- 🔰`
                                client.reply(from, msg, id).then(() => {
                                console.log(`Link audio youtube downloader telah dikirim. Loaded Processed for ${processTime(t, moment())} Second`)
                                })
                            } else {
                                let msg = `🔰 ---[ *YT AUDIO DOWNLOADER* ]--- 🔰\n\n*Title:* ${title}\n*Duration:* ${duration}\n*Loaded Processed:* ${processTime(t, moment())}\n\n🔰 ---[ *POWERED BY ${BotName}* ]--- 🔰`
                                client.sendFileFromUrl(from, url_audio, 'audio.mp3', null, null, null, true).then(() => {
                                console.log(`Audio youtube downloader telah dikirim. Loaded Processed for ${processTime(t, moment())} Second`)
                                }).then(() => { client.reply(from, msg, id) })
                                
                            }
                        }
                    })
                })
            }
            break
        case 'ytdlmp4':
            if (!args[0]) {
                client.reply(from, '✅ *Contoh:* !ytdlmp4 https://youtu.be/tu_EPBLOsns', id)
            } else {

                if (!isUrl(url) && !url.includes('youtube.com')) return client.reply(from, '❌ Maaf, link atau url tidak valid.', id)
                console.log(`Mempersiapkan youtube downloader video.`)
                await client.reply(from, `🍻 Video sedang di proses, ditunggu aja gan.`, id)

                downloader.ytdL('mp4', args[0]).then(data => {
                    data.map(({ code, title, url_video, minute, duration }) => {
                        if (code === '200') {
                            if (minute >= 10) {
                                let msg = `🔰 ---[ *YT VIDEO DOWNLOADER* ]--- 🔰\n\n*Title:* ${title}\n*Duration:* ${duration}\n*Link:* ${url}\n*Loaded Processed:* ${processTime(t, moment())}\n\nℹ️ Durasi video lebih dari 10 menit, silahkan download link di atas gan.\n\n🔰 ---[ *POWERED BY ${BotName}* ]--- 🔰`
                                client.reply(from, msg, id).then(() => {
                                console.log(`Link video youtube downloader telah dikirim. Loaded Processed for ${processTime(t, moment())} Second`)
                                })
                            } else {
                                let msg = `🔰 ---[ *YT VIDEO DOWNLOADER* ]--- 🔰\n\n*Title:* ${title}\n*Duration:* ${duration}\n*Loaded Processed:* ${processTime(t, moment())}\n\n🔰 ---[ *POWERED BY ${BotName}* ]--- 🔰`
                                client.sendFileFromUrl(from, url_video, 'video.mp4', msg, null, null, true).then(() => {
                                console.log(`Video youtube downloader telah dikirim. Loaded Processed for ${processTime(t, moment())} Second`)
                                })
                            }
                        }
                    })
                })
            }
            break
        // End Menu Downlaoder Bot

        // Start Menu Tools Bot
        case 'stiker': {
            if ((isMedia || isQuotedImage) && args.length === 0) {
                const encryptMedia = isQuotedImage ? quotedMsg : message
                const _mimetype = isQuotedImage ? quotedMsg.mimetype : mimetype
                const mediaData = await decryptMedia(encryptMedia, uaOverride)
                const imageBase64 = `data:${_mimetype};base64,${mediaData.toString('base64')}`
                client.sendImageAsSticker(from, imageBase64).then(() => {
                console.log(`Sticker Processed for ${processTime(t, moment())} Second`)
                })

            } else if (args.length === 1) {
                if (!isUrl(url)) { await client.reply(from, '❌ Maaf, link atau url tidak valid.', id) }
                client.sendStickerfromUrl(from, url).then((r) => (!r && r !== undefined)
                ? client.sendText(from, '❌ Maaf, link yang kamu kirim tidak memuat gambar.')
                : console.log(`Sticker Processed for ${processTime(t, moment())} Second`))

            } else {
                await client.reply(from, '❌ Gambar tidak ditemukan.', id)
            }
            break
        }
        case 'stikergif': {
            if (args.length !== 1) return client.reply(from, '❌ Maaf, format yang anda masukkan salah atau tidak ditemukan.', id)
            const isGiphy = url.match(new RegExp(/https?:\/\/(www\.)?giphy.com/, 'gi'))
            const isMediaGiphy = url.match(new RegExp(/https?:\/\/media.giphy.com\/media/, 'gi'))

            if (isGiphy) {
                const getGiphyCode = url.match(new RegExp(/(\/|\-)(?:.(?!(\/|\-)))+$/, 'gi'))
                if (!getGiphyCode) { return client.reply(from, '❌ Permintaan anda tidak dapat diproses.', id) }

                const giphyCode = getGiphyCode[0].replace(/[-\/]/gi, '')
                const smallGifUrl = 'https://media.giphy.com/media/' + giphyCode + '/giphy-downsized.gif'

                client.sendGiphyAsSticker(from, smallGifUrl).then(() => {
                console.log(`Sticker Processed for ${processTime(t, moment())} Second`)
                }).catch((err) => console.log(err))

            } else if (isMediaGiphy) {
                const gifUrl = url.match(new RegExp(/(giphy|source).(gif|mp4)/, 'gi'))
                if (!gifUrl) { return client.reply(from, '❌ Permintaan anda tidak dapat diproses.', id) }

                const smallGifUrl = url.replace(gifUrl[0], 'giphy-downsized.gif')
                client.sendGiphyAsSticker(from, smallGifUrl).then(() => {
                console.log(`Sticker Processed for ${processTime(t, moment())} Second`)
                }).catch((err) => console.log(err))

            } else {
                await client.reply(from, '❌ Maaf, untuk saat ini sticker gif hanya bisa menggunakan link dari giphy.', id)
            }
            break
        }
        case 'meme':
            if ((isMedia || isQuotedImage) && args.length >= 2) {
                console.log(`Sedang membuat meme yang diminta.`)
                await client.reply(from, `🍻 Meme anda sedang di proses, ditunggu aja gan.`, id)
                const top = arg.split('|')[0]
                const bottom = arg.split('|')[1]
                const encryptMedia = isQuotedImage ? quotedMsg : message
                const mediaData = await decryptMedia(encryptMedia, uaOverride)
                const getUrl = await uploadImages(mediaData, false)
                const ImageBase64 = await meme.custom(getUrl, top, bottom)

                client.sendFile(from, ImageBase64, 'meme.png', '🍻 Gambar yang anda minta sudah jadi.', null, true)
                .then((serialized) => console.log(`Sukses Mengirim File dengan id: ${serialized} diproses selama ${processTime(t, moment())}`))
                .catch((err) => console.error(err))
            } else {
                await client.reply(from, '✅ *Contoh:* !meme text atas | text bawah', id)
                await client.reply(from, '❌ Gambar tidak ditemukan.', id)
            }
            break
        case 'resi':
            if (args.length !== 2) return client.reply(from, '❌ Maaf, format yang anda masukkan salah atau tidak ditemukan.', id)
            const kurirs = ['jne', 'pos', 'tiki', 'wahana', 'jnt', 'rpx', 'sap', 'sicepat', 'pcp', 'jet', 'dse', 'first', 'ninja', 'lion', 'idl', 'rex']
            if (!kurirs.includes(args[0])) return client.sendText(from, `❌ Maaf, jenis ekspedisi pengiriman tidak didukung layanan ini hanya mendukung ekspedisi pengiriman ${kurirs.join(', ')} Tolong periksa kembali.`)
            console.log('Memeriksa No Resi', args[1], 'dengan ekspedisi', args[0])
            cekResi(args[0], args[1]).then((result) => client.sendText(from, result))
            break
        case 'translate':
            if (args.length != 1) return client.reply(from, '❌ Maaf, format yang anda masukkan salah atau tidak ditemukan.', id)
            if (!quotedMsg) return client.reply(from, '❌ Maaf, format yang anda masukkan salah atau tidak ditemukan.', id)
            const quoteText = quotedMsg.type == 'chat' ? quotedMsg.body : quotedMsg.type == 'image' ? quotedMsg.caption : ''
            translate(quoteText, args[0])
            .then((result) => client.sendText(from, result))
            .catch(() => client.sendText(from, '❌ Error, Kode bahasa salah atau tidak ditemukan.'))
            break
        case 'corona':
            if (quotedMsg.type !== 'location') return client.reply(from, '❌ Maaf, format yang anda masukkan salah atau tidak ditemukan.', id)
            console.log(`Request Status Zona Penyebaran Covid-19 (${quotedMsg.lat}, ${quotedMsg.lng}).`)
            const zoneStatus = await getLocationData(quotedMsg.lat, quotedMsg.lng)
            if (zoneStatus.kode !== 200) client.sendText(from, '❌ Maaf, Permintaan tidak dapat di proses ketika memeriksa lokasi yang anda kirim.')
            let data = ''
            for (let i = 0; i < zoneStatus.data.length; i++) {
                const { zone, region } = zoneStatus.data[i]
                const _zone = zone == 'green' ? 'Hijau* (Aman) \n' : zone == 'yellow' ? 'Kuning* (Waspada) \n' : 'Merah* (Bahaya) \n'
                data += `${i + 1}. Kel. *${region}* Berstatus *Zona ${_zone}`
            }
            const text = `🔰 -----[ *CEK LOKASI COVID-19* ]----- 🔰\n\nHasil pemeriksaan dari lokasi yang anda kirim adalah *${zoneStatus.status}* ${zoneStatus.optional}\n\nInformasi lokasi terdampak disekitar anda:\n${data}\n\n🔰 -----[ *POWERED BY ${BotName}* ]----- 🔰`
            client.sendText(from, text)
            break
        case 'toxic':
            console.log(`Auto Toxic Sedang Dibuat.`)
            toxic().then(toxic => {
                let msg = `${toxic}\n\n--BY ${BotName}`
                client.reply(from, msg, id).then(() => {
                console.log(`Auto Toxic Telah Dikirim. Loaded Processed for ${processTime(t, moment())} Second`)
                }).catch((err) => console.log(err))
            })
            break
        case 'quotes':
            console.log(`Random Quotes Sedang Dibuat.`)
            quotes().then(quotes => {
                let msg = `🔰 -----[ *RANDOM QUOTES BY ${BotName}* ]----- 🔰\n\nHi, *${pushname}*! 👋️\n\nQuotes :\n\n " *${quotes}* " \n\n🔰 -----[ *POWERED BY ${BotName}* ]----- 🔰`
                client.reply(from, msg, id).then(() => {
                console.log(`Random Quotes Telah Dikirim. Loaded Processed for ${processTime(t, moment())} Second`)
                }).catch((err) => console.log(err))
            })
            break
        case 'quotes2':
            console.log(`Random Quotes 2 Sedang Dibuat.`)
            quotes2()
            .then(body => {
                body.map(({ code, result }) => {
                    let msg = `🔰 -----[ *RANDOM QUOTES 2 BY ${BotName}* ]----- 🔰\n\nHi, *${pushname}*! 👋️\n\nQuotes :\n\n " *${result}* " \n\n🔰 -----[ *POWERED BY ${BotName}* ]----- 🔰`
                    client.reply(from, msg, id).then(() => {
                    console.log(`Random Quotes 2 Telah Dikirim. Loaded Processed for ${processTime(t, moment())} Second`)
                    }).catch((err) => console.log(err))
                })
            })
            .catch(err => client.reply(from, err))
            break
        case 'quotes3':
            console.log(`Random Quotes 3 Sedang Dibuat.`)
            quotes3()
            .then(body => {
                body.map(({ code, author, result }) => {
                    let msg = `🔰 -----[ *RANDOM QUOTES 3 BY ${BotName}* ]----- 🔰\n\nHi, *${pushname}*! 👋️\n\nQuotes :\n\n " *${result}* " \n\nAuthor : ~*${author}* \n\n🔰 -----[ *POWERED BY ${BotName}* ]----- 🔰`
                    client.reply(from, msg, id).then(() => {
                    console.log(`Random Quotes 3 Telah Dikirim. Loaded Processed for ${processTime(t, moment())} Second`)
                    }).catch((err) => console.log(err))
                })
            })
            .catch(err => client.reply(from, err))
            break
        case 'hilih':
            if (!args[0]) {
                client.reply(from, '✅ *Contoh:* !hilih anjay', id)
            } else {
                console.log(`Sedang membuat kata menjadi hilih.`)
                hilih(args.splice(0).join(' '))
                .then(body => {
                    body.map(({ code, result }) => {
                        let msg = `${result}`
                        client.reply(from, msg, id).then(() => {
                        console.log(`Kata hilih telah dikirim. Loaded Processed for ${processTime(t, moment())} Second`)
                        }).catch((err) => console.log(err))
                    })
                })
                .catch(err => client.reply(from, err))
            }
            break
        case 'alay':
            if (!args[0]) {
                client.reply(from, '✅ *Contoh:* !alay anjay', id)
            } else {
                console.log(`Sedang membuat kata menjadi alay.`)
                alay(args.splice(0).join(' '))
                .then(body => {
                    body.map(({ code, result }) => {
                        let msg = `${result}`
                        client.reply(from, msg, id).then(() => {
                        console.log(`Kata alay telah dikirim. Loaded Processed for ${processTime(t, moment())} Second`)
                        }).catch((err) => console.log(err))
                    })
                })
                .catch(err => client.reply(from, err))
            }
            break
        case 'ninja':
            if (!args[0]) {
                client.reply(from, '✅ *Contoh:* !ninja anjay', id)
            } else {
                console.log(`Sedang membuat kata menjadi ninja.`)
                ninja(args.splice(0).join(' '))
                .then(result => {
                    result.map(({ code, result }) => {
                        let msg = `${result}`
                        client.reply(from, msg, id).then(() => {
                        console.log(`Kata ninja telah dikirim. Loaded Processed for ${processTime(t, moment())} Second`)
                        }).catch((err) => console.log(err))
                    })
                })
                .catch(err => client.reply(from, err))
            }
            break;
        case 'quotesmaker':
            if (!args[0] || !args[1] || !args[2]) {
                client.reply(from, '✅ *Contoh:* !quotesmaker random mcprbot i love you', id)
            } else {
                console.log(`Quotesmaker sedang dibuat.`)
                await client.reply(from, `🍻 Quotes anda sedang di proses, ditunggu aja gan.`, id)
            }
            QutesMaker(args[0], args[1], args.splice(2).join(' '))
            .then(body => {
                body.map(({ code, result }) => {
                    if (code == '200') {
                        let msg = `🍻 Gambar yang anda minta sudah jadi.`
                        client.sendFileFromUrl(from, result, 'quotesmaker.jpg', msg, null, null, true)
                        .then((serialized) => console.log(`Quotesmaker telah dikirim. Loaded Processed for ${processTime(t, moment())} Second`))
                        .catch((err) => console.error(err))
                    }
                })
            })
            .catch(err => client.reply(from, err))
            break
        case 'wiki':
            if (!args[0]) {
                client.reply(from, '✅ *Contoh:* !wiki presiden', id)
            } else {
                console.log(`Search wiki to query sedang dibuat.`)
                wikipedia(args.splice(0).join(' '))
                .then(result => {
                    result.map(({ code, result }) => {
                        let msg = `🔰 -----[ *SEARCH WIKI BY ${BotName}* ]----- 🔰\n\n${result}\n\n🔰 -----[ *POWERED BY ${BotName}* ]----- 🔰`
                        client.reply(from, msg, id).then(() => {
                        console.log(`Search wikipedia telah dikirim. Loaded Processed for ${processTime(t, moment())} Second`)
                        }).catch((err) => console.log(err))
                    })
                })
                .catch(err => client.reply(from, err))
            }
            break;
        case 'brainly':
            if (!args[0]) {
                client.reply(from, '✅ *Contoh:* !brainly siapa penemu lampu?', id)
            } else {
                console.log(`Search brainly to query sedang dibuat.`)
                await client.reply(from, `🍻 Permintaan anda sedang di proses, ditunggu aja gan.`, id)
            }
            let replay = '🔰 -----[ *SEARCH BRAINLY BY ${BotName}* ]----- 🔰\n\n'
            Brainly(args.splice(0).join(' ')).then(result => {
                let i = 1
                result.map(({title, url}) => {
                    replay += `*${i++}*. ${title}\n*Link Brainly:* ${url}\n\n`
                })
                replay += `🔰 -----[ *POWERED BY ${BotName}* ]----- 🔰`
                client.reply(from, replay, id).then(() => {
                    console.log(`Search brainly telah dikirim. Loaded Processed for ${processTime(t, moment())} Second`)
                })
            })
            .catch(err => client.reply(from, err))
            break
        case 'cuaca':
            if (!args[0]) {
                client.reply(from, '✅ *Contoh:* !cuaca Jakarta', id)
            } else {
                console.log(`Sedang mencari perkiraan cuaca.`)
                await client.reply(from, `🍻 Permintaan anda sedang di proses, ditunggu aja gan.`, id)
            }
            cuaca(args[0])
            .then(result => {
                result.map(({ code, tempat, cuaca, deskripsi, suhu, kelembapan, udara, angin }) => {
                    if (code == '200') {
                        let msg = `🔰 -----[ *PERKIRAAN CUACA BY ${BotName}* ]----- 🔰\n\n*Kota:* ${tempat}\n*Cuaca:* ${cuaca}\n*Deskripsi:* ${deskripsi}\n*Suhu:* ${suhu}\n*Kelembapan:* ${kelembapan}\n*Tekanan Udara:* ${udara}\n*Kecepatan Angin:* ${angin}\n\n🔰 -----[ *POWERED BY ${BotName}* ]----- 🔰`
                        client.reply(from, msg, id).then(() => {
                            console.log(`Laporan cuaca telah dikirim. Loaded Processed for ${processTime(t, moment())} Second`)
                        })
                    } else {
                        client.reply(from, '❌ Data tidak ditemukan.', id).then(() => {
                            console.log(`Data tidak ditemukan. Loaded Processed for ${processTime(t, moment())} Second`)
                        })
                    }
                })
            })
            .catch(err => client.reply(from, err))
            break
        case 'jam':
            if (!args[0]) {
                client.reply(from, '✅ *Contoh:* !jam Jakarta', id)
            } else {
                console.log(`Sedang mencari perkiraan jam dunia.`)
                await client.reply(from, `🍻 Permintaan anda sedang di proses, ditunggu aja gan.`, id)
            }
            jamdunia(args[0])
            .then(result => {
                result.map(({ code, timezone, date, time, latitude, longitude, address }) => {
                    if (code == '200') {
                        let msg = `🔰 -----[ *JAM DUNIA BY ${BotName}* ]----- 🔰\n\n*Timezone:* ${timezone}\n*Date:* ${date}\n*Time:* ${time}\n*Location:* ${latitude}, ${longitude}\n*Address:* ${address}\n\n🔰 -----[ *POWERED BY ${BotName}* ]----- 🔰`
                        client.reply(from, msg, id).then(() => {
                            console.log(`Jam dunia telah dikirim. Loaded Processed for ${processTime(t, moment())} Second`)
                        })
                    } else {
                        client.reply(from, '❌ Data tidak ditemukan.', id).then(() => {
                            console.log(`Data tidak ditemukan. Loaded Processed for ${processTime(t, moment())} Second`)
                        })
                    }
                })
            })
            .catch(err => client.reply(from, err))
            break
        case 'sholat':
            if (!args[0]) {
                client.reply(from, '✅ *Contoh:* !sholat Jakarta', id)
            } else {
                console.log(`Sedang mencari jadwal sholat.`)
                jadwalSholat(args[0])
                .then(result => {
                    result.map(({ code, imsak, isya, subuh, dhuha, dzuhur, ashar, maghrib, terbit, tanggal, kota, note }) => {
                        if (code == '200') {
                            let msg = `🔰 *Jadwal Sholat Hari Ini* 🔰\n\n🌤️ Terbit : *${terbit}*\n\n🕓 Imsak : *${imsak}*\n🕔 Subuh : *${subuh}*\n🕢 Dhuha : *${dhuha}*\n🕛 Dzuhur : *${dzuhur}*\n🕞 Ashar : *${ashar}*\n🕕 Maghrib : *${maghrib}*\n🕖 Isya : *${isya}*\n\n⏰ *${tanggal}*\n🏠 Wilayah : *${kapital(args[0])} dan Sekitarnya* 😇\n\n${note}`
                            client.reply(from, msg, id).then(() => {
                            console.log(`Jadwal sholat telah dikirim. Loaded Processed for ${processTime(t, moment())} Second`)
                            })
                        } else {
                            client.reply(from, '❌ Data tidak ditemukan.', id).then(() => {
                                console.log(`Data tidak ditemukan. Loaded Processed for ${processTime(t, moment())} Second`)
                            })
                        }
                    })
                })
                .catch(err => client.reply(from, err))
            }
            break
        case 'arti':
            if (!args[0]) {
                client.reply(from, '✅ *Contoh:* !arti mcprbot', id)
            } else {
                console.log(`Sedang mencari arti nama anda.`)
                await client.reply(from, `🍻 Permintaan anda sedang di proses, ditunggu aja gan.`, id)
                arti(args.splice(0).join(' '))
                .then(result => {
                    result.map(({ code, arti }) => {
                        let msg = `🔰 -----[ *ARTI NAMA BY ${BotName}* ]----- 🔰\n\nArti Nama :\n\n${arti}\n\n🔰 -----[ *POWERED BY ${BotName}* ]----- 🔰`
                        client.reply(from, msg, id).then(() => {
                        console.log(`Arti nama telah dikirim. Loaded Processed for ${processTime(t, moment())} Second`)
                        })
                    })
                })
                .catch(err => client.reply(from, err))
            }
            break


        case 'shtlink':
            if (!args[0]) {
                client.reply(from, '✅ *Contoh:* !shtlink https://google.com', id)
            } else {
                console.log(`Sedang membuat shortlink.`)
                shtlink(args.splice(0).join(' '))
                .then(body => {
                    body.map(({ code, result }) => {
                        let msg = `🔰 ---[ *Short Link BY ${BotName}* ]--- 🔰\n\nSHort link : ${result}\n\n🔰 ---[ *POWERED BY ${BotName}* ]--- 🔰`
                        client.reply(from, msg, id).then(() => {
                        console.log(`Kata alay telah dikirim. Loaded Processed for ${processTime(t, moment())} Second`)
                        }).catch((err) => console.log(err))
                    })
                })
                .catch(err => client.reply(from, err))
            }
            break


        case 'lirik':
            if (!args[0]) {
                client.reply(from, '✅ *Contoh:* !lirik lathi', id)
            } else {
                console.log(`Sedang mencari lirik lagu anda.`)
                await client.reply(from, `🍻 Permintaan anda sedang di proses, ditunggu aja gan.`, id)
                lirik(args.splice(0).join(' '))
                .then(result => {
                    result.map(({ code, result }) => {
                        let msg = `${result}`
                        client.reply(from, msg, id).then(() => {
                        console.log(`Lirik lagu telah dikirim. Loaded Processed for ${processTime(t, moment())} Second`)
                        })
                    })
                })
                .catch(err => client.reply(from, err))
            }
            break
        case 'jodoh':
            if (!args[0] || !args[1] || !args[2]) {
                client.reply(from, '✅ *Contoh:* !jodoh aku & kamu', id)
            } else {
                console.log(`Sedang mencari kecocokan jodoh anda.`)
                await client.reply(from, `🍻 Permintaan anda sedang di proses, ditunggu aja gan.`, id)
                jodoh(args[0], args[1], args[2])
                .then(body => {
                    body.map(({ code, p1, p2, sisi, level }) => {
                        if (code == '200') {
                            let msg = `*Nama Anda:* ${p1}\n*Nama Pasangan:* ${p2}\n\n*Sisi Positif:* ${sisi.positif}.\n*Sisi Negatif:* ${sisi.negatif}`
                            client.sendFileFromUrl(from, level, 'jodoh.jpg', msg, null, null, true)
                            .then(() => console.log(`Jodoh telah dikirim. Loaded Processed for ${processTime(t, moment())} Second`))
                            .catch((err) => console.error(err))
                        }
                    })
                })
                .catch(err => client.reply(from, err))
            }
            break
        case 'cekjodoh':
            if (!args[0] || !args[1] || !args[2]) {
                client.reply(from, '✅ *Contoh:* !cekjodoh aku & kamu* / !cekjodoh aku & kamu & dia', id)
            } else {
                console.log(`Sedang mencari kecocokan jodoh.`)

                cekjodoh(args[0], args[1], args[2], args[3], args[4])
                .then(body => {
                    body.map(({ code, result }) => {
                        if (args[4] === undefined) {
                            if (code == '200') {
                                let msg = `🔰 -----[ *CEK JODOH BY ${BotName}* ]----- 🔰\n\n*Pasangan Pertama:* ${kapital(args[0])}\n*Pasangan Kedua:* ${kapital(args[2])}\n\n*Result:* ${result}\n\n🔰 -----[ *POWERED BY ${BotName}* ]----- 🔰`
                                client.reply(from, msg, id).then(() => {
                                console.log(`Cek jodoh telah dikirim. Loaded Processed for ${processTime(t, moment())} Second`)
                                })
                            }
                        } else {
                            if (code == '200') {
                                let msg = `🔰 -----[ *CEK JODOH BY ${BotName}* ]----- 🔰\n\n*Pasangan Pertama:* ${kapital(args[0])}\n*Pasangan Kedua:* ${kapital(args[2])}\n*Orang Ke 3:* ${kapital(args[4])}\n\n*Result:* ${result}\n\n🔰 -----[ *POWERED BY ${BotName}* ]----- 🔰`
                                client.reply(from, msg, id).then(() => {
                                console.log(`Cek jodoh telah dikirim. Loaded Processed for ${processTime(t, moment())} Second`)
                                })
                            }
                        }
                        
                    })
                })
            }
            break
        case 'asu':
            const list = ["https://cdn.shibe.online/shibes/247d0ac978c9de9d9b66d72dbdc65f2dac64781d.jpg","https://cdn.shibe.online/shibes/1cf322acb7d74308995b04ea5eae7b520e0eae76.jpg","https://cdn.shibe.online/shibes/1ce955c3e49ae437dab68c09cf45297d68773adf.jpg","https://cdn.shibe.online/shibes/ec02bee661a797518d37098ab9ad0c02da0b05c3.jpg","https://cdn.shibe.online/shibes/1e6102253b51fbc116b887e3d3cde7b5c5083542.jpg","https://cdn.shibe.online/shibes/f0c07a7205d95577861eee382b4c8899ac620351.jpg","https://cdn.shibe.online/shibes/3eaf3b7427e2d375f09fc883f94fa8a6d4178a0a.jpg","https://cdn.shibe.online/shibes/c8b9fcfde23aee8d179c4c6f34d34fa41dfaffbf.jpg","https://cdn.shibe.online/shibes/55f298bc16017ed0aeae952031f0972b31c959cb.jpg","https://cdn.shibe.online/shibes/2d5dfe2b0170d5de6c8bc8a24b8ad72449fbf6f6.jpg","https://cdn.shibe.online/shibes/e9437de45e7cddd7d6c13299255e06f0f1d40918.jpg","https://cdn.shibe.online/shibes/6c32141a0d5d089971d99e51fd74207ff10751e7.jpg","https://cdn.shibe.online/shibes/028056c9f23ff40bc749a95cc7da7a4bb734e908.jpg","https://cdn.shibe.online/shibes/4fb0c8b74dbc7653e75ec1da597f0e7ac95fe788.jpg","https://cdn.shibe.online/shibes/125563d2ab4e520aaf27214483e765db9147dcb3.jpg","https://cdn.shibe.online/shibes/ea5258fad62cebe1fedcd8ec95776d6a9447698c.jpg","https://cdn.shibe.online/shibes/5ef2c83c2917e2f944910cb4a9a9b441d135f875.jpg","https://cdn.shibe.online/shibes/6d124364f02944300ae4f927b181733390edf64e.jpg","https://cdn.shibe.online/shibes/92213f0c406787acd4be252edb5e27c7e4f7a430.jpg","https://cdn.shibe.online/shibes/40fda0fd3d329be0d92dd7e436faa80db13c5017.jpg","https://cdn.shibe.online/shibes/e5c085fc427528fee7d4c3935ff4cd79af834a82.jpg","https://cdn.shibe.online/shibes/f83fa32c0da893163321b5cccab024172ddbade1.jpg","https://cdn.shibe.online/shibes/4aa2459b7f411919bf8df1991fa114e47b802957.jpg","https://cdn.shibe.online/shibes/2ef54e174f13e6aa21bb8be3c7aec2fdac6a442f.jpg","https://cdn.shibe.online/shibes/fa97547e670f23440608f333f8ec382a75ba5d94.jpg","https://cdn.shibe.online/shibes/fb1b7150ed8eb4ffa3b0e61ba47546dd6ee7d0dc.jpg","https://cdn.shibe.online/shibes/abf9fb41d914140a75d8bf8e05e4049e0a966c68.jpg","https://cdn.shibe.online/shibes/f63e3abe54c71cc0d0c567ebe8bce198589ae145.jpg","https://cdn.shibe.online/shibes/4c27b7b2395a5d051b00691cc4195ef286abf9e1.jpg","https://cdn.shibe.online/shibes/00df02e302eac0676bb03f41f4adf2b32418bac8.jpg","https://cdn.shibe.online/shibes/4deaac9baec39e8a93889a84257338ebb89eca50.jpg","https://cdn.shibe.online/shibes/199f8513d34901b0b20a33758e6ee2d768634ebb.jpg","https://cdn.shibe.online/shibes/f3efbf7a77e5797a72997869e8e2eaa9efcdceb5.jpg","https://cdn.shibe.online/shibes/39a20ccc9cdc17ea27f08643b019734453016e68.jpg","https://cdn.shibe.online/shibes/e67dea458b62cf3daa4b1e2b53a25405760af478.jpg","https://cdn.shibe.online/shibes/0a892f6554c18c8bcdab4ef7adec1387c76c6812.jpg","https://cdn.shibe.online/shibes/1b479987674c9b503f32e96e3a6aeca350a07ade.jpg","https://cdn.shibe.online/shibes/0c80fc00d82e09d593669d7cce9e273024ba7db9.jpg","https://cdn.shibe.online/shibes/bbc066183e87457b3143f71121fc9eebc40bf054.jpg","https://cdn.shibe.online/shibes/0932bf77f115057c7308ef70c3de1de7f8e7c646.jpg","https://cdn.shibe.online/shibes/9c87e6bb0f3dc938ce4c453eee176f24636440e0.jpg","https://cdn.shibe.online/shibes/0af1bcb0b13edf5e9b773e34e54dfceec8fa5849.jpg","https://cdn.shibe.online/shibes/32cf3f6eac4673d2e00f7360753c3f48ed53c650.jpg","https://cdn.shibe.online/shibes/af94d8eeb0f06a0fa06f090f404e3bbe86967949.jpg","https://cdn.shibe.online/shibes/4b55e826553b173c04c6f17aca8b0d2042d309fb.jpg","https://cdn.shibe.online/shibes/a0e53593393b6c724956f9abe0abb112f7506b7b.jpg","https://cdn.shibe.online/shibes/7eba25846f69b01ec04de1cae9fed4b45c203e87.jpg","https://cdn.shibe.online/shibes/fec6620d74bcb17b210e2cedca72547a332030d0.jpg","https://cdn.shibe.online/shibes/26cf6be03456a2609963d8fcf52cc3746fcb222c.jpg","https://cdn.shibe.online/shibes/c41b5da03ad74b08b7919afc6caf2dd345b3e591.jpg","https://cdn.shibe.online/shibes/7a9997f817ccdabac11d1f51fac563242658d654.jpg","https://cdn.shibe.online/shibes/7221241bad7da783c3c4d84cfedbeb21b9e4deea.jpg","https://cdn.shibe.online/shibes/283829584e6425421059c57d001c91b9dc86f33b.jpg","https://cdn.shibe.online/shibes/5145c9d3c3603c9e626585cce8cffdfcac081b31.jpg","https://cdn.shibe.online/shibes/b359c891e39994af83cf45738b28e499cb8ffe74.jpg","https://cdn.shibe.online/shibes/0b77f74a5d9afaa4b5094b28a6f3ee60efcb3874.jpg","https://cdn.shibe.online/shibes/adccfdf7d4d3332186c62ed8eb254a49b889c6f9.jpg","https://cdn.shibe.online/shibes/3aac69180f777512d5dabd33b09f531b7a845331.jpg","https://cdn.shibe.online/shibes/1d25e4f592db83039585fa480676687861498db8.jpg","https://cdn.shibe.online/shibes/d8349a2436420cf5a89a0010e91bf8dfbdd9d1cc.jpg","https://cdn.shibe.online/shibes/eb465ef1906dccd215e7a243b146c19e1af66c67.jpg","https://cdn.shibe.online/shibes/3d14e3c32863195869e7a8ba22229f457780008b.jpg","https://cdn.shibe.online/shibes/79cedc1a08302056f9819f39dcdf8eb4209551a3.jpg","https://cdn.shibe.online/shibes/4440aa827f88c04baa9c946f72fc688a34173581.jpg","https://cdn.shibe.online/shibes/94ea4a2d4b9cb852e9c1ff599f6a4acfa41a0c55.jpg","https://cdn.shibe.online/shibes/f4478196e441aef0ada61bbebe96ac9a573b2e5d.jpg","https://cdn.shibe.online/shibes/96d4db7c073526a35c626fc7518800586fd4ce67.jpg","https://cdn.shibe.online/shibes/196f3ed10ee98557328c7b5db98ac4a539224927.jpg","https://cdn.shibe.online/shibes/d12b07349029ca015d555849bcbd564d8b69fdbf.jpg","https://cdn.shibe.online/shibes/80fba84353000476400a9849da045611a590c79f.jpg","https://cdn.shibe.online/shibes/94cb90933e179375608c5c58b3d8658ef136ad3c.jpg","https://cdn.shibe.online/shibes/8447e67b5d622ef0593485316b0c87940a0ef435.jpg","https://cdn.shibe.online/shibes/c39a1d83ad44d2427fc8090298c1062d1d849f7e.jpg","https://cdn.shibe.online/shibes/6f38b9b5b8dbf187f6e3313d6e7583ec3b942472.jpg","https://cdn.shibe.online/shibes/81a2cbb9a91c6b1d55dcc702cd3f9cfd9a111cae.jpg","https://cdn.shibe.online/shibes/f1f6ed56c814bd939645138b8e195ff392dfd799.jpg","https://cdn.shibe.online/shibes/204a4c43cfad1cdc1b76cccb4b9a6dcb4a5246d8.jpg","https://cdn.shibe.online/shibes/9f34919b6154a88afc7d001c9d5f79b2e465806f.jpg","https://cdn.shibe.online/shibes/6f556a64a4885186331747c432c4ef4820620d14.jpg","https://cdn.shibe.online/shibes/bbd18ae7aaf976f745bc3dff46b49641313c26a9.jpg","https://cdn.shibe.online/shibes/6a2b286a28183267fca2200d7c677eba73b1217d.jpg","https://cdn.shibe.online/shibes/06767701966ed64fa7eff2d8d9e018e9f10487ee.jpg","https://cdn.shibe.online/shibes/7aafa4880b15b8f75d916b31485458b4a8d96815.jpg","https://cdn.shibe.online/shibes/b501169755bcf5c1eca874ab116a2802b6e51a2e.jpg","https://cdn.shibe.online/shibes/a8989bad101f35cf94213f17968c33c3031c16fc.jpg","https://cdn.shibe.online/shibes/f5d78feb3baa0835056f15ff9ced8e3c32bb07e8.jpg","https://cdn.shibe.online/shibes/75db0c76e86fbcf81d3946104c619a7950e62783.jpg","https://cdn.shibe.online/shibes/8ac387d1b252595bbd0723a1995f17405386b794.jpg","https://cdn.shibe.online/shibes/4379491ef4662faa178f791cc592b52653fb24b3.jpg","https://cdn.shibe.online/shibes/4caeee5f80add8c3db9990663a356e4eec12fc0a.jpg","https://cdn.shibe.online/shibes/99ef30ea8bb6064129da36e5673649e957cc76c0.jpg","https://cdn.shibe.online/shibes/aeac6a5b0a07a00fba0ba953af27734d2361fc10.jpg","https://cdn.shibe.online/shibes/9a217cfa377cc50dd8465d251731be05559b2142.jpg","https://cdn.shibe.online/shibes/65f6047d8e1d247af353532db018b08a928fd62a.jpg","https://cdn.shibe.online/shibes/fcead395cbf330b02978f9463ac125074ac87ab4.jpg","https://cdn.shibe.online/shibes/79451dc808a3a73f99c339f485c2bde833380af0.jpg","https://cdn.shibe.online/shibes/bedf90869797983017f764165a5d97a630b7054b.jpg","https://cdn.shibe.online/shibes/dd20e5801badd797513729a3645c502ae4629247.jpg","https://cdn.shibe.online/shibes/88361ee50b544cb1623cb259bcf07b9850183e65.jpg","https://cdn.shibe.online/shibes/0ebcfd98e8aa61c048968cb37f66a2b5d9d54d4b.jpg"]
            let kya = list[Math.floor(Math.random() * list.length)]
            client.sendFileFromUrl(from, kya, 'Dog.jpeg', 'Nih asu 🤪')
            break
        case 'cat':
            q2 = Math.floor(Math.random() * 900) + 300;
            q3 = Math.floor(Math.random() * 900) + 300;
            client.sendFileFromUrl(from, 'http://placekitten.com/'+q3+'/'+q2, 'neko.png','')
            break
        case 'pokemon':
            q7 = Math.floor(Math.random() * 890) + 1;
            client.sendFileFromUrl(from, 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/'+q7+'.png','Pokemon.png',)
            break
        case 'wall':
            switch (args[0]) {
                case 'pubg':
                    const papji = ['https://wallpaperaccess.com/download/pubg-pc-1186818', 'https://wallpaperaccess.com/download/pubg-pc-1186998'] // ini cuma contoh, link gambar lu cari ae di gugel banyak
                    let pubeg = papji[Math.floor(Math.random() * papji.length)]
                    client.sendFileFromUrl(from, pubeg, 'pubg.jpg', '', id)
                    break
                case 'anime':
                    const walnime = ['https://cdn.nekos.life/wallpaper/QwGLg4oFkfY.png','https://cdn.nekos.life/wallpaper/bUzSjcYxZxQ.jpg','https://cdn.nekos.life/wallpaper/j49zxzaUcjQ.jpg','https://cdn.nekos.life/wallpaper/YLTH5KuvGX8.png','https://cdn.nekos.life/wallpaper/Xi6Edg133m8.jpg','https://cdn.nekos.life/wallpaper/qvahUaFIgUY.png','https://cdn.nekos.life/wallpaper/leC8q3u8BSk.jpg','https://cdn.nekos.life/wallpaper/tSUw8s04Zy0.jpg','https://cdn.nekos.life/wallpaper/sqsj3sS6EJE.png','https://cdn.nekos.life/wallpaper/HmjdX_s4PU4.png','https://cdn.nekos.life/wallpaper/Oe2lKgLqEXY.jpg','https://cdn.nekos.life/wallpaper/GTwbUYI-xTc.jpg','https://cdn.nekos.life/wallpaper/nn_nA8wTeP0.png','https://cdn.nekos.life/wallpaper/Q63o6v-UUa8.png','https://cdn.nekos.life/wallpaper/ZXLFm05K16Q.jpg','https://cdn.nekos.life/wallpaper/cwl_1tuUPuQ.png','https://cdn.nekos.life/wallpaper/wWhtfdbfAgM.jpg','https://cdn.nekos.life/wallpaper/3pj0Xy84cPg.jpg','https://cdn.nekos.life/wallpaper/sBoo8_j3fkI.jpg','https://cdn.nekos.life/wallpaper/gCUl_TVizsY.png','https://cdn.nekos.life/wallpaper/LmTi1k9REW8.jpg','https://cdn.nekos.life/wallpaper/sbq_4WW2PUM.jpg','https://cdn.nekos.life/wallpaper/QOSUXEbzDQA.png','https://cdn.nekos.life/wallpaper/khaqGIHsiqk.jpg','https://cdn.nekos.life/wallpaper/iFtEXugqQgA.png','https://cdn.nekos.life/wallpaper/deFKIDdRe1I.jpg','https://cdn.nekos.life/wallpaper/OHZVtvDm0gk.jpg','https://cdn.nekos.life/wallpaper/YZYa00Hp2mk.jpg','https://cdn.nekos.life/wallpaper/R8nPIKQKo9g.png','https://cdn.nekos.life/wallpaper/_brn3qpRBEE.jpg','https://cdn.nekos.life/wallpaper/ADTEQdaHhFI.png','https://cdn.nekos.life/wallpaper/MGvWl6om-Fw.jpg','https://cdn.nekos.life/wallpaper/YGmpjZW3AoQ.jpg','https://cdn.nekos.life/wallpaper/hNCgoY-mQPI.jpg','https://cdn.nekos.life/wallpaper/3db40hylKs8.png','https://cdn.nekos.life/wallpaper/iQ2FSo5nCF8.jpg','https://cdn.nekos.life/wallpaper/meaSEfeq9QM.png','https://cdn.nekos.life/wallpaper/CmEmn79xnZU.jpg','https://cdn.nekos.life/wallpaper/MAL18nB-yBI.jpg','https://cdn.nekos.life/wallpaper/FUuBi2xODuI.jpg','https://cdn.nekos.life/wallpaper/ez-vNNuk6Ck.jpg','https://cdn.nekos.life/wallpaper/K4-z0Bc0Vpc.jpg','https://cdn.nekos.life/wallpaper/Y4JMbswrNg8.jpg','https://cdn.nekos.life/wallpaper/ffbPXIxt4-0.png','https://cdn.nekos.life/wallpaper/x63h_W8KFL8.jpg','https://cdn.nekos.life/wallpaper/lktzjDRhWyg.jpg','https://cdn.nekos.life/wallpaper/j7oQtvRZBOI.jpg','https://cdn.nekos.life/wallpaper/MQQEAD7TUpQ.png','https://cdn.nekos.life/wallpaper/lEG1-Eeva6Y.png','https://cdn.nekos.life/wallpaper/Loh5wf0O5Aw.png','https://cdn.nekos.life/wallpaper/yO6ioREenLA.png','https://cdn.nekos.life/wallpaper/4vKWTVgMNDc.jpg','https://cdn.nekos.life/wallpaper/Yk22OErU8eg.png','https://cdn.nekos.life/wallpaper/Y5uf1hsnufE.png','https://cdn.nekos.life/wallpaper/xAmBpMUd2Zw.jpg','https://cdn.nekos.life/wallpaper/f_RWFoWciRE.jpg','https://cdn.nekos.life/wallpaper/Y9qjP2Y__PA.jpg','https://cdn.nekos.life/wallpaper/eqEzgohpPwc.jpg','https://cdn.nekos.life/wallpaper/s1MBos_ZGWo.jpg','https://cdn.nekos.life/wallpaper/PtW0or_Pa9c.png','https://cdn.nekos.life/wallpaper/32EAswpy3M8.png','https://cdn.nekos.life/wallpaper/Z6eJZf5xhcE.png','https://cdn.nekos.life/wallpaper/xdiSF731IFY.jpg','https://cdn.nekos.life/wallpaper/Y9r9trNYadY.png','https://cdn.nekos.life/wallpaper/8bH8CXn-sOg.jpg','https://cdn.nekos.life/wallpaper/a02DmIFzRBE.png','https://cdn.nekos.life/wallpaper/MnrbXcPa7Oo.png','https://cdn.nekos.life/wallpaper/s1Tc9xnugDk.jpg','https://cdn.nekos.life/wallpaper/zRqEx2gnfmg.jpg','https://cdn.nekos.life/wallpaper/PtW0or_Pa9c.png','https://cdn.nekos.life/wallpaper/0ECCRW9soHM.jpg','https://cdn.nekos.life/wallpaper/kAw8QHl_wbM.jpg','https://cdn.nekos.life/wallpaper/ZXcaFmpOlLk.jpg','https://cdn.nekos.life/wallpaper/WVEdi9Ng8UE.png','https://cdn.nekos.life/wallpaper/IRu29rNgcYU.png','https://cdn.nekos.life/wallpaper/LgIJ_1AL3rM.jpg','https://cdn.nekos.life/wallpaper/DVD5_fLJEZA.jpg','https://cdn.nekos.life/wallpaper/siqOQ7k8qqk.jpg','https://cdn.nekos.life/wallpaper/CXNX_15eGEQ.png','https://cdn.nekos.life/wallpaper/s62tGjOTHnk.jpg','https://cdn.nekos.life/wallpaper/tmQ5ce6EfJE.png','https://cdn.nekos.life/wallpaper/Zju7qlBMcQ4.jpg','https://cdn.nekos.life/wallpaper/CPOc_bMAh2Q.png','https://cdn.nekos.life/wallpaper/Ew57S1KtqsY.jpg','https://cdn.nekos.life/wallpaper/hVpFbYJmZZc.jpg','https://cdn.nekos.life/wallpaper/sb9_J28pftY.jpg','https://cdn.nekos.life/wallpaper/JDoIi_IOB04.jpg','https://cdn.nekos.life/wallpaper/rG76AaUZXzk.jpg','https://cdn.nekos.life/wallpaper/9ru2luBo360.png','https://cdn.nekos.life/wallpaper/ghCgiWFxGwY.png','https://cdn.nekos.life/wallpaper/OSR-i-Rh7ZY.png','https://cdn.nekos.life/wallpaper/65VgtPyweCc.jpg','https://cdn.nekos.life/wallpaper/3vn-0FkNSbM.jpg','https://cdn.nekos.life/wallpaper/u02Y0-AJPL0.jpg','https://cdn.nekos.life/wallpaper/_-Z-0fGflRc.jpg','https://cdn.nekos.life/wallpaper/3VjNKqEPp58.jpg','https://cdn.nekos.life/wallpaper/NoG4lKnk6Sc.jpg','https://cdn.nekos.life/wallpaper/xiTxgRMA_IA.jpg','https://cdn.nekos.life/wallpaper/yq1ZswdOGpg.png','https://cdn.nekos.life/wallpaper/4SUxw4M3UMA.png','https://cdn.nekos.life/wallpaper/cUPnQOHNLg0.jpg','https://cdn.nekos.life/wallpaper/zczjuLWRisA.jpg','https://cdn.nekos.life/wallpaper/TcxvU_diaC0.png','https://cdn.nekos.life/wallpaper/7qqWhEF_uoY.jpg','https://cdn.nekos.life/wallpaper/J4t_7DvoUZw.jpg','https://cdn.nekos.life/wallpaper/xQ1Pg5D6J4U.jpg','https://cdn.nekos.life/wallpaper/aIMK5Ir4xho.jpg','https://cdn.nekos.life/wallpaper/6gneEXrNAWU.jpg','https://cdn.nekos.life/wallpaper/PSvNdoISWF8.jpg','https://cdn.nekos.life/wallpaper/SjgF2-iOmV8.jpg','https://cdn.nekos.life/wallpaper/vU54ikOVY98.jpg','https://cdn.nekos.life/wallpaper/QjnfRwkRU-Q.jpg','https://cdn.nekos.life/wallpaper/uSKqzz6ZdXc.png','https://cdn.nekos.life/wallpaper/AMrcxZOnVBE.jpg','https://cdn.nekos.life/wallpaper/N1l8SCMxamE.jpg','https://cdn.nekos.life/wallpaper/n2cBaTo-J50.png','https://cdn.nekos.life/wallpaper/ZXcaFmpOlLk.jpg','https://cdn.nekos.life/wallpaper/7bwxy3elI7o.png','https://cdn.nekos.life/wallpaper/7VW4HwF6LcM.jpg','https://cdn.nekos.life/wallpaper/YtrPAWul1Ug.png','https://cdn.nekos.life/wallpaper/1p4_Mmq95Ro.jpg','https://cdn.nekos.life/wallpaper/EY5qz5iebJw.png','https://cdn.nekos.life/wallpaper/aVDS6iEAIfw.jpg','https://cdn.nekos.life/wallpaper/veg_xpHQfjE.jpg','https://cdn.nekos.life/wallpaper/meaSEfeq9QM.png','https://cdn.nekos.life/wallpaper/Xa_GtsKsy-s.png','https://cdn.nekos.life/wallpaper/6Bx8R6D75eM.png','https://cdn.nekos.life/wallpaper/zXOGXH_b8VY.png','https://cdn.nekos.life/wallpaper/VQcviMxoQ00.png','https://cdn.nekos.life/wallpaper/CJnRl-PKWe8.png','https://cdn.nekos.life/wallpaper/zEWYfFL_Ero.png','https://cdn.nekos.life/wallpaper/_C9Uc5MPaz4.png','https://cdn.nekos.life/wallpaper/zskxNqNXyG0.jpg','https://cdn.nekos.life/wallpaper/g7w14PjzzcQ.jpg','https://cdn.nekos.life/wallpaper/KavYXR_GRB4.jpg','https://cdn.nekos.life/wallpaper/Z_r9WItzJBc.jpg','https://cdn.nekos.life/wallpaper/Qps-0JD6834.jpg','https://cdn.nekos.life/wallpaper/Ri3CiJIJ6M8.png','https://cdn.nekos.life/wallpaper/ArGYIpJwehY.jpg','https://cdn.nekos.life/wallpaper/uqYKeYM5h8w.jpg','https://cdn.nekos.life/wallpaper/h9cahfuKsRg.jpg','https://cdn.nekos.life/wallpaper/iNPWKO8d2a4.jpg','https://cdn.nekos.life/wallpaper/j2KoFVhsNig.jpg','https://cdn.nekos.life/wallpaper/z5Nc-aS6QJ4.jpg','https://cdn.nekos.life/wallpaper/VUFoK8l1qs0.png','https://cdn.nekos.life/wallpaper/rQ8eYh5mXN8.png','https://cdn.nekos.life/wallpaper/D3NxNISDavQ.png','https://cdn.nekos.life/wallpaper/Z_CiozIenrU.jpg','https://cdn.nekos.life/wallpaper/np8rpfZflWE.jpg','https://cdn.nekos.life/wallpaper/ED-fgS09gik.jpg','https://cdn.nekos.life/wallpaper/AB0Cwfs1X2w.jpg','https://cdn.nekos.life/wallpaper/DZBcYfHouiI.jpg','https://cdn.nekos.life/wallpaper/lC7pB-GRAcQ.png','https://cdn.nekos.life/wallpaper/zrI-sBSt2zE.png','https://cdn.nekos.life/wallpaper/_RJhylwaCLk.jpg','https://cdn.nekos.life/wallpaper/6km5m_GGIuw.png','https://cdn.nekos.life/wallpaper/3db40hylKs8.png','https://cdn.nekos.life/wallpaper/oggceF06ONQ.jpg','https://cdn.nekos.life/wallpaper/ELdH2W5pQGo.jpg','https://cdn.nekos.life/wallpaper/Zun_n5pTMRE.png','https://cdn.nekos.life/wallpaper/VqhFKG5U15c.png','https://cdn.nekos.life/wallpaper/NsMoiW8JZ60.jpg','https://cdn.nekos.life/wallpaper/XE4iXbw__Us.png','https://cdn.nekos.life/wallpaper/a9yXhS2zbhU.jpg','https://cdn.nekos.life/wallpaper/jjnd31_3Ic8.jpg','https://cdn.nekos.life/wallpaper/Nxanxa-xO3s.png','https://cdn.nekos.life/wallpaper/dBHlPcbuDc4.jpg','https://cdn.nekos.life/wallpaper/6wUZIavGVQU.jpg','https://cdn.nekos.life/wallpaper/_-Z-0fGflRc.jpg','https://cdn.nekos.life/wallpaper/H9OUpIrF4gU.jpg','https://cdn.nekos.life/wallpaper/xlRdH3fBMz4.jpg','https://cdn.nekos.life/wallpaper/7IzUIeaae9o.jpg','https://cdn.nekos.life/wallpaper/FZCVL6PyWq0.jpg','https://cdn.nekos.life/wallpaper/5dG-HH6d0yw.png','https://cdn.nekos.life/wallpaper/ddxyA37HiwE.png','https://cdn.nekos.life/wallpaper/I0oj_jdCD4k.jpg','https://cdn.nekos.life/wallpaper/ABchTV97_Ts.png','https://cdn.nekos.life/wallpaper/58C37kkq39Y.png','https://cdn.nekos.life/wallpaper/HMS5mK7WSGA.jpg','https://cdn.nekos.life/wallpaper/1O3Yul9ojS8.jpg','https://cdn.nekos.life/wallpaper/hdZI1XsYWYY.jpg','https://cdn.nekos.life/wallpaper/h8pAJJnBXZo.png','https://cdn.nekos.life/wallpaper/apO9K9JIUp8.jpg','https://cdn.nekos.life/wallpaper/p8f8IY_2mwg.jpg','https://cdn.nekos.life/wallpaper/HY1WIB2r_cE.jpg','https://cdn.nekos.life/wallpaper/u02Y0-AJPL0.jpg','https://cdn.nekos.life/wallpaper/jzN74LcnwE8.png','https://cdn.nekos.life/wallpaper/IeAXo5nJhjw.jpg','https://cdn.nekos.life/wallpaper/7lgPyU5fuLY.jpg','https://cdn.nekos.life/wallpaper/f8SkRWzXVxk.png','https://cdn.nekos.life/wallpaper/ZmDTpGGeMR8.jpg','https://cdn.nekos.life/wallpaper/AMrcxZOnVBE.jpg','https://cdn.nekos.life/wallpaper/ZhP-f8Icmjs.jpg','https://cdn.nekos.life/wallpaper/7FyUHX3fE2o.jpg','https://cdn.nekos.life/wallpaper/CZoSLK-5ng8.png','https://cdn.nekos.life/wallpaper/pSNDyxP8l3c.png','https://cdn.nekos.life/wallpaper/AhYGHF6Fpck.jpg','https://cdn.nekos.life/wallpaper/ic6xRRptRes.jpg','https://cdn.nekos.life/wallpaper/89MQq6KaggI.png','https://cdn.nekos.life/wallpaper/y1DlFeHHTEE.png']
                    let walnimek = walnime[Math.floor(Math.random() * walnime.length)]
                    client.sendFileFromUrl(from, walnimek, 'anime.jpg', '', id)
                    break
                default:
                    client.reply(from, 'Pilih : \n\n*pubg* untuk wall papji \n*anime* untuk wall anime', id)
                    break
            }
            break
        case 'chord':
            if (!args[0]) {
                client.reply(from, '✅ *Contoh:* !chord lathi', id)
            } else {
                console.log(`Search query chord gitar.`)
                await client.reply(from, `🍻 Permintaan anda sedang di proses, ditunggu aja gan.`, id)
                Chord(args.splice(0).join(' '))
                .then(body => {
                    body.map(({ code, result }) => {
                        if (code == '200') {
                            let msg = `🔰 -----[ *CHORD BY ${BotName}* ]----- 🔰\n\n${result}\n\nSumber: www.chordindonesia.com\n\n🔰 -----[ *POWERED BY ${BotName}* ]----- 🔰`
                            client.reply(from, msg, id).then(() => {
                                console.log(`Chord gitar telah dikirim. Loaded Processed for ${processTime(t, moment())} Second`)
                            })
                        }
                    })
                })
                .catch(err => client.reply(from, err))
            }
            break
        case 'bmkg':
            console.log(`Mengecek info gempa bmkg.`)
            bmkg()
            .then(body => {
                body.map(({ Jam, Tanggal, Bujur, Kedalaman, lintang, Magnitude, Potensi, Wilayah1, Wilayah2, Wilayah3, Wilayah4, Wilayah5, _symbol, point }) => {
                    let msg = `🔰 -----[ *INFO GEMPA BY ${BotName}* ]----- 🔰\n\n*Bujur:* ${Bujur}\n*Kedalaman:* ${Kedalaman}\n*Lintang:* ${lintang}\n*Magnitude:* ${Magnitude}\n*Potensi:* ${Potensi}\n*Wilayah 1:* ${Wilayah1}\n*Wilayah 2:* ${Wilayah2}\n*Wilayah 3:* ${Wilayah3}\n*Wilayah 4:* ${Wilayah4}\n*Wilayah 5:* ${Wilayah5}\n*Simbol:* ${_symbol}\n*Coordinates:* ${point.coordinates}*Datetime:* ${Tanggal} & ${Jam}\n\n🔰 -----[ *POWERED BY ${BotName}* ]----- 🔰`
                    client.reply(from, msg, id).then(() => {
                    console.log(`Info gempa by bmkg Telah Dikirim. Loaded Processed for ${processTime(t, moment())} Second`)
                    }).catch((err) => console.log(err))
                })
            })
            .catch(err => client.reply(from, err))
            break
        case 'tts':
            if (!args[0]) {
                client.reply(from, '✅ *Contoh:* !tts [id/en/jp/ar] kamu anjay', id)
            } else {
                
                const ttsId = require('node-gtts')('id')
                const ttsEn = require('node-gtts')('en')
                const ttsJp = require('node-gtts')('ja')
                const ttsAr = require('node-gtts')('ar')
                const dataText = body.slice(8)
                if (dataText === '') return await client.reply(from, 'Kosong?', id)
                totalText = Number(dataText.split(' ').length) - Number(dataText.length)
                if (totalText >= 250) return await client.reply(from, '❌ Gagal gan, teks terlalu panjang!', id)
                var dataBhs = body.slice(5, 7)
                if (dataBhs == 'id') {
                    ttsId.save('./tts/resId.mp3', dataText, function () {
                        client.sendPtt(from, './tts/resId.mp3', id)
                    })
                } else if (dataBhs == 'en') {
                    ttsEn.save('./tts/resEn.mp3', dataText, function () {
                        client.sendPtt(from, './tts/resEn.mp3', id)
                    })
                } else if (dataBhs == 'jp') {
                    ttsJp.save('./tts/resJp.mp3', dataText, function () {
                        client.sendPtt(from, './tts/resJp.mp3', id)
                    })
                } else if (dataBhs == 'ar') {
                    ttsAr.save('./tts/resAr.mp3', dataText, function () {
                        client.sendPtt(from, './tts/resAr.mp3', id)
                    })
                } else {
                    await client.reply(from, 'Pilih bahasa:\n\n[id] untuk Indonesia\n[en] untuk Inggris\n[jp] untuk Jepang\n[ar] untuk Arab', id)
                }
            }
            break
        case 'ssweb':
            if (!args[0]) {
                client.reply(from, '✅ *Contoh:* !ssweb youtube.com', id)
            } else {
                console.log(`Sedang memproses link menjadi gambar.`)
                ssweb(args[0])
                .then(body => {
                    body.map(({ code, result }) => {
                        if (code == '200') {
                            client.sendFileFromUrl(from, result, 'images.jpg', '🍻 Nih bro screenshootnya.').then(() => {
                                console.log(`Gambar telah dikirim. Loaded Processed for ${processTime(t, moment())} Second`)
                            })
                        }
                    })
                })
                .catch(err => client.reply(from, err))
            }
            break
        case 'jadwaltv':
            if (!args[0]) {
                client.reply(from, '✅ *Contoh:* !jadwaltv INDOSIAR', id)
            } else {
                console.log(`Sedang mencari jadwal televisi.`)
                jadwalTv(args[0].toLowerCase())
                .then(body => {
                    body.map(({ code, result }) => {
                        if (code == '200') {
                            let msg = `🔰 -----[ *JADWAL TV BY ${BotName}* ]----- 🔰\n\n*Jadwal TV:* ${args[0].toUpperCase()}\n\n${result}\n\n🔰 -----[ *POWERED BY ${BotName}* ]----- 🔰`
                            client.reply(from, msg, id).then(() => {
                                console.log(`Jadwal TV telah dikirim. Loaded Processed for ${processTime(t, moment())} Second`)
                            })
                        } else {
                            let msg = '❌ Channel yang dituju salah! Daftar Channel yang tersedia: ANTV, GTV, INDOSIAR, INEWSTV, KOMPASTV, MNCTV, METROTV, NETTV, RCTI, SCTV, RTV, TRANS7, TRANSTV'
                            client.reply(from, msg, id).then(() => {
                                console.log(`Pesan error jadwal tv telah dikirim. Loaded Processed for ${processTime(t, moment())} Second`)
                            })
                        }
                    })
                })
                .catch(err => client.reply(from, err))
            }
            break
        case 'tvnow':
            console.log(`Mengecek jadwal tv sekarang`)
            tvnow()
            .then(body => {
                body.map(({ code, jam, jadwal }) => {
                    if (code == '200') {
                        let msg = `🔰 -----[ *JADWAL TV NOW BY ${BotName}* ]----- 🔰\n\n*Jam:* ${jam}\n\n*Jadwal:*\n\n${jadwal}\n\n🔰 -----[ *POWERED BY ${BotName}* ]----- 🔰`
                        client.reply(from, msg, id).then(() => {
                            console.log(`Jadwal televisi Telah Dikirim. Loaded Processed for ${processTime(t, moment())} Second`)
                        }).catch((err) => console.log(err))
                    }
                })
            })
            .catch(err => client.reply(from, err))
            break
        // Ene Menu Tools Bot

        default:
            console.log(color('[ERROR]', 'red'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), 'Unregistered Command from', color(pushname))
            break
        }
    } catch (err) {
        console.log(color('[ERROR]', 'red'), err)
    }
}
