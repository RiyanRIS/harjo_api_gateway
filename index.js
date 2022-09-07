var express = require('express');
var axios = require('axios');
var app = express();

app.get('/dokter', function (req, res) {
    let harinya = req.query.hari
    var data = JSON.stringify({
      "hari": harinya
    });
  
    var config = {
      method: 'get',
      url: 'http://rspau.ddns.net:8080/backend-apm/api/jadwal-dokter',
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };
  
    axios(config)
    .then(function (response) {
        res.status(200).json(response.data)
    })
    .catch(function (error) {
        res.status(500)
    });
})

app.get('/tarif', function (req, res) {
    let harinya = req.query.hari
    var data = JSON.stringify({
      "hari": harinya
    });
  
    var config = {
      method: 'get',
      url: 'http://36.91.47.11:8080/backend-apm/api/master/get-tarif-ruangan',
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };
  
    axios(config)
    .then(function (response) {
        res.status(200).json(response.data)
    })
    .catch(function (error) {
        res.status(500)
    });
})

const { default: hisokaConnect, useSingleFileAuthState } = require("@adiwajshing/baileys")
const { state, saveState } = useSingleFileAuthState(`./apiwahardjo.json`)
const pino = require('pino')
const { Boom } = require('@hapi/boom')

async function startHisoka() {
  const hisoka = hisokaConnect({
    logger: pino({ level: 'silent' }),
    printQRInTerminal: true,
    browser: ['Hisoka Multi Device','Safari','1.0.0'],
    auth: state
  })

  hisoka.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update	    
    if (connection === 'close') {
    let reason = new Boom(lastDisconnect?.error)?.output.statusCode
        if (reason === DisconnectReason.badSession) { console.log(`Bad Session File, Please Delete Session and Scan Again`); hisoka.logout(); }
        else if (reason === DisconnectReason.connectionClosed) { console.log("Connection closed, reconnecting...."); startHisoka(); }
        else if (reason === DisconnectReason.connectionLost) { console.log("Connection Lost from Server, reconnecting..."); startHisoka(); }
        else if (reason === DisconnectReason.connectionReplaced) { console.log("Connection Replaced, Another New Session Opened, Please Close Current Session First"); hisoka.logout(); }
        else if (reason === DisconnectReason.loggedOut) { console.log(`Device Logged Out, Please Scan Again And Run.`); hisoka.logout(); }
        else if (reason === DisconnectReason.restartRequired) { console.log("Restart Required, Restarting..."); startHisoka(); }
        else if (reason === DisconnectReason.timedOut) { console.log("Connection TimedOut, Reconnecting..."); startHisoka(); }
        else hisoka.end(`Unknown DisconnectReason: ${reason}|${connection}`)
    }
    console.log('Connected...', update)
  })

  hisoka.ev.on('creds.update', saveState)

  app.get('/wa', async (req, res) => {
    let nomor = req.query.no
    let pesan = req.query.pesan
    console.log("Mengirim pesan ke " + nomor + " pesanya " + pesan)
    const sentMsg  = await hisoka.sendMessage(nomor + "@s.whatsapp.net", { text: pesan })
    res.status(200).json({res: sentMsg})
  })
}

startHisoka();



var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})