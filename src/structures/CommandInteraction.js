'use strict';

const Interaction = require('./Interaction');
const InteractionWebhook = require('./InteractionWebhook');
const InteractionResponses = require('./interfaces/InteractionResponses');
const Collection = require('../util/Collection');
const { ApplicationCommandOptionTypes } = require('../util/Constants');

/**
 * Represents a command interaction.
 * @extends {Interaction}
 * @implements {InteractionResponses}
 */
class CommandInteraction extends Interaction {
  constructor(client, data) {
    super(client, data);

    /**
     * The channel this interaction was sent in
     * @type {?(TextChannel|NewsChannel|DMChannel)}
     * @name CommandInteraction#channel
     * @readonly
     */

    /**
     * The id of the channel this interaction was sent in
     * @type {Snowflake}
     * @name CommandInteraction#channelId
     */

    /**
     * The invoked application command's id
     * @type {Snowflake}
     */
    this.commandId = data.data.id;

    /**
     * The invoked application command's name
     * @type {string}
     */
    this.commandName = data.data.name;

    /**
     * Whether the reply to this interaction has been deferred
     * @type {boolean}
     */
    this.deferred = false;

    /**
     * The options passed to the command.
     * @type {Collection<string, CommandInteractionOption>}
     */
    this.options = this._createOptionsCollection(data.data.options, data.data.resolved);

    /**
     * Whether this interaction has already been replied to
     * @type {boolean}
     */
    this.replied = false;

    /**
     * Whether the reply to this interaction is ephemeral
     * @type {?boolean}
     */
    this.ephemeral = null;

    /**
     * An associated interaction webhook, can be used to further interact with this interaction
     * @type {InteractionWebhook}
     */
    this.webhook = new InteractionWebhook(this.client, this.applicationId, this.token);
  }

  /**
   * The invoked application command, if it was fetched before
   * @type {?ApplicationCommand}
   */
  get command() {
    const id = this.commandId;
    return this.guild?.commands.cache.get(id) ?? this.client.application.commands.cache.get(id) ?? null;
  }

  /**
   * Represents an option of a received command interaction.
   * @typedef {Object} CommandInteractionOption
   * @property {string} name The name of the option
   * @property {ApplicationCommandOptionType} type The type of the option
   * @property {string|number|boolean} [value] The value of the option
   * @property {User} [user] The resolved user
   * @property {GuildMember|APIGuildMember} [member] The resolved member
   * @property {GuildChannel|APIChannel} [channel] The resolved channel
   * @property {Role|APIRole} [role] The resolved role
   */

  /**
   * Transforms an option received from the API.
   * @param {APIApplicationCommandOption} option The received option
   * @param {APIApplicationCommandOptionResolved} resolved The resolved interaction data
   * @returns {CommandInteractionOption}
   * @private
   */
  transformOption(option, resolved) {
    const result = {
      name: option.name,
      type: ApplicationCommandOptionTypes[option.type],
    };

    if (!('value' in option)) return result;
    result.value = option.value;

    if (resolved) {
      const user = resolved.users?.[option.value];
      if (user) result.user = this.client.users._add(user);

      const member = resolved.members?.[option.value];
      if (member) result.member = this.guild?.members._add({ user, ...member }) ?? member;

      const channel = resolved.channels?.[option.value];
      if (channel) result.channel = this.client.channels._add(channel, this.guild) ?? channel;

      const role = resolved.roles?.[option.value];
      if (role) result.role = this.guild?.roles._add(role) ?? role;
    }

    return result;
  }

  /**
   * Creates a collection of options from the received options array.
   * @param {APIApplicationCommandOption[]} options The received options
   * @param {APIApplicationCommandOptionResolved} resolved The resolved interaction data
   * @returns {Collection<string, CommandInteractionOption>}
   * @private
   */
  _createOptionsCollection(options, resolved) {
    const optionsCollection = new Collection();

    if (options?.[0].type === 2) {
      /**
       * @type {string}
       */
      this.group = options[0].name;
      options = options[0].options;
    }
    if (options?.[0].type === 1) {
      /**
       * @type {string}
       */
      this.subcommand = options[0].name;
      options = options[0].options;
    }

    if (typeof options === 'undefined') return optionsCollection;
    for (const option of options) {
      optionsCollection.set(option.name, this.transformOption(option, resolved));
    }
    return optionsCollection;
  }

  // These are here only for documentation purposes - they are implemented by InteractionResponses
  /* eslint-disable no-empty-function */
  defer() {}
  reply() {}
  fetchReply() {}
  editReply() {}
  deleteReply() {}
  followUp() {}
}

InteractionResponses.applyToClass(CommandInteraction, ['deferUpdate', 'update']);

module.exports = CommandInteraction;

/* eslint-disable max-len */
/**
 * @external APIApplicationCommandOptionResolved
 * @see {@link https://discord.com/developers/docs/interactions/slash-commands#interaction-applicationcommandinteractiondataresolved}
 */
