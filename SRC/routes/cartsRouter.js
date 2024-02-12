import { Router } from "express"
import CartManager from "../config/CartManager.js"
let gestor_carritos = new CartManager ('./SRC/DataBase/db_carts.json')

const cartsRouter = Router ()

cartsRouter.post('/', async (req, res) => {

    console.log("Cargando nuevo carrito...")
    let new_cart = req.body
    await gestor_carritos.addCart(new_cart)
    res.status(200).send("Carrito agregado correctamente!")
})

cartsRouter.get('/:cid', async (req, res) => {

    console.log("Consultando carrito específico...")

    let cart_code = req.params.cid // Obtengo el código del carrito

    // Intento obtenerlo de la DB
    let my_cart = await gestor_carritos.getCartsById(cart_code)

    // Si no existe, doy el aviso. Caso contrario, lo envío
    my_cart == -1 ? res.status(400).send("El carrito no existe!") : res.status(200).send(my_cart)

    console.log("Carrito enviado!")
})

cartsRouter.post('/:cid/product/:pid', async (req, res) => {

    console.log("Agregando producto específico en un carrito...")

    let cart_code = req.params.cid
    let product_code = req.params.pid
    let add_result = await gestor_carritos.addCertainProductOnIdCart(cart_code, product_code)

    add_result === -1? res.status(400).send("Se intentó actualizar un carrito que no existe!") : res.status(200).send("Carrito actualizado!")
})

export default cartsRouter