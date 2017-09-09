const Permissions = require('../util/Permissions');
const Util = require('../util/Util');

/**
 * Represents a permission overwrite for a role or member in a guild channel.
 */
class PermissionOverwrites {
  constructor(guildChannel, data) {
    /**
     * The GuildChannel this overwrite is for
     * @name PermissionOverwrites#channel
     * @type {GuildChannel}
     * @readonly
     */
    Object.defineProperty(this, 'channel', { value: guildChannel });

    if (data) this._patch(data);
  }

  _patch(data) {
    /**
     * The ID of this overwrite, either a user ID or a role ID
     * @type {Snowflake}
     */
    this.id = data.id;

    /**
     * The type of this overwrite
     * @type {string}
     */
    this.type = data.type;

    this._denied = data.deny;
    this._allowed = data.allow;

    /**
     * The permissions that are denied for the user or role.
     * @type {Permissions}
     */
    this.denied = new Permissions(this._denied);

    /**
     * The permissions that are allowed for the user or role.
     * @type {Permissions}
     */
    this.allowed = new Permissions(this._allowed);
  }

  /**
   * Delete this Permission Overwrite.
   * @param {string} [reason] Reason for deleting this overwrite
   * @returns {Promise<PermissionOverwrites>}
   */
  delete(reason) {
    return this.channel.client.api.channels[this.channel.id].permissions[this.id]
      .delete({ reason })
      .then(() => this);
  }

  toJSON() {
    const json = Util.flatten(this);
    json.denied = this.denied.toJSON(true);
    json.allowed = this.allowed.toJSON(true);
    return json;
  }
}

module.exports = PermissionOverwrites;
