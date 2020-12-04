const express = require('express');
const router = express.Router();

const OrdersController = require('../controllers/orders-controller');

router.get('/', OrdersController.getPedidos);
router.post('/', OrdersController.postPedidos);
router.get('/:id_pedido', OrdersController.getOnePedido);

router.delete('/', OrdersController.deletePedido);

module.exports = router;