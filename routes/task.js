const express = require('express');
const router = express.Router();
const soma = require('../controllers/task/task')


router.post('/add', soma.add);
router.put('/upt', soma.upt);
router.patch('/upt', soma.upt);
router.delete('/del', soma.del);
router.get('/get', soma.get);
module.exports = router;