import cartModel from '../models/cartModel.js';
import productModel from '../models/productModel.js';
import ticketModel from '../models/ticketModel.js';


export const getCart = async (req, res) => {
    try {
        const cartId = req.params.cid
        //findOne busca por id porque es lo que le pasamos
        const cart = await cartModel.findOne({ _id: cartId })//.populate('products.prod_id')
        res.status(200).send(cart)
    } catch (error) {
        res.status(500).send(`Error interno del servidor al consultar carrito: ${error}`)
    }
}
export const createCart = async (req, res) => {
    try {
        const crearCart = await cartModel.create({ products: [] })
        res.status(201).send(crearCart)
    } catch (error) {
        res.status(500).send(`Error interno del servidor al crear carrito: ${error}`)
    }

}
export const insertProductCart = async (req, res) => {
    try {
        if (req.user.role == 'Admin') {
            const cartId = req.params.cid
            const idProducto = req.params.pid
            const { quantity } = req.body
            const cart = await cartModel.findById(cartId)

            const indice = cart.products.findIndex(product => product.id_prod._id == idProducto)
            console.log(indice)

            if (indice != -1) {
                //Si ya existe el producto, le sumo la nueva cantidad agregada
                cart.products[indice].quantity += quantity
                console.log("if")
            } else {
                //Si el prod no existe creo un objeto producto 
                cart.products.push({ id_prod: idProducto, quantity: quantity })
                console.log("else")
            }
            const mensaje = await cartModel.findByIdAndUpdate(cartId, cart)
            res.status(200).send(mensaje)
        } else {
            res.status(403).send('Usuario no autorizado')
        }
    } catch (error) {
        res.status(500).send(`Error interno del servidor al crear producto: ${error}`)
    }
}

export const createTicket = async (req, res) => {

    try {
        const cartId = req.params.cid
        const cart = await cartModel.findById(cartId)
        let prodSinStock = []
        if (cart) {
            cart.products.forEach(async (product) => {
                let product = await productModel.findById(product.id_prod)
                if (productModel.stock < product.quantity) { //Si el stock es menor a la cantidad de productos en el carrito guardo el producto en un array
                    prodSinStock.push(product._id)
                }
            })
            if (prodSinStock.length = 0) {
                //Finalizar compra
                const totalPrice = cart.products.reduce((acc, product) => (acc.id_prod.price * a.quantity) + (product.id_prod.price * product.quantity), 0)

                //Si EL USER ES ROLE PREMIUM TIENE UN 10% DE DESCUENTO, HACERLO ACA Y 
                //AGREGARLO AL TOTAL(AGREGAR EL ROLE EN USER MODEL O DONDE CORRESPONDA)
                // // // if (req.user.role == 'premium') {
                // // //     totalPrice * 0.9
                // // // }

                //const aux = [...cart.products]
                const newTicket = await ticketModel.create({
                    code: crypto.randomUUID(),
                    purchaser: req.user.email,
                    amount: totalPrice,


                    products: cart.products,
                    //products: aux
                })

                //Descontar stock de cada uno de los productos
                cart.products.forEach(async (prod) => {
                    await productModel.findByIdAndUpdate(prod.id_prod, {
                        stock: prod.quantity
                    })
                })
                //Vaciar carrito despues de la compra 
                // cart.products = [] Aasi tambien funciona 
                await cartModel.findByIdAndUpdate(cartId, {
                    products: []
                })
                // Vaciar carrito despues de la compra (NO SE SI ES EL METODO CORRECTO)                
                //await cartModel.findByIdAndDelete(cartId)

                res.status(200).send(newTicket)
            } else {
                //Retornar productos sin stock
                console.log(prodSinStock) //Muestro los productos sin stock que van a ser eliminados
                //prodSinStock = [idProducto1, idProducto2, idProducto3]
                prodSinStock.forEach((idProducto) => {
                    //[{idProducto, quantity}, {...}, {...}, ...]
                    cart.products = cart.products.filter(product => product.id_prod !== idProducto)
                })
                await cartModel.findByIdAndUpdate(cartId, {
                    products: cart.products
                })
                res.status(200).send(`Productos sin stock suficiente: ${prodSinStock}`)
            }

        } else {
            res.status(404).send('Carrito no existente')
        }
    } catch (error) {
        res.status(500).send(`Error interno del servidor al crear ticket: ${error}`)
    }
}

// export const getCart = async (req, res) => {
//     const cart = await cartModel.find();
//     res.json(cart);
// }   
