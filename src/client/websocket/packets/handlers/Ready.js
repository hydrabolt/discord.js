const AbstractHandler = require('./AbstractHandler');

const ClientUser = require('../../../../structures/ClientUser');
const Constants = require('../../../../util/Constants');

class ReadyHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    const ws = packet.shard;

    ws.emit('ready');

    ws.heartbeat();

    data.user.user_settings = data.user_settings;

    const clientUser = new ClientUser(client, data.user);
    client.user = clientUser;
    client.readyAt = new Date();
    client.users.set(clientUser.id, clientUser);

    for (const guild of data.guilds) {
      guild.shard = packet.shard;
      client.dataManager.newGuild(guild);
    }

    for (const privateDM of data.private_channels) {
      privateDM.shard = data.shard;
      client.dataManager.newChannel(privateDM);
    }

    for (const relation of data.relationships) {
      const user = client.dataManager.newUser(relation.user);
      if (relation.type === 1) {
        client.user.friends.set(user.id, user);
      } else if (relation.type === 2) {
        client.user.blocked.set(user.id, user);
      }
    }

    data.presences = data.presences || [];
    for (const presence of data.presences) {
      client.dataManager.newUser(presence.user);
      client._setPresence(presence.user.id, presence);
    }

    if (data.notes) {
      for (const user in data.notes) {
        let note = data.notes[user];
        if (!note.length) note = null;

        client.user.notes.set(user, note);
      }
    }

    if (!client.user.bot && client.options.sync) {
      ws.syncInterval = client.setInterval(ws.syncGuilds.bind(ws), 30000);
    }

    if (!client.users.has('1')) {
      client.dataManager.newUser({
        id: '1',
        username: 'Clyde',
        discriminator: '0000',
        avatar: 'https://discordapp.com/assets/f78426a064bc9dd24847519259bc42af.png',
        bot: true,
        status: 'online',
        game: null,
        verified: true,
      });
    }

    client.setTimeout(() => {
      if (ws.status !== Constants.Status.READY) ws._emitReady();
    }, 1200 * data.guilds.length);

    ws.sessionID = data.session_id;
    ws._trace = data._trace;
    ws.emit('debug', `READY ${ws._trace.join(' -> ')} ${ws.sessionID}`);
    ws.checkIfReady();
  }
}

module.exports = ReadyHandler;
