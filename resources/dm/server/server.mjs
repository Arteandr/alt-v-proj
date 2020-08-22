/// <reference types="@altv/types-server" />
import * as alt from 'alt'
import * as chat from 'chat'
// Dependencies
dotenv.config();

import chalk from 'chalk';
import { Database } from 'simplymongo';
import dotenv from 'dotenv';

import {LOCATIONS} from './config'

// Configuration
const config = {
    url: 'mongodb://hwndrer:Mike123a@cluster0-shard-00-00.rwlam.mongodb.net:27017,cluster0-shard-00-01.rwlam.mongodb.net:27017,cluster0-shard-00-02.rwlam.mongodb.net:27017/test?replicaSet=atlas-cvtmon-shard-0&ssl=true&authSource=admin',
    database: 'Cluster0',
    username: 'hwndrer',
    password: 'Mike123a',
    collections: ['accounts']
};

// Establish Database Singleton, Accessed through fetchDatabase in other files.
new Database(config.url, config.database, config.collections, config.username, config.password);

// alt:V Resources
import './auth/auth';

console.log(chalk.greenBright('[OS] Authentication - Started'));

import './colshape/colshape.mjs'

alt.onClient('locations:Get',(player)=>{
    alt.emitClient(player,'locations:GetAll',LOCATIONS)
})

// IMPORT EVENTS
import './events/playerConnect.mjs'
import './events/playerDeath.mjs'
import './events/playerDisconnect.mjs'
import './events/locationShow.mjs'
import './events/lobby.mjs'
import './events/ban.mjs'


//COMANDS 
import './commands/admin.mjs'


chat.registerCmd('coords', player => {
    const coords = player.pos;
    chat.send(player,JSON.stringify(coords));
    console.log(coords);
});
