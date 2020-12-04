const express = require('express');
const router = express.Router();
const multer = require('multer');
const TeachersController = require('../controllers/teachers-controller');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        let date = new Date().toISOString().replace(/:/g, "-") + "-";
        cb(null, date + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1000000
    },
    fileFilter: fileFilter
});

router.post('/', upload.single('file'),TeachersController.createTeacher);
router.post('/login', TeachersController.loginTeacher);

module.exports = router;