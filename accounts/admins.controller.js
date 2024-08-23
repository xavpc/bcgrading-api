const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const Role = require('_helpers/role');
const adminService = require('./admin.service');


// routes
router.post('/', authorize(Role.Admin), createSchema, AdminCreateAccount);

module.exports = router;

function AdminCreateAccount(req, res, next) {
    adminService.AdminCreateAccount(req.body)
        .then(account => res.json(account))
        .catch(next);
}

function createSchema(req, res, next) {
    const schema = Joi.object({
        
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        username: Joi.string().required(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
        role: Joi.string().valid(Role.Admin, Role.Registrar, Role.Student,Role.Teacher).required()
    });
    validateRequest(req, next, schema);
}