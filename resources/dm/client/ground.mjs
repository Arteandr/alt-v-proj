import * as alt from 'alt'
import * as native from 'natives'

alt.onServer('ground:Spawn',(pos)=> {
    const result = getGroundZ(pos.x,pos.y,pos.z)
    if(result){
        alt.emitServer('ground:SpawnReturn',pos.x,pos.y,result)
    }
})

function getGroundZ(x, y, z, tries = 0) {
    let [_, height] = native.getGroundZFor3dCoord(
        x,
        y,
        z + 100,
        undefined,
        undefined
    );
    if (!height && tries < 20) return getGroundZ(x, y, z + 100, ++tries);
    else if(!height) return 0;
    return height + 1;
}

