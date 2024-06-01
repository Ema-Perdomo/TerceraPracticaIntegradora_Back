import { Router } from 'express';
import productModel from '../models/products.js';
import passport from 'passport';
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js'

const productsRouter = Router()

//productsRouter.get('/', getProducts); VAN ASI PORQUE YA ESTAN IMPORTADOS EN EL CONTROLADOR
//productsRouter.get('/:idProd', getProduct);

productsRouter.get('/', async (req, res) => {

    try {
        const { limit, page, filter, ord } = req.query
        const prods = await getProducts(limit, page, filter, ord)

        //AL CONTROLADOR
        // let metFilter
        // const pag = page !== undefined ? page : 1
        // const lim = limit !== undefined ? limit : 10

        // if (filter == "true" || filter == "false") {
        //     metFilter = "status"
        // } else {
        //     if (filter !== undefined) {
        //         metFilter = "category"
        //     }
        // }
        // const query = metFilter ? { [metFilter]: filter } : {}
        // const ordQuery = ord !== undefined ? {price : ord} : {}

        //const prods = await productModel.paginate(query , { limit: lim, page: pag, sort: ordQuery}); -> Al Controlador
        //convierto prods a JSON
        const prodsJSON = prods.docs.map(prod => prod.toJSON())

        //     const limite = parseInt(limit)
        //NaN en If es false
        //if (limite && limite > 0) {//Si el string es no numerico devuelve NaN
        // const prodsLimit = prods.slice(0, limit) //Slice funciona con limit = undefined | "5" viene del query es = 5 en Js
        res.status(200).render('templates/home', {
            products: prodsJSON,
            mostrarProductos: true
        })
        // } else {
        // res.status(400).send("Error al consultar cliente, ingrese un número válido para las queries.")

    } catch (error) {
        res.status(500).render('templates/error', {
            error: error,
        })
    }
})

productsRouter.get('/:idProd', async (req, res) => {
    try {
        const prod = await getProduct(idProducto)
        const idProducto = req.params.idProd
        // const prod = await productModel.findById(idProducto)  ->Al Controlador
        if (prod)
            res.status(200).send(prod)
        else
            res.status(404).send("Producto inexistente.")
    } catch (error) {
        res.status(500).send(`Error interno del servidor al consultar producto: ${error}`)
    }
})

//-----------------IMPORTANTE MODIFICAR ---------------------!!!!!!!!!
//productsRouter.post('/', passport.passport.authenticate('jwt', { session: false }), createProduct); 
//Iria asi si estuviera en el controlador
//El passport.authenticate('jwt', { session: false }) va en create, delete y en el update IMPORTTANTE CAMBIARLO
productsRouter.post('/', async (req, res) => {
    try {
        if (req.user.role == 'Admin') {
            //Si es admin le permito crear un prdocuto
            const product = req.body
            const mensaje = await createProduct(product)
            //Create 201
            res.status(201).send('Producto creado correctamente')
        } else {
            res.status(403).send('Usuario no autorizado')
        }
    } catch (error) {
        res.status(500).send(`Error interno del servidor al crear producto: ${error}`)
    }
})

productsRouter.put('/:idProd', async (req, res) => {
    try {
        if (req.user.role == 'Admin') {
            const idProducto = req.params.idProd
            const upProduct = req.body //Consulto body
            const mensaje = await updateProduct(idProducto, upProduct)
            res.status(200).send(mensaje)
        } else {
            res.status(403).send('Usuario no autorizado')
        }

    } catch (error) {
        res.status(500).send(`Error interno del servidor al actualizar producto: ${error}`)
    }
})

productsRouter.delete('/:idProd', async (req, res) => {
    try {
        if (req.user.role == 'Admin') {
            const idProducto = req.params.idProd
            const mensaje = await productModel.findByIdAndDelete(idProducto)
            res.status(200).send(mensaje)
        } else {
            res.status(403).send('Usuario no autorizado')
        }
    } catch (error) {
        res.status(500).send(`Error interno del servidor al eliminar el producto: ${error}`)
    }
})

export default productsRouter