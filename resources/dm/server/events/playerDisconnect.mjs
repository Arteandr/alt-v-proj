import * as alt from 'alt'
import {fetchDatabaseInstance} from 'simplymongo'

alt.on('playerDisconnect', async (player, reason) => {
    let db = await fetchDatabaseInstance()
    let pName = player.getSyncedMeta('username');
    alt.log(`[PLAYER] ${pName} disconnected`)
    if (player.getSyncedMeta('currentLocation')) {
        player.deleteSyncedMeta('currentLocation');
    }
    if(player.getSyncedMeta('skin')){
        player.deleteSyncedMeta('skin');
    }
    player.removeAllWeapons();
    if(player.lastVehicle) player.lastVehicle.destroy();
    let currentKills = player.getSyncedMeta('kills');
    let currentDeaths = player.getSyncedMeta('deaths');
    db.updateDataByFieldMatch('username',pName,{kills: currentKills,deaths:currentDeaths,ip:player.ip.slice(7)},'accounts');
});
