const { create, Client } = require('@open-wa/wa-automate')
const { color } = require('./utils')
const options = require('./utils/options')
const msgHandler = require('./handler/message')

const start = (client = new Client()) => {
    console.log('[:] SELAMAT DATANG DI MCPR-BOT ^_^')
    console.log('[:] WHATSAPP TELAH TERSAMBUNG !')

    // Force it to keep the current session
    client.onStateChanged((state) => {
        console.log('[:] STATUS SAMBUNGAN :', state)
        if (state === 'CONFLICT') client.forceRefocus()
    })

    // listening on message
    client.onMessage((message) => {
        client.getAmountOfLoadedMessages() // Cut message Cache if cache more than 3K
            .then((msg) => {
                if (msg >= 2000) {
                    console.log('[:]', color(`Loaded Message Reach ${msg}, cuting message cache...`, 'yellow'))
                    client.cutMsgCache()
                }
            })
        // Message Handler
        msgHandler(client, message)
    })

    // listen group invitation
    client.onAddedToGroup(({ groupMetadata: { id }, contact: { name } }) =>
        client.getGroupMembersId(id)
            .then((ids) => {
                console.log('[INFO]', color(`Anda telah di invite grub. [ ${name} : ${ids.length} ]`, 'yellow'))
                // conditions if the group members are less than 10 then the bot will leave the group
                if (ids.length <= 40) {
                    client.sendText(id, '❌ Maaf, bot tidak dapat sembarangan masuk grub. Minimal anggota grub agar bot dapat masuk adalah 40 member.').then(() => client.leaveGroup(id))
                } else {
                    client.sendText(id, `🔰 -----[ *WELCOME TO GRUB ‼️* ]----- 🔰\n\nHalo warga grup *${name}* 👋️\nJangan lupa baca deskripsi group terlebih dahulu, dan patuhi rules yang ada.\n\n🔱 *Rules Grub:*\n\n✅ Menghormati anggota satu sama lain.\n✅ Tidak diperkenankan mem-posting hal-hal yang berbau dan mengandung unsur Politik, SARA, Kontroversial, pornografi LGBT dan disturbing picture (dalam bentuk apapun)\n✅ Larangan memposting sesuatu yang  berdampak negatif bagi anggota lain.\n✅ Tidak bercanda berlebihan yang dapat memicu perdebatan.\n\n🔰 -----[ *POWERED BY RFP BOT 😎* ]----- 🔰`)
                }
            }))

    client.onRemovedFromGroup((data) => {
        // console.log(data)
    })

    // listen paricipant event on group (wellcome message)
    client.onGlobalParicipantsChanged((event) => {
    })

    client.onIncomingCall((callData) => {
        console.log('[:]', color(`BLOCK USER SPAM TELP !`, 'red'))
        client.contactBlock(callData.peerJid)
    })
}

create('Imperial', options(true, start))
    .then((client) => start(client))
    .catch((err) => new Error(err))
