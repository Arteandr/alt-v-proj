import * as alt from 'alt'

import {LOBBY} from '../config'

alt.onClient('lobby:Join:Client',(player)=>{
    alt.emit('lobby:Join',player);
})

alt.on('lobby:Join',(player)=>{
    alt.emitClient(player,'location:Close');
    alt.emitClient(player,'camera:End');
    player.setSyncedMeta('tp',true)
    player.setSyncedMeta('currentLocation',1092);
    let randomNumber = Math.floor(Math.random() * Math.floor(3));
    let spawnPos = LOBBY.spawn[randomNumber];
    player.dimension = 1092;
    player.spawn(spawnPos.x,spawnPos.y,spawnPos.z,0);
    player.model = player.getSyncedMeta('skin');
    player.removeAllWeapons();
    player.health = 200;
    player.armour = 0;
    alt.setTimeout(() => { 
        player.setSyncedMeta('tp',false)
     }, 1000);
})

