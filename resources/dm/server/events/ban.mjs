import * as alt from'alt';
import { fetchDatabaseInstance} from 'simplymongo'
import {getTime} from '../commands/admin.mjs'

const _MS_PER_DAY = 1000 * 60 * 60 * 24;


alt.on('ban:Table',async (player,ban,id,accounts)=>{
    try {
        const db = await fetchDatabaseInstance();
        const response = await getTime();
        const timeNow = new Date(response.datetime);
        const timeBan = new Date(ban[0].date);
        const diff = dateDiffInDays(timeNow,timeBan);
        if(diff >= ban[0].days){
            await db.deleteById(id.toString(),'bans');
            return alt.emit('auth:Done', player, accounts[0]._id.toString(), accounts[0].account_id,accounts[0].username, accounts[0].email,accounts[0].kills,accounts[0].model.toString(),accounts[0].admin,accounts[0].deaths,accounts[0].ip);
        }else{
            player.setSyncedMeta('ban',true);
            alt.emitClient(player,'auth:Exit');
            const left = ban[0].days - diff;
            return alt.emitClient(player,'ban:Show',left,ban[0]);
        }
    } catch (error) {
        alt.logError(error)
        return 0;
    }

})       

function dateDiffInDays(a, b) {
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  
    return Math.round((utc2 - utc1) / _MS_PER_DAY,0) * -1;
  }