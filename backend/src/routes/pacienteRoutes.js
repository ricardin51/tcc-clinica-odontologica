const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');
const authMiddleware = require('../middlewares/authMiddleware');

// Todas as rotas exigem autenticação e perfil de coordenador
router.use(authMiddleware);

router.get('/', pacienteController.listarPacientes);

module.exports = router;