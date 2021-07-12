// These are enums that are used in the typings file but do not exist as actual exported values. To prevent them from
// showing up in an editor, they are imported from here instead of exporting them there directly.

export enum ActivityTypes {
  PLAYING = 0,
  STREAMING = 1,
  LISTENING = 2,
  WATCHING = 3,
  CUSTOM = 4,
  COMPETING = 5,
}

export enum ApplicationCommandOptionTypes {
  SUB_COMMAND = 1,
  SUB_COMMAND_GROUP = 2,
  STRING = 3,
  INTEGER = 4,
  BOOLEAN = 5,
  USER = 6,
  CHANNEL = 7,
  ROLE = 8,
  MENTIONABLE = 9,
}

export enum ApplicationCommandPermissionTypes {
  ROLE = 1,
  USER = 2,
}

export enum ChannelTypes {
  GUILD_TEXT = 0,
  DM = 1,
  GUILD_VOICE = 2,
  GROUP_DM = 3,
  GUILD_CATEGORY = 4,
  GUILD_NEWS = 5,
  GUILD_STORE = 6,
  UNKNOWN = 7,
  GUILD_NEWS_THREAD = 10,
  GUILD_PUBLIC_THREAD = 11,
  GUILD_PRIVATE_THREAD = 12,
  GUILD_STAGE_VOICE = 13,
}

export enum DefaultMessageNotificationLevels {
  ALL_MESSAGES = 0,
  ONLY_MENTIONS = 1,
}

export enum ExplicitContentFilterLevels {
  DISABLED = 0,
  MEMBERS_WITHOUT_ROLES = 1,
  ALL_MEMBERS = 2,
}

export enum InteractionResponseTypes {
  PONG = 1,
  CHANNEL_MESSAGE_WITH_SOURCE = 4,
  DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE = 5,
  DEFERRED_MESSAGE_UPDATE = 6,
  UPDATE_MESSAGE = 7,
}

export enum InteractionTypes {
  PING = 1,
  APPLICATION_COMMAND = 2,
  MESSAGE_COMPONENT = 3,
}

export enum InviteTargetType {
  STREAM = 1,
  EMBEDDED_APPLICATION = 2,
}

export enum MembershipStates {
  INVITED = 1,
  ACCEPTED = 2,
}

export enum MessageButtonStyles {
  PRIMARY = 1,
  SECONDARY = 2,
  SUCCESS = 3,
  DANGER = 4,
  LINK = 5,
}

export enum MessageComponentTypes {
  ACTION_ROW = 1,
  BUTTON = 2,
  SELECT_MENU = 3,
}

export enum MFALevels {
  NONE = 0,
  ELEVATED = 1,
}

export enum NSFWLevels {
  DEFAULT = 0,
  EXPLICIT = 1,
  SAFE = 2,
  AGE_RESTRICTED = 3,
}

export enum OverwriteTypes {
  role = 0,
  member = 1,
}

export enum PremiumTiers {
  NONE = 0,
  TIER_1 = 1,
  TIER_2 = 2,
  TIER_3 = 3,
}

export enum PrivacyLevels {
  PUBLIC = 1,
  GUILD_ONLY = 2,
}

export enum StickerFormatTypes {
  PNG = 1,
  APNG = 2,
  LOTTIE = 3,
}

export enum VerificationLevels {
  NONE = 0,
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  VERY_HIGH = 4,
}

export enum WebhookTypes {
  Incoming = 1,
  'Channel Follower' = 2,
}

export enum ConstantsEvents {
  RATE_LIMIT = 'rateLimit',
  INVALID_REQUEST_WARNING = 'invalidRequestWarning',
  CLIENT_READY = 'ready',
  APPLICATION_COMMAND_CREATE = 'applicationCommandCreate',
  APPLICATION_COMMAND_DELETE = 'applicationCommandDelete',
  APPLICATION_COMMAND_UPDATE = 'applicationCommandUpdate',
  GUILD_CREATE = 'guildCreate',
  GUILD_DELETE = 'guildDelete',
  GUILD_UPDATE = 'guildUpdate',
  INVITE_CREATE = 'inviteCreate',
  INVITE_DELETE = 'inviteDelete',
  GUILD_UNAVAILABLE = 'guildUnavailable',
  GUILD_MEMBER_ADD = 'guildMemberAdd',
  GUILD_MEMBER_REMOVE = 'guildMemberRemove',
  GUILD_MEMBER_UPDATE = 'guildMemberUpdate',
  GUILD_MEMBER_AVAILABLE = 'guildMemberAvailable',
  GUILD_MEMBERS_CHUNK = 'guildMembersChunk',
  GUILD_INTEGRATIONS_UPDATE = 'guildIntegrationsUpdate',
  GUILD_ROLE_CREATE = 'roleCreate',
  GUILD_ROLE_DELETE = 'roleDelete',
  GUILD_ROLE_UPDATE = 'roleUpdate',
  GUILD_EMOJI_CREATE = 'emojiCreate',
  GUILD_EMOJI_DELETE = 'emojiDelete',
  GUILD_EMOJI_UPDATE = 'emojiUpdate',
  GUILD_BAN_ADD = 'guildBanAdd',
  GUILD_BAN_REMOVE = 'guildBanRemove',
  CHANNEL_CREATE = 'channelCreate',
  CHANNEL_DELETE = 'channelDelete',
  CHANNEL_UPDATE = 'channelUpdate',
  CHANNEL_PINS_UPDATE = 'channelPinsUpdate',
  MESSAGE_CREATE = 'messageCreate',
  MESSAGE_DELETE = 'messageDelete',
  MESSAGE_UPDATE = 'messageUpdate',
  MESSAGE_BULK_DELETE = 'messageDeleteBulk',
  MESSAGE_REACTION_ADD = 'messageReactionAdd',
  MESSAGE_REACTION_REMOVE = 'messageReactionRemove',
  MESSAGE_REACTION_REMOVE_ALL = 'messageReactionRemoveAll',
  MESSAGE_REACTION_REMOVE_EMOJI = 'messageReactionRemoveEmoji',
  THREAD_CREATE = 'threadCreate',
  THREAD_DELETE = 'threadDelete',
  THREAD_UPDATE = 'threadUpdate',
  THREAD_LIST_SYNC = 'threadListSync',
  THREAD_MEMBER_UPDATE = 'threadMemberUpdate',
  THREAD_MEMBERS_UPDATE = 'threadMembersUpdate',
  USER_UPDATE = 'userUpdate',
  PRESENCE_UPDATE = 'presenceUpdate',
  VOICE_SERVER_UPDATE = 'voiceServerUpdate',
  VOICE_STATE_UPDATE = 'voiceStateUpdate',
  TYPING_START = 'typingStart',
  WEBHOOKS_UPDATE = 'webhookUpdate',
  INTERACTION_CREATE = 'interactionCreate',
  ERROR = 'error',
  WARN = 'warn',
  DEBUG = 'debug',
  SHARD_DISCONNECT = 'shardDisconnect',
  SHARD_ERROR = 'shardError',
  SHARD_RECONNECTING = 'shardReconnecting',
  SHARD_READY = 'shardReady',
  SHARD_RESUME = 'shardResume',
  INVALIDATED = 'invalidated',
  RAW = 'raw',
  STAGE_INSTANCE_CREATE = 'stageInstanceCreate',
  STAGE_INSTANCE_UPDATE = 'stageInstanceUpdate',
  STAGE_INSTANCE_DELETE = 'stageInstanceDelete',
}

export enum ConstantsShardEvents {
  CLOSE = 'close',
  DESTROYED = 'destroyed',
  INVALID_SESSION = 'invalidSession',
  READY = 'ready',
  RESUMED = 'resumed',
}

export enum ConstantsColors {
  DEFAULT = 0x000000,
  WHITE = 0xffffff,
  AQUA = 0x1abc9c,
  GREEN = 0x57f287,
  BLUE = 0x3498db,
  YELLOW = 0xfee75c,
  PURPLE = 0x9b59b6,
  LUMINOUS_VIVID_PINK = 0xe91e63,
  FUCHSIA = 0xeb459e,
  GOLD = 0xf1c40f,
  ORANGE = 0xe67e22,
  RED = 0xed4245,
  GREY = 0x95a5a6,
  NAVY = 0x34495e,
  DARK_AQUA = 0x11806a,
  DARK_GREEN = 0x1f8b4c,
  DARK_BLUE = 0x206694,
  DARK_PURPLE = 0x71368a,
  DARK_VIVID_PINK = 0xad1457,
  DARK_GOLD = 0xc27c0e,
  DARK_ORANGE = 0xa84300,
  DARK_RED = 0x992d22,
  DARK_GREY = 0x979c9f,
  DARKER_GREY = 0x7f8c8d,
  LIGHT_GREY = 0xbcc0c0,
  DARK_NAVY = 0x2c3e50,
  BLURPLE = 0x5865f2,
  GREYPLE = 0x99aab5,
  DARK_BUT_NOT_BLACK = 0x2c2f33,
  NOT_QUITE_BLACK = 0x23272a,
}

export enum ConstantsStatus {
  READY = 0,
  CONNECTING = 1,
  RECONNECTING = 2,
  IDLE = 3,
  NEARLY = 4,
  DISCONNECTED = 5,
}

export enum ConstantsOpcodes {
  DISPATCH = 0,
  HEARTBEAT = 1,
  IDENTIFY = 2,
  STATUS_UPDATE = 3,
  VOICE_STATE_UPDATE = 4,
  VOICE_GUILD_PING = 5,
  RESUME = 6,
  RECONNECT = 7,
  REQUEST_GUILD_MEMBERS = 8,
  INVALID_SESSION = 9,
  HELLO = 10,
  HEARTBEAT_ACK = 11,
}

export enum ConstantsClientApplicationAssetTypes {
  SMALL = 1,
  BIG = 2,
}
