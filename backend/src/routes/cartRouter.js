import { Router } from 'express';
import passport from 'passport';
import { createCart, getCart, insertProductCart, createTicket } from '../controllers/cartController.js';

const cartRouter = Router()


// //No tiene sentido al haber un solo carrito
// cartRouter.post('/', async (req, res) => {
//     try {
//         const id = crypto.randomBytes(10).toString('hex')
//         const cartManager = new CartManager('./src/data/cart.json', id)
//         return res.status(200).send(`Carrito creado correctamente con el id: ${id}`)

//     } catch (error) {
//         res.status(500).send(`Error al crear carrito: ${error}`)
//     }
// })



cartRouter.get('/:cid', getCart)
cartRouter.post('/', createCart)    //Crea un carrito
cartRouter.post('/:cid/:pid', passport.authenticate('jwt', { session: false }), insertProductCart)
cartRouter.get('/purchase/:cid', passport.authenticate('jwt', { session: false }), createTicket)

//Vaciar carrito
//HACER DELETE, esquema del productrouter, editar el cartmodel
// cartRouter.delete('/:cid/:pid', async (req, res) => {
/*/     try {
    const idProducto = req.params.idProd
    const mensaje = await productModel.findByIdAndDelete(idProducto)
    if (mensaje == 'Producto eliminado')
        res.status(200).send(mensaje)
    else
        res.status(404).send(mensaje)
} catch (error) {
    res.status(500).send(`Error interno del servidor al eliminar el producto: ${error}`)
}

//Para BORRAR USAR COMO ID DEL PROD el _id . _id dentro de el cart pq sino borramos
//el producto no del carrito sin ode la dbb
*/
export default cartRouter 