import express from 'express'
import __dirname from './path.js'
import productsRouter from './routes/productsRouter.js'

// Dejé la DB cargada con 10 productos de antemano utilizando la función .addProducts(product)

const my_app = express ()
const PORT = 8080

// Application middlewares

my_app.use('/static', express.static(__dirname + '/public'))
my_app.use(express.json())

// Router Middlewares

my_app.use('/products', productsRouter)

// Levanto el server

my_app.listen(PORT, () => {
    console.log(`Escuchando solicitudes en el puerto ${PORT}`)
})