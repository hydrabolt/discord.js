'use strict';

const Base = require('./Base');
const { ApplicationCommandOptionTypes } = require('../util/Constants');
const SnowflakeUtil = require('../util/Snowflake');

/**
 * Represents an application command.
 * @extends {Base}
 */
class ApplicationCommand extends Base {
  constructor(client, data, guild) {
    super(client);

    /**
     * The ID of this command
     * @type {Snowflake}
     */
    this.id = data.id;

    /**
     * The guild this command is part of
     * @type {?Guild}
     */
    this.guild = guild ?? null;

    this._patch(data);
  }

  _patch(data) {
    /**
     * The name of this command
     * @type {string}
     */
    this.name = data.name;

    /**
     * The description of this command
     * @type {string}
     */
    this.description = data.description;

    /**
     * The options of this command
     * @type {ApplicationCommandOption[]}
     */
    this.options = data.options?.map(ApplicationCommand.transformOption) ?? [];
  }

  /**
   * The timestamp the command was created at
   * @type {number}
   * @readonly
   */
  get createdTimestamp() {
    return SnowflakeUtil.deconstruct(this.id).timestamp;
  }

  /**
   * The time the command was created at
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /**
   * The manager that this command belongs to
   * @type {ApplicationCommandManager}
   * @readonly
   */
  get manager() {
    return (this.guild ?? this.client.application).commands;
  }

  /**
   * Data for creating or editing an application command.
   * @property {string} name The name of the command
   * @property {string} description The description of the command
   * @property {ApplicationCommandOption[]} [options] Options for the command
   * @typedef {Object} ApplicationCommandData
   */

  /**
   * Edits this application command.
   * @param {ApplicationCommandData} data The data to update the command with
   * @returns {ApplicationCommand}
   */
  edit(data) {
    return this.manager.edit(this, data);
  }

  /**
   * Deletes this command.
   * @returns {ApplicationCommand}
   */
  async delete() {
    await this.manager.delete(this);
    return this;
  }

  /**
   * An option for an application command or subcommand.
   * @typedef {Object} ApplicationCommandOption
   * @property {ApplicationCommandOptionType} type The type of the option
   * @property {string} name The name of the option
   * @property {string} description The description of the option
   * @property {boolean} [required] Whether the option is required
   * @property {ApplicationCommandOptionChoice[]} [choices] The choices of the option for the user to pick from
   * @property {ApplicationCommandOption[]} [options] Additional options if this option is a subcommand (group)
   */

  /**
   * A choice for an application command option.
   * @typedef {Object} ApplicationCommandOptionChoice
   * @property {string} name The name of the choice
   * @property {string|number} value The value of the choice
   */

  /**
   * Transforms an {@link ApplicationCommandOption} object into something that can be used with the API.
   * @param {ApplicationCommandOption} option The option to transform
   * @returns {Object}
   * @private
   */
  static transformOption(option) {
    return {
      ...option,
      type: ApplicationCommandOptionTypes[option.type],
      options: option.options?.map(ApplicationCommand.transformOption),
    };
  }
}

module.exports = ApplicationCommand;