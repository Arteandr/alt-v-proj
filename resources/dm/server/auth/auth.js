/// <reference types="@altv/types-server" />
import alt from 'alt-server';
import { MSGS } from './messages';
import { fetchDatabaseInstance } from 'simplymongo';
import { encryptPassword, verifyPassword } from './encryption';
import chalk from 'chalk';

alt.onClient('auth:Try', handleAuthAttempt);
alt.on('auth:Done', debugDoneAuth);

/**
 * Route the method the player is using to login.
 * Register or Login.
 * @param  {alt.Player} player
 * @param  {String} username
 * @param  {String} password
 * @param  {String | null} email
 */
async function handleAuthAttempt(player, username, password, email) {
    if (!player || !player.valid) {
        return;
    }

    if (!username || !password) {
        alt.emitClient(player, 'auth:Error', MSGS.UNDEFINED);
    }

    if (email) {
        handleRegistration(player, email, username, password);
        return;
    }

    handleLogin(player, username, password);
}

/**
 * Handle the registration of a player.
 * @param {alt.Player} player
 * @param  {String} email
 * @param  {String} username
 * @param  {String} password
 */
async function handleRegistration(player, email, username, password) {
    const db = await fetchDatabaseInstance();
    const emails = await db.fetchAllByField('email', email, 'accounts');
    const accounts = await db.fetchAllData('accounts');
    if (emails.length >= 1) {
        alt.emitClient(player, 'auth:Error', MSGS.EXISTS);
        return;
    }

    const usernames = await db.fetchAllByField('username', username, 'accounts');
    if (usernames.length >= 1) {
        alt.emitClient(player, 'auth:Error', MSGS.EXISTS);
        return;
    }

    const document = {
        account_id: accounts.length + 1,
        email,
        username,
        password: encryptPassword(password),
        model: 'g_m_y_armgoon_02',
        kills: 0,
        deaths: 0,
        admin: 0,
        ip: player.ip.slice(7)
    };

    const dbData = await db.insertData(document, 'accounts', true);
    alt.emit('auth:Done', player, dbData._id.toString(), dbData.account_id,dbData.username, dbData.email,dbData.kills,dbData.model.toString(),dbData.admin,dbData.deaths,dbData.ip);
}

/**
 * Handle the login of a player.
 * @param  {alt.Player} player
 * @param  {String} username
 * @param  {String} password
 */
async function handleLogin(player, username, password) {
    const db = await fetchDatabaseInstance();
    const accounts = await db.fetchAllByField('username', username, 'accounts');

    if (accounts.length <= 0) {
        alt.emitClient(player, 'auth:Error', MSGS.INCORRECT);
        return;
    }
    
    if (!verifyPassword(password, accounts[0].password)) {
        alt.emitClient(player, 'auth:Error', MSGS.INCORRECT);
        return;
    }
    
    const ban = await db.fetchAllByField('account_id',accounts[0].account_id,'bans');
    if(ban.length > 0){
        alt.emit('ban:Table', player,ban,ban[0]._id.toString(),accounts)
        return;
    }

    alt.emit('auth:Done', player, accounts[0]._id.toString(), accounts[0].account_id,accounts[0].username, accounts[0].email,accounts[0].kills,accounts[0].model.toString(),accounts[0].admin,accounts[0].deaths,accounts[0].ip);
}

/**
 * Simply to log a successful authentication to console.
 * @param  {alt.Player} player
 * @param  {String} id
 * @param  {String} username
 * @param  {String} email
 */
function debugDoneAuth(player, id, username, email) {
    console.log(chalk.cyanBright(`[OS] Authenticated - ${username} - ${id}`));
}
