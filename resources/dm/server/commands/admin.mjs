import * as alt from 'alt'
import * as chat from 'chat'
import axios from 'axios';

import { getForwardVectorServer } from "../utility/vector";
import { fetchDatabaseInstance } from 'simplymongo';
import {PedModel} from '../gamedata/models'
import {LOBBY} from '../config'

function adminChatSend(text) {
    const filteredPlayer = alt.Player.all.filter(target=>target.valid && target.hasSyncedMeta('admin'))
    for (const target of filteredPlayer) {
        chat.send(target, "A | " + text);
    }
}


chat.registerCmd('veh', handleAddVehicle);
chat.registerCmd('vehicle',handleAddVehicle);
function handleAddVehicle(player, args) {
    if(!player.hasSyncedMeta('admin')) return 0;
    if(player.getSyncedMeta('admin') < 2) return 0;
    if(args.length < 1) return chat.send(player, 'скоро добавим меню =)');
    
    if(!args[1]) args[1] = 151;
    if(!args[2]) args[2] = 151;

    if (player.lastVehicle && player.lastVehicle.valid) {
        player.lastVehicle.destroy();
    }

    const vehicleName = args[0];
    const fwdVector = getForwardVectorServer(player.rot);
    const positionInFront = {
        x: player.pos.x + fwdVector.x * 4,
        y: player.pos.y + fwdVector.y * 4,
        z: player.pos.z
    };

    try {
        player.lastVehicle = new alt.Vehicle(
            vehicleName,
            positionInFront.x,
            positionInFront.y,
            positionInFront.z,
            0,
            0,
            0
        );
        player.lastVehicle.primaryColor = Number.parseInt(args[1]);
        player.lastVehicle.secondaryColor = Number.parseInt(args[2]);
        player.lastVehicle.dimension = player.dimension;
        let text = `${player.getSyncedMeta('username')}[${player.getSyncedMeta('account_id')}] заспавнил ${vehicleName.charAt(0).toUpperCase() + vehicleName.slice(1)}`
        adminChatSend(text)
    } catch (err) {
        alt.log(err)
        return chat.send(player, `{FF0000}${vehicleName} is not a valid vehicle name.`);
    }
}


chat.registerCmd('kick',handleKick);
function handleKick(player,args){
    if(!player.hasSyncedMeta('admin')) return 0;
    if(player.getSyncedMeta('admin') < 1) return 0;
    if(args.length < 1) return chat.send(player, '/kick [account_id]');
    if(args[0] == player.getSyncedMeta('account_id')) return chat.send(player, 'Неверное имя пользователя');
    if(!Number.parseInt(args[0])) return chat.send(player,'Неверный id')

    const target = alt.Player.all.filter(target=>target.valid && target.getSyncedMeta('account_id') == args[0])
    if(target.length < 1) return chat.send('Игрок с указаным id не найден');
    if(player.getSyncedMeta('admin') <= 2 && target[0].getSyncedMeta('admin') == 3) return 0;
    args.shift();
    let reason = args.join(' ')
    target[0].kick(reason)
    let text = `{A80000}${player.getSyncedMeta('username')}[${player.getSyncedMeta('account_id')}] кикнул ${target[0].getSyncedMeta('username')}. Причина: ${reason}`
    return chat.broadcast(text);
}


chat.registerCmd('makeadmin',handleMakeAdmin)
chat.registerCmd('mk1',handleMakeAdmin)
async function handleMakeAdmin(player,args) {
    if(!player.hasSyncedMeta('admin')) return 0
    if(player.getSyncedMeta('admin') < 3) return 0
    if(args.length < 1) return chat.send(player, '/makeadmin [account_id] [lvl]')
    if(!Number.parseInt(args[0])) return chat.send(player,'Неверный id')

    const db = await fetchDatabaseInstance()
    const target = alt.Player.all.filter(target=>target.valid && target.getSyncedMeta('account_id') == Number.parseInt(args[0]));
    if(target.length < 1) return chat.send(player,'Игрок с указаным id не найден')
    if(target[0].getSyncedMeta('admin') >= 3) return 0;
    if(Number.parseInt(args[1]) == 0){
        if(!target[0].hasSyncedMeta('admin')) return 0;
        target[0].deleteSyncedMeta('admin')
        await db.updateDataByFieldMatch('username',target[0].getSyncedMeta('username').toString(),{admin:0},'accounts')
        chat.send(player,`{734596}Вы сняли ${target[0].getSyncedMeta('username')} с должности администратора`)
        return chat.send(target[0], `{734596}${player.getSyncedMeta('username')} снял Вас с должности администратора`);
    }else{
        await db.updateDataByFieldMatch('username',target[0].getSyncedMeta('username').toString(),{admin:args[1]},'accounts')
        target[0].setSyncedMeta('admin',args[1])
        chat.send(player, `{734596}Вы назначили ${target[0].getSyncedMeta('username')} на должность администратора [lvl:${args[1]}]`)
        return chat.send(target[0], `{734596}${player.getSyncedMeta('username')} назачил Вас на должность администратора [lvl:${args[1]}]`)
    }
}


alt.onClient('tp:ArrowUp',(player,coords)=>{
    let args = [coords.x,coords.y,coords];
    handleTeleport(player,args);
});
chat.registerCmd('tp',handleTeleport);
function handleTeleport(player,args) {
    player.setSyncedMeta('tp',true);
    if(!player.getSyncedMeta('admin')) return 0;
    if(player.getSyncedMeta('admin') < 1) return 0;
    if(args.length != 3) return chat.send(player, `/tp [x] [y] [z]`);
    const newPos = {
        x: args[0],
        y: args[1],
        z: args[2],
    }
        player.spawn(newPos.x,newPos.y,newPos.z,0)
    alt.setTimeout(() => { 
        player.setSyncedMeta('tp',false);
     }, 1000);
}


chat.registerCmd('goto',handleGoto);
function handleGoto(player,args) {
    if(!player.getSyncedMeta('admin')) return 0;
    if(player.getSyncedMeta('admin') < 1) return 0;
    if(args.length != 1) return chat.send(player, `/goto [account_id]`);
    const targetArray = alt.Player.all.filter(target=> target.valid && target.getSyncedMeta('account_id') == Number.parseInt(args[0]));
    if(targetArray.length < 1) return chat.send(player, `Неверный id`); 
    const target = targetArray[0];
    if(target.getSyncedMeta('username') == player.getSyncedMeta('username')) return chat.send(player, `Невозможно телепортироваться к себе`);
    
    player.setSyncedMeta('tp',true);

    const targetPos = {
        x: target.pos.x - 1,
        y: target.pos.y,
        z: target.pos.z,
    }
    try {
        player.pos = targetPos; 
        player.dimension = target.dimension;
        chat.send(player,`Вы успешно телепортировались к игроку ${target.getSyncedMeta('username')}[${target.getSyncedMeta('account_id')}]`);
        chat.send(target, `К вам телепортировался администратор ${player.getSyncedMeta('username')}[${player.getSyncedMeta('account_id')}]`);
        alt.setTimeout(() => { player.setSyncedMeta('tp',false) }, 1000);
    } catch (error) {
        alt.log(error)
        return chat.send(player, 'Невозможно телепортироваться к игроку');
    }
}


chat.registerCmd('gethere',handleGethere)
function handleGethere(player,args) {
    if(!player.getSyncedMeta('admin')) return 0;
    if(player.getSyncedMeta('admin') < 1) return 0;
    if(args.length != 1) return chat.send(player, `/gethere [account_id]`);
    const targetArray = alt.Player.all.filter(target=> target.valid && target.getSyncedMeta('account_id') == Number.parseInt(args[0]));
    if(targetArray.length < 1) return chat.send(player, `Неверный id`); 
    const target = targetArray[0];
    if(target.getSyncedMeta('username') == player.getSyncedMeta('username')) return chat.send(player, `Невозможно телепортировать себя к себе`);

    target.setSyncedMeta('tp',true);

    let admPos = {
        x: player.pos.x,
        y: player.pos.y,
        z: player.pos.z,
    }

    try {
        target.pos = admPos;
        target.dimension = player.dimension;
        target.setSyncedMeta('currentLocation', player.getSyncedMeta('currentLocation'));
        chat.send(player,`Вы успешно телепортировали игрока ${target.getSyncedMeta('username')}[${target.getSyncedMeta('account_id')}] к себе`);
        chat.send(target, `Администратор ${player.getSyncedMeta('username')}[${player.getSyncedMeta('account_id')}] телепортировал Вас к себе`);
        alt.setTimeout(() => { player.setSyncedMeta('tp',false) }, 1000);
    } catch (error) {
        alt.log(error);
        return chat.send(player, 'Невозможно телепортироваться к игроку');
    }
}


chat.registerCmd('skin', handleSkin);
function handleSkin(player,args) {
    if(!player.getSyncedMeta('admin')) return 0;
    if(player.getSyncedMeta('admin') < 1) return 0;
    if(args.length < 2) return chat.send(player, '/skin [account_id] [skin]');
    const targetArray = alt.Player.all.filter(target=> target.valid && target.getSyncedMeta('account_id') == Number.parseInt(args[0]))
    if(targetArray.length < 1) return chat.send(player, `Неверный id`); 
    const models = Object.keys(PedModel);
    const target = targetArray[0];
    if(Number.parseInt(args[1])){
        try {
            if(args[1] < 1 || args[1] > 781) return chat.send(player, 'Неправильный номер скина');
            target.setSyncedMeta('skin',models[args[1]]);
            target.model = models[args[1]]
            chat.send(target,`Администратор ${player.getSyncedMeta('username')}[${player.getSyncedMeta('account_id')}] установил Вам временный скин`)
            return chat.send(player, `Вы установили временный скин игроку ${target.getSyncedMeta('username')}[${target.getSyncedMeta('account_id')}]`);
        } catch (error) {
            return chat.send(player, 'Неудалось установить скин игроку')
        }
    }else{
        try {
            const filtered = models.filter(target=>target == args[1])
            if(filtered.length < 1) return chat.send(player, 'Неправильное название скина');
            target.setSyncedMeta('skin',args[1])
            target.model = args[1]
            chat.send(target,`Администратор ${player.getSyncedMeta('username')}[${player.getSyncedMeta('account_id')}] установил Вам временный скин`)
            return chat.send(player, `Вы установили временный скин игроку ${target.getSyncedMeta('username')}[${target.getSyncedMeta('account_id')}]`);
        } catch (error) {
            alt.log(error)
            return chat.send(player, 'Неудалось установить скин игроку')
        }
    }
}

chat.registerCmd('spawn',handleSpawn);
function handleSpawn(player,args) {
    if(!player.getSyncedMeta('admin')) return 0;
    if(player.getSyncedMeta('admin') < 1) return 0;
    if(args.length < 1) return chat.send(player, '/spawn [account_id]');
    const targetArray = alt.Player.all.filter(target=> target.valid && target.getSyncedMeta('account_id') == Number.parseInt(args[0]));
    if(targetArray.length < 1) return chat.send(player, `Неверный id`); 
    const target = targetArray[0];

    let randomNumber = Math.floor(Math.random() * Math.floor(3));
    let spawnPos = LOBBY.spawn[randomNumber]

    try {
        target.setSyncedMeta('tp',true);
        target.spawn(spawnPos.x,spawnPos.y,spawnPos.z,0);
        target.armour = 0;
        target.removeAllWeapons();
        target.dimension = 1092;
        target.setSyncedMeta('currentLocation',1092);
        alt.setTimeout(() => { 
            target.setSyncedMeta('tp',false);
         }, 500);
        if(target.getSyncedMeta('username') == player.getSyncedMeta('username')) return chat.send(player, 'Вы успешно заспавнили себя');
        chat.send(player,`Вы успешно заспавнили игрока ${target.getSyncedMeta('username')}[${target.getSyncedMeta('account_id')}]`);
        return chat.send(target,`Администратор ${player.getSyncedMeta('username')}[${player.getSyncedMeta('account_id')}] заспавнил вас`)
    } catch (error) {
        alt.logError(error);
        return chat.send(player,'Невозможно выполнить команду');
    }
}

chat.registerCmd('a',handleAdminChat);
chat.registerCmd('ö',handleAdminChat);
function handleAdminChat(player,args) {
    if(!player.getSyncedMeta('admin')) return 0;
    if(player.getSyncedMeta('admin') < 1) return 0;
    if(args.length < 1) return chat.send(player, '/a [text]');

    try {
        let text = args.join(' ');
        let fullText = `Администратор ${player.getSyncedMeta('username')}[${player.getSyncedMeta('account_id')}]: ` + text  
        const filteredPlayer = alt.Player.all.filter(target=>target.valid && target.hasSyncedMeta('admin'))
        for (const target of filteredPlayer) {
            chat.send(target, fullText);
        }
        return 0;
    } catch (error) {
        alt.error(error);
        return chat.send(player,"Невозможно выполнить команду")
    }
}


chat.registerCmd('ban',handleBan);
async function handleBan(player,args) {
    if(!player.hasSyncedMeta('admin')) return 0;
    if(player.getSyncedMeta('admin') < 2) return 0;
    if(args.length < 1) return chat.send(player, '/ban [account_id] [day] [reason]');
    const db = await fetchDatabaseInstance();
    if(!Number.parseInt(args[0])) return chat.send(player,'Неверный ID игрока');
    if(!Number.parseInt(args[1])) return chat.send(player,'Неверное количество дней');
    const dbTarget = await db.fetchAllByField('account_id',Number.parseInt(args[0]),'accounts');
    if(dbTarget.length < 1) return chat.send(player,'Указаный ID не найден');
    const exist = await db.fetchAllByField('account_id',Number.parseInt(args[0]),'bans');
    if(exist.length > 0) return chat.send(player,'Игрок уже в бане');
    if(dbTarget[0].admin >= 3 && player.getSyncedMeta('admin') <= 2) return 0;

    try {
        const account_id = Number.parseInt(args[0]);
        const argsReason= args.slice(2);
        const reason = argsReason.join(' ');
        const response = await getTime();
        const date = response.datetime;
        const days = Number.parseInt(args[1]);
        const document = {
            account_id: account_id,
            reason: reason,
            date: date,
            days: days,
            adminName: player.getSyncedMeta('username'),
        }    
        await db.insertData(document,'bans',false);
        chat.broadcast(`{A80000}Администратор ${player.getSyncedMeta('username')}[${player.getSyncedMeta('account_id')}] заблокировал ${dbTarget[0].username}[${dbTarget[0].account_id}] на ${days} дней. Причина: ${reason}`);
        const online = alt.Player.all.find(target=>target.valid && target.getSyncedMeta('account_id') == account_id);
        if(online){
            online.kick(`Вас забанил администратор ${player.getSyncedMeta('username')} на ${days} дней.
            Причина: ${reason}`);
        }
    } catch (error) {
        alt.logError(error);
        return chat.send(player,'Невозможно использовать команду');
    }

}


export async function getTime(){
    try {
        const response = await axios.get('http://worldtimeapi.org/api/timezone/Europe/Moscow');
        return response.data;
    } catch (error) {
        alt.logError(error);
        return 0;
    }
}


chat.registerCmd('sc',handleStatsClear);
async function handleStatsClear(player,args) {
    if(!player.hasSyncedMeta('admin')) return 0;
    if(player.getSyncedMeta('admin') < 2) return 0;
    if(args.length != 1) return chat.send(player, '/sc [account_id]');
    if(!Number.parseInt(args[0])) return chat.send(player,'Неверный ID игрока');

    const db = await fetchDatabaseInstance();
    const dbTarget = await db.fetchAllByField('account_id',Number.parseInt(args[0]),'accounts');
    if(dbTarget.length < 1) return chat.send(player,'Указаный ID не найден');
    if(dbTarget[0].admin >= 3 && player.getSyncedMeta('admin') <= 2) return 0;

    try {
        await db.updateDataByFieldMatch('account_id',Number.parseInt(args[0]),{kills:0,deaths:0},'accounts');
        const online = alt.Player.all.find(target=>target.valid && target.getSyncedMeta('account_id') == Number.parseInt(args[0]));
        if(online){
            online.setSyncedMeta('kills',0);
            online.setSyncedMeta('deaths',0);
            alt.emitClient(online,'stats:Refresh');
            chat.send(online,`Администратор ${player.getSyncedMeta('username')} обнулил Вашу статистику`)
        }
        chat.send(player, `Вы успешно обнулили статистику игрока ${dbTarget[0].username}[${dbTarget[0].account_id}]`)
    } catch (error) {
        alt.logError(error)
        return 0;
    }
}