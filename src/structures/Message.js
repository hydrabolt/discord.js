'use strict';

const Base = require('./Base');
const BaseMessageComponent = require('./BaseMessageComponent');
const ClientApplication = require('./ClientApplication');
const InteractionCollector = require('./InteractionCollector');
const MessageAttachment = require('./MessageAttachment');
const Embed = require('./MessageEmbed');
const Mentions = require('./MessageMentions');
const MessagePayload = require('./MessagePayload');
const ReactionCollector = require('./ReactionCollector');
const Sticker = require('./Sticker');
const { Error } = require('../errors');
const ReactionManager = require('../managers/ReactionManager');
const Collection = require('../util/Collection');
const { InteractionTypes, MessageTypes, SystemMessageTypes } = require('../util/Constants');
const MessageFlags = require('../util/MessageFlags');
const Permissions = require('../util/Permissions');
const SnowflakeUtil = require('../util/SnowflakeUtil');
const Util = require('../util/Util');

/**
 * Represents a message on Discord.
 * @extends {Base}
 */
class Message extends Base {
  /**
   * @param {Client} client The instantiating client
   * @param {APIMessage} data The data for the message
   * @param {TextChannel|DMChannel|NewsChannel|ThreadChannel} channel The channel the message was sent in
   */
  constructor(client, data, channel) {
    super(client);

    /**
     * The channel that the message was sent in
     * @type {TextChannel|DMChannel|NewsChannel|ThreadChannel}
     */
    this.channel = channel;

    /**
     * Whether this message has been deleted
     * @type {boolean}
     */
    this.deleted = false;

    if (data) this._patch(data);
  }

  _patch(data, partial = false) {
    /**
     * The message's id
     * @type {Snowflake}
     */
    this.id = data.id;

    if ('type' in data) {
      /**
       * The type of the message
       * @type {?MessageType}
       */
      this.type = MessageTypes[data.type];

      /**
       * Whether or not this message was sent by Discord, not actually a user (e.g. pin notifications)
       * @type {?boolean}
       */
      this.system = SystemMessageTypes.includes(this.type);
    } else if (typeof this.type !== 'string') {
      this.system = null;
      this.type = null;
    }

    if ('content' in data) {
      /**
       * The content of the message
       * @type {?string}
       */
      this.content = data.content;
    } else if (typeof this.content !== 'string') {
      this.content = null;
    }

    if ('author' in data) {
      /**
       * The author of the message
       * @type {?User}
       */
      this.author = this.client.users._add(data.author, !data.webhook_id);
    } else if (!this.author) {
      this.author = null;
    }

    if ('pinned' in data) {
      /**
       * Whether or not this message is pinned
       * @type {?boolean}
       */
      this.pinned = Boolean(data.pinned);
    } else if (typeof this.pinned !== 'boolean') {
      this.pinned = null;
    }

    if ('thread' in data) {
      /**
       * The thread started by this message
       * @type {?ThreadChannel}
       */
      this.thread = this.client.channels._add(data.thread);
    } else if (!this.thread) {
      this.thread = null;
    }

    if ('tts' in data) {
      /**
       * Whether or not the message was Text-To-Speech
       * @type {?boolean}
       */
      this.tts = data.tts;
    } else if (typeof this.tts !== 'boolean') {
      this.tts = null;
    }

    /**
     * A random number or string used for checking message delivery
     * <warn>This is only received after the message was sent successfully, and
     * lost if re-fetched</warn>
     * @type {?string}
     */
    this.nonce = partial ? this.nonce : 'nonce' in data ? data.nonce : null;

    /**
     * A list of embeds in the message - e.g. YouTube Player
     * @type {MessageEmbed[]}
     */
    this.embeds = data.embeds?.map(e => new Embed(e, true)) ?? (partial ? this.embeds.slice() : []);

    /**
     * A list of MessageActionRows in the message
     * @type {MessageActionRow[]}
     */
    this.components =
      data.components?.map(c => BaseMessageComponent.create(c, this.client)) ??
      (partial ? this.components.slice() : []);

    /**
     * A collection of attachments in the message - e.g. Pictures - mapped by their ids
     * @type {Collection<Snowflake, MessageAttachment>}
     */
    this.attachments =
      partial && !data.attachments && this.attachments ? new Collection(this.attachments) : new Collection();
    if (data.attachments) {
      for (const attachment of data.attachments) {
        this.attachments.set(attachment.id, new MessageAttachment(attachment.url, attachment.filename, attachment));
      }
    }

    /**
     * A collection of stickers in the message
     * @type {Collection<Snowflake, Sticker>}
     */
    this.stickers = partial && this.stickers ? new Collection(this.stickers) : new Collection();
    if (data.stickers) {
      for (const sticker of data.stickers) {
        this.stickers.set(sticker.id, new Sticker(this.client, sticker));
      }
    }

    /**
     * The timestamp the message was sent at
     * @type {number}
     */
    this.createdTimestamp = SnowflakeUtil.deconstruct(this.id).timestamp;

    /**
     * The timestamp the message was last edited at (if applicable)
     * @type {?number}
     */
    this.editedTimestamp = data.edited_timestamp ? new Date(data.edited_timestamp).getTime() : null;

    /**
     * A manager of the reactions belonging to this message
     * @type {ReactionManager}
     */
    this.reactions = partial && this.reactions ? this.reactions : new ReactionManager(this);
    if (data.reactions?.length > 0) {
      for (const reaction of data.reactions) {
        this.reactions._add(reaction);
      }
    }

    if (partial) {
      this.mentions = new Mentions(
        this,
        data.mentions ?? this.mentions.users,
        data.mention_roles ?? this.mentions.roles,
        data.mention_everyone ?? this.mentions.everyone,
        data.mention_channels ?? this.mentions.crosspostedChannels,
        data.referenced_message?.author ?? this.mentions.repliedUser,
      );
    } else {
      /**
       * All valid mentions that the message contains
       * @type {MessageMentions}
       */
      this.mentions = new Mentions(
        this,
        data.mentions,
        data.mention_roles,
        data.mention_everyone,
        data.mention_channels,
        data.referenced_message?.author,
      );
    }

    /**
     * The id of the webhook that sent the message, if applicable
     * @type {?Snowflake}
     */
    this.webhookId = partial && this.webhookId ? this.webhookId : data.webhook_id ?? null;

    /**
     * Supplemental application information for group activities
     * @type {?ClientApplication}
     */
    this.groupActivityApplication =
      partial && this.groupActivityApplication
        ? this.groupActivityApplication
        : data.application
        ? new ClientApplication(this.client, data.application)
        : null;

    /**
     * The id of the application of the interaction that sent this message, if any
     * @type {?Snowflake}
     */
    this.applicationId = partial && this.applicationId ? this.applicationId : data.application_id ?? null;

    /**
     * Group activity
     * @type {?MessageActivity}
     */
    this.activity =
      partial && this.activity
        ? this.activity
        : data.activity
        ? {
            partyId: data.activity.party_id,
            type: data.activity.type,
          }
        : null;

    if (this.member && data.member) {
      this.member._patch(data.member);
    } else if (data.member && this.guild && this.author) {
      this.guild.members._add(Object.assign(data.member, { user: this.author }));
    }

    /**
     * Flags that are applied to the message
     * @type {Readonly<MessageFlags>}
     */
    this.flags = new MessageFlags(partial ? data.flags ?? this.flags : data.flags).freeze();

    /**
     * Reference data sent in a message that contains ids identifying the referenced message
     * @typedef {Object} MessageReference
     * @property {string} channelId The channel's id the message was referenced
     * @property {?string} guildId The guild's id the message was referenced
     * @property {?string} messageId The message's id that was referenced
     */

    /**
     * Message reference data
     * @type {?MessageReference}
     */
    this.reference =
      partial && this.reference
        ? this.reference
        : data.message_reference
        ? {
            channelId: data.message_reference.channel_id,
            guildId: data.message_reference.guild_id,
            messageId: data.message_reference.message_id,
          }
        : null;

    if (data.referenced_message) {
      this.channel.messages._add(data.referenced_message);
    }

    /**
     * Partial data of the interaction that a message is a reply to
     * @typedef {Object} MessageInteraction
     * @property {Snowflake} id The interaction's id
     * @property {InteractionType} type The type of the interaction
     * @property {string} commandName The name of the interaction's application command
     * @property {User} user The user that invoked the interaction
     */

    if (data.interaction) {
      /**
       * Partial data of the interaction that this message is a reply to
       * @type {?MessageInteraction}
       */
      this.interaction = {
        id: data.interaction.id,
        type: InteractionTypes[data.interaction.type],
        commandName: data.interaction.name,
        user: this.client.users._add(data.interaction.user),
      };
    } else if (!this.interaction) {
      this.interaction = null;
    }
  }

  _update(data, partial = false) {
    const clone = this._clone();
    this._patch(data, partial);
    return clone;
  }

  /**
   * Whether or not this message is a partial
   * @type {boolean}
   * @readonly
   */
  get partial() {
    return typeof this.content !== 'string' || !this.author;
  }

  /**
   * Represents the author of the message as a guild member.
   * Only available if the message comes from a guild where the author is still a member
   * @type {?GuildMember}
   * @readonly
   */
  get member() {
    return this.guild?.members.resolve(this.author) ?? null;
  }

  /**
   * The time the message was sent at
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /**
   * The time the message was last edited at (if applicable)
   * @type {?Date}
   * @readonly
   */
  get editedAt() {
    return this.editedTimestamp ? new Date(this.editedTimestamp) : null;
  }

  /**
   * The guild the message was sent in (if in a guild channel)
   * @type {?Guild}
   * @readonly
   */
  get guild() {
    return this.channel.guild ?? null;
  }

  /**
   * The url to jump to this message
   * @type {string}
   * @readonly
   */
  get url() {
    return `https://discord.com/channels/${this.guild ? this.guild.id : '@me'}/${this.channel.id}/${this.id}`;
  }

  /**
   * The message contents with all mentions replaced by the equivalent text.
   * If mentions cannot be resolved to a name, the relevant mention in the message content will not be converted.
   * @type {string}
   * @readonly
   */
  get cleanContent() {
    // eslint-disable-next-line eqeqeq
    return this.content != null ? Util.cleanContent(this.content, this.channel) : null;
  }

  /**
   * Creates a reaction collector.
   * @param {ReactionCollectorOptions} [options={}] Options to send to the collector
   * @returns {ReactionCollector}
   * @example
   * // Create a reaction collector
   * const filter = (reaction, user) => reaction.emoji.name === '👌' && user.id === 'someId';
   * const collector = message.createReactionCollector({ filter, time: 15000 });
   * collector.on('collect', r => console.log(`Collected ${r.emoji.name}`));
   * collector.on('end', collected => console.log(`Collected ${collected.size} items`));
   */
  createReactionCollector(options = {}) {
    return new ReactionCollector(this, options);
  }

  /**
   * An object containing the same properties as CollectorOptions, but a few more:
   * @typedef {ReactionCollectorOptions} AwaitReactionsOptions
   * @property {string[]} [errors] Stop/end reasons that cause the promise to reject
   */

  /**
   * Similar to createReactionCollector but in promise form.
   * Resolves with a collection of reactions that pass the specified filter.
   * @param {AwaitReactionsOptions} [options={}] Optional options to pass to the internal collector
   * @returns {Promise<Collection<string, MessageReaction>>}
   * @example
   * // Create a reaction collector
   * const filter = (reaction, user) => reaction.emoji.name === '👌' && user.id === 'someId'
   * message.awaitReactions({ filter, time: 15000 })
   *   .then(collected => console.log(`Collected ${collected.size} reactions`))
   *   .catch(console.error);
   */
  awaitReactions(options = {}) {
    return new Promise((resolve, reject) => {
      const collector = this.createReactionCollector(options);
      collector.once('end', (reactions, reason) => {
        if (options.errors?.includes(reason)) reject(reactions);
        else resolve(reactions);
      });
    });
  }

  /**
   * @typedef {CollectorOptions} MessageComponentCollectorOptions
   * @property {MessageComponentType} [componentType] The type of component to listen for
   * @property {number} [max] The maximum total amount of interactions to collect
   * @property {number} [maxComponents] The maximum number of components to collect
   * @property {number} [maxUsers] The maximum number of users to interact
   */

  /**
   * Creates a message component interaction collector.
   * @param {MessageComponentCollectorOptions} [options={}] Options to send to the collector
   * @returns {InteractionCollector}
   * @example
   * // Create a message component interaction collector
   * const filter = (interaction) => interaction.customId === 'button' && interaction.user.id === 'someId';
   * const collector = message.createMessageComponentCollector({ filter, time: 15000 });
   * collector.on('collect', i => console.log(`Collected ${i.customId}`));
   * collector.on('end', collected => console.log(`Collected ${collected.size} items`));
   */
  createMessageComponentCollector(options = {}) {
    return new InteractionCollector(this.client, {
      ...options,
      interactionType: InteractionTypes.MESSAGE_COMPONENT,
      message: this,
    });
  }

  /**
   * An object containing the same properties as CollectorOptions, but a few more:
   * @typedef {Object} AwaitMessageComponentOptions
   * @property {CollectorFilter} [filter] The filter applied to this collector
   * @property {number} [time] Time to wait for an interaction before rejecting
   * @property {MessageComponentType} [componentType] The type of component interaction to collect
   */

  /**
   * Collects a single component interaction that passes the filter.
   * The Promise will reject if the time expires.
   * @param {AwaitMessageComponentOptions} [options={}] Options to pass to the internal collector
   * @returns {Promise<MessageComponentInteraction>}
   * @example
   * // Collect a message component interaction
   * const filter = (interaction) => interaction.customId === 'button' && interaction.user.id === 'someId';
   * message.awaitMessageComponent({ filter, time: 15000 })
   *   .then(interaction => console.log(`${interaction.customId} was clicked!`))
   *   .catch(console.error);
   */
  awaitMessageComponent(options = {}) {
    const _options = { ...options, max: 1 };
    return new Promise((resolve, reject) => {
      const collector = this.createMessageComponentCollector(_options);
      collector.once('end', (interactions, reason) => {
        const interaction = interactions.first();
        if (interaction) resolve(interaction);
        else reject(new Error('INTERACTION_COLLECTOR_ERROR', reason));
      });
    });
  }

  /**
   * Whether the message is editable by the client user
   * @type {boolean}
   * @readonly
   */
  get editable() {
    return this.author.id === this.client.user.id;
  }

  /**
   * Whether the message is deletable by the client user
   * @type {boolean}
   * @readonly
   */
  get deletable() {
    return Boolean(
      !this.deleted &&
        (this.author.id === this.client.user.id ||
          this.channel.permissionsFor?.(this.client.user)?.has(Permissions.FLAGS.MANAGE_MESSAGES)),
    );
  }

  /**
   * Whether the message is pinnable by the client user
   * @type {boolean}
   * @readonly
   */
  get pinnable() {
    return (
      this.type === 'DEFAULT' &&
      (!this.guild || this.channel.permissionsFor(this.client.user).has(Permissions.FLAGS.MANAGE_MESSAGES, false))
    );
  }

  /**
   * Fetches the Message this crosspost/reply/pin-add references, if available to the client
   * @returns {Promise<Message>}
   */
  async fetchReference() {
    if (!this.reference) throw new Error('MESSAGE_REFERENCE_MISSING');
    const { channelId, messageId } = this.reference;
    const channel = this.client.channels.resolve(channelId);
    if (!channel) throw new Error('GUILD_CHANNEL_RESOLVE');
    const message = await channel.messages.fetch(messageId);
    return message;
  }

  /**
   * Whether the message is crosspostable by the client user
   * @type {boolean}
   * @readonly
   */
  get crosspostable() {
    return (
      this.channel.type === 'news' &&
      !this.flags.has(MessageFlags.FLAGS.CROSSPOSTED) &&
      this.type === 'DEFAULT' &&
      this.channel.viewable &&
      this.channel.permissionsFor(this.client.user).has(Permissions.FLAGS.SEND_MESSAGES) &&
      (this.author.id === this.client.user.id ||
        this.channel.permissionsFor(this.client.user).has(Permissions.FLAGS.MANAGE_MESSAGES))
    );
  }

  /**
   * Options that can be passed into {@link Message#edit}.
   * @typedef {Object} MessageEditOptions
   * @property {?string} [content] Content to be edited
   * @property {MessageEmbed[]|APIEmbed[]} [embeds] Embeds to be added/edited
   * @property {MessageMentionOptions} [allowedMentions] Which mentions should be parsed from the message content
   * @property {MessageFlags} [flags] Which flags to set for the message. Only `SUPPRESS_EMBEDS` can be edited.
   * @property {MessageAttachment[]} [attachments] An array of attachments to keep,
   * all attachments will be kept if omitted
   * @property {FileOptions[]|BufferResolvable[]|MessageAttachment[]} [files] Files to add to the message
   * @property {MessageActionRow[]|MessageActionRowOptions[]|MessageActionRowComponentResolvable[][]} [components]
   * Action rows containing interactive components for the message (buttons, select menus)
   */

  /**
   * Edits the content of the message.
   * @param {string|MessagePayload|MessageEditOptions} options The options to provide
   * @returns {Promise<Message>}
   * @example
   * // Update the content of a message
   * message.edit('This is my new content!')
   *   .then(msg => console.log(`Updated the content of a message to ${msg.content}`))
   *   .catch(console.error);
   */
  edit(options) {
    return this.channel.messages.edit(this, options);
  }

  /**
   * Publishes a message in an announcement channel to all channels following it.
   * @returns {Promise<Message>}
   * @example
   * // Crosspost a message
   * if (message.channel.type === 'news') {
   *   message.crosspost()
   *     .then(() => console.log('Crossposted message'))
   *     .catch(console.error);
   * }
   */
  crosspost() {
    return this.channel.messages.crosspost(this.id);
  }

  /**
   * Pins this message to the channel's pinned messages.
   * @returns {Promise<Message>}
   * @example
   * // Pin a message
   * message.pin()
   *   .then(console.log)
   *   .catch(console.error)
   */
  pin() {
    return this.channel.messages.pin(this.id).then(() => this);
  }

  /**
   * Unpins this message from the channel's pinned messages.
   * @returns {Promise<Message>}
   * @example
   * // Unpin a message
   * message.unpin()
   *   .then(console.log)
   *   .catch(console.error)
   */
  unpin() {
    return this.channel.messages.unpin(this.id).then(() => this);
  }

  /**
   * Adds a reaction to the message.
   * @param {EmojiIdentifierResolvable} emoji The emoji to react with
   * @returns {Promise<MessageReaction>}
   * @example
   * // React to a message with a unicode emoji
   * message.react('🤔')
   *   .then(console.log)
   *   .catch(console.error);
   * @example
   * // React to a message with a custom emoji
   * message.react(message.guild.emojis.cache.get('123456789012345678'))
   *   .then(console.log)
   *   .catch(console.error);
   */
  async react(emoji) {
    emoji = this.client.emojis.resolveIdentifier(emoji);
    await this.channel.messages.react(this.id, emoji);
    return this.client.actions.MessageReactionAdd.handle({
      user: this.client.user,
      channel: this.channel,
      message: this,
      emoji: Util.parseEmoji(emoji),
    }).reaction;
  }

  /**
   * Deletes the message.
   * @returns {Promise<Message>}
   * @example
   * // Delete a message
   * message.delete()
   *   .then(msg => console.log(`Deleted message from ${msg.author.username}`))
   *   .catch(console.error);
   */
  async delete() {
    await this.channel.messages.delete(this.id);
    return this;
  }

  /**
   * Options provided when sending a message as an inline reply.
   * @typedef {BaseMessageOptions} ReplyMessageOptions
   * @property {boolean} [failIfNotExists=true] Whether to error if the referenced message
   * does not exist (creates a standard message in this case when false)
   */

  /**
   * Send an inline reply to this message.
   * @param {string|MessagePayload|ReplyMessageOptions} options The options to provide
   * @returns {Promise<Message|Message[]>}
   * @example
   * // Reply to a message
   * message.reply('This is a reply!')
   *   .then(() => console.log(`Replied to message "${message.content}"`))
   *   .catch(console.error);
   */
  reply(options) {
    let data;

    if (options instanceof MessagePayload) {
      data = options;
    } else {
      data = MessagePayload.create(this, options, {
        reply: {
          messageReference: this,
          failIfNotExists: options?.failIfNotExists ?? this.client.options.failIfNotExists,
        },
      });
    }
    return this.channel.send(data);
  }

  /**
   * Create a new public thread from this message
   * @see ThreadManager#create
   * @param {string} name The name of the new Thread
   * @param {ThreadAutoArchiveDuration} autoArchiveDuration How long before the thread is automatically archived
   * @param {string} [reason] Reason for creating the thread
   * @returns {Promise<ThreadChannel>}
   */
  startThread(name, autoArchiveDuration, reason) {
    if (!['text', 'news'].includes(this.channel.type)) {
      return Promise.reject(new Error('MESSAGE_THREAD_PARENT'));
    }
    return this.channel.threads.create({ name, autoArchiveDuration, startMessage: this, reason });
  }

  /**
   * Fetch this message.
   * @param {boolean} [force=false] Whether to skip the cache check and request the API
   * @returns {Promise<Message>}
   */
  fetch(force = false) {
    return this.channel.messages.fetch(this.id, true, force);
  }

  /**
   * Fetches the webhook used to create this message.
   * @returns {Promise<?Webhook>}
   */
  fetchWebhook() {
    if (!this.webhookId) return Promise.reject(new Error('WEBHOOK_MESSAGE'));
    return this.client.fetchWebhook(this.webhookId);
  }

  /**
   * Suppresses or unsuppresses embeds on a message.
   * @param {boolean} [suppress=true] If the embeds should be suppressed or not
   * @returns {Promise<Message>}
   */
  suppressEmbeds(suppress = true) {
    const flags = new MessageFlags(this.flags.bitfield);

    if (suppress) {
      flags.add(MessageFlags.FLAGS.SUPPRESS_EMBEDS);
    } else {
      flags.remove(MessageFlags.FLAGS.SUPPRESS_EMBEDS);
    }

    return this.edit({ flags });
  }

  /**
   * Removes the attachments from this message.
   * @returns {Promise<Message>}
   */
  removeAttachments() {
    return this.edit({ attachments: [] });
  }

  /**
   * Used mainly internally. Whether two messages are identical in properties. If you want to compare messages
   * without checking all the properties, use `message.id === message2.id`, which is much more efficient. This
   * method allows you to see if there are differences in content, embeds, attachments, nonce and tts properties.
   * @param {Message} message The message to compare it to
   * @param {APIMessage} rawData Raw data passed through the WebSocket about this message
   * @returns {boolean}
   */
  equals(message, rawData) {
    if (!message) return false;
    const embedUpdate = !message.author && !message.attachments;
    if (embedUpdate) return this.id === message.id && this.embeds.length === message.embeds.length;

    let equal =
      this.id === message.id &&
      this.author.id === message.author.id &&
      this.content === message.content &&
      this.tts === message.tts &&
      this.nonce === message.nonce &&
      this.embeds.length === message.embeds.length &&
      this.attachments.length === message.attachments.length;

    if (equal && rawData) {
      equal =
        this.mentions.everyone === message.mentions.everyone &&
        this.createdTimestamp === new Date(rawData.timestamp).getTime() &&
        this.editedTimestamp === new Date(rawData.edited_timestamp).getTime();
    }

    return equal;
  }

  /**
   * When concatenated with a string, this automatically concatenates the message's content instead of the object.
   * @returns {string}
   * @example
   * // Logs: Message: This is a message!
   * console.log(`Message: ${message}`);
   */
  toString() {
    return this.content;
  }

  toJSON() {
    return super.toJSON({
      channel: 'channelId',
      author: 'authorId',
      groupActivityApplication: 'groupActivityApplicationId',
      guild: 'guildId',
      cleanContent: true,
      member: false,
      reactions: false,
    });
  }
}

module.exports = Message;
