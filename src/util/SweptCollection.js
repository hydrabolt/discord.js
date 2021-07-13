'use strict';

const Collection = require('./Collection.js');
const { TypeError } = require('../errors/DJSError.js');

/**
 * Options for defining the behavior of a Swept Collection
 * @typedef {Object} SweptCollectionOptions
 * @property {Iterable} [iterable=null] Optional entries passed to the Map constructor.
 * @property {Client} [client=null] A client that instantiates this and has a setInterval function
 * @property {number} [maxSize=-1] The maximum size of the Collection
 * @property {Function|null} [maxSizePredicate=null] A function used to determine which item to remove
 * when reaching the specified max size. The function takes an entry as a paremeter and returns a boolean.
 * <info>This can allow the size to grow larger than max size when none of the entries pass the predicate.</info>
 * @property {Function|null} [sweepFunction=null] A custom function passed directly to `sweep()` every `sweepInterval`.
 * See {@link [Collection#sweep](https://discord.js.org/#/docs/collection/master/class/Collection?scrollTo=sweep)}
 * for the definition of this function. This overrides the build in function generated using the other properties.
 * @property {number} [sweepLifetime=14400] How long an entry should stay in the collection
 * before it is considered sweepable
 * @property {string} [sweepLifetimeProperty='createdTimestamp'] The property of the entry to check when
 * determining the entries lifetime.
 * @property {boolean} [sweepArchivedOnly=false] Whether to only sweep entries with a property `archived: true`.
 * E.g. for threads.
 * @property {number} [sweepInterval=3600] How frequently, in seconds, to sweep the collection.
 */

/**
 * A Collection which holds a max amount of entries and sweeps periodically.
 * The first key is deleted if the Collection has reached max size.
 * @extends {Collection}
 * @param {SweptCollectionOptions|Iterable} [options=null] Options for constructing the swept collection.
 */
class SweptCollection extends Collection {
  constructor(options = null) {
    if (typeof options !== 'object') throw new TypeError('INVALID_TYPE', 'options', 'object or iterable', true);
    const {
      maxSize = -1,
      maxSizePredicate = null,
      sweepFunction = null,
      sweepLifetime = 14400,
      sweepLifetimeProperty = 'createdTimestamp',
      sweepInterval = 3600,
      sweepArchivedOnly = false,
      client = null,
      iterable = null,
    } = options;

    if (typeof maxSize !== 'number') throw new TypeError('INVALID_TYPE', 'maxSize', 'number');
    if (maxSizePredicate !== null && typeof maxSizePredicate !== 'function') {
      throw new TypeError('INVALID_TYPE', 'maxSizePreidcate', 'function');
    }
    if (sweepFunction !== null && typeof sweepFunction !== 'function') {
      throw new TypeError('INVALID_TYPE', 'sweepFunction', 'function');
    }
    if (typeof sweepFunction !== 'function' && typeof sweepLifetime !== 'number') {
      throw new TypeError('INVALID_TYPE', 'sweepLifetime', 'number');
    }
    if (typeof sweepFunction !== 'function' && typeof sweepLifetimeProperty !== 'string') {
      throw new TypeError('INVALID_TYPE', 'sweepLifetimeProperty', 'number');
    }
    if (typeof sweepInterval !== 'number') throw new TypeError('INVALID_TYPE', 'sweepInterval', 'number');
    if (typeof sweepFunction !== 'function' && typeof sweepArchivedOnly !== 'boolean') {
      throw new TypeError('INVALID_TYPE', 'sweepArchivedOnly', 'boolean');
    }
    if (typeof client !== 'object') throw new TypeError('INVALID_TYPE', 'client', 'Client');

    const definiteIterable = options[Symbol.iterator] ? options : iterable;
    super(definiteIterable);

    /**
     * The client used to setInterval on, uses global setInterval if not provided.
     * @type {?Client}
     */
    this.client = client;

    /**
     * The max size of the Collection.
     * @type {number}
     */
    this.maxSize = maxSize;

    /**
     * A predicate for determining which item to remove when the Collection reaches max size.
     * Using this can allow the size to grow larger than max size if none of the entries match the predicate.
     * @type {?Function}
     */
    this.maxSizePredicate = maxSizePredicate;

    const intervalFunction = sweepFunction
      ? () => this.sweep(sweepFunction)
      : () => {
          if (sweepLifetime <= 0) return;
          const lifetimeMs = sweepLifetime * 1000;
          const now = Date.now();
          this.sweep(entry => {
            if (!entry[sweepLifetimeProperty]) return false;
            if (sweepArchivedOnly && !entry.archived) return false;
            return now - entry[sweepLifetimeProperty] > lifetimeMs;
          });
        };

    this.interval =
      sweepInterval > 0
        ? typeof this.client?.setInterval === 'function'
          ? this.client.setInterval(intervalFunction.bind(this), sweepInterval * 1000)
          : setInterval(intervalFunction.bind(this), sweepInterval * 1000)
        : null;
  }

  set(key, value) {
    if (this.maxSize === 0) return this;
    if (this.maxSize === -1 || this.maxSize === Infinity) super.set(key, value);
    if (this.size >= this.maxSize && !this.has(key)) {
      if (this.maxSizePredicate) {
        for (const [k, v] of this) {
          if (this.maxSizePredicate(v)) {
            this.delete(k);
            break;
          }
        }
      } else {
        this.delete(this.firstKey());
      }
    }
    return super.set(key, value);
  }
}

module.exports = SweptCollection;
