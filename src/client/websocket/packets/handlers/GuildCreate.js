const AbstractHandler = require('./AbstractHandler');
const { Events, Status } = require('../../../../util/Constants');

class GuildCreateHandler extends AbstractHandler {
  async handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    data.shard = packet.shard || client.shard;

    let guild = client.guilds.get(data.id);
    if (guild) {
      if (!guild.available && !data.unavailable) {
        // A newly available guild
        guild._patch(data);
        packet.shard.checkIfReady();
      }
    } else {
      // A new guild
      guild = client.guilds.add(data);
      const emitEvent = data.shard.status === Status.READY;
      if (emitEvent) {
        /**
         * Emitted whenever the client joins a guild.
         * @event Client#guildCreate
         * @param {Guild} guild The created guild
         */
        if (client.options.fetchAllMembers) await guild.members.fetch();
        client.emit(Events.GUILD_CREATE, guild);
      }
    }
  }
}

module.exports = GuildCreateHandler;
