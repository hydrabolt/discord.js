const Attachment = require('./MessageAttachment');
const Embed = require('./MessageEmbed');
const Collection = require('../util/Collection');

/**
 * Represents a Message on Discord
 */
class Message {
  constructor(channel, data, client) {
    this._type = 'message';
    /**
     * The channel that the message was sent in
     * @type {TextChannel|DMChannel|GroupDMChannel}
     */
    this.channel = channel;

    if (channel.guild) {
      /**
       * If the message was sent in a guild, this will be the guild the message was sent in
       * @type {?Guild}
       */
      this.guild = channel.guild;
    }

    /**
     * The client that instantiated the Message
     * @type {Client}
     */
    this.client = client;
    if (data) this.setup(data);
  }

  setup(data) {
    /**
     * Whether or not this message is pinned
     * @type {boolean}
     */
    this.pinned = data.pinned;
    /**
     * The author of the message
     * @type {User}
     */
    this.author = this.client.dataManager.newUser(data.author);
    if (this.guild) {
      /**
       * Represents the Author of the message as a Guild Member. Only available if the message comes from a Guild
       * where the author is still a member.
       * @type {GuildMember}
       */
      this.member = this.guild.member(this.author);
    }
    /**
     * The content of the message
     * @type {string}
     */
    this.content = data.content;
    this._timestamp = new Date(data.timestamp).getTime();
    this._editedTimestamp = data.edited_timestamp ? new Date(data.edited_timestamp).getTime() : null;
    /**
     * Whether or not the message was Text-To-Speech
     * @type {boolean}
     */
    this.tts = data.tts;
    /**
     * A random number used for checking message delivery
     * @type {string}
     */
    this.nonce = data.nonce;
    /**
     * A list of embeds in the message - e.g. YouTube Player
     * @type {Embed[]}
     */
    this.embeds = data.embeds.map(e => new Embed(this, e));
    /**
     * A collection of attachments in the message - e.g. Pictures - mapped by their ID.
     * @type {Collection<string, MessageAttachment>}
     */
    this.attachments = new Collection();
    for (const attachment of data.attachments) this.attachments.set(attachment.id, new Attachment(this, attachment));
    /**
     * An object containing a further users, roles or channels collections
     * @type {Object}
     * @property {Collection<string, User>} mentions.users Mentioned users, maps their ID to the user object.
     * @property {Collection<string, Role>} mentions.roles Mentioned roles, maps their ID to the role object.
     * @property {Collection<string, GuildChannel>} mentions.channels Mentioned channels,
     * maps their ID to the channel object.
     * @property {boolean} mentions.everyone Whether or not @everyone was mentioned.
     */
    this.mentions = {
      users: new Collection(),
      roles: new Collection(),
      channels: new Collection(),
      everyone: data.mention_everyone,
    };
    /**
     * The ID of the message (unique in the channel it was sent)
     * @type {string}
     */
    this.id = data.id;

    for (const mention of data.mentions) {
      let user = this.client.users.get(mention.id);
      if (user) {
        this.mentions.users.set(user.id, user);
      } else {
        user = this.client.dataManager.newUser(mention);
        this.mentions.users.set(user.id, user);
      }
    }

    if (data.mention_roles) {
      for (const mention of data.mention_roles) {
        const role = this.channel.guild.roles.get(mention);
        if (role) this.mentions.roles.set(role.id, role);
      }
    }

    if (this.channel.guild) {
      const channMentionsRaw = data.content.match(/<#([0-9]{14,20})>/g) || [];
      for (const raw of channMentionsRaw) {
        const chan = this.channel.guild.channels.get(raw.match(/([0-9]{14,20})/g)[0]);
        if (chan) this.mentions.channels.set(chan.id, chan);
      }
    }

    this._edits = [];

    /**
     * Whether or not this message was sent by Discord, not actually a user (e.g. pin notifications)
     * @type {boolean}
     */
    this.system = false;
    if (data.type === 6) this.system = true;
  }
  /**
   * When the message was sent
   * @type {Date}
   */
  get timestamp() {
    return new Date(this._timestamp);
  }

  /**
   * If the message was edited, the timestamp at which it was last edited
   * @type {?Date}
   */
  get editedTimestamp() {
    return new Date(this._editedTimestamp);
  }

  /**
   * An array of cached versions of the message, including the current version.
   * Sorted from latest (first) to oldest (last).
   * @type {Array<Message>}
   */
  get edits() {
    return this._edits.slice().unshift(this);
  }

  patch(data) { // eslint-disable-line complexity
    if (data.author) {
      this.author = this.client.users.get(data.author.id);
      if (this.guild) this.member = this.guild.member(this.author);
    }
    if (data.content) this.content = data.content;
    if (data.timestamp) this._timestamp = new Date(data.timestamp).getTime();
    if (data.edited_timestamp) {
      this._editedTimestamp = data.edited_timestamp ? new Date(data.edited_timestamp).getTime() : null;
    }
    if ('tts' in data) this.tts = data.tts;
    if ('mention_everyone' in data) this.mentions.everyone = data.mention_everyone;
    if (data.nonce) this.nonce = data.nonce;
    if (data.embeds) this.embeds = data.embeds.map(e => new Embed(this, e));
    if (data.type > -1) {
      this.system = false;
      if (data.type === 6) {
        this.system = true;
      }
    }
    if (data.attachments) {
      this.attachments = new Collection();
      for (const attachment of data.attachments) {
        this.attachments.set(attachment.id, new Attachment(this, attachment));
      }
    }
    if (data.mentions) {
      for (const mention of data.mentions) {
        let user = this.client.users.get(mention.id);
        if (user) {
          this.mentions.users.set(user.id, user);
        } else {
          user = this.client.dataManager.newUser(mention);
          this.mentions.users.set(user.id, user);
        }
      }
    }
    if (data.mention_roles) {
      for (const mention of data.mention_roles) {
        const role = this.channel.guild.roles.get(mention);
        if (role) {
          this.mentions.roles.set(role.id, role);
        }
      }
    }
    if (data.id) this.id = data.id;
    if (this.channel.guild && data.content) {
      const channMentionsRaw = data.content.match(/<#([0-9]{14,20})>/g) || [];
      for (const raw of channMentionsRaw) {
        const chan = this.channel.guild.channels.get(raw.match(/([0-9]{14,20})/g)[0]);
        if (chan) {
          this.mentions.channels.set(chan.id, chan);
        }
      }
    }
  }

  /**
   * Used mainly internally. Whether two messages are identical in properties. If you want to compare messages
   * without checking all the properties, use `message.id === message2.id`, which is much more efficient. This
   * method allows you to see if there are differences in content, embeds, attachments, nonce and tts properties.
   * @param {Message} message The message to compare it to
   * @param {Object} rawData Raw data passed through the WebSocket about this message
   * @returns {boolean}
   */
  equals(message, rawData) {
    if (!message) return false;
    const embedUpdate = !message.author && !message.attachments;
    if (embedUpdate) return this.id === message.id && this.embeds.length === message.embeds.length;

    let equal = this.id === message.id &&
        this.author.id === message.author.id &&
        this.content === message.content &&
        this.tts === message.tts &&
        this.nonce === message.nonce &&
        this.embeds.length === message.embeds.length &&
        this.attachments.length === message.attachments.length;

    if (equal && rawData) {
      equal = this.mentions.everyone === message.mentions.everyone &&
        this._timestamp === new Date(rawData.timestamp).getTime() &&
        this._editedTimestamp === new Date(rawData.edited_timestamp).getTime();
    }

    return equal;
  }

  /**
   * Deletes the message
   * @param {number} [timeout=0] How long to wait to delete the message in milliseconds
   * @returns {Promise<Message>}
   * @example
   * // delete a message
   * message.delete()
   *  .then(msg => console.log(`Deleted message from ${msg.author}`))
   *  .catch(console.log);
   */
  delete(timeout = 0) {
    return new Promise((resolve, reject) => {
      this.client.setTimeout(() => {
        this.client.rest.methods.deleteMessage(this)
          .then(resolve)
          .catch(reject);
      }, timeout);
    });
  }

  /**
   * Edit the content of a message
   * @param {string} content The new content for the message
   * @returns {Promise<Message>}
   * @example
   * // update the content of a message
   * message.edit('This is my new content!')
   *  .then(msg => console.log(`Updated the content of a message from ${msg.author}`))
   *  .catch(console.log);
   */
  edit(content) {
    return this.client.rest.methods.updateMessage(this, content);
  }

  /**
   * Reply to a message
   * @param {string} content The content for the message
   * @param {MessageOptions} [options = {}] The options to provide
   * @returns {Promise<Message>}
   * @example
   * // reply to a message
   * message.reply('Hey, I'm a reply!')
   *  .then(msg => console.log(`Sent a reply to ${msg.author}`))
   *  .catch(console.log);
   */
  reply(content, options = {}) {
    content = this.client.resolver.resolveString(content);
    const newContent = this.guild ? `${this.author}, ${content}` : content;
    return this.client.rest.methods.sendMessage(this.channel, newContent, options.tts);
  }

  /**
   * Whether or not a user, channel or role is mentioned in this message.
   * @param {GuildChannel|User|Role|string} data either a guild channel, user or a role object, or a string representing
   * the ID of any of these.
   * @returns {boolean}
   */
  isMentioned(data) {
    data = data.id ? data.id : data;
    return this.mentions.users.has(data) || this.mentions.channels.has(data) || this.mentions.roles.has(data);
  }

  /**
   * Pins this message to the channel's pinned messages
   * @returns {Promise<Message>}
   */
  pin() {
    return this.client.rest.methods.pinMessage(this);
  }

  /**
   * Unpins this message from the channel's pinned messages
   * @returns {Promise<Message>}
   */
  unpin() {
    return this.client.rest.methods.unpinMessage(this);
  }
}

module.exports = Message;
