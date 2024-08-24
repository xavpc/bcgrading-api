const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const Role = require('_helpers/role');
const adminService = require('./admin.service');


// routes
router.post('/', authorize(Role.Admin), createSchema, AdminCreateAccount);
router.get('/', authorize(Role.Admin), AdminGetAllAccounts);
router.get('/:id', authorize(), AdmindGetAccountById);
router.put('/:id', authorize(), updateSchema, AdminUpdateAccount);
router.put('/updatepassword/:id', authorize(Role.Admin), passwordSchema, AdminUpdatePassword);
router.put('/delete/:id', authorize(Role.Admin), AdminDeleteAccount);
router.put('/reactivate/:id', authorize(Role.Admin), AdminReactivateAccount);

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

function AdminGetAllAccounts(req, res, next) {
    adminService.AdminGetAllAccounts()
        .then(accounts => res.json(accounts))
        .catch(next);
}

function AdmindGetAccountById(req, res, next) {
    // users can get their own account and admins can get any account
    if (Number(req.params.id) !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized You are not allowed' });
    }

    adminService.AdmindGetAccountById(req.params.id)
        .then(account => account ? res.json(account) : res.sendStatus(404))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schemaRules = {
        username: Joi.string().empty(''),  
        firstName: Joi.string().empty(''),
        lastName: Joi.string().empty(''),
            
    };

      // Check if user is Admin
      if (req.user.role === Role.Admin) {
        // Admins can update the role field
        schemaRules.role = Joi.string().valid(Role.Admin, Role.Student, Role.Registrar, Role.Teacher).empty('');
    } else {
        // If the user is not an Admin and tries to update the role, return an unauthorized message
        if (req.body.role) {
            return res.status(401).json({ message: 'Unauthorized to change account role' });
        }
    }

    // Create the Joi schema
    const schema = Joi.object(schemaRules);
    
    validateRequest(req, next, schema);
}

function AdminUpdateAccount(req, res, next) {
    // users can update their own account and admins can update any account
    if (Number(req.params.id) !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    adminService.AdminUpdateAccount(req.params.id, req.body)
        .then(account => res.json(account))
        .catch(next);
}

function passwordSchema(req, res, next) {
    const schema = Joi.object({

        password: Joi.string().min(6).empty(''),
        confirmPassword: Joi.string().valid(Joi.ref('password')).empty('')
    }).with('password', 'confirmPassword');
    validateRequest(req, next, schema);
}


function AdminUpdatePassword(req, res, next) {
   

    adminService.AdminUpdatePassword(req.params.id, req.body)
        .then(account => res.json(account))
        .catch(next);
}





function AdminDeleteAccount(req, res, next) {
   

    adminService.AdminDeleteAccount(req.params.id, req.body)
        .then(account => res.json(account))
        .catch(next);
}


function AdminReactivateAccount(req, res, next) {
   

    adminService.AdminReactivateAccount(req.params.id, req.body)
        .then(account => res.json(account))
        .catch(next);
}