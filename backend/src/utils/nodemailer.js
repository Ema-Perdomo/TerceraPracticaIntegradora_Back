import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: 'emaperdomo00@gmail.com',
        pass: ''
    }
})

export const sendEmailChangePassword = async (email, linkChangePassword) => {
    const mailOption = {
        from: '<emaperdomo00@gmail.com> ',
        to: email,
        subject: 'Correo de recuperacion de contraseña',
    //     text: `
    //     Haz click en el siguiente enlace para cambiar tu contraseña: ${linkChangePassword}
    // `,
        html: `
        <div>
            <p>Haz click en el siguiente enlace para cambiar tu contraseña: </p><button> <a href="${linkChangePassword}">Cambiar contraseña</a> </button>
            <p>Si no fuiste tú, por favor ignore este mensaje.</p>
        </div>
    `
        //     attachments: [
        //         {
        //             filename: 'test.jpg',
        //             path: __dirname + '/img/test.jpg',
        //             cid: 'test' //id de la imagen // (same cid value as in the html img src (segun copilot)) 
        //         },
        //         {
        //             filename: 'test.pdf',
        //             path: __dirname + '/img/test.pdf',
        //             cid: 'pdf'
        //         }
        //     ]
    }
    transporter.sendMail(mailOption, (error, info) => {
        if (error) {
            console.log("Error al enviar correo de recuperacion de contraseña: ", error)
        } else {
            console.log('Email enviado correctamente: ' + info.response)
        }
    })
}
