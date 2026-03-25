const express = require('express');
const router = express.Router();
const consultaController = require('../controllers/consultaController');
const authMiddleware = require('../middlewares/authMiddleware');

// Todas as rotas de consulta exigem autenticação
router.use(authMiddleware);

router.get('/', consultaController.listarConsultas);
router.post('/', consultaController.agendarConsulta);
router.put('/:id', consultaController.atualizarConsulta);
router.delete('/:id', consultaController.cancelarConsulta);

module.exports = router;