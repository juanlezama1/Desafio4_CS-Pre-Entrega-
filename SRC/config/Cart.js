import crypto from 'crypto'

class Cart {
    
    constructor (products)

    {
        this.products = products
        this.id = crypto.randomBytes(15).toString('hex')
    }
}

export default Cart