const express = require('express');
const router = express.Router();

const TeachersController = require('../controllers/teachers-controller');

router.post('/', TeachersController.createTeacher);
router.post('/login', TeachersController.loginTeacher);

module.exports = router;