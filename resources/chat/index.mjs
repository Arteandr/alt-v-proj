import alt from 'alt';

let cmdHandlers = {};

function invokeCmd(player, cmd, args) {
  const callback = cmdHandlers[cmd];

  if (callback) {
    callback(player, args);
  } else {
    return 0;
  }
}

alt.onClient('chatmessage', (player, msg) => {
  if (msg[0] === '/') {
    msg = msg.trim().slice(1);

    if (msg.length > 0) {
      alt.log('[chat:cmd] ' + player.getSyncedMeta('username') + ': /' + msg);

      let args = msg.split(' ');
      let cmd = args.shift();

      invokeCmd(player, cmd, args);
    }
  } else {
    msg = msg.trim();

    if (msg.length > 0) {
      alt.log('[chat:msg] '+ `[loc:${player.getSyncedMeta('currentLocation')}] ` + player.getSyncedMeta('username') + ': ' + msg);

      const filteredPlayers = alt.Player.all.filter(target => target.valid && target.getSyncedMeta('currentLocation') == player.getSyncedMeta('currentLocation'));
      for ( const target of filteredPlayers){
        alt.emitClient(target, 'chatmessage', player.getSyncedMeta('username'), msg.replace(/</g, '&lt;').replace(/'/g, '&#39').replace(/"/g, '&#34'));
      }
    }
  }
});

export function send(player, msg) {
  alt.emitClient(player, 'chatmessage', null, msg);
}

export function broadcast(msg) {
  send(null, msg);
}

export function registerCmd(cmd, callback) {
  if (cmdHandlers[cmd] !== undefined) {
    alt.logError(`Failed to register command /${cmd}, already registered`);
  } else {
    cmdHandlers[cmd] = callback;
  }
}

export default { send, broadcast, registerCmd };
