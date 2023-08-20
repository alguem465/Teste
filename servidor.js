const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

app.get('/', (req, res) => {

	const html = `<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>App em tempo real</title>
        </head>
    <body>
      <h1>Teste de contagem hehe</h1>
      <p>Contagem atual: <span id="contador">0</span></p>
      <button id="adicionar">Adicionar</button>
       <script src="/socket.io/socket.io.js"></script>
       <script>
         const socket = io()
         
         const atualizar = (n) => {
           document.getElementById("contador").textContent = n
         }
         
         document.addEventListener('DOMContentLoaded', () => {
           socket.on('inicio', (n) => {
             atualizar(n)
           })
           socket.on('atualizar', (n) => {
             atualizar(n)
           })
           document.getElementById("adicionar").addEventListener('click', () => {
             socket.emit('incrementar')
           })
         })
       </script>
    </body>
    </html>`

	res.send(html)
})

let contagem = 0

io.on('connection', (socket) => {
  console.log("Um usuário conectado")
  
  socket.emit('inicio', contagem)

  socket.on('incrementar', () => {
    contagem++
    io.emit('atualizar', contagem)
  })
  
  socket.on('disconnect', () => {
    console.log("Usuário desconectado")
  })
})

server.listen(process.env.PORT || 3000, '0.0.0.0', () => {
  console.log("Servidor rodando na porta 3000")
})
