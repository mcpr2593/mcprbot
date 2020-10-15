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
                if (msg >= 10000) {
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
                if (ids.length <= 10000) {
                    client.sendText(id, '❌ Maaf, bot tidak dapat sembarangan masuk grub. Silahkan chat Owner/Pemilik Bot --> https://bit.ly/377u1Ik.').then(() => client.leaveGroup(id))
                } else {
                    client.sendText(id, '❌ Maaf, bot tidak dapat sembarangan masuk grub. Silahkan chat Owner/Pemilik Bot --> https://bit.ly/377u1Ik.').then(() => client.leaveGroup(id))
                }
            }))

    client.onRemovedFromGroup((data) => {
        // console.log(data)
    })

    // listen paricipant event on group (wellcome message)
    client.onGlobalParicipantsChanged((event) => {
    })

  
 // listening on Incoming Call
 client.onIncomingCall(( async (call) => {
    await client.sendText(call.peerJid, 'Maaf, BOT tidak bisa menerima panggilan. nelfon = block! /n Unblock? Silahkan chat Owner/Pemilik Bot --> https://bit.ly/30Zffzs.')
    .then(() => client.contactBlock(call.peerJid))
}))
}



create('Imperial', options(true, start))
    .then((client) => start(client))
    .catch((err) => new Error(err))
