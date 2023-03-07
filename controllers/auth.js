const { response } = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJwt } = require('../helpers/jwt')



const crearUsuario = async (req, resp = response) => {
    const { email, password } = req.body


    try {

        let usuario = await Usuario.findOne({ email });
        if (usuario) {
            return resp.status(400).json({
                ok: false,
                msg: 'Un usuario existe con ese correo'
            });
        }

        usuario = new Usuario(req.body);

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();
        //Generar JWT
        const token = await generarJwt(usuario.id, usuario.name);

        resp.status(201).json({
            ok: true,
            msg: 'Registro',
            uid: usuario.id,
            name: usuario.name,
            token
        })
    } catch (error) {
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }

}

const loginUsuario = async (req, resp = response) => {
    const { email, password } = req.body

    try {

        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return resp.status(400).json({
                ok: false,
                msg: 'Un usuario no existe con ese correo'
            });
        }

        //Confirmar los password
        const validPassword = bcrypt.compareSync(password, usuario.password)
        if (!validPassword) {
            return resp.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            });
        }
        //Generar nuestro JWT
        const token = await generarJwt(usuario.id, usuario.name);

        resp.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })

    } catch (error) {
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }

};


const revalidarToken = async (req, resp = response) => {

    const { uid, name } = req;

    //Generar JWT y retornar en la peticion.
    const token = await generarJwt(uid, name);
    resp.json({
        ok: true,
        token
    })

};


module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}