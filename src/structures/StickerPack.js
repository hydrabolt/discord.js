'use strict';

const Base = require('./Base');
const Sticker = require('./Sticker');
const Collection = require('../util/Collection');
const SnowflakeUtil = require('../util/SnowflakeUtil');

/**
 * Represents a pack of standard stickers.
 * @extends {Base}
 */
class StickerPack extends Base {
  /**
   * @param {Client} client The instantiating client
   * @param {Object} pack The data for the sticker pack
   */
  constructor(client, pack) {
    super(client);
    /**
     * The Sticker pack's id
     * @type {Snowflake}
     */
    this.id = pack.id;

    /**
     * The stickers in the pack
     * @type {Collection<Snowflake, Sticker>}
     */
    this.stickers = new Collection(pack.stickers.map(s => [s.id, new Sticker(client, s)]));

    /**
     * The name of the sticker pack
     * @type {string}
     */
    this.name = pack.name;

    /**
     * The id of the pack's SKU
     * @type {Snowflake}
     */
    this.skuId = pack.sku_id;

    /**
     * The id of a sticker in the pack which is shown as the pack's icon
     * @type {?Snowflake}
     */
    this.coverStickerId = pack.cover_sticker_id ?? null;

    /**
     * The description of the sticker pack
     * @type {string}
     */
    this.description = pack.description;

    /**
     * The id of the sticker pack's banner image
     * @type {Snowflake}
     */
    this.bannerId = pack.banner_asset_id;
  }

  /**
   * The timestamp the sticker was created at
   * @type {number}
   * @readonly
   */
  get createdTimestamp() {
    return SnowflakeUtil.deconstruct(this.id).timestamp;
  }

  /**
   * The time the sticker was created at
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /**
   * The sticker which is shown as the pack's icon
   * @type {?Sticker}
   * @readonly
   */
  get coverSticker() {
    return this.coverStickerId && this.stickers.get(this.coverStickerId);
  }

  /**
   * The URL to this sticker pack's banner.
   * @param {StaticImageURLOptions} [options={}] Options for the Image URL
   * @returns {string}
   */
  bannerURL({ format, size } = {}) {
    return this.client.rest.cdn.StickerPackBanner(this.bannerId, format, size);
  }
}

module.exports = StickerPack;
