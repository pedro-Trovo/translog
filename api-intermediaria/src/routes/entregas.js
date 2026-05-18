const { Router } = require('express');
const soapService = require('../services/soapService');
const { validate, STATUS_ENUM } = require('../middleware/validate');

const router = Router();

/**
 * @swagger
 * /entregas:
 *   get:
 *     summary: Lista entregas com filtros opcionais
 *     parameters:
 *       - in: query
 *         name: dataInicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Data inicial (YYYY-MM-DD)
 *       - in: query
 *         name: dataFim
 *         schema:
 *           type: string
 *           format: date
 *         description: Data final (YYYY-MM-DD)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [COLETADO, EM_TRANSITO, SAIU_PARA_ENTREGA, ENTREGUE, TENTATIVA_FALHA, CANCELADO]
 *         description: Filtrar por status
 *     responses:
 *       200:
 *         description: Lista de entregas
 */
router.get('/', async (req, res) => {
  try {
    const { dataInicio, dataFim, status } = req.query;
    const entregas = await soapService.listarEntregas({ dataInicio, dataFim, status });
    res.json(Array.isArray(entregas) ? entregas : []);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

/**
 * @swagger
 * /entregas/{codigo}:
 *   get:
 *     summary: Rastreia uma entrega pelo codigo
 *     parameters:
 *       - in: path
 *         name: codigo
 *         required: true
 *         schema:
 *           type: string
 *         description: Codigo de rastreio
 *     responses:
 *       200:
 *         description: Dados da entrega
 *       404:
 *         description: Entrega nao encontrada
 */
router.get('/:codigo', async (req, res) => {
  try {
    const entrega = await soapService.rastrearEntrega(req.params.codigo);
    if (!entrega) {
      return res.status(404).json({ erro: 'Entrega nao encontrada' });
    }
    res.json(entrega);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

/**
 * @swagger
 * /entregas:
 *   post:
 *     summary: Cria uma nova entrega
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - remetenteNome
 *               - remetenteCidade
 *               - destinatarioNome
 *               - destinatarioCidade
 *               - destinatarioEndereco
 *             properties:
 *               remetenteNome:
 *                 type: string
 *               remetenteCidade:
 *                 type: string
 *               destinatarioNome:
 *                 type: string
 *               destinatarioCidade:
 *                 type: string
 *               destinatarioEndereco:
 *                 type: string
 *               pesoKg:
 *                 type: number
 *     responses:
 *       201:
 *         description: Entrega criada
 */
router.post('/',
  validate({
    remetenteNome: { required: true },
    remetenteCidade: { required: true },
    destinatarioNome: { required: true },
    destinatarioCidade: { required: true },
    destinatarioEndereco: { required: true },
    pesoKg: { type: 'number', min: 0 },
  }),
  async (req, res) => {
    try {
      const entrega = await soapService.criarEntrega(req.body);
      res.status(201).json(entrega);
    } catch (err) {
      res.status(500).json({ erro: err.message });
    }
  },
);

/**
 * @swagger
 * /entregas/{codigo}/status:
 *   patch:
 *     summary: Atualiza o status de uma entrega
 *     parameters:
 *       - in: path
 *         name: codigo
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [COLETADO, EM_TRANSITO, SAIU_PARA_ENTREGA, ENTREGUE, TENTATIVA_FALHA, CANCELADO]
 *               observacao:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status atualizado
 */
router.patch('/:codigo/status',
  validate({ status: { required: true, enum: STATUS_ENUM } }),
  async (req, res) => {
    try {
      const { status, observacao } = req.body;
      const entrega = await soapService.atualizarStatus(req.params.codigo, status, observacao);
      res.json(entrega);
    } catch (err) {
      res.status(500).json({ erro: err.message });
    }
  },
);

/**
 * @swagger
 * /entregas/{codigo}:
 *   delete:
 *     summary: Cancela uma entrega
 *     parameters:
 *       - in: path
 *         name: codigo
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - motivo
 *             properties:
 *               motivo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Entrega cancelada
 */
router.delete('/:codigo',
  validate({ motivo: { required: true } }),
  async (req, res) => {
    try {
      const { motivo } = req.body;
      const entrega = await soapService.cancelarEntrega(req.params.codigo, motivo);
      res.json(entrega);
    } catch (err) {
      res.status(500).json({ erro: err.message });
    }
  },
);

module.exports = router;
