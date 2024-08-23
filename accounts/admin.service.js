const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require("crypto");
const { Op } = require('sequelize');
const db = require('_helpers/db');
const Role = require('_helpers/role');


module.exports = {

AdminCreateAccount,
getAll,
getById,
update,
delete: _delete
};

async function AdminCreateAccount(params) {
    // validate
    if (await db.Account.findOne({ where: { username: params.username } })) {
        throw 'username "' + params.username + '" is already registered';
    }

    const account = new db.Account(params);
   

    // hash password
    account.passwordHash = await hash(params.password);

    // save account
    await account.save();

    return account;
}

async function hash(password) {
    return await bcrypt.hash(password, 10);
}


async function getAll() {
    const accounts = await db.Account.findAll();
    return accounts.map(x => basicDetails(x));
}

async function getById(id) {
    const account = await getAccount(id);
    return basicDetails(account);
}



async function update(id, params) {
    const account = await getAccount(id);

    // validate (if email was changed)
    if (params.username && account.username !== params.username && await db.Account.findOne({ where: { username: params.username } })) {
        throw 'Username "' + params.username + '" is already taken';
    }

    // hash password if it was entered
    if (params.password) {
        params.passwordHash = await hash(params.password);
    }

    // copy params to account and save
    Object.assign(account, params);
    account.updated = Date.now();
    await account.save();

    return basicDetails(account);
}

async function _delete(id) {
    const account = await getAccount(id);
    await account.destroy();
}



async function getAccount(id) {
    const account = await db.Account.findByPk(id);
    if (!account) throw 'Account not found';
    return account;
}

