import { Router } from "express";
import { uploadImage } from '../controllers/multerController.js'
import upload from '../config/multer.js'

const multerRouter = Router()

multerRouter.post('/', upload.single('product'),uploadImage)

export default multerRouter

