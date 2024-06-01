import cartRouter from './cartRouter.js';
import productsRouter from './ProductsRouter.js';
import userRouter from './userRouter.js';
import chatRouter from './chatRouter.js';
import multerRouter from './multerRouter.js';
import sessionRouter from './sessionRouter.js';
import express from 'express';
import { __dirname } from '../path.js';

const indexRouter = express.Router();

// indexRouter.use('/')

//Routes
indexRouter.use('/public', express.static(__dirname + '/public'))
indexRouter.use('/api/products', productsRouter, express.static(__dirname + '/public'))
indexRouter.use('/api/cart', cartRouter)
indexRouter.use('/api/chat', chatRouter, express.static(__dirname + '/public'))
indexRouter.use('/api/users', userRouter)
indexRouter.use('/api/session', sessionRouter)
indexRouter.use('/upload',multerRouter)

export default indexRouter;