import * as alt from 'alt'
import {getAuth} from './authPanel'
import * as native from 'natives'

let view;
let viewLoc;
let viewMenu;
let viewStats;
let viewBan;

let location;

let noclip;

alt.onServer('location:Show', showLocationPanel);

alt.onServer('location:Edit', editLocation);

function showLocationPanel(loc) {
    if(viewLoc && viewLoc.destroy){
        viewLoc.destroy();
    }
    location = loc
    viewLoc = new alt.WebView("http://resource/client/html/Location/index.html")

    viewLoc.focus()
    alt.showCursor(true);
    alt.toggleGameControls(false);

    viewLoc.on('location:Ready',handleReady)
    viewLoc.on('location:Enter',handleEnter)
    viewLoc.on('lobby:Join:Vue',()=>{
        alt.emitServer('lobby:Join:Client');
    })
}

function editLocation(ONLINE){
    if(!viewLoc) return 0;
    viewLoc.emit('edit',ONLINE);
}

function handleReady() {
    if(!viewLoc){
        return;
    }
    viewLoc.emit('location:Ready',location,alt.Player.local.getSyncedMeta('currentLocation'))
}

alt.onServer('location:Close',()=>{
    if(viewLoc){
        closeViewLocation();
    }
})

function closeViewLocation() {
        viewLoc.destroy();
        viewLoc = null;
        alt.showCursor(false);
        alt.toggleGameControls(true);
        alt.emitServer('location:falseMeta');
}

function handleEnter(id) {
    alt.emitServer('location:EnterSucc', id);
    closeViewLocation();
}


/// KILLLIST

alt.onServer('killList:Show',showKillList);

function showKillList() {
    if(view && view.destroy){
        view.destroy();
    }
    view = new alt.WebView("http://resource/client/html/killist/index.html")
}

alt.onServer('killList:AddKill',addKillList);

function addKillList(victim,killer,weaponHash) {
    let victimName = victim.getSyncedMeta('username')
    if(!killer){
        killer = victim.getSyncedMeta('username')
    }else{
        killer = killer.getSyncedMeta('username')
    }
    let data = {victimName,killer,weaponHash}
    view.emit('killList:AddKillView',data)    
}


//KEYDOWN

alt.on('keydown',key=>{
    switch (key) {
        case 112:
            if(alt.Player.local.hasSyncedMeta('ban')) return 0;
            if(getAuth()) return 0;
            showMenu();
            break;
        case 117:
            if(alt.Player.local.hasSyncedMeta('ban')) return 0;
            if(getAuth()) return 0;
            if(alt.Player.local.getSyncedMeta('currentLocation') == 1092) return 0;
            view.emit('killList:Turn')
            break;
        case 116:
            if(alt.Player.local.hasSyncedMeta('ban')) return 0;
            if(getAuth()) return 0;
            if(!viewLoc){
                alt.emitServer('location:ShowServerClient');
            }else{
                closeViewLocation();
            }
        case 38:
            if(alt.Player.local.hasSyncedMeta('ban')) return 0;
            if(getAuth()) return 0;
            if(!alt.Player.local.hasSyncedMeta('admin')) return 0;
            let waypoint = native.getFirstBlipInfoId(8);
            if (native.doesBlipExist(waypoint)) {
                let coords= native.getBlipInfoIdCoord(waypoint);
                alt.emitServer('tp:ArrowUp',coords);
            }
            break
        case 79:
            if(alt.Player.local.hasSyncedMeta('ban')) return 0;
            if(getAuth()) return 0;
            if(!alt.Player.local.hasSyncedMeta('admin')) return 0;

            if(!noclip){
                alt.emit('noclip:start');
                noclip = true;
            }else if(noclip){
                alt.emit('noclip:stop');
                noclip = false;
            }
        default:
            break;
    }
})


//MENU

function showMenu() {
    if(viewMenu && viewMenu.destroy){
        viewMenu.destroy()
    }
    viewMenu = new alt.WebView("http://resource/client/html/menu/index.html")
    viewMenu.focus()
    alt.showCursor(true);
    alt.toggleGameControls(false);
}



// STATS

alt.onServer('stats:Show',showStats);
function showStats() {
    if(viewStats && viewStats.destroy){
        viewStats.destroy();
    }

    viewStats = new alt.WebView("http://resource/client/html/stats/index.html")
    viewStats.on('load',handleReadyStats);
}

function handleReadyStats() {
    if(!viewStats){
        return;
    }
    let kills = alt.Player.local.getSyncedMeta('kills');
    let deaths = alt.Player.local.getSyncedMeta('deaths');
    return viewStats.emit('load',kills,deaths);
}

alt.onServer('stats:Refresh',()=>{
    if(!viewStats){
        return;
    }
    let kills = alt.Player.local.getSyncedMeta('kills');
    let deaths = alt.Player.local.getSyncedMeta('deaths');
    viewStats.emit('stats:Refresh:Vue',kills,deaths);
})


// BAN 

alt.onServer('ban:Show',handleBan);

function handleBan(left,ban) {
    if(viewBan && viewBan.destroy){
        viewBan.destroy();
    }

    viewBan = new alt.WebView("http://resource/client/html/ban/index.html")
    alt.showCursor(true);
    alt.toggleGameControls(false);
    viewBan.on('ban:Ready',()=>{
        if(!viewBan){
            return;
        }
        return viewBan.emit('ban:Ready',left,ban)
    })
}
