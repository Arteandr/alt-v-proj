import * as alt from 'alt'
import * as native from 'natives'

let disabledControls = []

alt.onServer('lobby:Disable',(bind)=>{
    disabledControls.push(alt.everyTick(() => {
        native.disableControlAction(0, bind, true);
      })) 
})

alt.onServer('lobby:Disable:False',()=>{
    disabledControls.forEach(item => {
        alt.clearEveryTick(item);
    });
})