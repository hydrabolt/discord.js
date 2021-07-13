'use strict';

/**
 * Rate limit data
 * @typedef {Object} RateLimitData
 * @property {number} timeout Time until this rate limit ends, in ms
 * @property {number} limit The maximum amount of requests of this endpoint
 * @property {string} method The http method of this request
 * @property {string} path The path of the request relative to the HTTP endpoint
 * @property {string} route The route of the request relative to the HTTP endpoint
 * @property {boolean} global Whether this is a global rate limit
 */

/**
 * Whether this rate limit should throw an Error
 * @typedef {Function} RateLimitQueueFilter
 * @param {RateLimitData} rateLimitData The data of this rate limit
 * @returns {boolean|Promise<boolean>}
 */

/**
 * @typedef {Function} CacheFactory
 * @param {Function} manager The manager class the cache is being requested from.
 * @param {Function} holds The class that the cache will hold.
 * @returns {Collection} Cache instance that follows collection interface.
 */

/**
 * Options for a client.
 * @typedef {Object} ClientOptions
 * @property {number|number[]|string} [shards] The shard's id to run, or an array of shard ids. If not specified,
 * the client will spawn {@link ClientOptions#shardCount} shards. If set to `auto`, it will fetch the
 * recommended amount of shards from Discord and spawn that amount
 * @property {number} [shardCount=1] The total amount of shards used by all processes of this bot
 * (e.g. recommended shard count, shard count of the ShardingManager)
 * @property {CacheFactory} [makeCache] Function to create a cache.
 * (-1 or Infinity for unlimited - don't do this without message sweeping, otherwise memory usage will climb
 * indefinitely)
 * @property {number} [messageCacheLifetime=0] How long a message should stay in the cache until it is considered
 * sweepable (in seconds, 0 for forever)
 * @property {number} [messageSweepInterval=0] How frequently to remove messages from the cache that are older than
 * the message cache lifetime (in seconds, 0 for never)
 * @property {MessageMentionOptions} [allowedMentions] Default value for {@link MessageOptions#allowedMentions}
 * @property {number} [invalidRequestWarningInterval=0] The number of invalid REST requests (those that return
 * 401, 403, or 429) in a 10 minute window between emitted warnings (0 for no warnings). That is, if set to 500,
 * warnings will be emitted at invalid request number 500, 1000, 1500, and so on.
 * @property {PartialType[]} [partials] Structures allowed to be partial. This means events can be emitted even when
 * they're missing all the data for a particular structure. See the "Partial Structures" topic on the
 * [guide](https://discordjs.guide/popular-topics/partials.html) for some
 * important usage information, as partials require you to put checks in place when handling data.
 * @property {number} [restWsBridgeTimeout=5000] Maximum time permitted between REST responses and their
 * corresponding websocket events
 * @property {number} [restTimeOffset=500] Extra time in milliseconds to wait before continuing to make REST
 * requests (higher values will reduce rate-limiting errors on bad connections)
 * @property {number} [restRequestTimeout=15000] Time to wait before cancelling a REST request, in milliseconds
 * @property {number} [restSweepInterval=60] How frequently to delete inactive request buckets, in seconds
 * (or 0 for never)
 * @property {number} [restGlobalRateLimit=0] How many requests to allow sending per second (0 for unlimited, 50 for
 * the standard global limit used by Discord)
 * @property {string[]|RateLimitQueueFilter} [rejectOnRateLimit] Decides how rate limits and pre-emptive throttles
 * should be handled. If this option is an array containing the prefix of the request route (e.g. /channels to match any
 * route starting with /channels, such as /channels/222197033908436994/messages) or a function returning true, a
 * {@link RateLimitError} will be thrown. Otherwise the request will be queued for later
 * @property {number} [retryLimit=1] How many times to retry on 5XX errors (Infinity for indefinite amount of retries)
 * @property {boolean} [failIfNotExists=true] Default value for {@link ReplyMessageOptions#failIfNotExists}
 * @property {PresenceData} [presence={}] Presence data to use upon login
 * @property {IntentsResolvable} intents Intents to enable for this connection
 * @property {WebsocketOptions} [ws] Options for the WebSocket
 * @property {HTTPOptions} [http] HTTP options
 */

/**
 * WebSocket options (these are left as snake_case to match the API)
 * @typedef {Object} WebsocketOptions
 * @property {number} [large_threshold=50] Number of members in a guild after which offline users will no longer be
 * sent in the initial guild member list, must be between 50 and 250
 */

/**
 * HTTP options
 * @typedef {Object} HTTPOptions
 * @property {number} [version=9] API version to use
 * @property {string} [api='https://discord.com/api'] Base url of the API
 * @property {string} [cdn='https://cdn.discordapp.com'] Base url of the CDN
 * @property {string} [invite='https://discord.gg'] Base url of invites
 * @property {string} [template='https://discord.new'] Base url of templates
 * @property {Object} [headers] Additional headers to send for all API requests
 */

/**
 * Contains various utilities for client options.
 */
class Options extends null {
  /**
   * The default client options.
   * @param {Client} [client] The client creating these options
   * @returns {ClientOptions}
   */
  static createDefault(client) {
    return {
      shardCount: 1,
      makeCache: this.cacheWithLimitsOrSweep({
        MessageManager: 200,
        ThreadManager: { sweepArchivedOnly: true, client },
      }),
      messageCacheLifetime: 0,
      messageSweepInterval: 0,
      invalidRequestWarningInterval: 0,
      partials: [],
      restWsBridgeTimeout: 5000,
      restRequestTimeout: 15000,
      restGlobalRateLimit: 0,
      retryLimit: 1,
      restTimeOffset: 500,
      restSweepInterval: 60,
      failIfNotExists: true,
      presence: {},
      ws: {
        large_threshold: 50,
        compress: false,
        properties: {
          $os: process.platform,
          $browser: 'discord.js',
          $device: 'discord.js',
        },
        version: 9,
      },
      http: {
        version: 9,
        api: 'https://discord.com/api',
        cdn: 'https://cdn.discordapp.com',
        invite: 'https://discord.gg',
        template: 'https://discord.new',
      },
    };
  }

  /**
   * Create a cache factory using predefined limits.
   * @param {Record<string, number>} [limits={}] Limits for structures.
   * @returns {CacheFactory}
   */
  static cacheWithLimits(limits = {}) {
    const Collection = require('./Collection');
    const LimitedCollection = require('./LimitedCollection');

    return manager => {
      const limit = limits[manager.name];
      if (limit === null || limit === undefined || limit === Infinity) {
        return new Collection();
      }
      return new LimitedCollection(limit);
    };
  }

  /**
   * Create a cache factory using predefined sweep settings.
   * @param {Record<string, SweptCollectionOptions>} [settings={}] Settings for structures.
   * @returns {CacheFactory}
   */
  static cacheWithSweep(settings = {}) {
    const Collection = require('./Collection');
    const SweptCollection = require('./SweptCollection');

    return manager => {
      const setting = settings[manager.name];
      if (
        setting === null || setting === undefined || typeof setting !== 'object' || setting.sweepInterval
          ? setting.sweepInterval <= 0 || setting.sweepInterval === Infinity
          : true
      ) {
        return new Collection();
      }
      return new SweptCollection(setting);
    };
  }

  /**
   * Create a cache factory using predefined sweep settings or limits.
   * @param {Record<string, SweptCollectionOptions|number>} [settings={}] Settings or Limits for structures.
   * @returns {CacheFactory}
   */
  static cacheWithLimitsOrSweep(settings = {}) {
    const Collection = require('./Collection');
    const LimitedCollection = require('./LimitedCollection');
    const SweptCollection = require('./SweptCollection');

    return manager => {
      const setting = settings[manager.name];
      if (typeof setting === 'number' && setting !== Infinity) return LimitedCollection(setting);
      if (
        setting === null ||
        setting === undefined ||
        typeof setting !== 'object' ||
        (setting.sweepInterval ? setting.sweepInterval <= 0 || setting.sweepInterval === Infinity : true)
      ) {
        return new Collection();
      }
      return new SweptCollection(setting);
    };
  }

  /**
   * Create a cache factory that always caches everything.
   * @returns {CacheFactory}
   */
  static cacheEverything() {
    const Collection = require('./Collection');
    return () => new Collection();
  }
}

module.exports = Options;
