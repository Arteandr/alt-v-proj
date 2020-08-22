import * as alt from 'alt'
import * as chat from 'chat'

import { LOCATIONS } from "../config";
import { HASH_BY_NAME } from "../gamedata/weapon";

alt.on('playerConnect', showAuthWindow);
function showAuthWindow(player) {
    player.pos = new alt.Vector3(-75.015, -818.215, 326.176);
    alt.emitClient(player,'camera:Start');
    alt.emitClient(player, 'auth:Open');
    console.log(`${player.name} has connected!`);
}

alt.on('auth:Done', exitAuthWindow);
function exitAuthWindow(player, id, account_id,username, email,kills, model,admin,deaths,ip) {
    if(admin > 0) player.setSyncedMeta('admin',admin);
    player.setSyncedMeta('lastIP',ip);
    player.setSyncedMeta('currentIP',player.ip.slice(7));
    player.setSyncedMeta('username', username);
    player.setSyncedMeta('skin',model);
    player.setSyncedMeta('kills',kills);
    player.setSyncedMeta('deaths',deaths);
    player.setSyncedMeta('account_id',account_id);
    alt.emitClient(player, 'auth:Exit');
    alt.emitClient(player, 'stats:Show');
    if(admin > 0) adminLogin(player.getSyncedMeta('username'),player.getSyncedMeta('lastIP'),player.getSyncedMeta('currentIP'));
    alt.emit('lobby:Join',player);
}

alt.onClient('location:EnterSucc',locationTP);
function locationTP(player,id){
    alt.emitClient(player,'camera:End');
    player.setSyncedMeta('currentLocation', id);
    player.setSyncedMeta('tp',true)
    let randomNumber = Math.floor(Math.random() * Math.floor(3));
    let spawnPos = LOCATIONS[id].spawn[randomNumber]
    player.spawn(spawnPos.x,spawnPos.y,spawnPos.z,0)
    player.dimension = id;
    player.removeAllWeapons();
    LOCATIONS[id].guns.forEach(gun => {
        player.giveWeapon(HASH_BY_NAME[gun], 250, true);
    });
    chat.send(player, `Вы перемещены в локацию ${LOCATIONS[id].name}`);
    alt.emitClient(player,'killList:Show');
    player.health = 200
    if(LOCATIONS[id].armour){
        player.armour = 100
    }
    alt.emitClient(player,'invulnerability',5)
    alt.setTimeout(() => { 
        player.setSyncedMeta('tp',false)
     }, 1000);}


function adminLogin(username,lastIP,currentIP) {
    const filtered = alt.Player.all.filter(target=> target.valid && target.hasSyncedMeta('admin'));
    for (const target of filtered) {
        chat.send(target,`Администратор ${username} вошел в игру [ip:${currentIP}][lastIP:${lastIP}]`)
    }
}