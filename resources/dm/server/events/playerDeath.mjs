import * as alt from 'alt'

import {LOCATIONS,LOBBY} from '../config';
import {HASH_BY_NAME} from '../gamedata/weapon'
import { randomPositionAround  } from "../utility/vector";
import {fetchDatabaseInstance} from 'simplymongo'


alt.on('playerDeath', playerDeath);
async function playerDeath(victim,killer,weaponHash) {
        const db = await fetchDatabaseInstance();
        if(victim.getSyncedMeta('currentLocation') == 1092){
            let randomNumber = Math.floor(Math.random() * Math.floor(3));
            let spawnPos = LOBBY.spawn[randomNumber]
            return victim.spawn(spawnPos.x,spawnPos.y,spawnPos.z,0);
        }
        let locID = victim.getSyncedMeta('currentLocation');
        alt.setTimeout(() => { 
            let random = randomPositionAround(LOCATIONS[locID].coords,25)
            alt.emitClient(victim,'ground:Spawn',random)
            alt.onClient('ground:SpawnReturn',(player,x,y,z)=> {
                player.spawn(x,y,z,0)
                alt.emitClient(player,'invulnerability',3)
                player.health = 200
                if (LOCATIONS[locID].armour) {
                    player.armour = 100;
                }
            }) 
         }, 500);
        LOCATIONS[locID].guns.forEach(gun => {
            victim.giveWeapon(HASH_BY_NAME[gun], 250, true);
        })
        victim.dimension = locID
        killer.health = killer.health + 20; // Выдается 20 очков здоровья когда игрок убивает
        const filteredPlayers = alt.Player.all.filter(target => target.valid && target.getSyncedMeta('currentLocation') == victim.getSyncedMeta('currentLocation'));
        for (const target of filteredPlayers) {
            alt.emitClient(target, 'killList:AddKill',victim,killer,weaponHash);
          }
        
        if(!killer) return 0;
        // ++ DEATHS 
        let currentDeaths = victim.getSyncedMeta('deaths');
        await db.updateDataByFieldMatch('username',victim.getSyncedMeta('username'),{deaths: currentDeaths+1},'accounts');
        victim.setSyncedMeta('deaths',currentDeaths+1);
        alt.emitClient(victim,'stats:Refresh');

        // ++ KILLS

        let currentKills = killer.getSyncedMeta('kills');
        await db.updateDataByFieldMatch('username',killer.getSyncedMeta('username'),{kills: currentKills+1},'accounts');
        killer.setSyncedMeta('kills',currentKills+1);
        alt.emitClient(killer,'stats:Refresh');
    }