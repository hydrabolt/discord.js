'use strict';

const Action = require('./Action');
const { Events } = require('../../util/Constants');

class GuildStickerDeleteAction extends Action {
  handle(sticker) {
    sticker.guild.stickers.cache.delete(sticker.id);
    sticker.deleted = true;
    /**
     * Emitted whenever a custom sticker is deleted in a guild.
     * @event Client#stickerDelete
     * @param {Sticker} sticker The sticker that was deleted
     */
    this.client.emit(Events.GUILD_STICKER_DELETE, sticker);
    return { sticker };
  }
}

module.exports = GuildStickerDeleteAction;
