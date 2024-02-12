import crypto from 'crypto'

class Product {

    constructor ({title, description, price, thumbnail, stock, code, status, category})

    {
        // Antes que nada valido que me hayan enviado todos los campos
        if (!title || !description || !price || !stock ||!code || !status || !category)
            throw new Error("Error al declarar el producto! Campos insuficientes")

        else

        {
            this.title = title
            this.description = description
            this.price = price
            thumbnail? this.thumbnail = thumbnail : this.thumbnail = []
            this.id = crypto.randomBytes(15).toString('hex') // Genero un ID random de 15 Bytes
            this.stock = stock
            this.code = code
            this.status = status
            this.category = category

            console.log("Producto generado correctamente!")
        }
    }    
}

export default Product