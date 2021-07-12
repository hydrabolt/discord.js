'use strict';

const AnonymousGuild = require('./AnonymousGuild');
const GuildAuditLogs = require('./GuildAuditLogs');
const GuildPreview = require('./GuildPreview');
const GuildTemplate = require('./GuildTemplate');
const Integration = require('./Integration');
const Webhook = require('./Webhook');
const WelcomeScreen = require('./WelcomeScreen');
const { Error, TypeError } = require('../errors');
const GuildApplicationCommandManager = require('../managers/GuildApplicationCommandManager');
const GuildBanManager = require('../managers/GuildBanManager');
const GuildChannelManager = require('../managers/GuildChannelManager');
const GuildEmojiManager = require('../managers/GuildEmojiManager');
const GuildInviteManager = require('../managers/GuildInviteManager');
const GuildMemberManager = require('../managers/GuildMemberManager');
const GuildStickerManager = require('../managers/GuildStickerManager');
const PresenceManager = require('../managers/PresenceManager');
const RoleManager = require('../managers/RoleManager');
const StageInstanceManager = require('../managers/StageInstanceManager');
const VoiceStateManager = require('../managers/VoiceStateManager');
const Collection = require('../util/Collection');
const {
  ChannelTypes,
  DefaultMessageNotificationLevels,
  PartialTypes,
  VerificationLevels,
  ExplicitContentFilterLevels,
  Status,
  MFALevels,
  PremiumTiers,
} = require('../util/Constants');
const DataResolver = require('../util/DataResolver');
const SystemChannelFlags = require('../util/SystemChannelFlags');
const Util = require('../util/Util');

/**
 * Represents a guild (or a server) on Discord.
 * <info>It's recommended to see if a guild is available before performing operations or reading data from it. You can
 * check this with `guild.available`.</info>
 * @extends {AnonymousGuild}
 */
class Guild extends AnonymousGuild {
  constructor(client, data) {
    super(client, data, false);

    /**
     * A manager of the application commands belonging to this guild
     * @type {GuildApplicationCommandManager}
     */
    this.commands = new GuildApplicationCommandManager(this);

    /**
     * A manager of the members belonging to this guild
     * @type {GuildMemberManager}
     */
    this.members = new GuildMemberManager(this);

    /**
     * A manager of the channels belonging to this guild
     * @type {GuildChannelManager}
     */
    this.channels = new GuildChannelManager(this);

    /**
     * A manager of the bans belonging to this guild
     * @type {GuildBanManager}
     */
    this.bans = new GuildBanManager(this);

    /**
     * A manager of the roles belonging to this guild
     * @type {RoleManager}
     */
    this.roles = new RoleManager(this);

    /**
     * A manager of the presences belonging to this guild
     * @type {PresenceManager}
     */
    this.presences = new PresenceManager(this.client);

    /**
     * A manager of the voice states of this guild
     * @type {VoiceStateManager}
     */
    this.voiceStates = new VoiceStateManager(this);

    /**
     * A manager of the stage instances of this guild
     * @type {StageInstanceManager}
     */
    this.stageInstances = new StageInstanceManager(this);

    /**
     * A manager of the invites of this guild
     * @type {GuildInviteManager}
     */
    this.invites = new GuildInviteManager(this);

    /**
     * Whether the bot has been removed from the guild
     * @type {boolean}
     */
    this.deleted = false;

    if (!data) return;
    if (data.unavailable) {
      /**
       * Whether the guild is available to access. If it is not available, it indicates a server outage
       * @type {boolean}
       */
      this.available = false;
    } else {
      this._patch(data);
      if (!data.channels) this.available = false;
    }

    /**
     * The id of the shard this Guild belongs to.
     * @type {number}
     */
    this.shardId = data.shardId;
  }

  /**
   * The Shard this Guild belongs to.
   * @type {WebSocketShard}
   * @readonly
   */
  get shard() {
    return this.client.ws.shards.get(this.shardId);
  }

  /**
   * Sets up the guild.
   * @param {*} data The raw data of the guild
   * @private
   */
  _patch(data) {
    super._patch(data);
    this.id = data.id;
    this.name = data.name;
    this.icon = data.icon;
    this.available = !data.unavailable;

    /**
     * The hash of the guild discovery splash image
     * @type {?string}
     */
    this.discoverySplash = data.discovery_splash;

    /**
     * The full amount of members in this guild
     * @type {number}
     */
    this.memberCount = data.member_count ?? this.memberCount;

    /**
     * Whether the guild is "large" (has more than large_threshold members, 50 by default)
     * @type {boolean}
     */
    this.large = Boolean(data.large ?? this.large);

    /**
     * An array of enabled guild features, here are the possible values:
     * * ANIMATED_ICON
     * * BANNER
     * * COMMERCE
     * * COMMUNITY
     * * DISCOVERABLE
     * * FEATURABLE
     * * INVITE_SPLASH
     * * MEMBER_VERIFICATION_GATE_ENABLED
     * * MONETIZATION_ENABLED
     * * MORE_STICKERS
     * * NEWS
     * * PARTNERED
     * * PREVIEW_ENABLED
     * * PRIVATE_THREADS
     * * RELAY_ENABLED
     * * SEVEN_DAY_THREAD_ARCHIVE
     * * THREE_DAY_THREAD_ARCHIVE
     * * TICKETED_EVENTS_ENABLED
     * * VANITY_URL
     * * VERIFIED
     * * VIP_REGIONS
     * * WELCOME_SCREEN_ENABLED
     * @typedef {string} Features
     */

    /**
     * The id of the application that created this guild (if applicable)
     * @type {?Snowflake}
     */
    this.applicationId = data.application_id;

    /**
     * The time in seconds before a user is counted as "away from keyboard"
     * @type {?number}
     */
    this.afkTimeout = data.afk_timeout;

    /**
     * The id of the voice channel where AFK members are moved
     * @type {?Snowflake}
     */
    this.afkChannelId = data.afk_channel_id;

    /**
     * The system channel's id
     * @type {?Snowflake}
     */
    this.systemChannelId = data.system_channel_id;

    /**
     * The premium tier of this guild
     * @type {PremiumTier}
     */
    this.premiumTier = PremiumTiers[data.premium_tier];

    if (typeof data.premium_subscription_count !== 'undefined') {
      /**
       * The total number of boosts for this server
       * @type {?number}
       */
      this.premiumSubscriptionCount = data.premium_subscription_count;
    }

    if (typeof data.widget_enabled !== 'undefined') {
      /**
       * Whether widget images are enabled on this guild
       * @type {?boolean}
       */
      this.widgetEnabled = data.widget_enabled;
    }

    if (typeof data.widget_channel_id !== 'undefined') {
      /**
       * The widget channel's id, if enabled
       * @type {?string}
       */
      this.widgetChannelId = data.widget_channel_id;
    }

    /**
     * The explicit content filter level of the guild
     * @type {ExplicitContentFilterLevel}
     */
    this.explicitContentFilter = ExplicitContentFilterLevels[data.explicit_content_filter];

    /**
     * The required MFA level for this guild
     * @type {MFALevel}
     */
    this.mfaLevel = MFALevels[data.mfa_level];

    /**
     * The timestamp the client user joined the guild at
     * @type {number}
     */
    this.joinedTimestamp = data.joined_at ? new Date(data.joined_at).getTime() : this.joinedTimestamp;

    /**
     * The default message notification level of the guild
     * @type {DefaultMessageNotificationLevel}
     */
    this.defaultMessageNotifications = DefaultMessageNotificationLevels[data.default_message_notifications];

    /**
     * The value set for the guild's system channel flags
     * @type {Readonly<SystemChannelFlags>}
     */
    this.systemChannelFlags = new SystemChannelFlags(data.system_channel_flags).freeze();

    if (typeof data.max_members !== 'undefined') {
      /**
       * The maximum amount of members the guild can have
       * @type {?number}
       */
      this.maximumMembers = data.max_members;
    } else if (typeof this.maximumMembers === 'undefined') {
      this.maximumMembers = null;
    }

    if (typeof data.max_presences !== 'undefined') {
      /**
       * The maximum amount of presences the guild can have
       * <info>You will need to fetch the guild using {@link Guild#fetch} if you want to receive this parameter</info>
       * @type {?number}
       */
      this.maximumPresences = data.max_presences ?? 25000;
    } else if (typeof this.maximumPresences === 'undefined') {
      this.maximumPresences = null;
    }

    if (typeof data.approximate_member_count !== 'undefined') {
      /**
       * The approximate amount of members the guild has
       * <info>You will need to fetch the guild using {@link Guild#fetch} if you want to receive this parameter</info>
       * @type {?number}
       */
      this.approximateMemberCount = data.approximate_member_count;
    } else if (typeof this.approximateMemberCount === 'undefined') {
      this.approximateMemberCount = null;
    }

    if (typeof data.approximate_presence_count !== 'undefined') {
      /**
       * The approximate amount of presences the guild has
       * <info>You will need to fetch the guild using {@link Guild#fetch} if you want to receive this parameter</info>
       * @type {?number}
       */
      this.approximatePresenceCount = data.approximate_presence_count;
    } else if (typeof this.approximatePresenceCount === 'undefined') {
      this.approximatePresenceCount = null;
    }

    /**
     * The use count of the vanity URL code of the guild, if any
     * <info>You will need to fetch this parameter using {@link Guild#fetchVanityData} if you want to receive it</info>
     * @type {?number}
     */
    this.vanityURLUses = null;

    /**
     * The rules channel's id for the guild
     * @type {?Snowflake}
     */
    this.rulesChannelId = data.rules_channel_id;

    /**
     * The community updates channel's id for the guild
     * @type {?Snowflake}
     */
    this.publicUpdatesChannelId = data.public_updates_channel_id;

    /**
     * The preferred locale of the guild, defaults to `en-US`
     * @type {string}
     */
    this.preferredLocale = data.preferred_locale;

    if (data.channels) {
      this.channels.cache.clear();
      for (const rawChannel of data.channels) {
        this.client.channels._add(rawChannel, this);
      }
    }

    if (data.threads) {
      for (const rawThread of data.threads) {
        this.client.channels._add(rawThread, this);
      }
    }

    if (data.roles) {
      this.roles.cache.clear();
      for (const role of data.roles) this.roles._add(role);
    }

    if (data.members) {
      this.members.cache.clear();
      for (const guildUser of data.members) this.members._add(guildUser);
    }

    if (data.owner_id) {
      /**
       * The user id of this guild's owner
       * @type {Snowflake}
       */
      this.ownerId = data.owner_id;
    }

    if (data.presences) {
      for (const presence of data.presences) {
        this.presences._add(Object.assign(presence, { guild: this }));
      }
    }

    if (data.stage_instances) {
      this.stageInstances.cache.clear();
      for (const stageInstance of data.stage_instances) {
        this.stageInstances._add(stageInstance);
      }
    }

    if (data.voice_states) {
      this.voiceStates.cache.clear();
      for (const voiceState of data.voice_states) {
        this.voiceStates._add(voiceState);
      }
    }

    if (!this.emojis) {
      /**
       * A manager of the emojis belonging to this guild
       * @type {GuildEmojiManager}
       */
      this.emojis = new GuildEmojiManager(this);
      if (data.emojis) for (const emoji of data.emojis) this.emojis._add(emoji);
    } else if (data.emojis) {
      this.client.actions.GuildEmojisUpdate.handle({
        guild_id: this.id,
        emojis: data.emojis,
      });
    }

    if (!this.stickers) {
      /**
       * A manager of the stickers belonging to this guild
       * @type {GuildStickerManager}
       */
      this.stickers = new GuildStickerManager(this);
      if (data.stickers) for (const sticker of data.stickers) this.stickers.add(sticker);
    } else if (data.stickers) {
      this.client.actions.GuildStickersUpdate.handle({
        guild_id: this.id,
        stickers: data.stickers,
      });
    }
  }

  /**
   * The URL to this guild's banner.
   * @param {StaticImageURLOptions} [options={}] Options for the Image URL
   * @returns {?string}
   */
  bannerURL({ format, size } = {}) {
    return this.banner && this.client.rest.cdn.Banner(this.id, this.banner, format, size);
  }

  /**
   * The time the client user joined the guild
   * @type {Date}
   * @readonly
   */
  get joinedAt() {
    return new Date(this.joinedTimestamp);
  }

  /**
   * The URL to this guild's invite splash image.
   * @param {StaticImageURLOptions} [options={}] Options for the Image URL
   * @returns {?string}
   */
  splashURL({ format, size } = {}) {
    return this.splash && this.client.rest.cdn.Splash(this.id, this.splash, format, size);
  }

  /**
   * The URL to this guild's discovery splash image.
   * @param {StaticImageURLOptions} [options={}] Options for the Image URL
   * @returns {?string}
   */
  discoverySplashURL({ format, size } = {}) {
    return this.discoverySplash && this.client.rest.cdn.DiscoverySplash(this.id, this.discoverySplash, format, size);
  }

  /**
   * Options used to fetch the owner of guild.
   * @typedef {Object} FetchOwnerOptions
   * @property {boolean} [cache=true] Whether or not to cache the fetched member
   * @property {boolean} [force=false] Whether to skip the cache check and request the API
   */

  /**
   * Fetches the owner of the guild.
   * If the member object isn't needed, use {@link Guild#ownerId} instead.
   * @param {FetchOwnerOptions} [options] The options for fetching the member
   * @returns {Promise<GuildMember>}
   */
  fetchOwner(options) {
    return this.members.fetch({ ...options, user: this.ownerId });
  }

  /**
   * AFK voice channel for this guild
   * @type {?VoiceChannel}
   * @readonly
   */
  get afkChannel() {
    return this.client.channels.resolve(this.afkChannelId);
  }

  /**
   * System channel for this guild
   * @type {?TextChannel}
   * @readonly
   */
  get systemChannel() {
    return this.client.channels.resolve(this.systemChannelId);
  }

  /**
   * Widget channel for this guild
   * @type {?TextChannel}
   * @readonly
   */
  get widgetChannel() {
    return this.client.channels.resolve(this.widgetChannelId);
  }

  /**
   * Rules channel for this guild
   * @type {?TextChannel}
   * @readonly
   */
  get rulesChannel() {
    return this.client.channels.resolve(this.rulesChannelId);
  }

  /**
   * Public updates channel for this guild
   * @type {?TextChannel}
   * @readonly
   */
  get publicUpdatesChannel() {
    return this.client.channels.resolve(this.publicUpdatesChannelId);
  }

  /**
   * The client user as a GuildMember of this guild
   * @type {?GuildMember}
   * @readonly
   */
  get me() {
    return (
      this.members.resolve(this.client.user.id) ??
      (this.client.options.partials.includes(PartialTypes.GUILD_MEMBER)
        ? this.members._add({ user: { id: this.client.user.id } }, true)
        : null)
    );
  }

  /**
   * Fetches a collection of integrations to this guild.
   * Resolves with a collection mapping integrations by their ids.
   * @returns {Promise<Collection<string, Integration>>}
   * @example
   * // Fetch integrations
   * guild.fetchIntegrations()
   *   .then(integrations => console.log(`Fetched ${integrations.size} integrations`))
   *   .catch(console.error);
   */
  async fetchIntegrations() {
    const data = await this.client.api.guilds(this.id).integrations.get();
    return data.reduce(
      (collection, integration) => collection.set(integration.id, new Integration(this.client, integration, this)),
      new Collection(),
    );
  }

  /**
   * Fetches a collection of templates from this guild.
   * Resolves with a collection mapping templates by their codes.
   * @returns {Promise<Collection<string, GuildTemplate>>}
   */
  fetchTemplates() {
    return this.client.api
      .guilds(this.id)
      .templates.get()
      .then(templates =>
        templates.reduce((col, data) => col.set(data.code, new GuildTemplate(this.client, data)), new Collection()),
      );
  }

  /**
   * Fetches the welcome screen for this guild.
   * @returns {Promise<WelcomeScreen>}
   */
  async fetchWelcomeScreen() {
    const data = await this.client.api.guilds(this.id, 'welcome-screen').get();
    return new WelcomeScreen(this, data);
  }

  /**
   * The data for creating an integration.
   * @typedef {Object} IntegrationData
   * @property {string} id The integration id
   * @property {string} type The integration type
   */

  /**
   * Creates an integration by attaching an integration object
   * @param {IntegrationData} data The data for the integration
   * @param {string} reason Reason for creating the integration
   * @returns {Promise<Guild>}
   */
  createIntegration(data, reason) {
    return this.client.api
      .guilds(this.id)
      .integrations.post({ data, reason })
      .then(() => this);
  }

  /**
   * Creates a template for the guild.
   * @param {string} name The name for the template
   * @param {string} [description] The description for the template
   * @returns {Promise<GuildTemplate>}
   */
  createTemplate(name, description) {
    return this.client.api
      .guilds(this.id)
      .templates.post({ data: { name, description } })
      .then(data => new GuildTemplate(this.client, data));
  }

  /**
   * Obtains a guild preview for this guild from Discord.
   * @returns {Promise<GuildPreview>}
   */
  fetchPreview() {
    return this.client.api
      .guilds(this.id)
      .preview.get()
      .then(data => new GuildPreview(this.client, data));
  }

  /**
   * An object containing information about a guild's vanity invite.
   * @typedef {Object} Vanity
   * @property {?string} code Vanity invite code
   * @property {?number} uses How many times this invite has been used
   */

  /**
   * Fetches the vanity url invite object to this guild.
   * Resolves with an object containing the vanity url invite code and the use count
   * @returns {Promise<Vanity>}
   * @example
   * // Fetch invite data
   * guild.fetchVanityData()
   *   .then(res => {
   *     console.log(`Vanity URL: https://discord.gg/${res.code} with ${res.uses} uses`);
   *   })
   *   .catch(console.error);
   */
  async fetchVanityData() {
    if (!this.features.includes('VANITY_URL')) {
      throw new Error('VANITY_URL');
    }
    const data = await this.client.api.guilds(this.id, 'vanity-url').get();
    this.vanityURLCode = data.code;
    this.vanityURLUses = data.uses;

    return data;
  }

  /**
   * Fetches all webhooks for the guild.
   * @returns {Promise<Collection<Snowflake, Webhook>>}
   * @example
   * // Fetch webhooks
   * guild.fetchWebhooks()
   *   .then(webhooks => console.log(`Fetched ${webhooks.size} webhooks`))
   *   .catch(console.error);
   */
  fetchWebhooks() {
    return this.client.api
      .guilds(this.id)
      .webhooks.get()
      .then(data => {
        const hooks = new Collection();
        for (const hook of data) hooks.set(hook.id, new Webhook(this.client, hook));
        return hooks;
      });
  }

  /**
   * Data for the Guild Widget object
   * @typedef {Object} GuildWidget
   * @property {boolean} enabled Whether the widget is enabled
   * @property {?GuildChannel} channel The widget channel
   */

  /**
   * The Guild Widget object
   * @typedef {Object} GuildWidgetData
   * @property {boolean} enabled Whether the widget is enabled
   * @property {?GuildChannelResolvable} channel The widget channel
   */

  /**
   * Fetches the guild widget.
   * @returns {Promise<GuildWidget>}
   * @example
   * // Fetches the guild widget
   * guild.fetchWidget()
   *   .then(widget => console.log(`The widget is ${widget.enabled ? 'enabled' : 'disabled'}`))
   *   .catch(console.error);
   */
  async fetchWidget() {
    const data = await this.client.api.guilds(this.id).widget.get();
    this.widgetEnabled = data.enabled;
    this.widgetChannelId = data.channel_id;
    return {
      enabled: data.enabled,
      channel: data.channel_id ? this.channels.cache.get(data.channel_id) : null,
    };
  }

  /**
   * Options used to fetch audit logs.
   * @typedef {Object} GuildAuditLogsFetchOptions
   * @property {Snowflake|GuildAuditLogsEntry} [before] Only return entries before this entry
   * @property {number} [limit] The number of entries to return
   * @property {UserResolvable} [user] Only return entries for actions made by this user
   * @property {AuditLogAction|number} [type] Only return entries for this action type
   */

  /**
   * Fetches audit logs for this guild.
   * @param {GuildAuditLogsFetchOptions} [options={}] Options for fetching audit logs
   * @returns {Promise<GuildAuditLogs>}
   * @example
   * // Output audit log entries
   * guild.fetchAuditLogs()
   *   .then(audit => console.log(audit.entries.first()))
   *   .catch(console.error);
   */
  fetchAuditLogs(options = {}) {
    if (options.before && options.before instanceof GuildAuditLogs.Entry) options.before = options.before.id;
    if (typeof options.type === 'string') options.type = GuildAuditLogs.Actions[options.type];

    return this.client.api
      .guilds(this.id)
      ['audit-logs'].get({
        query: {
          before: options.before,
          limit: options.limit,
          user_id: this.client.users.resolveId(options.user),
          action_type: options.type,
        },
      })
      .then(data => GuildAuditLogs.build(this, data));
  }

  /**
   * Options used to add a user to a guild using OAuth2.
   * @typedef {Object} AddGuildMemberOptions
   * @property {string} accessToken An OAuth2 access token for the user with the `guilds.join` scope granted to the
   * bot's application
   * @property {string} [nick] The nickname to give to the member (requires `MANAGE_NICKNAMES`)
   * @property {Collection<Snowflake, Role>|RoleResolvable[]} [roles] The roles to add to the member
   * (requires `MANAGE_ROLES`)
   * @property {boolean} [mute] Whether the member should be muted (requires `MUTE_MEMBERS`)
   * @property {boolean} [deaf] Whether the member should be deafened (requires `DEAFEN_MEMBERS`)
   */

  /**
   * Adds a user to the guild using OAuth2. Requires the `CREATE_INSTANT_INVITE` permission.
   * @param {UserResolvable} user The user to add to the guild
   * @param {AddGuildMemberOptions} options Options for adding the user to the guild
   * @returns {Promise<GuildMember>}
   */
  async addMember(user, options) {
    user = this.client.users.resolveId(user);
    if (!user) throw new TypeError('INVALID_TYPE', 'user', 'UserResolvable');
    if (this.members.cache.has(user)) return this.members.cache.get(user);
    options.access_token = options.accessToken;
    if (options.roles) {
      if (!Array.isArray(options.roles) && !(options.roles instanceof Collection)) {
        throw new TypeError('INVALID_TYPE', 'options.roles', 'Array or Collection of Roles or Snowflakes', true);
      }
      const resolvedRoles = [];
      for (const role of options.roles.values()) {
        const resolvedRole = this.roles.resolveId(role);
        if (!role) throw new TypeError('INVALID_ELEMENT', 'Array or Collection', 'options.roles', role);
        resolvedRoles.push(resolvedRole);
      }
      options.roles = resolvedRoles;
    }
    const data = await this.client.api.guilds(this.id).members(user).put({ data: options });
    // Data is an empty buffer if the member is already part of the guild.
    return data instanceof Buffer ? this.members.fetch(user) : this.members._add(data);
  }

  /**
   * The data for editing a guild.
   * @typedef {Object} GuildEditData
   * @property {string} [name] The name of the guild
   * @property {VerificationLevel|number} [verificationLevel] The verification level of the guild
   * @property {ExplicitContentFilterLevel|number} [explicitContentFilter] The level of the explicit content filter
   * @property {ChannelResolvable} [afkChannel] The AFK channel of the guild
   * @property {ChannelResolvable} [systemChannel] The system channel of the guild
   * @property {number} [afkTimeout] The AFK timeout of the guild
   * @property {Base64Resolvable} [icon] The icon of the guild
   * @property {GuildMemberResolvable} [owner] The owner of the guild
   * @property {Base64Resolvable} [splash] The invite splash image of the guild
   * @property {Base64Resolvable} [discoverySplash] The discovery splash image of the guild
   * @property {Base64Resolvable} [banner] The banner of the guild
   * @property {DefaultMessageNotificationLevel|number} [defaultMessageNotifications] The default message notification
   * level of the guild
   * @property {SystemChannelFlagsResolvable} [systemChannelFlags] The system channel flags of the guild
   * @property {ChannelResolvable} [rulesChannel] The rules channel of the guild
   * @property {ChannelResolvable} [publicUpdatesChannel] The community updates channel of the guild
   * @property {string} [preferredLocale] The preferred locale of the guild
   * @property {string} [description] The discovery description of the guild
   * @property {Features[]} [features] The features of the guild
   */

  /**
   * Updates the guild with new information - e.g. a new name.
   * @param {GuildEditData} data The data to update the guild with
   * @param {string} [reason] Reason for editing this guild
   * @returns {Promise<Guild>}
   * @example
   * // Set the guild name
   * guild.edit({
   *   name: 'Discord Guild',
   * })
   *   .then(updated => console.log(`New guild name ${updated}`))
   *   .catch(console.error);
   */
  edit(data, reason) {
    const _data = {};
    if (data.name) _data.name = data.name;
    if (typeof data.verificationLevel !== 'undefined') {
      _data.verification_level =
        typeof data.verificationLevel === 'number'
          ? data.verificationLevel
          : VerificationLevels[data.verificationLevel];
    }
    if (typeof data.afkChannel !== 'undefined') {
      _data.afk_channel_id = this.client.channels.resolveId(data.afkChannel);
    }
    if (typeof data.systemChannel !== 'undefined') {
      _data.system_channel_id = this.client.channels.resolveId(data.systemChannel);
    }
    if (data.afkTimeout) _data.afk_timeout = Number(data.afkTimeout);
    if (typeof data.icon !== 'undefined') _data.icon = data.icon;
    if (data.owner) _data.owner_id = this.client.users.resolveId(data.owner);
    if (data.splash) _data.splash = data.splash;
    if (data.discoverySplash) _data.discovery_splash = data.discoverySplash;
    if (data.banner) _data.banner = data.banner;
    if (typeof data.explicitContentFilter !== 'undefined') {
      _data.explicit_content_filter =
        typeof data.explicitContentFilter === 'number'
          ? data.explicitContentFilter
          : ExplicitContentFilterLevels[data.explicitContentFilter];
    }
    if (typeof data.defaultMessageNotifications !== 'undefined') {
      _data.default_message_notifications =
        typeof data.defaultMessageNotifications === 'number'
          ? data.defaultMessageNotifications
          : DefaultMessageNotificationLevels[data.defaultMessageNotifications];
    }
    if (typeof data.systemChannelFlags !== 'undefined') {
      _data.system_channel_flags = SystemChannelFlags.resolve(data.systemChannelFlags);
    }
    if (typeof data.rulesChannel !== 'undefined') {
      _data.rules_channel_id = this.client.channels.resolveId(data.rulesChannel);
    }
    if (typeof data.publicUpdatesChannel !== 'undefined') {
      _data.public_updates_channel_id = this.client.channels.resolveId(data.publicUpdatesChannel);
    }
    if (typeof data.features !== 'undefined') {
      _data.features = data.features;
    }
    if (typeof data.description !== 'undefined') {
      _data.description = data.description;
    }
    if (data.preferredLocale) _data.preferred_locale = data.preferredLocale;
    return this.client.api
      .guilds(this.id)
      .patch({ data: _data, reason })
      .then(newData => this.client.actions.GuildUpdate.handle(newData).updated);
  }

  /**
   * Welcome channel data
   * @typedef {Object} WelcomeChannelData
   * @property {string} description The description to show for this welcome channel
   * @property {GuildTextChannelResolvable} channel The channel to link for this welcome channel
   * @property {EmojiIdentifierResolvable} [emoji] The emoji to display for this welcome channel
   */

  /**
   * Welcome screen edit data
   * @typedef {Object} WelcomeScreenEditData
   * @property {boolean} [enabled] Whether the welcome screen is enabled
   * @property {string} [description] The description for the welcome screen
   * @property {WelcomeChannelData[]} [welcomeChannels] The welcome channel data for the welcome screen
   */

  /**
   * Updates the guild's welcome screen
   * @param {WelcomeScreenEditData} data Data to edit the welcome screen with
   * @returns {Promise<WelcomeScreen>}
   * @example
   * guild.editWelcomeScreen({
   *   description: 'Hello World',
   *   enabled: true,
   *   welcomeChannels: [
   *     {
   *       description: 'foobar',
   *       channel: '222197033908436994',
   *     }
   *   ],
   * })
   */
  async editWelcomeScreen(data) {
    const { enabled, description, welcomeChannels } = data;
    const welcome_channels = welcomeChannels?.map(welcomeChannelData => {
      const emoji = this.emojis.resolve(welcomeChannelData.emoji);
      return {
        emoji_id: emoji && emoji.id,
        emoji_name: emoji?.name ?? welcomeChannelData.emoji,
        channel_id: this.channels.resolveId(welcomeChannelData.channel),
        description: welcomeChannelData.description,
      };
    });

    const patchData = await this.client.api.guilds(this.id, 'welcome-screen').patch({
      data: {
        welcome_channels,
        description,
        enabled,
      },
    });
    return new WelcomeScreen(this, patchData);
  }

  /**
   * Edits the level of the explicit content filter.
   * @param {ExplicitContentFilterLevel|number} explicitContentFilter The new level of the explicit content filter
   * @param {string} [reason] Reason for changing the level of the guild's explicit content filter
   * @returns {Promise<Guild>}
   */
  setExplicitContentFilter(explicitContentFilter, reason) {
    return this.edit({ explicitContentFilter }, reason);
  }

  /* eslint-disable max-len */
  /**
   * Edits the setting of the default message notifications of the guild.
   * @param {DefaultMessageNotificationLevel|number} defaultMessageNotifications The new default message notification level of the guild
   * @param {string} [reason] Reason for changing the setting of the default message notifications
   * @returns {Promise<Guild>}
   */
  setDefaultMessageNotifications(defaultMessageNotifications, reason) {
    return this.edit({ defaultMessageNotifications }, reason);
  }
  /* eslint-enable max-len */

  /**
   * Edits the flags of the default message notifications of the guild.
   * @param {SystemChannelFlagsResolvable} systemChannelFlags The new flags for the default message notifications
   * @param {string} [reason] Reason for changing the flags of the default message notifications
   * @returns {Promise<Guild>}
   */
  setSystemChannelFlags(systemChannelFlags, reason) {
    return this.edit({ systemChannelFlags }, reason);
  }

  /**
   * Edits the name of the guild.
   * @param {string} name The new name of the guild
   * @param {string} [reason] Reason for changing the guild's name
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild name
   * guild.setName('Discord Guild')
   *  .then(updated => console.log(`Updated guild name to ${updated.name}`))
   *  .catch(console.error);
   */
  setName(name, reason) {
    return this.edit({ name }, reason);
  }

  /**
   * Edits the verification level of the guild.
   * @param {VerificationLevel|number} verificationLevel The new verification level of the guild
   * @param {string} [reason] Reason for changing the guild's verification level
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild verification level
   * guild.setVerificationLevel(1)
   *  .then(updated => console.log(`Updated guild verification level to ${guild.verificationLevel}`))
   *  .catch(console.error);
   */
  setVerificationLevel(verificationLevel, reason) {
    return this.edit({ verificationLevel }, reason);
  }

  /**
   * Edits the AFK channel of the guild.
   * @param {ChannelResolvable} afkChannel The new AFK channel
   * @param {string} [reason] Reason for changing the guild's AFK channel
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild AFK channel
   * guild.setAFKChannel(channel)
   *  .then(updated => console.log(`Updated guild AFK channel to ${guild.afkChannel.name}`))
   *  .catch(console.error);
   */
  setAFKChannel(afkChannel, reason) {
    return this.edit({ afkChannel }, reason);
  }

  /**
   * Edits the system channel of the guild.
   * @param {ChannelResolvable} systemChannel The new system channel
   * @param {string} [reason] Reason for changing the guild's system channel
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild system channel
   * guild.setSystemChannel(channel)
   *  .then(updated => console.log(`Updated guild system channel to ${guild.systemChannel.name}`))
   *  .catch(console.error);
   */
  setSystemChannel(systemChannel, reason) {
    return this.edit({ systemChannel }, reason);
  }

  /**
   * Edits the AFK timeout of the guild.
   * @param {number} afkTimeout The time in seconds that a user must be idle to be considered AFK
   * @param {string} [reason] Reason for changing the guild's AFK timeout
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild AFK channel
   * guild.setAFKTimeout(60)
   *  .then(updated => console.log(`Updated guild AFK timeout to ${guild.afkTimeout}`))
   *  .catch(console.error);
   */
  setAFKTimeout(afkTimeout, reason) {
    return this.edit({ afkTimeout }, reason);
  }

  /**
   * Sets a new guild icon.
   * @param {Base64Resolvable|BufferResolvable} icon The new icon of the guild
   * @param {string} [reason] Reason for changing the guild's icon
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild icon
   * guild.setIcon('./icon.png')
   *  .then(updated => console.log('Updated the guild icon'))
   *  .catch(console.error);
   */
  async setIcon(icon, reason) {
    return this.edit({ icon: await DataResolver.resolveImage(icon) }, reason);
  }

  /**
   * Sets a new owner of the guild.
   * @param {GuildMemberResolvable} owner The new owner of the guild
   * @param {string} [reason] Reason for setting the new owner
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild owner
   * guild.setOwner(guild.members.cache.first())
   *  .then(updated => console.log(`Updated the guild owner to ${updated.owner.displayName}`))
   *  .catch(console.error);
   */
  setOwner(owner, reason) {
    return this.edit({ owner }, reason);
  }

  /**
   * Sets a new guild invite splash image.
   * @param {Base64Resolvable|BufferResolvable} splash The new invite splash image of the guild
   * @param {string} [reason] Reason for changing the guild's invite splash image
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild splash
   * guild.setSplash('./splash.png')
   *  .then(updated => console.log('Updated the guild splash'))
   *  .catch(console.error);
   */
  async setSplash(splash, reason) {
    return this.edit({ splash: await DataResolver.resolveImage(splash) }, reason);
  }

  /**
   * Sets a new guild discovery splash image.
   * @param {Base64Resolvable|BufferResolvable} discoverySplash The new discovery splash image of the guild
   * @param {string} [reason] Reason for changing the guild's discovery splash image
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild discovery splash
   * guild.setDiscoverySplash('./discoverysplash.png')
   *   .then(updated => console.log('Updated the guild discovery splash'))
   *   .catch(console.error);
   */
  async setDiscoverySplash(discoverySplash, reason) {
    return this.edit({ discoverySplash: await DataResolver.resolveImage(discoverySplash) }, reason);
  }

  /**
   * Sets a new guild banner.
   * @param {Base64Resolvable|BufferResolvable} banner The new banner of the guild
   * @param {string} [reason] Reason for changing the guild's banner
   * @returns {Promise<Guild>}
   * @example
   * guild.setBanner('./banner.png')
   *  .then(updated => console.log('Updated the guild banner'))
   *  .catch(console.error);
   */
  async setBanner(banner, reason) {
    return this.edit({ banner: await DataResolver.resolveImage(banner) }, reason);
  }

  /**
   * Edits the rules channel of the guild.
   * @param {ChannelResolvable} rulesChannel The new rules channel
   * @param {string} [reason] Reason for changing the guild's rules channel
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild rules channel
   * guild.setRulesChannel(channel)
   *  .then(updated => console.log(`Updated guild rules channel to ${guild.rulesChannel.name}`))
   *  .catch(console.error);
   */
  setRulesChannel(rulesChannel, reason) {
    return this.edit({ rulesChannel }, reason);
  }

  /**
   * Edits the community updates channel of the guild.
   * @param {ChannelResolvable} publicUpdatesChannel The new community updates channel
   * @param {string} [reason] Reason for changing the guild's community updates channel
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild community updates channel
   * guild.setPublicUpdatesChannel(channel)
   *  .then(updated => console.log(`Updated guild community updates channel to ${guild.publicUpdatesChannel.name}`))
   *  .catch(console.error);
   */
  setPublicUpdatesChannel(publicUpdatesChannel, reason) {
    return this.edit({ publicUpdatesChannel }, reason);
  }

  /**
   * Edits the preferred locale of the guild.
   * @param {string} preferredLocale The new preferred locale of the guild
   * @param {string} [reason] Reason for changing the guild's preferred locale
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild preferred locale
   * guild.setPreferredLocale('en-US')
   *  .then(updated => console.log(`Updated guild preferred locale to ${guild.preferredLocale}`))
   *  .catch(console.error);
   */
  setPreferredLocale(preferredLocale, reason) {
    return this.edit({ preferredLocale }, reason);
  }

  /**
   * Data that can be resolved to give a Category Channel object. This can be:
   * * A CategoryChannel object
   * * A Snowflake
   * @typedef {CategoryChannel|Snowflake} CategoryChannelResolvable
   */

  /**
   * The data needed for updating a channel's position.
   * @typedef {Object} ChannelPosition
   * @property {ChannelResolvable} channel Channel to update
   * @property {number} [position] New position for the channel
   * @property {CategoryChannelResolvable} [parent] Parent channel for this channel
   * @property {boolean} [lockPermissions] If the overwrites should be locked to the parents overwrites
   */

  /**
   * Batch-updates the guild's channels' positions.
   * <info>Only one channel's parent can be changed at a time</info>
   * @param {ChannelPosition[]} channelPositions Channel positions to update
   * @returns {Promise<Guild>}
   * @example
   * guild.setChannelPositions([{ channel: channelId, position: newChannelIndex }])
   *   .then(guild => console.log(`Updated channel positions for ${guild}`))
   *   .catch(console.error);
   */
  setChannelPositions(channelPositions) {
    const updatedChannels = channelPositions.map(r => ({
      id: this.client.channels.resolveId(r.channel),
      position: r.position,
      lock_permissions: r.lockPermissions,
      parent_id: typeof r.parent !== 'undefined' ? this.channels.resolveId(r.parent) : undefined,
    }));

    return this.client.api
      .guilds(this.id)
      .channels.patch({ data: updatedChannels })
      .then(
        () =>
          this.client.actions.GuildChannelsPositionUpdate.handle({
            guild_id: this.id,
            channels: updatedChannels,
          }).guild,
      );
  }

  /**
   * The data needed for updating a guild role's position
   * @typedef {Object} GuildRolePosition
   * @property {RoleResolveable} role The role's id
   * @property {number} position The position to update
   */

  /**
   * Batch-updates the guild's role positions
   * @param {GuildRolePosition[]} rolePositions Role positions to update
   * @returns {Promise<Guild>}
   * @example
   * guild.setRolePositions([{ role: roleId, position: updatedRoleIndex }])
   *  .then(guild => console.log(`Role positions updated for ${guild}`))
   *  .catch(console.error);
   */
  setRolePositions(rolePositions) {
    // Make sure rolePositions are prepared for API
    rolePositions = rolePositions.map(o => ({
      id: this.roles.resolveId(o.role),
      position: o.position,
    }));

    // Call the API to update role positions
    return this.client.api
      .guilds(this.id)
      .roles.patch({
        data: rolePositions,
      })
      .then(
        () =>
          this.client.actions.GuildRolesPositionUpdate.handle({
            guild_id: this.id,
            roles: rolePositions,
          }).guild,
      );
  }

  /**
   * Edits the guild's widget.
   * @param {GuildWidgetData} widget The widget for the guild
   * @param {string} [reason] Reason for changing the guild's widget
   * @returns {Promise<Guild>}
   */
  setWidget(widget, reason) {
    return this.client.api
      .guilds(this.id)
      .widget.patch({
        data: {
          enabled: widget.enabled,
          channel_id: this.channels.resolveId(widget.channel),
        },
        reason,
      })
      .then(() => this);
  }

  /**
   * Leaves the guild.
   * @returns {Promise<Guild>}
   * @example
   * // Leave a guild
   * guild.leave()
   *   .then(g => console.log(`Left the guild ${g}`))
   *   .catch(console.error);
   */
  leave() {
    if (this.ownerId === this.client.user.id) return Promise.reject(new Error('GUILD_OWNED'));
    return this.client.api
      .users('@me')
      .guilds(this.id)
      .delete()
      .then(() => this.client.actions.GuildDelete.handle({ id: this.id }).guild);
  }

  /**
   * Deletes the guild.
   * @returns {Promise<Guild>}
   * @example
   * // Delete a guild
   * guild.delete()
   *   .then(g => console.log(`Deleted the guild ${g}`))
   *   .catch(console.error);
   */
  delete() {
    return this.client.api
      .guilds(this.id)
      .delete()
      .then(() => this.client.actions.GuildDelete.handle({ id: this.id }).guild);
  }

  /**
   * Whether this guild equals another guild. It compares all properties, so for most operations
   * it is advisable to just compare `guild.id === guild2.id` as it is much faster and is often
   * what most users need.
   * @param {Guild} guild The guild to compare with
   * @returns {boolean}
   */
  equals(guild) {
    return (
      guild &&
      guild instanceof this.constructor &&
      this.id === guild.id &&
      this.available === guild.available &&
      this.splash === guild.splash &&
      this.discoverySplash === guild.discoverySplash &&
      this.name === guild.name &&
      this.memberCount === guild.memberCount &&
      this.large === guild.large &&
      this.icon === guild.icon &&
      this.ownerId === guild.ownerId &&
      this.verificationLevel === guild.verificationLevel &&
      (this.features === guild.features ||
        (this.features.length === guild.features.length &&
          this.features.every((feat, i) => feat === guild.features[i])))
    );
  }

  toJSON() {
    const json = super.toJSON({
      available: false,
      createdTimestamp: true,
      nameAcronym: true,
      presences: false,
      voiceStates: false,
    });
    json.iconURL = this.iconURL();
    json.splashURL = this.splashURL();
    json.discoverySplashURL = this.discoverySplashURL();
    json.bannerURL = this.bannerURL();
    return json;
  }

  /**
   * The voice state adapter for this guild that can be used with @discordjs/voice to play audio in voice
   * and stage channels.
   * @type {Function}
   * @readonly
   * @example
   * const { joinVoiceChannel } = require('@discordjs/voice');
   * const voiceConnection = joinVoiceChannel({
   *  channelId: channel.id,
   *  guildId: channel.guild.id,
   *  adapterCreator: channel.guild.voiceAdapterCreator,
   * });
   */
  get voiceAdapterCreator() {
    return methods => {
      this.client.voice.adapters.set(this.id, methods);
      return {
        sendPayload: data => {
          if (this.shard.status !== Status.READY) return false;
          this.shard.send(data);
          return true;
        },
        destroy: () => {
          this.client.voice.adapters.delete(this.id);
        },
      };
    };
  }

  /**
   * Creates a collection of this guild's roles, sorted by their position and ids.
   * @returns {Collection<Snowflake, Role>}
   * @private
   */
  _sortedRoles() {
    return Util.discordSort(this.roles.cache);
  }

  /**
   * Creates a collection of this guild's or a specific category's channels, sorted by their position and ids.
   * @param {GuildChannel} [channel] Category to get the channels of
   * @returns {Collection<Snowflake, GuildChannel>}
   * @private
   */
  _sortedChannels(channel) {
    const category = channel.type === ChannelTypes.GUILD_CATEGORY;
    return Util.discordSort(
      this.channels.cache.filter(
        c =>
          (['GUILD_TEXT', 'GUILD_NEWS', 'GUILD_STORE'].includes(channel.type)
            ? ['GUILD_TEXT', 'GUILD_NEWS', 'GUILD_STORE'].includes(c.type)
            : c.type === channel.type) &&
          (category || c.parent === channel.parent),
      ),
    );
  }
}

module.exports = Guild;

/**
 * @external APIGuild
 * @see {@link https://discord.com/developers/docs/resources/guild#guild-object}
 */
