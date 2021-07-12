'use strict';

/* eslint-disable import/order */
const MessageCollector = require('../MessageCollector');
const MessagePayload = require('../MessagePayload');
const SnowflakeUtil = require('../../util/SnowflakeUtil');
const Collection = require('../../util/Collection');
const { InteractionTypes } = require('../../util/Constants');
const { RangeError, TypeError, Error } = require('../../errors');
const InteractionCollector = require('../InteractionCollector');

/**
 * Interface for classes that have text-channel-like features.
 * @interface
 */
class TextBasedChannel {
  constructor() {
    /**
     * A manager of the messages sent to this channel
     * @type {MessageManager}
     */
    this.messages = new MessageManager(this);

    /**
     * The channel's last message id, if one was sent
     * @type {?Snowflake}
     */
    this.lastMessageId = null;

    /**
     * The timestamp when the last pinned message was pinned, if there was one
     * @type {?number}
     */
    this.lastPinTimestamp = null;
  }

  /**
   * The Message object of the last message in the channel, if one was sent
   * @type {?Message}
   * @readonly
   */
  get lastMessage() {
    return this.messages.resolve(this.lastMessageId);
  }

  /**
   * The date when the last pinned message was pinned, if there was one
   * @type {?Date}
   * @readonly
   */
  get lastPinAt() {
    return this.lastPinTimestamp ? new Date(this.lastPinTimestamp) : null;
  }

  /**
   * Base options provided when sending.
   * @typedef {Object} BaseMessageOptions
   * @property {boolean} [tts=false] Whether or not the message should be spoken aloud
   * @property {string} [nonce=''] The nonce for the message
   * @property {string} [content=''] The content for the message
   * @property {MessageEmbed[]|APIEmbed[]} [embeds] The embeds for the message
   * (see [here](https://discord.com/developers/docs/resources/channel#embed-object) for more details)
   * @property {MessageMentionOptions} [allowedMentions] Which mentions should be parsed from the message content
   * (see [here](https://discord.com/developers/docs/resources/channel#allowed-mentions-object) for more details)
   * @property {FileOptions[]|BufferResolvable[]|MessageAttachment[]} [files] Files to send with the message
   * @property {MessageActionRow[]|MessageActionRowOptions[]} [components]
   * Action rows containing interactive components for the message (buttons, select menus)
   * @property {StickerResolvable[]} [stickers=[]] Stickers to send in the message
   */

  /**
   * Options provided when sending or editing a message.
   * @typedef {BaseMessageOptions} MessageOptions
   * @property {ReplyOptions} [reply] The options for replying to a message
   */

  /**
   * Options provided to control parsing of mentions by Discord
   * @typedef {Object} MessageMentionOptions
   * @property {MessageMentionTypes[]} [parse] Types of mentions to be parsed
   * @property {Snowflake[]} [users] Snowflakes of Users to be parsed as mentions
   * @property {Snowflake[]} [roles] Snowflakes of Roles to be parsed as mentions
   * @property {boolean} [repliedUser=true] Whether the author of the Message being replied to should be pinged
   */

  /**
   * Types of mentions to enable in MessageMentionOptions.
   * - `roles`
   * - `users`
   * - `everyone`
   * @typedef {string} MessageMentionTypes
   */

  /**
   * @typedef {Object} FileOptions
   * @property {BufferResolvable} attachment File to attach
   * @property {string} [name='file.jpg'] Filename of the attachment
   */

  /**
   * Options for sending a message with a reply.
   * @typedef {Object} ReplyOptions
   * @param {MessageResolvable} messageReference The message to reply to (must be in the same channel and not system)
   * @param {boolean} [failIfNotExists=true] Whether to error if the referenced message
   * does not exist (creates a standard message in this case when false)
   */

  /**
   * Sends a message to this channel.
   * @param {string|MessagePayload|MessageOptions} options The options to provide
   * @returns {Promise<Message>}
   * @example
   * // Send a basic message
   * channel.send('hello!')
   *   .then(message => console.log(`Sent message: ${message.content}`))
   *   .catch(console.error);
   * @example
   * // Send a remote file
   * channel.send({
   *   files: ['https://cdn.discordapp.com/icons/222078108977594368/6e1019b3179d71046e463a75915e7244.png?size=2048']
   * })
   *   .then(console.log)
   *   .catch(console.error);
   * @example
   * // Send a local file
   * channel.send({
   *   files: [{
   *     attachment: 'entire/path/to/file.jpg',
   *     name: 'file.jpg'
   *   }]
   * })
   *   .then(console.log)
   *   .catch(console.error);
   * @example
   * // Send an embed with a local image inside
   * channel.send({
   *   content: 'This is an embed',
   *   embeds: [
   *     {
   *       thumbnail: {
   *         url: 'attachment://file.jpg'
   *       }
   *     }
   *   ],
   *   files: [{
   *     attachment: 'entire/path/to/file.jpg',
   *     name: 'file.jpg'
   *   }]
   * })
   *   .then(console.log)
   *   .catch(console.error);
   */
  async send(options) {
    const User = require('../User');
    const GuildMember = require('../GuildMember');

    if (this instanceof User || this instanceof GuildMember) {
      return this.createDM().then(dm => dm.send(options));
    }

    let messagePayload;

    if (options instanceof MessagePayload) {
      messagePayload = options.resolveData();
    } else {
      messagePayload = MessagePayload.create(this, options).resolveData();
    }

    const { data, files } = await messagePayload.resolveFiles();
    return this.client.api.channels[this.id].messages
      .post({ data, files })
      .then(d => this.client.actions.MessageCreate.handle(d).message);
  }

  /**
   * Starts a typing indicator in the channel.
   * @param {number} [count=1] The number of times startTyping should be considered to have been called
   * @returns {Promise} Resolves once the bot stops typing gracefully, or rejects when an error occurs
   * @example
   * // Start typing in a channel, or increase the typing count by one
   * channel.startTyping();
   * @example
   * // Start typing in a channel with a typing count of five, or set it to five
   * channel.startTyping(5);
   */
  startTyping(count) {
    if (typeof count !== 'undefined' && count < 1) throw new RangeError('TYPING_COUNT');
    if (this.client.user._typing.has(this.id)) {
      const entry = this.client.user._typing.get(this.id);
      entry.count = count ?? entry.count + 1;
      return entry.promise;
    }

    const entry = {};
    entry.promise = new Promise((resolve, reject) => {
      const endpoint = this.client.api.channels[this.id].typing;
      Object.assign(entry, {
        count: count ?? 1,
        interval: this.client.setInterval(() => {
          endpoint.post().catch(error => {
            this.client.clearInterval(entry.interval);
            this.client.user._typing.delete(this.id);
            reject(error);
          });
        }, 9000),
        resolve,
      });
      endpoint.post().catch(error => {
        this.client.clearInterval(entry.interval);
        this.client.user._typing.delete(this.id);
        reject(error);
      });
      this.client.user._typing.set(this.id, entry);
    });
    return entry.promise;
  }

  /**
   * Stops the typing indicator in the channel.
   * The indicator will only stop if this is called as many times as startTyping().
   * <info>It can take a few seconds for the client user to stop typing.</info>
   * @param {boolean} [force=false] Whether or not to reset the call count and force the indicator to stop
   * @example
   * // Reduce the typing count by one and stop typing if it reached 0
   * channel.stopTyping();
   * @example
   * // Force typing to fully stop regardless of typing count
   * channel.stopTyping(true);
   */
  stopTyping(force = false) {
    if (this.client.user._typing.has(this.id)) {
      const entry = this.client.user._typing.get(this.id);
      entry.count--;
      if (entry.count <= 0 || force) {
        this.client.clearInterval(entry.interval);
        this.client.user._typing.delete(this.id);
        entry.resolve();
      }
    }
  }

  /**
   * Whether or not the typing indicator is being shown in the channel
   * @type {boolean}
   * @readonly
   */
  get typing() {
    return this.client.user._typing.has(this.id);
  }

  /**
   * Number of times `startTyping` has been called
   * @type {number}
   * @readonly
   */
  get typingCount() {
    return this.client.user._typing.get(this.id)?.count ?? 0;
  }

  /**
   * Creates a Message Collector.
   * @param {MessageCollectorOptions} [options={}] The options to pass to the collector
   * @returns {MessageCollector}
   * @example
   * // Create a message collector
   * const filter = m => m.content.includes('discord');
   * const collector = channel.createMessageCollector({ filter, time: 15000 });
   * collector.on('collect', m => console.log(`Collected ${m.content}`));
   * collector.on('end', collected => console.log(`Collected ${collected.size} items`));
   */
  createMessageCollector(options = {}) {
    return new MessageCollector(this, options);
  }

  /**
   * An object containing the same properties as CollectorOptions, but a few more:
   * @typedef {MessageCollectorOptions} AwaitMessagesOptions
   * @property {string[]} [errors] Stop/end reasons that cause the promise to reject
   */

  /**
   * Similar to createMessageCollector but in promise form.
   * Resolves with a collection of messages that pass the specified filter.
   * @param {AwaitMessagesOptions} [options={}] Optional options to pass to the internal collector
   * @returns {Promise<Collection<Snowflake, Message>>}
   * @example
   * // Await !vote messages
   * const filter = m => m.content.startsWith('!vote');
   * // Errors: ['time'] treats ending because of the time limit as an error
   * channel.awaitMessages({ filter, max: 4, time: 60000, errors: ['time'] })
   *   .then(collected => console.log(collected.size))
   *   .catch(collected => console.log(`After a minute, only ${collected.size} out of 4 voted.`));
   */
  awaitMessages(options = {}) {
    return new Promise((resolve, reject) => {
      const collector = this.createMessageCollector(options);
      collector.once('end', (collection, reason) => {
        if (options.errors?.includes(reason)) {
          reject(collection);
        } else {
          resolve(collection);
        }
      });
    });
  }

  /**
   * Creates a button interaction collector.
   * @param {MessageComponentCollectorOptions} [options={}] Options to send to the collector
   * @returns {InteractionCollector}
   * @example
   * // Create a button interaction collector
   * const filter = (interaction) => interaction.customId === 'button' && interaction.user.id === 'someId';
   * const collector = channel.createMessageComponentCollector({ filter, time: 15000 });
   * collector.on('collect', i => console.log(`Collected ${i.customId}`));
   * collector.on('end', collected => console.log(`Collected ${collected.size} items`));
   */
  createMessageComponentCollector(options = {}) {
    return new InteractionCollector(this.client, {
      ...options,
      interactionType: InteractionTypes.MESSAGE_COMPONENT,
      channel: this,
    });
  }

  /**
   * Collects a single component interaction that passes the filter.
   * The Promise will reject if the time expires.
   * @param {AwaitMessageComponentOptions} [options={}] Options to pass to the internal collector
   * @returns {Promise<MessageComponentInteraction>}
   * @example
   * // Collect a message component interaction
   * const filter = (interaction) => interaction.customId === 'button' && interaction.user.id === 'someId';
   * channel.awaitMessageComponent({ filter, time: 15000 })
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
   * Bulk deletes given messages that are newer than two weeks.
   * @param {Collection<Snowflake, Message>|MessageResolvable[]|number} messages
   * Messages or number of messages to delete
   * @param {boolean} [filterOld=false] Filter messages to remove those which are older than two weeks automatically
   * @returns {Promise<Collection<Snowflake, Message>>} Deleted messages
   * @example
   * // Bulk delete messages
   * channel.bulkDelete(5)
   *   .then(messages => console.log(`Bulk deleted ${messages.size} messages`))
   *   .catch(console.error);
   */
  async bulkDelete(messages, filterOld = false) {
    if (Array.isArray(messages) || messages instanceof Collection) {
      let messageIds = messages instanceof Collection ? messages.keyArray() : messages.map(m => m.id ?? m);
      if (filterOld) {
        messageIds = messageIds.filter(id => Date.now() - SnowflakeUtil.deconstruct(id).timestamp < 1209600000);
      }
      if (messageIds.length === 0) return new Collection();
      if (messageIds.length === 1) {
        await this.client.api.channels(this.id).messages(messageIds[0]).delete();
        const message = this.client.actions.MessageDelete.getMessage(
          {
            message_id: messageIds[0],
          },
          this,
        );
        return message ? new Collection([[message.id, message]]) : new Collection();
      }
      await this.client.api.channels[this.id].messages['bulk-delete'].post({ data: { messages: messageIds } });
      return messageIds.reduce(
        (col, id) =>
          col.set(
            id,
            this.client.actions.MessageDeleteBulk.getMessage(
              {
                message_id: id,
              },
              this,
            ),
          ),
        new Collection(),
      );
    }
    if (!isNaN(messages)) {
      const msgs = await this.messages.fetch({ limit: messages });
      return this.bulkDelete(msgs, filterOld);
    }
    throw new TypeError('MESSAGE_BULK_DELETE_TYPE');
  }

  static applyToClass(structure, full = false, ignore = []) {
    const props = ['send'];
    if (full) {
      props.push(
        'lastMessage',
        'lastPinAt',
        'bulkDelete',
        'startTyping',
        'stopTyping',
        'typing',
        'typingCount',
        'createMessageCollector',
        'awaitMessages',
        'createMessageComponentCollector',
        'awaitMessageComponent',
      );
    }
    for (const prop of props) {
      if (ignore.includes(prop)) continue;
      Object.defineProperty(
        structure.prototype,
        prop,
        Object.getOwnPropertyDescriptor(TextBasedChannel.prototype, prop),
      );
    }
  }
}

module.exports = TextBasedChannel;

// Fixes Circular
const MessageManager = require('../../managers/MessageManager');
