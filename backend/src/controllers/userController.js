import { userModel } from '../models/user.js';

export const getUsers = async () => {
    try {
        //Consulto usuarios
        const users = await userModel.find()
        res.status(200).send(users)
    } catch (error) {
        res.status(500).send("Error al consultar usuarios:" , error)
    }
}
