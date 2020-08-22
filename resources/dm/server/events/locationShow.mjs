import * as alt from 'alt'
import * as chat from 'chat'
import {LOCATIONS} from '../config'

let ONLINE = [];

LOCATIONS.forEach(loc => {
    ONLINE[loc.id] = 0;
});


alt.setInterval(() => { 
    LOCATIONS.forEach(loc => {
        const filteredPlayers = alt.Player.all.filter(target => target.valid && target.getSyncedMeta('currentLocation') == loc.id)
        ONLINE[loc.id] = filteredPlayers.length;
    });
    const players = alt.Player.all.filter(target => target.valid && target.getSyncedMeta('location') == true)
    for (let target of players){
        alt.emitClient(target,'location:Edit',ONLINE);
    }
 }, 1000);

alt.on('location:ShowServer',(player)=>{
    alt.emitClient(player, 'location:Show',LOCATIONS);
    player.setSyncedMeta('location',true);
    player.setSyncedMeta('tp',true)
})
alt.onClient('location:ShowServerClient',(player)=>{
    alt.emitClient(player, 'location:Show',LOCATIONS);
    player.setSyncedMeta('location',true);
    player.setSyncedMeta('tp',true)

})


alt.onClient('location:falseMeta',(player)=>{
    player.setSyncedMeta('location',false)
})