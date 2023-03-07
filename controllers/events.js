const { response } = require('express');
const Evento = require('../models/Evento');

const getEventos = async (req, resp = response) => {

    const eventos = await Evento.find()
        .populate('user', 'name');

    resp.json({
        ok: true,
        eventos
    })
}


const crearEvento = async (req, resp = response) => {

    // Escribir evento en la BD
    const evento = new Evento(req.body)
    try {
        evento.user = req.uid;
        const eventoGuardado = await evento.save();
        resp.json({
            ok: true,
            evento: eventoGuardado
        })

    } catch (error) {
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: 'Contacte con el administrador'
        })

    }

    // verificar que tenga el evento.
    console.log(req.body);


}

const actualizarEvento = async (req, resp = response) => {

    const eventoId = req.params.id;
    const uid = req.uid;
    try {
        const evento = await Evento.findById(eventoId);
        if (!evento) {
            resp.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese id'
            })
        }

        if (evento.user.toString() !== uid) {
            return resp.status(401).json({
                ok: false,
                msg: 'No tiene los privilegios para editar este evento'
            })
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, { new: true });
        resp.json({
            ok: true,
            evento: eventoActualizado
        });


    } catch (error) {
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: 'Contacte con el administrador'
        })
    }

}

const eliminarEvento = async (req, resp = response) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {

        const evento = await Evento.findById(eventoId);
        if (!evento) {
            resp.status(404).json({
                ok: false,
                msg: 'No se encontro evento con ese id'
            })
        }
        if (evento.user.toString() !== uid) {
            return resp.status(401).json({
                ok: false,
                msg: 'No tiene los privilegios para editar este evento'
            })
        }
        await Evento.findByIdAndRemove(eventoId);
        resp.json({
            ok: true,
        })



    } catch (error) {
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: 'Contacte con el administrador'
        })
    }
}

module.exports = {
    getEventos,
    crearEvento,
    eliminarEvento,
    actualizarEvento
}

