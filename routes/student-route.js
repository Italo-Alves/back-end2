const express = require('express');
const router = express.Router();

const StudentsController = require('../controllers/students-controller');

router.post('/', StudentsController.createStudent);
router.post('/login', StudentsController.loginStudent);

module.exports = router;