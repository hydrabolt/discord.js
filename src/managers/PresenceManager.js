'use strict';

const { Presence } = require('../structures/Presence');
const BaseManager = require('./BaseManager');

class PresenceManager extends BaseManager {
  constructor(client, iterable) {
    super(client, iterable, Presence);
  }

  /**
  * The cache of Presences
  * @property {Collection<Snowflake, Presence>} cache
  * @memberof PresenceManager
  * @instance
  */

  add(data, cache) {
    const existing = this.cache.get(data.user.id);
    return existing ? existing.patch(data) : super.add(data, cache, { id: data.user.id });
  }

  /**
   * Data that can be resolved to a Presence object. This can be:
   * * A Presence
   * * A UserResolvable
   * * A Snowflake
   * @typedef {Presence|UserResolvable|Snowflake} PresenceResolvable
   */

  /**
    * Resolves a PresenceResolvable to a Presence object.
    * @param {PresenceResolvable} presence The presence resolvable to resolve
    * @returns {?Presence}
    */
  resolve(presence) {
    const presenceResolvable = super.resolve(presence);
    if (presenceResolvable) return presenceResolvable;
    const UserResolvable = this.client.users.resolveID(presence);
    return super.resolve(UserResolvable) || null;
  }

  /**
    * Resolves a PresenceResolvable to a Presence ID string.
    * @param {PresenceResolvable} presence The presence resolvable to resolve
    * @returns {?Snowflake}
    */
  resolveID(presence) {
    const presenceResolvable = super.resolveID(presence);
    if (presenceResolvable) return presenceResolvable;
    const userResolvable = this.client.users.resolveID(presence);
    return this.cache.has(userResolvable) ? userResolvable : null;
  }
}

module.exports = PresenceManager;
