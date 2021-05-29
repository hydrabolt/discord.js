'use strict';

const Package = (exports.Package = require('../../package.json'));
const { Error, RangeError } = require('../errors');

exports.UserAgent = `DiscordBot (${Package.homepage.split('#')[0]}, ${Package.version}) Node.js/${process.version}`;

exports.WSCodes = {
  1000: 'WS_CLOSE_REQUESTED',
  4004: 'TOKEN_INVALID',
  4010: 'SHARDING_INVALID',
  4011: 'SHARDING_REQUIRED',
  4013: 'INVALID_INTENTS',
  4014: 'DISALLOWED_INTENTS',
};

const AllowedImageFormats = ['webp', 'png', 'jpg', 'jpeg', 'gif'];

const AllowedImageSizes = Array.from({ length: 9 }, (e, i) => 2 ** (i + 4));

function makeImageUrl(root, { format = 'webp', size } = {}) {
  if (format && !AllowedImageFormats.includes(format)) throw new Error('IMAGE_FORMAT', format);
  if (size && !AllowedImageSizes.includes(size)) throw new RangeError('IMAGE_SIZE', size);
  return `${root}.${format}${size ? `?size=${size}` : ''}`;
}

/**
 * Options for Image URLs.
 * @typedef {StaticImageURLOptions} ImageURLOptions
 * @property {boolean} [dynamic] If true, the format will dynamically change to `gif` for
 * animated avatars; the default is false
 */

/**
 * Options for static Image URLs.
 * @typedef {Object} StaticImageURLOptions
 * @property {string} [format] One of `webp`, `png`, `jpg`, `jpeg`, `gif`. If no format is provided,
 * defaults to `webp`
 * @property {number} [size] One of `16`, `32`, `64`, `128`, `256`, `512`, `1024`, `2048`, `4096`
 */

exports.Endpoints = {
  CDN(root) {
    return {
      Emoji: (emojiId, format = 'png') => `${root}/emojis/${emojiId}.${format}`,
      Asset: name => `${root}/assets/${name}`,
      DefaultAvatar: discriminator => `${root}/embed/avatars/${discriminator}.png`,
      Avatar: (userId, hash, format = 'webp', size, dynamic = false) => {
        if (dynamic) format = hash.startsWith('a_') ? 'gif' : format;
        return makeImageUrl(`${root}/avatars/${userId}/${hash}`, { format, size });
      },
      GuildMemberAvatar: (guildId, memberId, hash, format = 'webp', size, dynamic = false) => {
        if (dynamic) format = hash.startsWith('a_') ? 'gif' : format;
        return makeImageUrl(`${root}/guilds/${guildId}/users/${memberId}/avatars/${hash}`, { format, size });
      },
      Banner: (guildId, hash, format = 'webp', size) =>
        makeImageUrl(`${root}/banners/${guildId}/${hash}`, { format, size }),
      Icon: (guildId, hash, format = 'webp', size, dynamic = false) => {
        if (dynamic) format = hash.startsWith('a_') ? 'gif' : format;
        return makeImageUrl(`${root}/icons/${guildId}/${hash}`, { format, size });
      },
      AppIcon: (clientId, hash, { format = 'webp', size } = {}) =>
        makeImageUrl(`${root}/app-icons/${clientId}/${hash}`, { size, format }),
      AppAsset: (clientId, hash, { format = 'webp', size } = {}) =>
        makeImageUrl(`${root}/app-assets/${clientId}/${hash}`, { size, format }),
      GDMIcon: (channelId, hash, format = 'webp', size) =>
        makeImageUrl(`${root}/channel-icons/${channelId}/${hash}`, { size, format }),
      Splash: (guildId, hash, format = 'webp', size) =>
        makeImageUrl(`${root}/splashes/${guildId}/${hash}`, { size, format }),
      DiscoverySplash: (guildId, hash, format = 'webp', size) =>
        makeImageUrl(`${root}/discovery-splashes/${guildId}/${hash}`, { size, format }),
      TeamIcon: (teamId, hash, { format = 'webp', size } = {}) =>
        makeImageUrl(`${root}/team-icons/${teamId}/${hash}`, { size, format }),
    };
  },
  invite: (root, code) => `${root}/${code}`,
  botGateway: '/gateway/bot',
};

/**
 * The current status of the client. Here are the available statuses:
 * * READY: 0
 * * CONNECTING: 1
 * * RECONNECTING: 2
 * * IDLE: 3
 * * NEARLY: 4
 * * DISCONNECTED: 5
 * * WAITING_FOR_GUILDS: 6
 * * IDENTIFYING: 7
 * * RESUMING: 8
 * @typedef {number} Status
 */
exports.Status = {
  READY: 0,
  CONNECTING: 1,
  RECONNECTING: 2,
  IDLE: 3,
  NEARLY: 4,
  DISCONNECTED: 5,
  WAITING_FOR_GUILDS: 6,
  IDENTIFYING: 7,
  RESUMING: 8,
};

exports.Opcodes = {
  DISPATCH: 0,
  HEARTBEAT: 1,
  IDENTIFY: 2,
  STATUS_UPDATE: 3,
  VOICE_STATE_UPDATE: 4,
  VOICE_GUILD_PING: 5,
  RESUME: 6,
  RECONNECT: 7,
  REQUEST_GUILD_MEMBERS: 8,
  INVALID_SESSION: 9,
  HELLO: 10,
  HEARTBEAT_ACK: 11,
};

exports.Events = {
  RATE_LIMIT: 'rateLimit',
  INVALID_REQUEST_WARNING: 'invalidRequestWarning',
  CLIENT_READY: 'ready',
  APPLICATION_COMMAND_CREATE: 'applicationCommandCreate',
  APPLICATION_COMMAND_DELETE: 'applicationCommandDelete',
  APPLICATION_COMMAND_UPDATE: 'applicationCommandUpdate',
  GUILD_CREATE: 'guildCreate',
  GUILD_DELETE: 'guildDelete',
  GUILD_UPDATE: 'guildUpdate',
  GUILD_UNAVAILABLE: 'guildUnavailable',
  GUILD_MEMBER_ADD: 'guildMemberAdd',
  GUILD_MEMBER_REMOVE: 'guildMemberRemove',
  GUILD_MEMBER_UPDATE: 'guildMemberUpdate',
  GUILD_MEMBER_AVAILABLE: 'guildMemberAvailable',
  GUILD_MEMBERS_CHUNK: 'guildMembersChunk',
  GUILD_INTEGRATIONS_UPDATE: 'guildIntegrationsUpdate',
  GUILD_ROLE_CREATE: 'roleCreate',
  GUILD_ROLE_DELETE: 'roleDelete',
  INVITE_CREATE: 'inviteCreate',
  INVITE_DELETE: 'inviteDelete',
  GUILD_ROLE_UPDATE: 'roleUpdate',
  GUILD_EMOJI_CREATE: 'emojiCreate',
  GUILD_EMOJI_DELETE: 'emojiDelete',
  GUILD_EMOJI_UPDATE: 'emojiUpdate',
  GUILD_BAN_ADD: 'guildBanAdd',
  GUILD_BAN_REMOVE: 'guildBanRemove',
  CHANNEL_CREATE: 'channelCreate',
  CHANNEL_DELETE: 'channelDelete',
  CHANNEL_UPDATE: 'channelUpdate',
  CHANNEL_PINS_UPDATE: 'channelPinsUpdate',
  MESSAGE_CREATE: 'messageCreate',
  MESSAGE_DELETE: 'messageDelete',
  MESSAGE_UPDATE: 'messageUpdate',
  MESSAGE_BULK_DELETE: 'messageDeleteBulk',
  MESSAGE_REACTION_ADD: 'messageReactionAdd',
  MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
  MESSAGE_REACTION_REMOVE_ALL: 'messageReactionRemoveAll',
  MESSAGE_REACTION_REMOVE_EMOJI: 'messageReactionRemoveEmoji',
  THREAD_CREATE: 'threadCreate',
  THREAD_DELETE: 'threadDelete',
  THREAD_UPDATE: 'threadUpdate',
  THREAD_LIST_SYNC: 'threadListSync',
  THREAD_MEMBER_UPDATE: 'threadMemberUpdate',
  THREAD_MEMBERS_UPDATE: 'threadMembersUpdate',
  USER_UPDATE: 'userUpdate',
  PRESENCE_UPDATE: 'presenceUpdate',
  VOICE_SERVER_UPDATE: 'voiceServerUpdate',
  VOICE_STATE_UPDATE: 'voiceStateUpdate',
  TYPING_START: 'typingStart',
  WEBHOOKS_UPDATE: 'webhookUpdate',
  INTERACTION_CREATE: 'interactionCreate',
  ERROR: 'error',
  WARN: 'warn',
  DEBUG: 'debug',
  SHARD_DISCONNECT: 'shardDisconnect',
  SHARD_ERROR: 'shardError',
  SHARD_RECONNECTING: 'shardReconnecting',
  SHARD_READY: 'shardReady',
  SHARD_RESUME: 'shardResume',
  INVALIDATED: 'invalidated',
  RAW: 'raw',
  STAGE_INSTANCE_CREATE: 'stageInstanceCreate',
  STAGE_INSTANCE_UPDATE: 'stageInstanceUpdate',
  STAGE_INSTANCE_DELETE: 'stageInstanceDelete',
};

exports.ShardEvents = {
  CLOSE: 'close',
  DESTROYED: 'destroyed',
  INVALID_SESSION: 'invalidSession',
  READY: 'ready',
  RESUMED: 'resumed',
  ALL_READY: 'allReady',
};

/**
 * The type of Structure allowed to be a partial:
 * * USER
 * * CHANNEL (only affects DMChannels)
 * * GUILD_MEMBER
 * * MESSAGE
 * * REACTION
 * <warn>Partials require you to put checks in place when handling data. See the "Partial Structures" topic on the
 * [guide](https://discordjs.guide/popular-topics/partials.html) for more information.</warn>
 * @typedef {string} PartialType
 */
exports.PartialTypes = keyMirror(['USER', 'CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION']);

/**
 * The type of a websocket message event, e.g. `MESSAGE_CREATE`. Here are the available events:
 * * READY
 * * RESUMED
 * * APPLICATION_COMMAND_CREATE
 * * APPLICATION_COMMAND_DELETE
 * * APPLICATION_COMMAND_UPDATE
 * * GUILD_CREATE
 * * GUILD_DELETE
 * * GUILD_UPDATE
 * * INVITE_CREATE
 * * INVITE_DELETE
 * * GUILD_MEMBER_ADD
 * * GUILD_MEMBER_REMOVE
 * * GUILD_MEMBER_UPDATE
 * * GUILD_MEMBERS_CHUNK
 * * GUILD_INTEGRATIONS_UPDATE
 * * GUILD_ROLE_CREATE
 * * GUILD_ROLE_DELETE
 * * GUILD_ROLE_UPDATE
 * * GUILD_BAN_ADD
 * * GUILD_BAN_REMOVE
 * * GUILD_EMOJIS_UPDATE
 * * CHANNEL_CREATE
 * * CHANNEL_DELETE
 * * CHANNEL_UPDATE
 * * CHANNEL_PINS_UPDATE
 * * MESSAGE_CREATE
 * * MESSAGE_DELETE
 * * MESSAGE_UPDATE
 * * MESSAGE_DELETE_BULK
 * * MESSAGE_REACTION_ADD
 * * MESSAGE_REACTION_REMOVE
 * * MESSAGE_REACTION_REMOVE_ALL
 * * MESSAGE_REACTION_REMOVE_EMOJI
 * * THREAD_CREATE
 * * THREAD_UPDATE
 * * THREAD_DELETE
 * * THREAD_LIST_SYNC
 * * THREAD_MEMBER_UPDATE
 * * THREAD_MEMBERS_UPDATE
 * * USER_UPDATE
 * * PRESENCE_UPDATE
 * * TYPING_START
 * * VOICE_STATE_UPDATE
 * * VOICE_SERVER_UPDATE
 * * WEBHOOKS_UPDATE
 * * INTERACTION_CREATE
 * * STAGE_INSTANCE_CREATE
 * * STAGE_INSTANCE_UPDATE
 * * STAGE_INSTANCE_DELETE
 * @typedef {string} WSEventType
 */
exports.WSEvents = keyMirror([
  'READY',
  'RESUMED',
  'APPLICATION_COMMAND_CREATE',
  'APPLICATION_COMMAND_DELETE',
  'APPLICATION_COMMAND_UPDATE',
  'GUILD_CREATE',
  'GUILD_DELETE',
  'GUILD_UPDATE',
  'INVITE_CREATE',
  'INVITE_DELETE',
  'GUILD_MEMBER_ADD',
  'GUILD_MEMBER_REMOVE',
  'GUILD_MEMBER_UPDATE',
  'GUILD_MEMBERS_CHUNK',
  'GUILD_INTEGRATIONS_UPDATE',
  'GUILD_ROLE_CREATE',
  'GUILD_ROLE_DELETE',
  'GUILD_ROLE_UPDATE',
  'GUILD_BAN_ADD',
  'GUILD_BAN_REMOVE',
  'GUILD_EMOJIS_UPDATE',
  'CHANNEL_CREATE',
  'CHANNEL_DELETE',
  'CHANNEL_UPDATE',
  'CHANNEL_PINS_UPDATE',
  'MESSAGE_CREATE',
  'MESSAGE_DELETE',
  'MESSAGE_UPDATE',
  'MESSAGE_DELETE_BULK',
  'MESSAGE_REACTION_ADD',
  'MESSAGE_REACTION_REMOVE',
  'MESSAGE_REACTION_REMOVE_ALL',
  'MESSAGE_REACTION_REMOVE_EMOJI',
  'THREAD_CREATE',
  'THREAD_UPDATE',
  'THREAD_DELETE',
  'THREAD_LIST_SYNC',
  'THREAD_MEMBER_UPDATE',
  'THREAD_MEMBERS_UPDATE',
  'USER_UPDATE',
  'PRESENCE_UPDATE',
  'TYPING_START',
  'VOICE_STATE_UPDATE',
  'VOICE_SERVER_UPDATE',
  'WEBHOOKS_UPDATE',
  'INTERACTION_CREATE',
  'STAGE_INSTANCE_CREATE',
  'STAGE_INSTANCE_UPDATE',
  'STAGE_INSTANCE_DELETE',
]);

/**
 * A valid scope to request when generating an invite link.
 * <warn>Scopes that require whitelist are not considered valid for this generator</warn>
 * * `applications.builds.read`: allows reading build data for a users applications
 * * `applications.commands`: allows this bot to create commands in the server
 * * `applications.entitlements`: allows reading entitlements for a users applications
 * * `applications.store.update`: allows reading and updating of store data for a users applications
 * * `bot`: makes the bot join the selected guild
 * * `connections`: makes the endpoint for getting a users connections available
 * * `email`: allows the `/users/@me` endpoint return with an email
 * * `identify`: allows the `/users/@me` endpoint without an email
 * * `guilds`: makes the `/users/@me/guilds` endpoint available for a user
 * * `guilds.join`: allows the bot to join the user to any guild it is in using Guild#addMember
 * * `gdm.join`: allows joining the user to a group dm
 * * `webhook.incoming`: generates a webhook to a channel
 * @typedef {string} InviteScope
 */
exports.InviteScopes = [
  'applications.builds.read',
  'applications.commands',
  'applications.entitlements',
  'applications.store.update',
  'bot',
  'connections',
  'email',
  'identity',
  'guilds',
  'guilds.join',
  'gdm.join',
  'webhook.incoming',
];

/**
 * The type of a message, e.g. `DEFAULT`. Here are the available types:
 * * DEFAULT
 * * RECIPIENT_ADD
 * * RECIPIENT_REMOVE
 * * CALL
 * * CHANNEL_NAME_CHANGE
 * * CHANNEL_ICON_CHANGE
 * * PINS_ADD
 * * GUILD_MEMBER_JOIN
 * * USER_PREMIUM_GUILD_SUBSCRIPTION
 * * USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_1
 * * USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_2
 * * USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_3
 * * CHANNEL_FOLLOW_ADD
 * * GUILD_DISCOVERY_DISQUALIFIED
 * * GUILD_DISCOVERY_REQUALIFIED
 * * GUILD_DISCOVERY_GRACE_PERIOD_INITIAL_WARNING
 * * GUILD_DISCOVERY_GRACE_PERIOD_FINAL_WARNING
 * * THREAD_CREATED
 * * REPLY
 * * APPLICATION_COMMAND
 * * THREAD_STARTER_MESSAGE
 * * GUILD_INVITE_REMINDER
 * @typedef {string} MessageType
 */
exports.MessageTypes = [
  'DEFAULT',
  'RECIPIENT_ADD',
  'RECIPIENT_REMOVE',
  'CALL',
  'CHANNEL_NAME_CHANGE',
  'CHANNEL_ICON_CHANGE',
  'PINS_ADD',
  'GUILD_MEMBER_JOIN',
  'USER_PREMIUM_GUILD_SUBSCRIPTION',
  'USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_1',
  'USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_2',
  'USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_3',
  'CHANNEL_FOLLOW_ADD',
  null,
  'GUILD_DISCOVERY_DISQUALIFIED',
  'GUILD_DISCOVERY_REQUALIFIED',
  'GUILD_DISCOVERY_GRACE_PERIOD_INITIAL_WARNING',
  'GUILD_DISCOVERY_GRACE_PERIOD_FINAL_WARNING',
  'THREAD_CREATED',
  'REPLY',
  'APPLICATION_COMMAND',
  'THREAD_STARTER_MESSAGE',
  'GUILD_INVITE_REMINDER',
];

/**
 * The types of messages that are `System`. The available types are `MessageTypes` excluding:
 * * DEFAULT
 * * REPLY
 * * APPLICATION_COMMAND
 * @typedef {string} SystemMessageType
 */
exports.SystemMessageTypes = exports.MessageTypes.filter(
  type => type && !['DEFAULT', 'REPLY', 'APPLICATION_COMMAND'].includes(type),
);

/**
 * <info>Bots cannot set a `CUSTOM` activity type, it is only for custom statuses received from users</info>
 * The type of an activity of a users presence, e.g. `PLAYING`. Here are the available types:
 * * PLAYING
 * * STREAMING
 * * LISTENING
 * * WATCHING
 * * CUSTOM
 * * COMPETING
 * @typedef {string} ActivityType
 */
exports.ActivityTypes = createEnum(['PLAYING', 'STREAMING', 'LISTENING', 'WATCHING', 'CUSTOM', 'COMPETING']);

/**
 * All available channel types:
 * * `GUILD_TEXT` - a guild text channel
 * * `DM` - a DM channel
 * * `GUILD_VOICE` - a guild voice channel
 * * `GROUP_DM` - a group DM channel
 * * `GUILD_CATEGORY` - a guild category channel
 * * `GUILD_NEWS` - a guild news channel
 * * `GUILD_STORE` - a guild store channel
 * * `GUILD_NEWS_THREAD` - a guild news channel's public thread channel
 * * `GUILD_PUBLIC_THREAD` - a guild text channel's public thread channel
 * * `GUILD_PRIVATE_THREAD` - a guild text channel's private thread channel
 * * `GUILD_STAGE_VOICE` - a guild stage voice channel
 * * `UNKNOWN` - a generic channel of unknown type, could be Channel or GuildChannel
 * @typedef {string} ChannelType
 */
exports.ChannelTypes = createEnum([
  'GUILD_TEXT',
  'DM',
  'GUILD_VOICE',
  'GROUP_DM',
  'GUILD_CATEGORY',
  'GUILD_NEWS',
  'GUILD_STORE',
  ...Array(3).fill(null),
  // 10
  'GUILD_NEWS_THREAD',
  'GUILD_PUBLIC_THREAD',
  'GUILD_PRIVATE_THREAD',
  'GUILD_STAGE_VOICE',
]);

/**
 * The types of channels that are text-based. The available types are:
 * * DM
 * * GUILD_TEXT
 * * GUILD_NEWS
 * * GUILD_NEWS_THREAD
 * * GUILD_PUBLIC_THREAD
 * * GUILD_PRIVATE_THREAD
 * @typedef {string} TextBasedChannelTypes
 */
exports.TextBasedChannelTypes = [
  'DM',
  'GUILD_TEXT',
  'GUILD_NEWS',
  'GUILD_NEWS_THREAD',
  'GUILD_PUBLIC_THREAD',
  'GUILD_PRIVATE_THREAD',
];

/**
 * The types of channels that are threads. The available types are:
 * * GUILD_NEWS_THREAD
 * * GUILD_PUBLIC_THREAD
 * * GUILD_PRIVATE_THREAD
 * @typedef {string} ThreadChannelTypes
 */
exports.ThreadChannelTypes = ['GUILD_NEWS_THREAD', 'GUILD_PUBLIC_THREAD', 'GUILD_PRIVATE_THREAD'];

/**
 * The types of channels that are voice-based. The available types are:
 * * GUILD_VOICE
 * * GUILD_STAGE_VOICE
 * @typedef {string} VoiceBasedChannelTypes
 */
exports.VoiceBasedChannelTypes = ['GUILD_VOICE', 'GUILD_STAGE_VOICE'];

exports.ClientApplicationAssetTypes = {
  SMALL: 1,
  BIG: 2,
};

exports.Colors = {
  DEFAULT: 0x000000,
  WHITE: 0xffffff,
  AQUA: 0x1abc9c,
  GREEN: 0x57f287,
  BLUE: 0x3498db,
  YELLOW: 0xfee75c,
  PURPLE: 0x9b59b6,
  LUMINOUS_VIVID_PINK: 0xe91e63,
  FUCHSIA: 0xeb459e,
  GOLD: 0xf1c40f,
  ORANGE: 0xe67e22,
  RED: 0xed4245,
  GREY: 0x95a5a6,
  NAVY: 0x34495e,
  DARK_AQUA: 0x11806a,
  DARK_GREEN: 0x1f8b4c,
  DARK_BLUE: 0x206694,
  DARK_PURPLE: 0x71368a,
  DARK_VIVID_PINK: 0xad1457,
  DARK_GOLD: 0xc27c0e,
  DARK_ORANGE: 0xa84300,
  DARK_RED: 0x992d22,
  DARK_GREY: 0x979c9f,
  DARKER_GREY: 0x7f8c8d,
  LIGHT_GREY: 0xbcc0c0,
  DARK_NAVY: 0x2c3e50,
  BLURPLE: 0x5865f2,
  GREYPLE: 0x99aab5,
  DARK_BUT_NOT_BLACK: 0x2c2f33,
  NOT_QUITE_BLACK: 0x23272a,
};

/**
 * The value set for the explicit content filter levels for a guild:
 * * DISABLED
 * * MEMBERS_WITHOUT_ROLES
 * * ALL_MEMBERS
 * @typedef {string} ExplicitContentFilterLevel
 */
exports.ExplicitContentFilterLevels = createEnum(['DISABLED', 'MEMBERS_WITHOUT_ROLES', 'ALL_MEMBERS']);

/**
 * The value set for the verification levels for a guild:
 * * NONE
 * * LOW
 * * MEDIUM
 * * HIGH
 * * VERY_HIGH
 * @typedef {string} VerificationLevel
 */
exports.VerificationLevels = createEnum(['NONE', 'LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH']);

/**
 * An error encountered while performing an API request. Here are the potential errors:
 * * UNKNOWN_ACCOUNT
 * * UNKNOWN_APPLICATION
 * * UNKNOWN_CHANNEL
 * * UNKNOWN_GUILD
 * * UNKNOWN_INTEGRATION
 * * UNKNOWN_INVITE
 * * UNKNOWN_MEMBER
 * * UNKNOWN_MESSAGE
 * * UNKNOWN_OVERWRITE
 * * UNKNOWN_PROVIDER
 * * UNKNOWN_ROLE
 * * UNKNOWN_TOKEN
 * * UNKNOWN_USER
 * * UNKNOWN_EMOJI
 * * UNKNOWN_WEBHOOK
 * * UNKNOWN_WEBHOOK_SERVICE
 * * UNKNOWN_SESSION
 * * UNKNOWN_BAN
 * * UNKNOWN_SKU
 * * UNKNOWN_STORE_LISTING
 * * UNKNOWN_ENTITLEMENT
 * * UNKNOWN_BUILD
 * * UNKNOWN_LOBBY
 * * UNKNOWN_BRANCH
 * * UNKNOWN_STORE_DIRECTORY_LAYOUT
 * * UNKNOWN_REDISTRIBUTABLE
 * * UNKNOWN_GIFT_CODE
 * * UNKNOWN_GUILD_TEMPLATE
 * * UNKNOWN_DISCOVERABLE_SERVER_CATEGORY
 * * UNKNOWN_STICKER
 * * UNKNOWN_INTERACTION
 * * UNKNOWN_APPLICATION_COMMAND
 * * UNKNOWN_APPLICATION_COMMAND_PERMISSIONS
 * * UNKNOWN_STAGE_INSTANCE
 * * UNKNOWN_GUILD_MEMBER_VERIFICATION_FORM
 * * UNKNOWN_GUILD_WELCOME_SCREEN
 * * BOT_PROHIBITED_ENDPOINT
 * * BOT_ONLY_ENDPOINT
 * * CANNOT_SEND_EXPLICIT_CONTENT
 * * NOT_AUTHORIZED
 * * SLOWMODE_RATE_LIMIT
 * * ACCOUNT_OWNER_ONLY
 * * ANNOUNCEMENT_EDIT_LIMIT_EXCEEDED
 * * CHANNEL_HIT_WRITE_RATELIMIT
 * * CONTENT_NOT_ALLOWED
 * * MAXIMUM_GUILDS
 * * MAXIMUM_FRIENDS
 * * MAXIMUM_PINS
 * * MAXIMUM_RECIPIENTS
 * * MAXIMUM_ROLES
 * * MAXIMUM_WEBHOOKS
 * * MAXIMUM_EMOJIS
 * * MAXIMUM_REACTIONS
 * * MAXIMUM_CHANNELS
 * * MAXIMUM_ATTACHMENTS
 * * MAXIMUM_INVITES
 * * MAXIMUM_ANIMATED_EMOJIS
 * * MAXIMUM_SERVER_MEMBERS
 * * MAXIMUM_NUMBER_OF_SERVER_CATEGORIES
 * * GUILD_ALREADY_HAS_TEMPLATE
 * * MAXIMUM_THREAD_PARTICIPANTS
 * * MAXIMUM_NON_GUILD_MEMBERS_BANS
 * * MAXIMUM_BAN_FETCHES
 * * MAXIMUM_NUMBER_OF_STICKERS_REACHED
 * * UNAUTHORIZED
 * * ACCOUNT_VERIFICATION_REQUIRED
 * * DIRECT_MESSAGES_TOO_FAST
 * * REQUEST_ENTITY_TOO_LARGE
 * * FEATURE_TEMPORARILY_DISABLED
 * * USER_BANNED
 * * TARGET_USER_NOT_CONNECTED_TO_VOICE
 * * ALREADY_CROSSPOSTED
 * * MISSING_ACCESS
 * * INVALID_ACCOUNT_TYPE
 * * CANNOT_EXECUTE_ON_DM
 * * EMBED_DISABLED
 * * CANNOT_EDIT_MESSAGE_BY_OTHER
 * * CANNOT_SEND_EMPTY_MESSAGE
 * * CANNOT_MESSAGE_USER
 * * CANNOT_SEND_MESSAGES_IN_VOICE_CHANNEL
 * * CHANNEL_VERIFICATION_LEVEL_TOO_HIGH
 * * OAUTH2_APPLICATION_BOT_ABSENT
 * * MAXIMUM_OAUTH2_APPLICATIONS
 * * INVALID_OAUTH_STATE
 * * MISSING_PERMISSIONS
 * * INVALID_AUTHENTICATION_TOKEN
 * * NOTE_TOO_LONG
 * * INVALID_BULK_DELETE_QUANTITY
 * * CANNOT_PIN_MESSAGE_IN_OTHER_CHANNEL
 * * INVALID_OR_TAKEN_INVITE_CODE
 * * CANNOT_EXECUTE_ON_SYSTEM_MESSAGE
 * * CANNOT_EXECUTE_ON_CHANNEL_TYPE
 * * INVALID_OAUTH_TOKEN
 * * MISSING_OAUTH_SCOPE
 * * INVALID_WEBHOOK_TOKEN
 * * INVALID_ROLE
 * * INVALID_RECIPIENTS
 * * BULK_DELETE_MESSAGE_TOO_OLD
 * * INVALID_FORM_BODY
 * * INVITE_ACCEPTED_TO_GUILD_NOT_CONTAINING_BOT
 * * INVALID_API_VERSION
 * * CANNOT_SELF_REDEEM_GIFT
 * * PAYMENT_SOURCE_REQUIRED
 * * CANNOT_DELETE_COMMUNITY_REQUIRED_CHANNEL
 * * INVALID_STICKER_SENT
 * * INVALID_OPERATION_ON_ARCHIVED_THREAD
 * * INVALID_THREAD_NOTIFICATION_SETTINGS
 * * PARAMETER_EARLIER_THAN_CREATION
 * * TWO_FACTOR_REQUIRED
 * * NO_USERS_WITH_DISCORDTAG_EXIST
 * * REACTION_BLOCKED
 * * RESOURCE_OVERLOADED
 * * STAGE_ALREADY_OPEN
 * * MESSAGE_ALREADY_HAS_THREAD
 * * THREAD_LOCKED
 * * MAXIMUM_ACTIVE_THREADS
 * * MAXIMUM_ACTIVE_ANNOUCEMENT_THREAD
 * @typedef {string} APIError
 */
exports.APIErrors = {
  UNKNOWN_ACCOUNT: 10001,
  UNKNOWN_APPLICATION: 10002,
  UNKNOWN_CHANNEL: 10003,
  UNKNOWN_GUILD: 10004,
  UNKNOWN_INTEGRATION: 10005,
  UNKNOWN_INVITE: 10006,
  UNKNOWN_MEMBER: 10007,
  UNKNOWN_MESSAGE: 10008,
  UNKNOWN_OVERWRITE: 10009,
  UNKNOWN_PROVIDER: 10010,
  UNKNOWN_ROLE: 10011,
  UNKNOWN_TOKEN: 10012,
  UNKNOWN_USER: 10013,
  UNKNOWN_EMOJI: 10014,
  UNKNOWN_WEBHOOK: 10015,
  UNKNOWN_WEBHOOK_SERVICE: 10016,
  UNKNOWN_SESSION: 10020,
  UNKNOWN_BAN: 10026,
  UNKNOWN_SKU: 10027,
  UNKNOWN_STORE_LISTING: 10028,
  UNKNOWN_ENTITLEMENT: 10029,
  UNKNOWN_BUILD: 10030,
  UNKNOWN_LOBBY: 10031,
  UNKNOWN_BRANCH: 10032,
  UNKNOWN_STORE_DIRECTORY_LAYOUT: 10033,
  UNKNOWN_REDISTRIBUTABLE: 10036,
  UNKNOWN_GIFT_CODE: 10038,
  UNKNOWN_GUILD_TEMPLATE: 10057,
  UNKNOWN_DISCOVERABLE_SERVER_CATEGORY: 10059,
  UNKNOWN_STICKER: 10060,
  UNKNOWN_INTERACTION: 10062,
  UNKNOWN_APPLICATION_COMMAND: 10063,
  UNKNOWN_APPLICATION_COMMAND_PERMISSIONS: 10066,
  UNKNOWN_STAGE_INSTANCE: 10067,
  UNKNOWN_GUILD_MEMBER_VERIFICATION_FORM: 10068,
  UNKNOWN_GUILD_WELCOME_SCREEN: 10069,
  BOT_PROHIBITED_ENDPOINT: 20001,
  BOT_ONLY_ENDPOINT: 20002,
  CANNOT_SEND_EXPLICIT_CONTENT: 20009,
  NOT_AUTHORIZED: 20012,
  SLOWMODE_RATE_LIMIT: 20016,
  ACCOUNT_OWNER_ONLY: 20018,
  ANNOUNCEMENT_EDIT_LIMIT_EXCEEDED: 20022,
  CHANNEL_HIT_WRITE_RATELIMIT: 20028,
  CONTENT_NOT_ALLOWED: 20031,
  GUILD_PREMIUM_LEVEL_TOO_LOW: 20035,
  MAXIMUM_GUILDS: 30001,
  MAXIMUM_FRIENDS: 30002,
  MAXIMUM_PINS: 30003,
  MAXIMUM_RECIPIENTS: 30004,
  MAXIMUM_ROLES: 30005,
  MAXIMUM_WEBHOOKS: 30007,
  MAXIMUM_EMOJIS: 30008,
  MAXIMUM_REACTIONS: 30010,
  MAXIMUM_CHANNELS: 30013,
  MAXIMUM_ATTACHMENTS: 30015,
  MAXIMUM_INVITES: 30016,
  MAXIMUM_ANIMATED_EMOJIS: 30018,
  MAXIMUM_SERVER_MEMBERS: 30019,
  MAXIMUM_NUMBER_OF_SERVER_CATEGORIES: 30030,
  GUILD_ALREADY_HAS_TEMPLATE: 30031,
  MAXIMUM_THREAD_PARTICIPANTS: 30033,
  MAXIMUM_NON_GUILD_MEMBERS_BANS: 30035,
  MAXIMUM_BAN_FETCHES: 30037,
  MAXIMUM_NUMBER_OF_STICKERS_REACHED: 30039,
  UNAUTHORIZED: 40001,
  ACCOUNT_VERIFICATION_REQUIRED: 40002,
  DIRECT_MESSAGES_TOO_FAST: 40003,
  REQUEST_ENTITY_TOO_LARGE: 40005,
  FEATURE_TEMPORARILY_DISABLED: 40006,
  USER_BANNED: 40007,
  TARGET_USER_NOT_CONNECTED_TO_VOICE: 40032,
  ALREADY_CROSSPOSTED: 40033,
  MISSING_ACCESS: 50001,
  INVALID_ACCOUNT_TYPE: 50002,
  CANNOT_EXECUTE_ON_DM: 50003,
  EMBED_DISABLED: 50004,
  CANNOT_EDIT_MESSAGE_BY_OTHER: 50005,
  CANNOT_SEND_EMPTY_MESSAGE: 50006,
  CANNOT_MESSAGE_USER: 50007,
  CANNOT_SEND_MESSAGES_IN_VOICE_CHANNEL: 50008,
  CHANNEL_VERIFICATION_LEVEL_TOO_HIGH: 50009,
  OAUTH2_APPLICATION_BOT_ABSENT: 50010,
  MAXIMUM_OAUTH2_APPLICATIONS: 50011,
  INVALID_OAUTH_STATE: 50012,
  MISSING_PERMISSIONS: 50013,
  INVALID_AUTHENTICATION_TOKEN: 50014,
  NOTE_TOO_LONG: 50015,
  INVALID_BULK_DELETE_QUANTITY: 50016,
  CANNOT_PIN_MESSAGE_IN_OTHER_CHANNEL: 50019,
  INVALID_OR_TAKEN_INVITE_CODE: 50020,
  CANNOT_EXECUTE_ON_SYSTEM_MESSAGE: 50021,
  CANNOT_EXECUTE_ON_CHANNEL_TYPE: 50024,
  INVALID_OAUTH_TOKEN: 50025,
  MISSING_OAUTH_SCOPE: 50026,
  INVALID_WEBHOOK_TOKEN: 50027,
  INVALID_ROLE: 50028,
  INVALID_RECIPIENTS: 50033,
  BULK_DELETE_MESSAGE_TOO_OLD: 50034,
  INVALID_FORM_BODY: 50035,
  INVITE_ACCEPTED_TO_GUILD_NOT_CONTAINING_BOT: 50036,
  INVALID_API_VERSION: 50041,
  CANNOT_SELF_REDEEM_GIFT: 50054,
  PAYMENT_SOURCE_REQUIRED: 50070,
  CANNOT_DELETE_COMMUNITY_REQUIRED_CHANNEL: 50074,
  INVALID_STICKER_SENT: 50081,
  INVALID_OPERATION_ON_ARCHIVED_THREAD: 50083,
  INVALID_THREAD_NOTIFICATION_SETTINGS: 50084,
  PARAMETER_EARLIER_THAN_CREATION: 50085,
  TWO_FACTOR_REQUIRED: 60003,
  NO_USERS_WITH_DISCORDTAG_EXIST: 80004,
  REACTION_BLOCKED: 90001,
  RESOURCE_OVERLOADED: 130000,
  STAGE_ALREADY_OPEN: 150006,
  MESSAGE_ALREADY_HAS_THREAD: 160004,
  THREAD_LOCKED: 160005,
  MAXIMUM_ACTIVE_THREADS: 160006,
  MAXIMUM_ACTIVE_ANNOUCEMENT_THREAD: 160007,
};

/**
 * The value set for a guild's default message notifications, e.g. `ALL_MESSAGES`. Here are the available types:
 * * ALL_MESSAGES
 * * ONLY_MENTIONS
 * @typedef {string} DefaultMessageNotificationLevel
 */
exports.DefaultMessageNotificationLevels = createEnum(['ALL_MESSAGES', 'ONLY_MENTIONS']);

/**
 * The value set for a team members's membership state:
 * * INVITED
 * * ACCEPTED
 * @typedef {string} MembershipState
 */
exports.MembershipStates = createEnum([null, 'INVITED', 'ACCEPTED']);

/**
 * The value set for a webhook's type:
 * * Incoming
 * * Channel Follower
 * @typedef {string} WebhookType
 */
exports.WebhookTypes = createEnum([null, 'Incoming', 'Channel Follower']);

/**
 * The value set for a sticker's type:
 * * PNG
 * * APNG
 * * LOTTIE
 * @typedef {string} StickerFormatType
 */
exports.StickerFormatTypes = createEnum([null, 'PNG', 'APNG', 'LOTTIE']);

/**
 * An overwrite type:
 * * role
 * * member
 * @typedef {string} OverwriteType
 */
exports.OverwriteTypes = createEnum(['role', 'member']);

/**
 * The type of an {@link ApplicationCommandOption} object:
 * * SUB_COMMAND
 * * SUB_COMMAND_GROUP
 * * STRING
 * * INTEGER
 * * BOOLEAN
 * * USER
 * * CHANNEL
 * * ROLE
 * * MENTIONABLE
 * @typedef {string} ApplicationCommandOptionType
 */
exports.ApplicationCommandOptionTypes = createEnum([
  null,
  'SUB_COMMAND',
  'SUB_COMMAND_GROUP',
  'STRING',
  'INTEGER',
  'BOOLEAN',
  'USER',
  'CHANNEL',
  'ROLE',
  'MENTIONABLE',
]);

/**
 * The type of an {@link ApplicationCommandPermissions} object:
 * * ROLE
 * * USER
 * @typedef {string} ApplicationCommandPermissionType
 */
exports.ApplicationCommandPermissionTypes = createEnum([null, 'ROLE', 'USER']);

/**
 * The type of an {@link Interaction} object:
 * * PING
 * * APPLICATION_COMMAND
 * * MESSAGE_COMPONENT
 * @typedef {string} InteractionType
 */
exports.InteractionTypes = createEnum([null, 'PING', 'APPLICATION_COMMAND', 'MESSAGE_COMPONENT']);

/**
 * The type of an interaction response:
 * * PONG
 * * CHANNEL_MESSAGE_WITH_SOURCE
 * * DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE
 * * DEFERRED_MESSAGE_UPDATE
 * * UPDATE_MESSAGE
 * @typedef {string} InteractionResponseType
 */
exports.InteractionResponseTypes = createEnum([
  null,
  'PONG',
  null,
  null,
  'CHANNEL_MESSAGE_WITH_SOURCE',
  'DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE',
  'DEFERRED_MESSAGE_UPDATE',
  'UPDATE_MESSAGE',
]);

/**
 * The type of a message component
 * * ACTION_ROW
 * * BUTTON
 * * SELECT_MENU
 * @typedef {string} MessageComponentType
 */
exports.MessageComponentTypes = createEnum([null, 'ACTION_ROW', 'BUTTON', 'SELECT_MENU']);

/**
 * The style of a message button
 * * PRIMARY
 * * SECONDARY
 * * SUCCESS
 * * DANGER
 * * LINK
 * @typedef {string} MessageButtonStyle
 */
exports.MessageButtonStyles = createEnum([null, 'PRIMARY', 'SECONDARY', 'SUCCESS', 'DANGER', 'LINK']);

/**
 * The required MFA level for a guild
 * * NONE
 * * ELEVATED
 * @typedef {string} MFALevel
 */
exports.MFALevels = createEnum(['NONE', 'ELEVATED']);

/**
 * NSFW level of a Guild:
 * * DEFAULT
 * * EXPLICIT
 * * SAFE
 * * AGE_RESTRICTED
 * @typedef {string} NSFWLevel
 */
exports.NSFWLevels = createEnum(['DEFAULT', 'EXPLICIT', 'SAFE', 'AGE_RESTRICTED']);

/**
 * Privacy level of a {@link StageInstance} object:
 * * PUBLIC
 * * GUILD_ONLY
 * @typedef {string} PrivacyLevel
 */
exports.PrivacyLevels = createEnum([null, 'PUBLIC', 'GUILD_ONLY']);

/**
 * The premium tier (Server Boost level) of a guild:
 * * NONE
 * * TIER_1
 * * TIER_2
 * * TIER_3
 * @typedef {string} PremiumTier
 */
exports.PremiumTiers = createEnum(['NONE', 'TIER_1', 'TIER_2', 'TIER_3']);

function keyMirror(arr) {
  let tmp = Object.create(null);
  for (const value of arr) tmp[value] = value;
  return tmp;
}

function createEnum(keys) {
  const obj = {};
  for (const [index, key] of keys.entries()) {
    if (key === null) continue;
    obj[key] = index;
    obj[index] = key;
  }
  return obj;
}
