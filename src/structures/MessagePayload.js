'use strict';

const BaseMessageComponent = require('./BaseMessageComponent');
const MessageEmbed = require('./MessageEmbed');
const { RangeError } = require('../errors');
const DataResolver = require('../util/DataResolver');
const MessageFlags = require('../util/MessageFlags');
const Util = require('../util/Util');

/**
 * Represents a message to be sent to the API.
 */
class MessagePayload {
  /**
   * @param {MessageTarget} target - The target for this message to be sent to
   * @param {MessageOptions|WebhookMessageOptions} options - Options passed in from send
   */
  constructor(target, options) {
    /**
     * The target for this message to be sent to
     * @type {MessageTarget}
     */
    this.target = target;

    /**
     * Options passed in from send
     * @type {MessageOptions|WebhookMessageOptions}
     */
    this.options = options;

    /**
     * Data sendable to the API
     * @type {?APIMessage}
     */
    this.data = null;

    /**
     * @typedef {Object} MessageFile
     * @property {Buffer|string|Stream} attachment The original attachment that generated this file
     * @property {string} name The name of this file
     * @property {Buffer|Stream} file The file to be sent to the API
     */

    /**
     * Files sendable to the API
     * @type {?MessageFile[]}
     */
    this.files = null;
  }

  /**
   * Whether or not the target is a webhook
   * @type {boolean}
   * @readonly
   */
  get isWebhook() {
    const Webhook = require('./Webhook');
    const WebhookClient = require('../client/WebhookClient');
    return this.target instanceof Webhook || this.target instanceof WebhookClient;
  }

  /**
   * Whether or not the target is a user
   * @type {boolean}
   * @readonly
   */
  get isUser() {
    const User = require('./User');
    const GuildMember = require('./GuildMember');
    return this.target instanceof User || this.target instanceof GuildMember;
  }

  /**
   * Whether or not the target is a message
   * @type {boolean}
   * @readonly
   */
  get isMessage() {
    const Message = require('./Message');
    return this.target instanceof Message;
  }

  /**
   * Wether or not the target is a message manager
   * @type {boolean}
   * @readonly
   */
  get isMessageManager() {
    const MessageManager = require('../managers/MessageManager');
    return this.target instanceof MessageManager;
  }

  /**
   * Whether or not the target is an interaction
   * @type {boolean}
   * @readonly
   */
  get isInteraction() {
    const Interaction = require('./Interaction');
    const InteractionWebhook = require('./InteractionWebhook');
    return this.target instanceof Interaction || this.target instanceof InteractionWebhook;
  }

  /**
   * Makes the content of this message.
   * @returns {?string}
   */
  makeContent() {
    let content;
    if (this.options.content === null) {
      content = '';
    } else if (typeof this.options.content !== 'undefined') {
      content = Util.verifyString(this.options.content, RangeError, 'MESSAGE_CONTENT_TYPE', false);
    }

    return content;
  }

  /**
   * Resolves data.
   * @returns {MessagePayload}
   */
  resolveData() {
    if (this.data) return this;
    const isInteraction = this.isInteraction;
    const isWebhook = this.isWebhook;

    const content = this.makeContent();
    const tts = Boolean(this.options.tts);

    let nonce;
    if (typeof this.options.nonce !== 'undefined') {
      nonce = this.options.nonce;
      // eslint-disable-next-line max-len
      if (typeof nonce === 'number' ? !Number.isInteger(nonce) : typeof nonce !== 'string') {
        throw new RangeError('MESSAGE_NONCE_TYPE');
      }
    }

    const components = this.options.components?.map(c => BaseMessageComponent.create(c).toJSON());

    let username;
    let avatarURL;
    if (isWebhook) {
      username = this.options.username ?? this.target.name;
      if (this.options.avatarURL) avatarURL = this.options.avatarURL;
    }

    let flags;
    if (this.isMessage || this.isMessageManager) {
      // eslint-disable-next-line eqeqeq
      flags = this.options.flags != null ? new MessageFlags(this.options.flags).bitfield : this.target.flags?.bitfield;
    } else if (isInteraction && this.options.ephemeral) {
      flags = MessageFlags.FLAGS.EPHEMERAL;
    }

    let allowedMentions =
      typeof this.options.allowedMentions === 'undefined'
        ? this.target.client.options.allowedMentions
        : this.options.allowedMentions;

    if (allowedMentions) {
      allowedMentions = Util.cloneObject(allowedMentions);
      allowedMentions.replied_user = allowedMentions.repliedUser;
      delete allowedMentions.repliedUser;
    }

    let message_reference;
    if (typeof this.options.reply === 'object') {
      const message_id = this.isMessage
        ? this.target.channel.messages.resolveId(this.options.reply.messageReference)
        : this.target.messages.resolveId(this.options.reply.messageReference);
      if (message_id) {
        message_reference = {
          message_id,
          fail_if_not_exists: this.options.reply.failIfNotExists ?? this.target.client.options.failIfNotExists,
        };
      }
    }

    this.data = {
      content,
      tts,
      nonce,
      embeds: this.options.embeds?.map(embed => new MessageEmbed(embed).toJSON()),
      components,
      username,
      avatar_url: avatarURL,
      allowed_mentions:
        typeof content === 'undefined' && typeof message_reference === 'undefined' ? undefined : allowedMentions,
      flags,
      message_reference,
      attachments: this.options.attachments,
      sticker_ids: this.options.stickers?.map(sticker => sticker.id ?? sticker),
    };
    return this;
  }

  /**
   * Resolves files.
   * @returns {Promise<MessagePayload>}
   */
  async resolveFiles() {
    if (this.files) return this;

    this.files = await Promise.all(this.options.files?.map(file => this.constructor.resolveFile(file)) ?? []);
    return this;
  }

  /**
   * Resolves a single file into an object sendable to the API.
   * @param {BufferResolvable|Stream|FileOptions|MessageAttachment} fileLike Something that could be resolved to a file
   * @returns {MessageFile}
   */
  static async resolveFile(fileLike) {
    let attachment;
    let name;

    const findName = thing => {
      if (typeof thing === 'string') {
        return Util.basename(thing);
      }

      if (thing.path) {
        return Util.basename(thing.path);
      }

      return 'file.jpg';
    };

    const ownAttachment =
      typeof fileLike === 'string' || fileLike instanceof Buffer || typeof fileLike.pipe === 'function';
    if (ownAttachment) {
      attachment = fileLike;
      name = findName(attachment);
    } else {
      attachment = fileLike.attachment;
      name = fileLike.name ?? findName(attachment);
    }

    const resource = await DataResolver.resolveFile(attachment);
    return { attachment, name, file: resource };
  }

  /**
   * Creates a `MessagePayload` from user-level arguments.
   * @param {MessageTarget} target Target to send to
   * @param {string|MessageOptions|WebhookMessageOptions} options Options or content to use
   * @param {MessageOptions|WebhookMessageOptions} [extra={}] - Extra options to add onto specified options
   * @returns {MessagePayload}
   */
  static create(target, options, extra = {}) {
    return new this(
      target,
      typeof options !== 'object' || options === null ? { content: options, ...extra } : { ...options, ...extra },
    );
  }
}

module.exports = MessagePayload;

/**
 * A target for a message.
 * @typedef {TextChannel|DMChannel|User|GuildMember|Webhook|WebhookClient|Interaction|InteractionWebhook|
 * Message|MessageManager} MessageTarget
 */

/**
 * @external APIMessage
 * @see {@link https://discord.com/developers/docs/resources/channel#message-object}
 */
