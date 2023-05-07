console.log('Node script now running')
//hent biblioteket ip
const ip = require('ip')
console.log(ip.address())
let ipadr = ip.address()
//hent biblioteket express og gem objektet i en konstant
const express = require('express')
//initaliser app objektet
const app = express()


//Definer en port
const port = 666
//start en webserver på port 666
const server = app.listen(port, ()=>{
    console.log('Server lytter på port: ' + port)
})


//Websockets
// opret en server websocket
const socketLib = require('socket.io')
const serverSocket = socketLib(server)
app.use('/', express.static('public'))



serverSocket.sockets.on('connection', socket => {
    console.log('new socket connection established')
    

    //serverSocket.sockets.emit('', )
})


//UDP PROTOCOL:
const dgram = require('dgram');
const udpserver = dgram.createSocket('udp4');

const udpPORT = 3000;
const udpHOST = '10.146.126.11';

udpserver.bind(udpPORT, ipadr);


udpserver.on('message', (msg, rinfo) => {
    console.log(`Received message from ${rinfo.address}:${rinfo.port}: ${msg}`);
    //console.log(`${msg}`)
    serverSocket.sockets.emit('movement', `${msg}`)
});

udpserver.on('error', (err) => {
    console.error(`server error:\n${err.stack}`);
    server.close();
  });