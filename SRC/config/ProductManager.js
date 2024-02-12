import {promises as fs} from 'fs'
import Product from './Product.js'

class ProductManager {

    constructor(path)

    {
        // Aviso si el path que mandaron no es válido
        if (!path)

        {
            console.error('El path ingresado es inválido!')
            return
        }

        this.path = path
        console.log("Gestor de productos generado correctamente!")
    }

    // Crea el objeto del tipo "Product" y lo carga al arreglo
    addProduct = async (product) => {

        // Intento generar un producto a raíz de lo que mandó el usuario
        // Si puedo hacerlo, es porque es un producto válido.
        // Caso contrario, devuelvo código de error

        let new_product

        try {
            new_product = new Product (product)
        }

        catch (error)

        {
            return -1
        }
 
        // Valido que el path no sea nulo
        if (!this.path)

        {
            console.error('Usuario ingresó path inválido')
            return
        }

        let my_products

        // Intento leer mi base, por si hay una DB, y sólo le agregaría productos
        try {
            my_products = JSON.parse(await fs.readFile(this.path, 'utf-8'))

            // Lo transformo a array por si era un objeto simple y quiero agregar más productos
            !Array.isArray(my_products) && (my_products = [my_products])
        }

        // Si no existe la base, la creo a partir de un arreglo vacío
        catch (error)

        {
            console.log("Creando base de datos...")
            my_products= []
        }

        // Valido que no se repita el campo "code"

        if (my_products.find(my_product => my_product.code === new_product.code))

        {
            console.log("Usuario intentó agregar producto previamente cargado") // Si ya está cargado, aviso
            return "Producto previamente cargado!"
        }

        // Caso contrario, lo agrego.
        my_products.push(new_product)
        await fs.writeFile(this.path, JSON.stringify(my_products))  
        console.log(`Usuario agregó el producto '${new_product.title}' a la base!`)
        return `Producto ${new_product.title} agregado correctamente a la base!`
    }

    // Devolverá el arreglo de todos los productos hasta el momento ó (-1) si no hay productos 
    getProducts = async () => {

        // Valido que el path no sea nulo
        if (!this.path)

        {
            console.error('El path ingresado no es correcto!')
            return
        }

        // Intento leer mi base por si ya tenía productos
        let my_products = []

        try {
            my_products = JSON.parse(await fs.readFile(this.path, 'utf-8')) // Leo mi base
            return (my_products)
        }

        // Si no pude leer porque no tenía nada, doy el aviso
        catch (error)

        {
            return -1
        }
    }

    // Buscará en el arreglo el producto que coincida el código
    getProductById = async (code) => {

        // Valido que el path no sea nulo
        if (!this.path)

        {
            console.error('El path ingresado no es correcto!')
            return
        }

        // Intento acceder a la base
        let my_products = []

        try {
            my_products = JSON.parse(await fs.readFile(this.path, 'utf-8')) // Intento leer mi base
        }

        catch (error) {
            console.error ("Imposible acceder a DB!")
            return
        }

        // Intento buscar el producto con el código específico

        const certain_product = my_products.find(product => product.code === code)

        if (certain_product)
            return certain_product

        // Caso en que no haya ningún producto con ese código
        return -1
    }

    updateProduct = async (code, new_product) => {
        
        // Valido que el path no sea nulo
        if (!this.path)

        {
            console.error('El path ingresado no es correcto!')
            return
        }

        // Intento acceder a la base

        let my_products = []

        try {
            my_products = JSON.parse(await fs.readFile(this.path, 'utf-8')) // Intento leer mi base
        }

        catch (error) {
            console.error ("Imposible acceder a DB!")
            return
        }

        // Intento generar un producto a raíz del "producto" que mandaron para verificar si es correcto.

        let my_product

        try {
            my_product = new Product (new_product)
        }

        catch (error)

        {
            console.log("Usuario envió producto incompleto")
            return -2
        }

        // Intento buscar el índice del producto que coincida con el código
        let element_index = my_products.findIndex(product => product.code === code)

        if (element_index === -1)

        {
            console.log ("Usuario intentó actualizar producto no existente en DB")
            return -1
        }

        // Actualizo los campos, excepto el del código/id

        my_products[element_index].title = my_product.title
        my_products[element_index].description = my_product.description
        my_products[element_index].price = my_product.price
        my_products[element_index].stock = my_product.stock
        my_products[element_index].status = my_product.status
        my_products[element_index].category = my_product.category
        my_products[element_index].thumbnail = my_product.thumbnail

        // Vuelvo a guardar el arreglo en el JSON
        await fs.writeFile(this.path, JSON.stringify(my_products))
        console.log("Producto actualizado!")
    }

    deleteProduct = async (code) => {

        // Valido que el path no sea nulo
        if (!this.path)

        {
            console.error('El path ingresado no es correcto!')
            return
        }

        let my_products = []

        try {
            my_products = JSON.parse(await fs.readFile(this.path, 'utf-8')) // Intento leer mi base
        }

        catch (error) {
            console.error ("Imposible acceder a DB!")
            return
        }

        // Busco si hay algún elemento que coincida con el código enviado
        if (my_products.find(product => product.code === code))

        {
            // Si es así, lo elimino de la DB
           my_products = my_products.filter(product => product.code != code)
           await fs.writeFile(this.path, JSON.stringify(my_products))  
           console.log(`Producto eliminado correctamente de la base!`)
        }

        // Caso contrario, doy el aviso
        else {
            console.log("Imposible borrar, producto no encontrado en la base!")
            return -1
        }
    }

}

export default ProductManager