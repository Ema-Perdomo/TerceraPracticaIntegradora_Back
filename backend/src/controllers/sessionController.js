import passport from "passport";
import { sendEmailChangePassword } from "../utils/nodemailer.js";
import jwt from 'jsonwebtoken';
import { userModel } from "../models/user.js";
import { validatePassword, createHash } from "../utils/validatePassword.js";

export const login = async (req, res) => {
    try {
        if (!req.user) { //Si no existe el usuario
            res.status(401).send('Usuario o contraseña invalidos')
        }
        //req.session guarda en MongoDB
        req.session.user = {
            email: req.user.email,
            first_name: req.user.first_name,
        }

        res.status(200).send('Login exitoso')
    } catch (error) {
        res.status(500).send('Error al loguear usuario: ', error)

    }
};

export const register = async (req, res) => {
    try {
        if (!req.user) { //Si no existe el usuario
            return res.status(400).send('Usuario ya existente en la aplicacion')
        }
        res.status(200).send('Usuario registrado correctamente')
    } catch (error) {
        res.status(500).send('Error al registrar usuario: ', error)
    }
};



export const githubSession = async (req, res) => {
    req.session.user = {
        email: req.user.email,
        first_name: req.user.name,
    }
    res.redirect('/')
};

export const logout = async (req, res) => {
    req.session.destroy((e =>
        //Si hay error al cerrar sesion devuelvo el error sino redirijo a la pagina principal
        e ? res.status(500).send('Error al cerrar sesion') : res.status(200).redirect(/*"api/session/login" o: */ "/")
    ))
};

export const testJWT = async (req, res) => {
    if (req.user.role == 'user')
        return res.status(403).send('Usuario no autorizado')
    else
        res.status(200).send(req.user)
};

export const changePassword = async (req, res) => {
    const { token } = req.params
    const { newPassword } = req.body

    try {
        //Verifico si el token y la contraseña ("coder") son validos
        const validateToken = jwt.verify(token.substr(6,), "coder")
        //Valido mi user por si acaso
        const user = await userModel.findOne({ email: validateToken.userEmail })    
        if (user) {
            if (!validatePassword(newPassword, user.password)) { //Si no es igual, cambio la contraseña
                const hashPassword = createHash(newPassword)
                user.password = hashPassword
                const resultado = await userModel.findByIdAndUpdate(user._id, user) //Busco el user, le cambio la contraseña y lo guardo
                
                console.log(resultado)
                
                res.status(200).send('Contraseña cambiada con éxito')
            } else {//Contraseñas iguales}
                res.status(400).send('La contraseña es igual a la anterior')
            }
        }else{
            //Usuario no existe
            res.status(404).send('Usuario no encontrado')
        }
        } catch (error) {
            res.status(500).send('Error al cambiar contraseña: ', error)
            
            if(error?.message === "jwt expired"){       //Si el link expira
                res.status(400).send("El tiempo maximo para recuperar la contraseña ha expirado, por favor solicite un nuevo link")
                //REEENVIO DE EMAIL (hacerlo)
            }
        }
    }

export const sendEmailPassword = async (req, res) => {
        try {
            const { email } = req.body
            const user = await userModel.find({ email: email }) //Busco el usuario tal que el email sea igual al email que me pasan
            if (user) {
                const token = jwt.sign
                    ({ userEmail: email }, "coder", { expiresIn: '1h' })                             //Como tengo al usuario, genero un token con el email del usuario
                const resetLink = `http://localhost:8000/api/session/reset-password?token=${token}`     //Creo un link con el token
                sendEmailChangePassword(email, resetLink)                                        //Envio el email con el link
                res.status(200).send('Email enviado con éxito')
            } else {
                return res.status(404).send('Usuario no encontrado')
            }
        } catch (error) {
            res.status(500).send(error)
        }
    }
