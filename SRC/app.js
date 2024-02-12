import express from 'express'
import __dirname from './path.js'
import productsRouter from './routes/productsRouter.js'
import cartsRouter from './routes/cartsRouter.js'

// Dejé la DB cargada con 10 productos de antemano utilizando la función .addProducts(product)

const my_app = express ()
const PORT = 8080

// Application middlewares

my_app.use(express.json())

// Router Middlewares

my_app.use('/api/products', productsRouter)
my_app.use('/api/carts', cartsRouter)

// Levanto el server

my_app.listen(PORT, () => {
    console.log(`Escuchando solicitudes en el puerto ${PORT}`)
})