'use strict';

const BaseMessageComponent = require('./BaseMessageComponent');
const { MessageComponentTypes } = require('../util/Constants');

/**
 * Represents an ActionRow containing message components.
 * @extends {BaseMessageComponent}
 */
class MessageActionRow extends BaseMessageComponent {
  /**
   * Components that can be placed in a MessageActionRow
   * * MessageButton
   * @typedef {MessageButton} MessageActionRowComponent
   */

  /**
   * Options for components that can be placed in a MessageActionRow
   * * MessageButtonOptions
   * @typedef {MessageButtonOptions} MessageActionRowComponentOptions
   */

  /**
   * Data that can be resolved into a components that can be placed in a MessageActionRow
   * * MessageActionRowComponent
   * * MessageActionRowComponentOptions
   * @typedef {MessageActionRowComponent|MessageActionRowComponentOptions} MessageActionRowComponentResolvable
   */

  /**
   * @typedef {BaseMessageComponentOptions} MessageActionRowOptions
   * @property {MessageActionRowComponentResolvable[]} [components]
   * The components to place in this ActionRow
   */

  /**
   * @param {MessageActionRow|MessageActionRowOptions} [data={}] MessageActionRow to clone or raw data
   */
  constructor(data = {}) {
    super({ type: 'ACTION_ROW' });

    this.components = (data.components ?? []).map(c => BaseMessageComponent.create(c, null, true));
  }

  /**
   * Adds components to the row (max 5).
   * @param {...MessageActionRowComponentResolvable[]} components The components to add
   * @returns {MessageActionRow}
   */
  addComponents(...components) {
    this.components.push(...components.flat(2).map(c => BaseMessageComponent.create(c, null, true)));
    return this;
  }

  /**
   * Removes, replaces, and inserts components in the action row (max 25).
   * @param {number} index The index to start at
   * @param {number} deleteCount The number of components to remove
   * @param {...MessageActionRowComponentResolvable[]} [components] The replacing components
   * @returns {MessageSelectMenu}
   */
  spliceComponents(index, deleteCount, ...components) {
    this.components.splice(
      index,
      deleteCount,
      ...components.flat(2).map(c => BaseMessageComponent.create(c, null, true)),
    );
    return this;
  }

  /**
   * Transforms the action row to a plain object.
   * @returns {Object} The raw data of this action row
   */
  toJSON() {
    return {
      components: this.components.map(c => c.toJSON()),
      type: MessageComponentTypes[this.type],
    };
  }
}

module.exports = MessageActionRow;
