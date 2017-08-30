const PresenceStore = require('./DataStore');
const Collection = require('../util/Collection');
const Constants = require('../util/Constants');
const { Presence } = require('../structures/Presence');

class ClientPresenceStore extends PresenceStore {
  constructor(...args) {
    super(...args);
    this.clientPresence = new Presence({
      status: 'online',
      afk: false,
      since: null,
      activity: null,
    });
  }

  async setClientPresence({ status, since, afk, activity }) {
    const applicationID = activity && (activity.application ? activity.application.id || activity.application : null);
    let assets = new Collection();
    if (activity && activity.assets && applicationID) {
      try {
        const a = await this.client.api.oauth2.applications(applicationID).assets.get();
        for (const asset of a) assets.set(asset.name, asset.id);
      } catch (err) {} // eslint-disable-line no-empty
    }

    const packet = {
      afk: afk != null ? afk : false, // eslint-disable-line eqeqeq
      since: since != null ? since : null, // eslint-disable-line eqeqeq
      status: status || this.clientPresence.status,
      game: activity ? {
        type: typeof activity.type === 'number' ? activity.type : Constants.ActivityTypes.indexOf(activity.type),
        name: activity.name,
        url: activity.url,
        description: activity.description || undefined,
        state: activity.state || undefined,
        assets: activity.assets ? {
          large_text: activity.assets.largeText || undefined,
          small_text: activity.assets.smallText || undefined,
          large_image: assets.get(activity.assets.largeImage) || activity.assets.largeImage,
          small_image: assets.get(activity.assets.smallImage) || activity.assets.smallImage,
        } : undefined,
        application_id: applicationID || undefined,
        secrets: activity.secrets || undefined,
        instance: activity.instance || undefined,
      } : null,
    };

    this.clientPresence.patch(packet);
    this.client.ws.send({ op: Constants.OPCodes.STATUS_UPDATE, d: packet });
    return this.clientPresence;
  }
}

module.exports = ClientPresenceStore;
