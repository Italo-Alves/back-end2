const mysql = require('../mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.createTeacher = async (req, res, next) => {

    try {
        var query = `SELECT * FROM professores WHERE email = ? or foneMobile = ?`;
        var result = await mysql.execute(query, [req.body.email, req.body.foneMobile]);

        if (result.length > 0) {
            return res.status(409).send({ message: 'Professor(a) já cadastrado' })
        }

        const hash = await bcrypt.hashSync(req.body.password, 10);

        query = 'INSERT INTO professores (firstName, lastName, documentNumber, birthday, diploma, zip, state, city, address, number, addressDetails, neighborhood, foneMobile, foneHome, foneCompany, email, password) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
        const results = await mysql.execute(query, [req.body.firstName, req.body.lastName, req.body.documentNumber, req.body.birthday, req.file.path, req.body.zip, req.body.state, req.body.city, req.body.address, req.body.number, req.body.addressDetails, req.body.neighborhood, req.body.foneMobile, req.body.foneHome, req.body.foneCompany, req.body.email, hash]);
        const response = {
            message: 'Professor(a) criado com sucesso',
            createdUser: {
                teacherId: results.insertId,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                documentNumber: req.body.documentNumber,
                birthday: req.body.birthday,
                diploma: req.file.path,
                zip: req.body.zip,
                state: req.body.state,
                city: req.body.city,
                address: req.body.address,
                number: req.body.number,
                addressDetails: req.body.addressDetails,
                neighborhood: req.body.neighborhood,
                foneMobile: req.body.foneMobile,
                foneHome: req.body.foneHome,
                foneCompany: req.body.foneCompany,
                email: req.body.email
            }
        }
        return res.status(201).send(response);

    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.loginTeacher = async (req, res, next) => {

    try {
        const query = `SELECT * FROM professores WHERE email = ?`;
        var results = await mysql.execute(query, [req.body.email]);

        if (results.length < 1) {
            return res.status(401).send({ message: 'Falha na autenticação' })
        }

        if (await bcrypt.compareSync(req.body.password, results[0].password)) {
            const token = jwt.sign({
                teacherId: results[0].teacherId,
                email: results[0].email
            },
            process.env.JWT_KEY,
            {
                expiresIn: 3600
            });
            return res.status(200).send({
                message: 'Autenticado com sucesso',
                token: token
            });
        }
        return res.status(401).send({ message: 'Falha na autenticação' })

    } catch (error) {
        return res.status(500).send({ message: 'Falha na autenticação' });
    }
};