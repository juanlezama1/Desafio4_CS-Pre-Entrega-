import { Router } from "express"
import Product from "../config/Product.js"
import ProductManager from '../config/ProductManager.js'
let gestor_productos = new ProductManager ('./SRC/DataBase/db.json')

const productsRouter = Router ()

productsRouter.get('/', async (req, res) => {
    const {limit} = req.query // Si no se mandó, tendrá el valor 'undefined'
    console.log("Enviando productos al cliente...")

    let my_products = await gestor_productos.getProducts()

    if (my_products === -1) // Caso de que la DB esté vacía
        res.status(200).send("Sin productos por ahora!")

    else 
    
    {
        // En el caso de que la DB no esté vacía, devuelvo la cantidad solicitada
        // O todos los productos en caso que no esté definido el query param 'limit'
        let cantidad_productos
        !limit? cantidad_productos = my_products.length: cantidad_productos = limit

        // Caso de que envíen un límite, pero no sea un número
        isNaN(cantidad_productos)? res.status(400).send("El límite debe ser numérico!") : res.status(200).send(my_products.splice(0, cantidad_productos))
    }

    console.log("Productos enviados!")
} )

productsRouter.get('/:pid', async (req, res) => {

    console.log("Enviando producto específico...")

    let product_code = req.params.pid // Obtengo el código del producto

    // Intento obtenerlo de la DB
    let my_product = await gestor_productos.getProductById(product_code)

    // Si no existe, doy el aviso. Caso contrario, lo envío
    my_product == -1 ? res.status(400).send("El producto no existe!") : res.status(200).send(my_product)

    console.log("Producto enviado!")
})

productsRouter.post('/', async (req, res) => {

    console.log("Cargando nuevo producto...")
    let new_product = req.body

    // Add product me devolverá -1 en caso de error, o el mensaje correspondiente para el usuario.
    let add_result = await gestor_productos.addProduct(new_product)

    add_result == -1? res.status(400).send("Producto con formato incorrecto!") : res.status(200).send(add_result)  
})

productsRouter.put('/:pid', async (req, res) => {

    console.log("Actualizando producto...")
    let product_id = req.params.pid
    let update_result = await gestor_productos.updateProduct(product_id, req.body)

    if (update_result === -1)
        res.status(400).send("Imposible actualizar, producto no existe en la BD!")

    else if (update_result === -2)
        res.status(400).send("Producto incompleto, imposible actualizar")

    else
        res.status(200).send("Producto actualizado con éxito!")
})

productsRouter.delete('/:pid', async (req, res) => {

    console.log("Eliminando producto...")
    let product_id = req.params.pid
    
    if (gestor_productos.deleteProduct(product_id) == -1)
        res.status(400).send("Imposible eliminar, producto inexistente en DB!")

    else
        res.status(200).send("Producto eliminado con éxito!")
})

export default productsRouter