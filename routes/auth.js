/*
    Rutas de usuario / Auth
    host + /api/auth    
*/

const { Router } = require('express');
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos');
const { crearUsuario, revalidarToken, loginUsuario } = require('../controllers/auth');
const { validarJwt } = require('../middlewares/validar-jwt');


const router = Router();




router.post(
    '/new',
    [//Midlewares
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe ser de 6 caracteres').isLength({ min: 6 }),
        validarCampos
    ],
    crearUsuario);

router.post(
    '/',
    [
        //midlewares
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe ser de 6 caracteres').isLength({ min: 6 }),
        validarCampos
    ],
    loginUsuario);

router.get('/renew', validarJwt, revalidarToken);


module.exports = router;