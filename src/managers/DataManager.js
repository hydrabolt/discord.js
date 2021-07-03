'use strict';

const BaseManager = require('./BaseManager');

let Structures;

/**
 * Manager that holds data structures.
 * @extends {BaseManager}
 * @abstract
 */
class DataManager extends BaseManager {
  constructor(client, holds) {
    super(client);

    if (!Structures) Structures = require('../util/Structures');

    /**
     * The data structure belonging to this manager.
     * @name BaseManager#holds
     * @type {Function}
     * @private
     * @readonly
     */
    Object.defineProperty(this, 'holds', { value: Structures.get(holds.name) ?? holds });
  }

  /**
   * The cache of items for this manager.
   * @type {Collection}
   * @abstract
   */
  get cache() {
    throw new Error(`Getter 'cache' not implemented for ${this.constructor.name}`);
  }

  /**
   * Resolves a data entry to a data Object.
   * @param {string|Object} idOrInstance The id or instance of something in this Manager
   * @returns {?Object} An instance from this Manager
   */
  resolve(idOrInstance) {
    if (idOrInstance instanceof this.holds) return idOrInstance;
    if (typeof idOrInstance === 'string') return this.cache.get(idOrInstance) ?? null;
    return null;
  }

  /**
   * Resolves a data entry to an instance ID.
   * @param {string|Object} idOrInstance The id or instance of something in this Manager
   * @returns {?Snowflake}
   */
  resolveID(idOrInstance) {
    if (idOrInstance instanceof this.holds) return idOrInstance.id;
    if (typeof idOrInstance === 'string') return idOrInstance;
    return null;
  }

  valueOf() {
    return this.cache;
  }
}

module.exports = DataManager;
