import * as alt from 'alt'
import * as chat from 'chat'

import {LOCATIONS,LOBBY} from '../config'

let COLSHAPES = []

LOCATIONS.forEach(loc => {
    COLSHAPES[loc.id] = new alt.ColshapeSphere(loc.coords.x, loc.coords.y, loc.coords.z, loc.radius + 30);
    COLSHAPES[loc.id].name = loc.name
    COLSHAPES[loc.id].dimension = loc.id
});


alt.on('entityLeaveColshape',(colshape,entity)=>{
    if(entity instanceof alt.Vehicle) return 0;
    if(entity.getSyncedMeta('tp')) return 0;
        LOCATIONS.forEach(loc => {
            if(colshape.name == COLSHAPES[loc.id].name){
                    let prevArm = entity.armour;
                    let prevHealth = entity.health;
                    const randomNumber = Math.floor(Math.random() * Math.floor(3))
                    const spawnPos = loc.spawn[randomNumber]
                    entity.pos = new alt.Vector3(spawnPos.x,spawnPos.y,spawnPos.z);
                    entity.health = prevHealth;
                    if(loc.armour){
                        entity.armour = prevArm;
                    }

            }
        });
    
})

// LOBY COLSHAPE

let LOBBY_COLSHAPE = new alt.ColshapeSphere(LOBBY.spawn[3].x,LOBBY.spawn[3].y,LOBBY.spawn[3].z,LOBBY.radius);
LOBBY_COLSHAPE.name = 'LOBBY'
LOBBY_COLSHAPE.dimension = 1092;

alt.on('entityEnterColshape', (colshape, entity) => {
    if(entity instanceof alt.Vehicle) return 0;
    if(colshape.name == 'LOBBY'){
        LOBBY.binds.forEach(bind => {
            alt.emitClient(entity,'lobby:Disable',bind);
        });
    }
});

alt.on('entityLeaveColshape', (colshape, entity) => {
    if(entity instanceof alt.Vehicle) return 0;
    if(entity.getSyncedMeta('tp')) {
        alt.emitClient(entity,'lobby:Disable:False')
        return 0
    };
    if(colshape.name == 'LOBBY'){
        entity.spawn(LOBBY.spawn[1].x,LOBBY.spawn[1].y,LOBBY.spawn[1].z,0)
        alt.emitClient(entity,'lobby:Disable:False')
    };
});