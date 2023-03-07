/**
 * Rutas de eventos / Events
 * host + /api/events
 * 
 */

const { Router } = require('express');
const { validarJwt } = require('../middlewares/validar-jwt');
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { isDate } = require('../helpers/isData')

const router = Router();


// Todas tienes que pasar por la validaciones del JWT
router.use(validarJwt);
// Obtener eventos

router.get(
    '/',


    validarCampos,
    getEventos
)

//Crear evento
router.post(
    '/',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'La fehca de inicio tiene que ser obligatoria').custom(isDate),
        check('end', 'La fehca de finalizacion tiene que ser obligatoria').custom(isDate),

        validarCampos
    ],

    crearEvento
)

//Actualizar evento
router.put(
    '/:id',

    actualizarEvento
)

//Borrar evento

router.delete(
    '/:id/',

    eliminarEvento)

module.exports = router;