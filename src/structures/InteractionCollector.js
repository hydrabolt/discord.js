'use strict';

const Collector = require('./interfaces/Collector');
const Collection = require('../util/Collection');
const { Events } = require('../util/Constants');
const { InteractionTypes, MessageComponentTypes } = require('../util/Constants');

/**
 * @typedef {CollectorOptions} InteractionCollectorOptions
 * @property {TextChannel|DMChannel|NewsChannel} [channel] The channel to listen to interactions from
 * @property {MessageComponentType} [componentType] The type of component to listen for
 * @property {Guild} [guild] The guild to listen to interactions from
 * @property {InteractionType} [interactionType] The type of interaction to listen for
 * @property {number} [max] The maximum total amount of interactions to collect
 * @property {number} [maxComponents] The maximum number of components to collect
 * @property {number} [maxUsers] The maximum number of users to interact
 * @property {Message|APIMessage} [message] The message to listen to interactions from
 */

/**
 * Collects interactions.
 * Will automatically stop if the message (`'messageDelete'`),
 * channel (`'channelDelete'`), or guild (`'guildDelete'`) are deleted.
 * @extends {Collector}
 */
class InteractionCollector extends Collector {
  /**
   * @param {Client} client The client on which to collect interactions
   * @param {InteractionCollectorOptions} [options={}] The options to apply to this collector
   */
  constructor(client, options = {}) {
    super(client, options);

    /**
     * The message from which to collect interactions, if provided
     * @type {?Snowflake}
     */
    this.messageId = options.message?.id;

    /**
     * The channel from which to collect interactions, if provided
     * @type {?Snowflake}
     */
    this.channelId =
      this.client.channels.resolveId(options.message?.channel) ??
      options.message?.channel_id ??
      this.client.channels.resolveId(options.channel);

    /**
     * The guild from which to collect interactions, if provided
     * @type {?Snowflake}
     */
    this.guildId =
      this.client.guilds.resolveId(options.message?.guild) ??
      options.message?.guild_id ??
      this.client.guilds.resolveId(options.channel?.guild) ??
      this.client.guilds.resolveId(options.guild);

    /**
     * The the type of interaction to collect
     * @type {?InteractionType}
     */
    this.interactionType =
      typeof options.interactionType === 'number'
        ? InteractionTypes[options.interactionType]
        : options.interactionType ?? null;

    /**
     * The the type of component to collect
     * @type {?MessageComponentType}
     */
    this.componentType =
      typeof options.componentType === 'number'
        ? MessageComponentTypes[options.componentType]
        : options.componentType ?? null;

    /**
     * The users which have interacted to this collector
     * @type {Collection}
     */
    this.users = new Collection();

    /**
     * The total number of interactions collected
     * @type {number}
     */
    this.total = 0;

    this.empty = this.empty.bind(this);
    this.client.incrementMaxListeners();

    if (this.messageId) {
      this._handleMessageDeletion = this._handleMessageDeletion.bind(this);
      this.client.on(Events.MESSAGE_DELETE, this._handleMessageDeletion);
    }

    if (this.channelId) {
      this._handleChannelDeletion = this._handleChannelDeletion.bind(this);
      this.client.on(Events.CHANNEL_DELETE, this._handleChannelDeletion);
    }

    if (this.guildId) {
      this._handleGuildDeletion = this._handleGuildDeletion.bind(this);
      this.client.on(Events.GUILD_DELETE, this._handleGuildDeletion);
    }

    this.client.on(Events.INTERACTION_CREATE, this.handleCollect);

    this.once('end', () => {
      this.client.removeListener(Events.INTERACTION_CREATE, this.handleCollect);
      this.client.removeListener(Events.MESSAGE_DELETE, this._handleMessageDeletion);
      this.client.removeListener(Events.CHANNEL_DELETE, this._handleChannelDeletion);
      this.client.removeListener(Events.GUILD_DELETE, this._handleGuildDeletion);
      this.client.decrementMaxListeners();
    });

    this.on('collect', interaction => {
      this.total++;
      this.users.set(interaction.user.id, interaction.user);
    });
  }

  /**
   * Handles an incoming interaction for possible collection.
   * @param {Interaction} interaction The interaction to possibly collect
   * @returns {?Snowflake}
   * @private
   */
  collect(interaction) {
    /**
     * Emitted whenever a interaction is collected.
     * @event InteractionCollector#collect
     * @param {Interaction} interaction The interaction that was collected
     */
    if (this.interactionType && interaction.type !== this.interactionType) return null;
    if (this.componentType && interaction.componentType !== this.componentType) return null;
    if (this.messageId && interaction.message?.id !== this.messageId) return null;
    if (this.channelId && interaction.channelId !== this.channelId) return null;
    if (this.guildId && interaction.guildId !== this.guildId) return null;

    return interaction.id;
  }

  /**
   * Handles an interaction for possible disposal.
   * @param {Interaction} interaction The interaction that could be disposed of
   * @returns {?Snowflake}
   */
  dispose(interaction) {
    /**
     * Emitted whenever an interaction is disposed of.
     * @event InteractionCollector#dispose
     * @param {Interaction} interaction The interaction that was disposed of
     */
    if (this.type && interaction.type !== this.type) return null;
    if (this.componentType && interaction.componentType !== this.componentType) return null;
    if (this.messageId && interaction.message?.id !== this.messageId) return null;
    if (this.channelId && interaction.channelId !== this.channelId) return null;
    if (this.guildId && interaction.guildId !== this.guildId) return null;

    return interaction.id;
  }

  /**
   * Empties this interaction collector.
   */
  empty() {
    this.total = 0;
    this.collected.clear();
    this.users.clear();
    this.checkEnd();
  }

  /**
   * The reason this collector has ended with, or null if it hasn't ended yet
   * @type {?string}
   * @readonly
   */
  get endReason() {
    if (this.options.max && this.total >= this.options.max) return 'limit';
    if (this.options.maxComponents && this.collected.size >= this.options.maxComponents) return 'componentLimit';
    if (this.options.maxUsers && this.users.size >= this.options.maxUsers) return 'userLimit';
    return null;
  }

  /**
   * Handles checking if the message has been deleted, and if so, stops the collector with the reason 'messageDelete'.
   * @private
   * @param {Message} message The message that was deleted
   * @returns {void}
   */
  _handleMessageDeletion(message) {
    if (message.id === this.messageId) {
      this.stop('messageDelete');
    }
  }

  /**
   * Handles checking if the channel has been deleted, and if so, stops the collector with the reason 'channelDelete'.
   * @private
   * @param {GuildChannel} channel The channel that was deleted
   * @returns {void}
   */
  _handleChannelDeletion(channel) {
    if (channel.id === this.channelId) {
      this.stop('channelDelete');
    }
  }

  /**
   * Handles checking if the guild has been deleted, and if so, stops the collector with the reason 'guildDelete'.
   * @private
   * @param {Guild} guild The guild that was deleted
   * @returns {void}
   */
  _handleGuildDeletion(guild) {
    if (guild.id === this.guildId) {
      this.stop('guildDelete');
    }
  }
}

module.exports = InteractionCollector;
