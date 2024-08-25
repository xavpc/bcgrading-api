const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require("crypto");
const { Op } = require('sequelize');
const db = require('_helpers/db');
const Role = require('_helpers/role');


module.exports = {

AdminCreateAccount,
AdminGetAllAccounts,
AdminGetInactiveAccounts,
AdmindGetAccountById,
AdminUpdateAccount,
AdminUpdatePassword,
AdminDeleteAccount,
AdminReactivateAccount
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


function formatDate(date) {
    const d = new Date(date);
    const formattedDate = d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: '2-digit'
    });
    const formattedTime = d.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true
    });
    return `${formattedDate} ${formattedTime}`;
}

async function AdminGetAllAccounts() {
    const accounts = await db.Account.findAll({
        where: {  isActive: true, isDeleted: false }
    });
    
    return accounts.map(account => {
        const acc = account.toJSON();
        return {
            ...acc,
            created: formatDate(acc.created),
            updated: acc.updated ? formatDate(acc.updated) : null,
            dateReactivated: acc.dateReactivated ? formatDate(acc.dateReactivated) : null,
            dateDeleted: acc.dateDeleted ? formatDate(acc.dateDeleted) : null
        };
    });
}

async function AdminGetInactiveAccounts() {
    const accounts = await db.Account.findAll({
        where: {  isActive: false, isDeleted: true }
    });
    
    return accounts.map(account => {
        const acc = account.toJSON();
        return {
            ...acc,
            created: formatDate(acc.created),
            updated: acc.updated ? formatDate(acc.updated) : null,
            dateReactivated: acc.dateReactivated ? formatDate(acc.dateReactivated) : null,
            dateDeleted: acc.dateDeleted ? formatDate(acc.dateDeleted) : null
        };
    });
}

async function AdmindGetAccountById(id) {
    const account = await db.Account.findByPk(id);

    if (!account) throw 'Account not found';

    return {
        ...account.toJSON(),
        created: formatDate(account.created),
        updated: account.updated ? formatDate(account.updated) : null,
        dateReactivated: account.dateReactivated ? formatDate(account.dateReactivated) : null,
        dateDeleted: account.dateDeleted ? formatDate(account.dateDeleted) : null
    };
}



async function AdminUpdateAccount(id, params) {
    const account = await db.Account.findByPk(id);

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

    return account;
}

async function AdminUpdatePassword(id, params) {
    const account = await db.Account.findByPk(id);


    // hash password if it was entered
    if (params.password) {
        params.passwordHash = await hash(params.password);
    }

    // copy params to account and save
    Object.assign(account, params);
    account.updated = Date.now();
    await account.save();

    return account;
}


async function AdminDeleteAccount(id, params) {
    const account = await db.Account.findByPk(id);
    const currentUserId = await db.Account.findByPk(id);
   

    if (!account) throw 'Account not found';

    // Check if the current user is an admin and is trying to delete their own account or another admin's account
    if (currentUserId === id || account.role === "Admin") {
        throw 'Cannot delete Admin Account or own account';
    }
   

    // copy params to account and save
    Object.assign(account, params);
    account.isActive = false;
    account.isDeleted = true;
    account.dateDeleted = Date.now();
    account.updated = Date.now();
    await account.save();

    return account;
}

async function AdminReactivateAccount(id, params) {
    const account = await db.Account.findByPk(id);


    // hash password if it was entered
   

    // copy params to account and save
    Object.assign(account, params);
    account.isDeleted = false;
    account.isActive = true;
    account.dateReactivated = Date.now();
    account.updated = Date.now();
    await account.save();

    return account;
}






async function getAccount(id) {
    const account = await db.Account.findByPk(id);
    if (!account) throw 'Account not found';
    return account;
}

