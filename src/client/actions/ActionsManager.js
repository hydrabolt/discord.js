'use strict';

const fs = require('fs');

class ActionsManager {
  constructor(client) {
    this.client = client;

    const files = fs.readdirSync(__dirname);

    for (const file of files) {
      if (['Action.js', 'ActionsManager.js'].includes(file)) continue;
      this.register(require(`./${file}`));
    }
  }

  register(Action) {
    this[Action.name.replace(/Action$/, '')] = new Action(this.client);
  }
}

module.exports = ActionsManager;
