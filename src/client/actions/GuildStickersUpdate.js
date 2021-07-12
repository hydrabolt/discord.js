'use strict';

const Action = require('./Action');

class GuildStickersUpdateAction extends Action {
  handle(data) {
    const guild = this.client.guilds.cache.get(data.guild_id);
    if (!guild?.stickers) return;

    const deletions = new Map(guild.stickers.cache);

    for (const sticker of data.stickers) {
      // Determine type of sticker event
      const cachedSticker = guild.stickers.cache.get(sticker.id);
      if (cachedSticker) {
        deletions.delete(sticker.id);
        if (!cachedSticker.equals(sticker)) {
          // Sticker updated
          this.client.actions.GuildStickerUpdate.handle(cachedSticker, sticker);
        }
      } else {
        // Sticker added
        this.client.actions.GuildStickerCreate.handle(guild, sticker);
      }
    }

    for (const sticker of deletions.values()) {
      // Sticker deleted
      this.client.actions.GuildStickerDelete.handle(sticker);
    }
  }
}

module.exports = GuildStickersUpdateAction;
