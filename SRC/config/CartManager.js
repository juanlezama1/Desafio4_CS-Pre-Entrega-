import Cart from './Cart.js'
import {promises as fs} from 'fs'

class CartManager {
    
    constructor(path)

    {
        // Aviso si el path que mandaron no es válido
        if (!path)

        {
            console.error('El path ingresado es inválido!')
            return
        }

        this.path = path
        console.log("Gestor de carritos generado correctamente!")
    }

    addCart = async (cart) => {

        let new_cart = new Cart (cart)
 
        let my_carts

        // Intento leer mi base, por si hay una DB, y sólo le agregaría este carrito
        try {
            my_carts = JSON.parse(await fs.readFile(this.path, 'utf-8'))

            // Lo transformo a array por si era un objeto simple y quiero agregar más productos
            !Array.isArray(my_carts) && (my_carts = [my_carts])
        }

        // Si no existe la base, la creo a partir de un arreglo vacío
        catch (error)

        {
            console.log("Creando base de datos de carritos...")
            my_carts= []
        }

        // Caso contrario, lo agrego.
        my_carts.push(new_cart)
        await fs.writeFile(this.path, JSON.stringify(my_carts))  
        console.log(`Usuario agregó carrito a la base!`)
        return
    }

    getCartsById = async (cart_id) => {

        // Intento acceder a la base
        let my_carts = []

        try {
            my_carts = JSON.parse(await fs.readFile(this.path, 'utf-8')) // Intento leer mi base
        }

        catch (error) {
            console.error ("Imposible acceder a DB!")
            return
        }

        // Intento buscar el carrito con el código específico

        const certain_cart = my_carts.find(cart => cart.id === cart_id)

        if (certain_cart)
            return certain_cart.products

        // Caso en que no haya ningún carrito con ese código
        return -1
    }

    addCertainProductOnIdCart = async (cart_id, product_code) => {

        // Intento acceder a la base

        let my_carts = []

        try {
            my_carts = JSON.parse(await fs.readFile(this.path, 'utf-8')) // Intento leer mi base
        }

        catch (error) {
            console.error ("Imposible acceder a DB!")
            return
        }

        // Intento buscar el índice del producto que coincida con el código
        let cart_index = my_carts.findIndex(cart => cart.id === cart_id)

        if (cart_index === -1)

        {
            console.log ("Usuario intentó actualizar producto en un carrito no existente")
            return -1
        }

        // Intento buscar el producto en particular dentro de ese carrito

        let product_index = my_carts[cart_index].products.findIndex(product => product.code === product_code)

        if (product_index === -1)

        {
            console.log("Producto no existente en el carrito, agregándolo...")
            let new_product = {code: product_code, stock: 1}
            my_carts[cart_index].products.push(new_product)
        }

        else
            my_carts[cart_index].products[product_index].stock += 1

    
        // Vuelvo a guardar el arreglo en el JSON
        await fs.writeFile(this.path, JSON.stringify(my_carts))
        console.log("Producto actualizado!")
    }
}

export default CartManager