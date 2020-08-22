/// <reference types="@altv/types-client" />
import * as alt from 'alt'
import * as native from 'natives'
import './html/panel'
import './html/authPanel'
import './lobby.mjs'

alt.log(`[OS] Authentication - Loaded`);


import './ground.mjs'


let Blips = [];
let Camera;
alt.on('connectionComplete',()=>{
    alt.emitServer('locations:Get')
    alt.onServer('locations:GetAll',(locations)=> {
        locations.forEach(loc => {
            Blips[loc.id] = new alt.RadiusBlip(loc.coords.x,loc.coords.y,loc.coords.z,loc.radius+20);
            Blips[loc.id].color = 1
            Blips[loc.id].alpha = 100
        });
    })
})  

alt.onServer('invulnerability',(sec)=>{
    let time = sec * 1000
    native.setEntityCanBeDamaged(alt.Player.local.scriptID, false);
    alt.setTimeout(()=>{
        native.setEntityCanBeDamaged(alt.Player.local.scriptID, true);
    }, time)
})



//SPAWN CAMERA
alt.onServer('camera:Start',()=>{
    Camera = native.createCam("DEFAULT_SCRIPTED_FLY_CAMERA", true);
    native.setCamCoord(Camera,24,-1499.103271484375, 378.172119140625);
    native.renderScriptCams(true, false, 0, 1, 0);
    native.setCamRot(Camera,-8,0,0,0)
});

alt.onServer('camera:End',()=>{
    if(!Camera) return 0;
    alt.log(`[CAMERA] Camera End emited`)
    native.renderScriptCams(false, false, 0, 1, 0);
})