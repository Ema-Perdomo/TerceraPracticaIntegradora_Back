

export const uploadImage = async (req, res) => (
    (req, res) => {   //Carga de imagenes
        try {
            console.log(req.file)
            console.log(req.body)//?
            res.status(200).send('Imagen subida correctamente')
        } catch (error) {
            res.status(500).send('Error al cargar la imagen.')
        }
    }
)
