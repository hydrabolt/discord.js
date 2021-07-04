declare enum ActivityTypes {
  PLAYING = 0,
  STREAMING = 1,
  LISTENING = 2,
  WATCHING = 3,
  CUSTOM = 4,
  COMPETING = 5,
}

declare enum ApplicationCommandOptionTypes {
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

declare enum ApplicationCommandPermissionTypes {
  ROLE = 1,
  USER = 2,
}

declare enum ChannelType {
  text = 0,
  dm = 1,
  voice = 2,
  group = 3,
  category = 4,
  news = 5,
  store = 6,
  unknown = 7,
  news_thread = 10,
  public_thread = 11,
  private_thread = 12,
  stage = 13,
}

declare enum ChannelTypes {
  TEXT = 0,
  DM = 1,
  VOICE = 2,
  GROUP = 3,
  CATEGORY = 4,
  NEWS = 5,
  STORE = 6,
  NEWS_THREAD = 10,
  PUBLIC_THREAD = 11,
  PRIVATE_THREAD = 12,
  STAGE = 13,
}

declare enum DefaultMessageNotificationLevels {
  ALL_MESSAGES = 0,
  ONLY_MENTIONS = 1,
}

declare enum ExplicitContentFilterLevels {
  DISABLED = 0,
  MEMBERS_WITHOUT_ROLES = 1,
  ALL_MEMBERS = 2,
}

declare enum InteractionResponseTypes {
  PONG = 1,
  CHANNEL_MESSAGE_WITH_SOURCE = 4,
  DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE = 5,
  DEFERRED_MESSAGE_UPDATE = 6,
  UPDATE_MESSAGE = 7,
}

declare enum InteractionTypes {
  PING = 1,
  APPLICATION_COMMAND = 2,
  MESSAGE_COMPONENT = 3,
}

declare enum InviteTargetType {
  STREAM = 1,
  EMBEDDED_APPLICATION = 2,
}

declare enum MembershipStates {
  INVITED = 1,
  ACCEPTED = 2,
}

declare enum MessageButtonStyles {
  PRIMARY = 1,
  SECONDARY = 2,
  SUCCESS = 3,
  DANGER = 4,
  LINK = 5,
}

declare enum MessageComponentTypes {
  ACTION_ROW = 1,
  BUTTON = 2,
  SELECT_MENU = 3,
}

declare enum MFALevels {
  NONE = 0,
  ELEVATED = 1,
}

declare enum NSFWLevels {
  DEFAULT = 0,
  EXPLICIT = 1,
  SAFE = 2,
  AGE_RESTRICTED = 3,
}

declare enum OverwriteTypes {
  role = 0,
  member = 1,
}

declare enum PremiumTiers {
  NONE = 0,
  TIER_1 = 1,
  TIER_2 = 2,
  TIER_3 = 3,
}

declare enum PrivacyLevels {
  PUBLIC = 1,
  GUILD_ONLY = 2,
}

declare enum StickerFormatTypes {
  PNG = 1,
  APNG = 2,
  LOTTIE = 3,
}

declare enum VerificationLevels {
  NONE = 0,
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  VERY_HIGH = 4,
}

declare enum WebhookTypes {
  Incoming = 1,
  'Channel Follower' = 2,
}

type Awaited<T> = T | PromiseLike<T>;

declare module '@discordjs/voice' {
  import { GatewayVoiceServerUpdateDispatchData, GatewayVoiceStateUpdateDispatchData } from 'discord-api-types/v8';

  export interface DiscordGatewayAdapterLibraryMethods {
    onVoiceServerUpdate(data: GatewayVoiceServerUpdateDispatchData): void;
    onVoiceStateUpdate(data: GatewayVoiceStateUpdateDispatchData): void;
    destroy(): void;
  }

  export interface DiscordGatewayAdapterImplementerMethods {
    sendPayload(payload: any): boolean;
    destroy(): void;
  }

  export type DiscordGatewayAdapterCreator = (
    methods: DiscordGatewayAdapterLibraryMethods,
  ) => DiscordGatewayAdapterImplementerMethods;
}

declare module 'discord.js' {
  import {
    blockQuote,
    bold,
    codeBlock,
    hideLinkEmbed,
    hyperlink,
    inlineCode,
    italic,
    quote,
    strikethrough,
    time,
    TimestampStyles,
    TimestampStylesString,
    underscore,
  } from '@discordjs/builders';
  import BaseCollection from '@discordjs/collection';
  import { DiscordGatewayAdapterCreator, DiscordGatewayAdapterLibraryMethods } from '@discordjs/voice';
  import { ChildProcess } from 'child_process';
  import {
    APIActionRowComponent,
    APIInteractionDataResolvedChannel,
    APIInteractionDataResolvedGuildMember,
    APIInteractionGuildMember,
    APIMessage,
    APIMessageComponent,
    APIOverwrite,
    APIPartialEmoji,
    APIRole,
    APIUser,
    Snowflake as APISnowflake,
  } from 'discord-api-types/v8';
  import { EventEmitter } from 'events';
  import { PathLike } from 'fs';
  import { Stream } from 'stream';
  import * as WebSocket from 'ws';

  export const version: string;

  //#region Classes

  export class Activity {
    constructor(presence: Presence, data?: unknown);
    public applicationID: Snowflake | null;
    public assets: RichPresenceAssets | null;
    public buttons: string[];
    public readonly createdAt: Date;
    public createdTimestamp: number;
    public details: string | null;
    public emoji: Emoji | null;
    public flags: Readonly<ActivityFlags>;
    public id: Snowflake;
    public name: string;
    public party: {
      id: string | null;
      size: [number, number];
    } | null;
    public platform: ActivityPlatform | null;
    public sessionID: string | null;
    public state: string | null;
    public syncID: string | null;
    public timestamps: {
      start: Date | null;
      end: Date | null;
    } | null;
    public type: ActivityType;
    public url: string | null;
    public equals(activity: Activity): boolean;
  }

  export class ActivityFlags extends BitField<ActivityFlagsString> {
    public static FLAGS: Record<ActivityFlagsString, number>;
    public static resolve(bit?: BitFieldResolvable<ActivityFlagsString, number>): number;
  }

  export abstract class AnonymousGuild extends BaseGuild {
    constructor(client: Client, data: unknown, immediatePatch?: boolean);
    public banner: string | null;
    public description: string | null;
    public nsfwLevel: NSFWLevel;
    public splash: string | null;
    public vanityURLCode: string | null;
    public verificationLevel: VerificationLevel;
    public bannerURL(options?: StaticImageURLOptions): string | null;
    public splashURL(options?: StaticImageURLOptions): string | null;
  }

  export class MessagePayload {
    constructor(target: MessageTarget, options: MessageOptions | WebhookMessageOptions);
    public data: unknown | null;
    public readonly isUser: boolean;
    public readonly isWebhook: boolean;
    public readonly isMessage: boolean;
    public readonly isMessageManager: boolean;
    public readonly isInteraction: boolean;
    public files: unknown[] | null;
    public options: MessageOptions | WebhookMessageOptions;
    public target: MessageTarget;

    public static create(
      target: MessageTarget,
      options: string | MessageOptions | WebhookMessageOptions,
      extra?: MessageOptions | WebhookMessageOptions,
    ): MessagePayload;
    public static resolveFile(fileLike: BufferResolvable | Stream | FileOptions | MessageAttachment): Promise<unknown>;

    public makeContent(): string | undefined;
    public resolveData(): this;
    public resolveFiles(): Promise<this>;
  }

  export abstract class Application {
    constructor(client: Client, data: unknown);
    public readonly createdAt: Date;
    public readonly createdTimestamp: number;
    public description: string | null;
    public icon: string | null;
    public id: Snowflake;
    public name: string | null;
    public coverURL(options?: StaticImageURLOptions): string | null;
    public fetchAssets(): Promise<ApplicationAsset[]>;
    public iconURL(options?: StaticImageURLOptions): string | null;
    public toJSON(): unknown;
    public toString(): string | null;
  }

  export class ApplicationCommand<PermissionsFetchType = {}> extends Base {
    constructor(client: Client, data: unknown, guild?: Guild, guildID?: Snowflake);
    public readonly createdAt: Date;
    public readonly createdTimestamp: number;
    public defaultPermission: boolean;
    public description: string;
    public guild: Guild | null;
    public guildID: Snowflake | null;
    public readonly manager: ApplicationCommandManager;
    public id: Snowflake;
    public name: string;
    public options: ApplicationCommandOption[];
    public permissions: ApplicationCommandPermissionsManager<
      PermissionsFetchType,
      PermissionsFetchType,
      PermissionsFetchType,
      Guild | null,
      Snowflake
    >;
    public delete(): Promise<ApplicationCommand<PermissionsFetchType>>;
    public edit(data: ApplicationCommandData): Promise<ApplicationCommand<PermissionsFetchType>>;
    private static transformOption(option: ApplicationCommandOptionData, received?: boolean): unknown;
  }

  type ApplicationResolvable = Application | Activity | Snowflake;

  export class ApplicationFlags extends BitField<ApplicationFlagsString> {
    public static FLAGS: Record<ApplicationFlagsString, number>;
    public static resolve(bit?: BitFieldResolvable<ApplicationFlagsString, number>): number;
  }

  export class Base {
    constructor(client: Client);
    public readonly client: Client;
    public toJSON(...props: { [key: string]: boolean | string }[]): unknown;
    public valueOf(): string;
  }

  export class BaseClient extends EventEmitter {
    constructor(options?: ClientOptions | WebhookClientOptions);
    private _timeouts: Set<NodeJS.Timeout>;
    private _intervals: Set<NodeJS.Timeout>;
    private _immediates: Set<NodeJS.Immediate>;
    private readonly api: unknown;
    private rest: unknown;
    private decrementMaxListeners(): void;
    private incrementMaxListeners(): void;

    public options: ClientOptions | WebhookClientOptions;
    public clearInterval(interval: NodeJS.Timeout): void;
    public clearTimeout(timeout: NodeJS.Timeout): void;
    public clearImmediate(timeout: NodeJS.Immediate): void;
    public destroy(): void;
    public setInterval(fn: (...args: any[]) => void, delay: number, ...args: any[]): NodeJS.Timeout;
    public setTimeout(fn: (...args: any[]) => void, delay: number, ...args: any[]): NodeJS.Timeout;
    public setImmediate(fn: (...args: any[]) => void, ...args: any[]): NodeJS.Immediate;
    public toJSON(...props: { [key: string]: boolean | string }[]): unknown;
  }

  export abstract class BaseGuild extends Base {
    constructor(client: Client, data: unknown);
    public readonly createdAt: Date;
    public readonly createdTimestamp: number;
    public features: GuildFeatures[];
    public icon: string | null;
    public id: Snowflake;
    public name: string;
    public readonly nameAcronym: string;
    public readonly partnered: boolean;
    public readonly verified: boolean;
    public fetch(): Promise<Guild>;
    public iconURL(options?: ImageURLOptions): string | null;
    public toString(): string;
  }

  export class BaseGuildEmoji extends Emoji {
    constructor(client: Client, data: unknown, guild: Guild | GuildPreview);
    public available: boolean | null;
    public readonly createdAt: Date;
    public readonly createdTimestamp: number;
    public guild: Guild | GuildPreview;
    public id: Snowflake;
    public managed: boolean | null;
    public requiresColons: boolean | null;
  }

  export class BaseGuildVoiceChannel extends GuildChannel {
    constructor(guild: Guild, data?: unknown);
    public readonly members: Collection<Snowflake, GuildMember>;
    public readonly full: boolean;
    public readonly joinable: boolean;
    public rtcRegion: string | null;
    public bitrate: number;
    public userLimit: number;
    public setRTCRegion(region: string | null): Promise<this>;
  }

  export class BaseMessageComponent {
    constructor(data?: BaseMessageComponent | BaseMessageComponentOptions);
    public type: MessageComponentType | null;
    private static create(data: MessageComponentOptions): MessageComponent;
    private static resolveType(type: MessageComponentTypeResolvable): MessageComponentType;
  }

  export class BitField<S extends string, N extends number | bigint = number> {
    constructor(bits?: BitFieldResolvable<S, N>);
    public bitfield: N;
    public add(...bits: BitFieldResolvable<S, N>[]): BitField<S, N>;
    public any(bit: BitFieldResolvable<S, N>): boolean;
    public equals(bit: BitFieldResolvable<S, N>): boolean;
    public freeze(): Readonly<BitField<S, N>>;
    public has(bit: BitFieldResolvable<S, N>): boolean;
    public missing(bits: BitFieldResolvable<S, N>, ...hasParam: readonly unknown[]): S[];
    public remove(...bits: BitFieldResolvable<S, N>[]): BitField<S, N>;
    public serialize(...hasParam: readonly unknown[]): Record<S, boolean>;
    public toArray(...hasParam: readonly unknown[]): S[];
    public toJSON(): N extends number ? number : string;
    public valueOf(): N;
    public [Symbol.iterator](): IterableIterator<S>;
    public static FLAGS: unknown;
    public static resolve(bit?: BitFieldResolvable<any, number | bigint>): number | bigint;
  }

  export class ButtonInteraction extends MessageComponentInteraction {
    public componentType: 'BUTTON';
  }

  export class CategoryChannel extends GuildChannel {
    public readonly children: Collection<Snowflake, GuildChannel>;
    public type: 'category';
  }

  type CategoryChannelResolvable = Snowflake | CategoryChannel;

  export class Channel extends Base {
    constructor(client: Client, data?: unknown, immediatePatch?: boolean);
    public readonly createdAt: Date;
    public readonly createdTimestamp: number;
    public deleted: boolean;
    public id: Snowflake;
    public type: keyof typeof ChannelType;
    public delete(reason?: string): Promise<Channel>;
    public fetch(force?: boolean): Promise<Channel>;
    public isText(): this is TextChannel | DMChannel | NewsChannel | ThreadChannel;
    public isThread(): this is ThreadChannel;
    public toString(): ChannelMention;
  }

  export class Client extends BaseClient {
    constructor(options: ClientOptions);
    private actions: unknown;
    private _eval(script: string): any;
    private _validateOptions(options: ClientOptions): void;

    public application: ClientApplication | null;
    public channels: ChannelManager;
    public readonly emojis: BaseGuildEmojiManager;
    public guilds: GuildManager;
    public options: ClientOptions;
    public readyAt: Date | null;
    public readonly readyTimestamp: number | null;
    public shard: ShardClientUtil | null;
    public token: string | null;
    public readonly uptime: number | null;
    public user: ClientUser | null;
    public users: UserManager;
    public voice: ClientVoiceManager;
    public ws: WebSocketManager;
    public destroy(): void;
    public fetchGuildPreview(guild: GuildResolvable): Promise<GuildPreview>;
    public fetchInvite(invite: InviteResolvable): Promise<Invite>;
    public fetchGuildTemplate(template: GuildTemplateResolvable): Promise<GuildTemplate>;
    public fetchVoiceRegions(): Promise<Collection<string, VoiceRegion>>;
    public fetchWebhook(id: Snowflake, token?: string): Promise<Webhook>;
    public fetchWidget(id: Snowflake): Promise<Widget>;
    public generateInvite(options?: InviteGenerationOptions): string;
    public login(token?: string): Promise<string>;
    public sweepMessages(lifetime?: number): number;
    public toJSON(): unknown;

    public on<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => Awaited<void>): this;
    public on<S extends string | symbol>(
      event: Exclude<S, keyof ClientEvents>,
      listener: (...args: any[]) => Awaited<void>,
    ): this;

    public once<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => Awaited<void>): this;
    public once<S extends string | symbol>(
      event: Exclude<S, keyof ClientEvents>,
      listener: (...args: any[]) => Awaited<void>,
    ): this;

    public emit<K extends keyof ClientEvents>(event: K, ...args: ClientEvents[K]): boolean;
    public emit<S extends string | symbol>(event: Exclude<S, keyof ClientEvents>, ...args: any[]): boolean;

    public off<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => Awaited<void>): this;
    public off<S extends string | symbol>(
      event: Exclude<S, keyof ClientEvents>,
      listener: (...args: any[]) => Awaited<void>,
    ): this;

    public removeAllListeners<K extends keyof ClientEvents>(event?: K): this;
    public removeAllListeners<S extends string | symbol>(event?: Exclude<S, keyof ClientEvents>): this;
  }

  export class ClientApplication extends Application {
    public botPublic: boolean | null;
    public botRequireCodeGrant: boolean | null;
    public commands: ApplicationCommandManager;
    public cover: string | null;
    public flags: Readonly<ApplicationFlags>;
    public owner: User | Team | null;
    public readonly partial: boolean;
    public rpcOrigins: string[];
    public fetch(): Promise<ClientApplication>;
  }

  export class ClientUser extends User {
    public mfaEnabled: boolean;
    public verified: boolean;
    public edit(data: ClientUserEditData): Promise<this>;
    public setActivity(options?: ActivityOptions): Presence;
    public setActivity(name: string, options?: ActivityOptions): Presence;
    public setAFK(afk: boolean, shardID?: number | number[]): Presence;
    public setAvatar(avatar: BufferResolvable | Base64Resolvable): Promise<this>;
    public setPresence(data: PresenceData): Presence;
    public setStatus(status: PresenceStatusData, shardID?: number | number[]): Presence;
    public setUsername(username: string): Promise<this>;
  }

  export class Options {
    public static createDefaultOptions(): ClientOptions;
    public static cacheWithLimits(limits?: Record<string, number>): CacheFactory;
    public static cacheEverything(): CacheFactory;
  }

  export class ClientVoiceManager {
    constructor(client: Client);
    public readonly client: Client;
    public adapters: Map<Snowflake, DiscordGatewayAdapterLibraryMethods>;
  }

  export abstract class Collector<K, V, F extends any[] = []> extends EventEmitter {
    constructor(client: Client, options?: CollectorOptions<[V, ...F]>);
    private _timeout: NodeJS.Timeout | null;
    private _idletimeout: NodeJS.Timeout | null;

    public readonly client: Client;
    public collected: Collection<K, V>;
    public ended: boolean;
    public abstract readonly endReason: string | null;
    public filter: CollectorFilter<[V, ...F]>;
    public readonly next: Promise<V>;
    public options: CollectorOptions<[V, ...F]>;
    public checkEnd(): void;
    public handleCollect(...args: any[]): Promise<void>;
    public handleDispose(...args: any[]): Promise<void>;
    public stop(reason?: string): void;
    public resetTimer(options?: CollectorResetTimerOptions): void;
    public [Symbol.asyncIterator](): AsyncIterableIterator<V>;
    public toJSON(): unknown;

    protected listener: (...args: any[]) => void;
    public abstract collect(...args: any[]): K | null | Promise<K | null>;
    public abstract dispose(...args: any[]): K | null;

    public on(event: 'collect' | 'dispose', listener: (...args: any[]) => Awaited<void>): this;
    public on(event: 'end', listener: (collected: Collection<K, V>, reason: string) => Awaited<void>): this;

    public once(event: 'collect' | 'dispose', listener: (...args: any[]) => Awaited<void>): this;
    public once(event: 'end', listener: (collected: Collection<K, V>, reason: string) => Awaited<void>): this;
  }

  export class CommandInteraction extends Interaction {
    public readonly command: ApplicationCommand | ApplicationCommand<{ guild: GuildResolvable }> | null;
    public readonly channel: TextChannel | DMChannel | NewsChannel | PartialDMChannel | ThreadChannel | null;
    public channelID: Snowflake;
    public commandID: Snowflake;
    public commandName: string;
    public deferred: boolean;
    public ephemeral: boolean | null;
    public options: Collection<string, CommandInteractionOption>;
    public replied: boolean;
    public webhook: InteractionWebhook;
    public defer(options?: InteractionDeferOptions & { fetchReply: true }): Promise<Message | APIMessage>;
    public defer(options?: InteractionDeferOptions): Promise<void>;
    public deleteReply(): Promise<void>;
    public editReply(options: string | MessagePayload | WebhookEditMessageOptions): Promise<Message | APIMessage>;
    public fetchReply(): Promise<Message | APIMessage>;
    public followUp(options: string | MessagePayload | InteractionReplyOptions): Promise<Message | APIMessage>;
    public reply(options: InteractionReplyOptions & { fetchReply: true }): Promise<Message | APIMessage>;
    public reply(options: string | MessagePayload | InteractionReplyOptions): Promise<void>;
    private transformOption(option: unknown, resolved: unknown): CommandInteractionOption;
    private _createOptionsCollection(options: unknown, resolved: unknown): Collection<string, CommandInteractionOption>;
  }

  type AllowedImageFormat = 'webp' | 'png' | 'jpg' | 'jpeg' | 'gif';

  export const Constants: {
    Package: {
      name: string;
      version: string;
      description: string;
      author: string;
      license: string;
      main: PathLike;
      types: PathLike;
      homepage: string;
      keywords: string[];
      bugs: { url: string };
      repository: { type: string; url: string };
      scripts: { [key: string]: string };
      engines: { [key: string]: string };
      dependencies: { [key: string]: string };
      peerDependencies: { [key: string]: string };
      devDependencies: { [key: string]: string };
      [key: string]: any;
    };
    UserAgent: string | null;
    Endpoints: {
      botGateway: string;
      invite: (root: string, code: string) => string;
      CDN: (root: string) => {
        Asset: (name: string) => string;
        DefaultAvatar: (id: Snowflake | number) => string;
        Emoji: (emojiID: Snowflake, format: 'png' | 'gif') => string;
        Avatar: (
          userID: Snowflake | number,
          hash: string,
          format: 'default' | AllowedImageFormat,
          size: number,
          dynamic: boolean,
        ) => string;
        Banner: (
          id: Snowflake | number,
          hash: string,
          format: AllowedImageFormat,
          size: number,
          dynamic: boolean,
        ) => string;
        Icon: (
          userID: Snowflake | number,
          hash: string,
          format: 'default' | AllowedImageFormat,
          size: number,
          dynamic: boolean,
        ) => string;
        AppIcon: (userID: Snowflake | number, hash: string, format: AllowedImageFormat, size: number) => string;
        AppAsset: (userID: Snowflake | number, hash: string, format: AllowedImageFormat, size: number) => string;
        GDMIcon: (userID: Snowflake | number, hash: string, format: AllowedImageFormat, size: number) => string;
        Splash: (guildID: Snowflake | number, hash: string, format: AllowedImageFormat, size: number) => string;
        DiscoverySplash: (
          guildID: Snowflake | number,
          hash: string,
          format: AllowedImageFormat,
          size: number,
        ) => string;
        TeamIcon: (teamID: Snowflake | number, hash: string, format: AllowedImageFormat, size: number) => string;
      };
    };
    WSCodes: {
      1000: 'WS_CLOSE_REQUESTED';
      4004: 'TOKEN_INVALID';
      4010: 'SHARDING_INVALID';
      4011: 'SHARDING_REQUIRED';
    };
    Events: {
      RATE_LIMIT: 'rateLimit';
      INVALID_REQUEST_WARNING: 'invalidRequestWarning';
      CLIENT_READY: 'ready';
      APPLICATION_COMMAND_CREATE: 'applicationCommandCreate';
      APPLICATION_COMMAND_DELETE: 'applicationCommandDelete';
      APPLICATION_COMMAND_UPDATE: 'applicationCommandUpdate';
      GUILD_CREATE: 'guildCreate';
      GUILD_DELETE: 'guildDelete';
      GUILD_UPDATE: 'guildUpdate';
      INVITE_CREATE: 'inviteCreate';
      INVITE_DELETE: 'inviteDelete';
      GUILD_UNAVAILABLE: 'guildUnavailable';
      GUILD_MEMBER_ADD: 'guildMemberAdd';
      GUILD_MEMBER_REMOVE: 'guildMemberRemove';
      GUILD_MEMBER_UPDATE: 'guildMemberUpdate';
      GUILD_MEMBER_AVAILABLE: 'guildMemberAvailable';
      GUILD_MEMBERS_CHUNK: 'guildMembersChunk';
      GUILD_INTEGRATIONS_UPDATE: 'guildIntegrationsUpdate';
      GUILD_ROLE_CREATE: 'roleCreate';
      GUILD_ROLE_DELETE: 'roleDelete';
      GUILD_ROLE_UPDATE: 'roleUpdate';
      GUILD_EMOJI_CREATE: 'emojiCreate';
      GUILD_EMOJI_DELETE: 'emojiDelete';
      GUILD_EMOJI_UPDATE: 'emojiUpdate';
      GUILD_BAN_ADD: 'guildBanAdd';
      GUILD_BAN_REMOVE: 'guildBanRemove';
      CHANNEL_CREATE: 'channelCreate';
      CHANNEL_DELETE: 'channelDelete';
      CHANNEL_UPDATE: 'channelUpdate';
      CHANNEL_PINS_UPDATE: 'channelPinsUpdate';
      MESSAGE_CREATE: 'messageCreate';
      MESSAGE_DELETE: 'messageDelete';
      MESSAGE_UPDATE: 'messageUpdate';
      MESSAGE_BULK_DELETE: 'messageDeleteBulk';
      MESSAGE_REACTION_ADD: 'messageReactionAdd';
      MESSAGE_REACTION_REMOVE: 'messageReactionRemove';
      MESSAGE_REACTION_REMOVE_ALL: 'messageReactionRemoveAll';
      MESSAGE_REACTION_REMOVE_EMOJI: 'messageReactionRemoveEmoji';
      THREAD_CREATE: 'threadCreate';
      THREAD_DELETE: 'threadDelete';
      THREAD_UPDATE: 'threadUpdate';
      THREAD_LIST_SYNC: 'threadListSync';
      THREAD_MEMBER_UPDATE: 'threadMemberUpdate';
      THREAD_MEMBERS_UPDATE: 'threadMembersUpdate';
      USER_UPDATE: 'userUpdate';
      PRESENCE_UPDATE: 'presenceUpdate';
      VOICE_SERVER_UPDATE: 'voiceServerUpdate';
      VOICE_STATE_UPDATE: 'voiceStateUpdate';
      TYPING_START: 'typingStart';
      WEBHOOKS_UPDATE: 'webhookUpdate';
      INTERACTION_CREATE: 'interactionCreate';
      ERROR: 'error';
      WARN: 'warn';
      DEBUG: 'debug';
      SHARD_DISCONNECT: 'shardDisconnect';
      SHARD_ERROR: 'shardError';
      SHARD_RECONNECTING: 'shardReconnecting';
      SHARD_READY: 'shardReady';
      SHARD_RESUME: 'shardResume';
      INVALIDATED: 'invalidated';
      RAW: 'raw';
      STAGE_INSTANCE_CREATE: 'stageInstanceCreate';
      STAGE_INSTANCE_UPDATE: 'stageInstanceUpdate';
      STAGE_INSTANCE_DELETE: 'stageInstanceDelete';
    };
    ShardEvents: {
      CLOSE: 'close';
      DESTROYED: 'destroyed';
      INVALID_SESSION: 'invalidSession';
      READY: 'ready';
      RESUMED: 'resumed';
    };
    PartialTypes: {
      [K in PartialTypes]: K;
    };
    WSEvents: {
      [K in WSEventType]: K;
    };
    Colors: {
      DEFAULT: 0x000000;
      WHITE: 0xffffff;
      AQUA: 0x1abc9c;
      GREEN: 0x57f287;
      BLUE: 0x3498db;
      YELLOW: 0xfee75c;
      PURPLE: 0x9b59b6;
      LUMINOUS_VIVID_PINK: 0xe91e63;
      FUCHSIA: 0xeb459e;
      GOLD: 0xf1c40f;
      ORANGE: 0xe67e22;
      RED: 0xed4245;
      GREY: 0x95a5a6;
      NAVY: 0x34495e;
      DARK_AQUA: 0x11806a;
      DARK_GREEN: 0x1f8b4c;
      DARK_BLUE: 0x206694;
      DARK_PURPLE: 0x71368a;
      DARK_VIVID_PINK: 0xad1457;
      DARK_GOLD: 0xc27c0e;
      DARK_ORANGE: 0xa84300;
      DARK_RED: 0x992d22;
      DARK_GREY: 0x979c9f;
      DARKER_GREY: 0x7f8c8d;
      LIGHT_GREY: 0xbcc0c0;
      DARK_NAVY: 0x2c3e50;
      BLURPLE: 0x5865f2;
      GREYPLE: 0x99aab5;
      DARK_BUT_NOT_BLACK: 0x2c2f33;
      NOT_QUITE_BLACK: 0x23272a;
    };
    Status: {
      READY: 0;
      CONNECTING: 1;
      RECONNECTING: 2;
      IDLE: 3;
      NEARLY: 4;
      DISCONNECTED: 5;
    };
    OPCodes: {
      DISPATCH: 0;
      HEARTBEAT: 1;
      IDENTIFY: 2;
      STATUS_UPDATE: 3;
      VOICE_STATE_UPDATE: 4;
      VOICE_GUILD_PING: 5;
      RESUME: 6;
      RECONNECT: 7;
      REQUEST_GUILD_MEMBERS: 8;
      INVALID_SESSION: 9;
      HELLO: 10;
      HEARTBEAT_ACK: 11;
    };
    APIErrors: APIErrors;
    ChannelTypes: typeof ChannelTypes;
    ThreadChannelTypes: ThreadChannelType[];
    ClientApplicationAssetTypes: {
      SMALL: 1;
      BIG: 2;
    };
    InviteScopes: InviteScope[];
    MessageTypes: MessageType[];
    SystemMessageTypes: SystemMessageType[];
    ActivityTypes: typeof ActivityTypes;
    StickerFormatTypes: typeof StickerFormatTypes;
    OverwriteTypes: typeof OverwriteTypes;
    ExplicitContentFilterLevels: typeof ExplicitContentFilterLevels;
    DefaultMessageNotificationLevels: typeof DefaultMessageNotificationLevels;
    VerificationLevels: typeof VerificationLevels;
    MembershipStates: typeof MembershipStates;
    ApplicationCommandOptionTypes: typeof ApplicationCommandOptionTypes;
    ApplicationCommandPermissionTypes: typeof ApplicationCommandPermissionTypes;
    InteractionTypes: typeof InteractionTypes;
    InteractionResponseTypes: typeof InteractionResponseTypes;
    MessageComponentTypes: typeof MessageComponentTypes;
    MessageButtonStyles: typeof MessageButtonStyles;
    MFALevels: typeof MFALevels;
    NSFWLevels: typeof NSFWLevels;
    PrivacyLevels: typeof PrivacyLevels;
    WebhookTypes: typeof WebhookTypes;
    PremiumTiers: typeof PremiumTiers;
  };

  export class DataResolver extends null {
    private constructor();
    public static resolveBase64(data: Base64Resolvable): string;
    public static resolveCode(data: string, regx: RegExp): string;
    public static resolveFile(resource: BufferResolvable | Stream): Promise<Buffer | Stream>;
    public static resolveFileAsBuffer(resource: BufferResolvable | Stream): Promise<Buffer>;
    public static resolveImage(resource: BufferResolvable | Base64Resolvable): Promise<string>;
    public static resolveInviteCode(data: InviteResolvable): string;
    public static resolveGuildTemplateCode(data: GuildTemplateResolvable): string;
  }

  export class DiscordAPIError extends Error {
    constructor(error: unknown, status: number, request: unknown);
    private static flattenErrors(obj: unknown, key: string): string[];

    public code: number;
    public method: string;
    public path: string;
    public httpStatus: number;
    public requestData: HTTPErrorData;
  }

  export class DMChannel extends TextBasedChannel(Channel, ['bulkDelete']) {
    constructor(client: Client, data?: unknown);
    public messages: MessageManager;
    public recipient: User;
    public readonly partial: false;
    public type: 'dm';
    public fetch(force?: boolean): Promise<this>;
  }

  export class Emoji extends Base {
    constructor(client: Client, emoji: unknown);
    public animated: boolean | null;
    public readonly createdAt: Date | null;
    public readonly createdTimestamp: number | null;
    public deleted: boolean;
    public id: Snowflake | null;
    public name: string | null;
    public readonly identifier: string;
    public readonly url: string | null;
    public toJSON(): unknown;
    public toString(): string;
  }

  export class Guild extends AnonymousGuild {
    constructor(client: Client, data: unknown);
    private _sortedRoles(): Collection<Snowflake, Role>;
    private _sortedChannels(channel: Channel): Collection<Snowflake, GuildChannel>;

    public readonly afkChannel: VoiceChannel | null;
    public afkChannelID: Snowflake | null;
    public afkTimeout: number;
    public applicationID: Snowflake | null;
    public approximateMemberCount: number | null;
    public approximatePresenceCount: number | null;
    public available: boolean;
    public bans: GuildBanManager;
    public channels: GuildChannelManager;
    public commands: GuildApplicationCommandManager;
    public defaultMessageNotifications: DefaultMessageNotificationLevel | number;
    public deleted: boolean;
    public discoverySplash: string | null;
    public emojis: GuildEmojiManager;
    public explicitContentFilter: ExplicitContentFilterLevel;
    public readonly joinedAt: Date;
    public joinedTimestamp: number;
    public large: boolean;
    public maximumMembers: number | null;
    public maximumPresences: number | null;
    public readonly me: GuildMember | null;
    public memberCount: number;
    public members: GuildMemberManager;
    public mfaLevel: MFALevel;
    public ownerID: Snowflake;
    public preferredLocale: string;
    public premiumSubscriptionCount: number | null;
    public premiumTier: PremiumTier;
    public presences: PresenceManager;
    public readonly publicUpdatesChannel: TextChannel | null;
    public publicUpdatesChannelID: Snowflake | null;
    public roles: RoleManager;
    public readonly rulesChannel: TextChannel | null;
    public rulesChannelID: Snowflake | null;
    public readonly shard: WebSocketShard;
    public shardID: number;
    public stageInstances: StageInstanceManager;
    public readonly systemChannel: TextChannel | null;
    public systemChannelFlags: Readonly<SystemChannelFlags>;
    public systemChannelID: Snowflake | null;
    public vanityURLUses: number | null;
    public readonly voiceAdapterCreator: DiscordGatewayAdapterCreator;
    public readonly voiceStates: VoiceStateManager;
    public readonly widgetChannel: TextChannel | null;
    public widgetChannelID: Snowflake | null;
    public widgetEnabled: boolean | null;
    public addMember(user: UserResolvable, options: AddGuildMemberOptions): Promise<GuildMember>;
    public createIntegration(data: IntegrationData, reason?: string): Promise<Guild>;
    public createTemplate(name: string, description?: string): Promise<GuildTemplate>;
    public delete(): Promise<Guild>;
    public discoverySplashURL(options?: StaticImageURLOptions): string | null;
    public edit(data: GuildEditData, reason?: string): Promise<Guild>;
    public editWelcomeScreen(data: WelcomeScreenEditData): Promise<WelcomeScreen>;
    public equals(guild: Guild): boolean;
    public fetchAuditLogs(options?: GuildAuditLogsFetchOptions): Promise<GuildAuditLogs>;
    public fetchIntegrations(): Promise<Collection<string, Integration>>;
    public fetchInvites(): Promise<Collection<string, Invite>>;
    public fetchOwner(options?: FetchOwnerOptions): Promise<GuildMember>;
    public fetchPreview(): Promise<GuildPreview>;
    public fetchTemplates(): Promise<Collection<GuildTemplate['code'], GuildTemplate>>;
    public fetchVanityData(): Promise<Vanity>;
    public fetchVoiceRegions(): Promise<Collection<string, VoiceRegion>>;
    public fetchWebhooks(): Promise<Collection<Snowflake, Webhook>>;
    public fetchWelcomeScreen(): Promise<WelcomeScreen>;
    public fetchWidget(): Promise<GuildWidget>;
    public leave(): Promise<Guild>;
    public setAFKChannel(afkChannel: ChannelResolvable | null, reason?: string): Promise<Guild>;
    public setAFKTimeout(afkTimeout: number, reason?: string): Promise<Guild>;
    public setBanner(banner: Base64Resolvable | null, reason?: string): Promise<Guild>;
    public setChannelPositions(channelPositions: readonly ChannelPosition[]): Promise<Guild>;
    public setDefaultMessageNotifications(
      defaultMessageNotifications: DefaultMessageNotificationLevel | number,
      reason?: string,
    ): Promise<Guild>;
    public setDiscoverySplash(discoverySplash: Base64Resolvable | null, reason?: string): Promise<Guild>;
    public setExplicitContentFilter(
      explicitContentFilter: ExplicitContentFilterLevel | number,
      reason?: string,
    ): Promise<Guild>;
    public setIcon(icon: Base64Resolvable | null, reason?: string): Promise<Guild>;
    public setName(name: string, reason?: string): Promise<Guild>;
    public setOwner(owner: GuildMemberResolvable, reason?: string): Promise<Guild>;
    public setPreferredLocale(preferredLocale: string, reason?: string): Promise<Guild>;
    public setPublicUpdatesChannel(publicUpdatesChannel: ChannelResolvable | null, reason?: string): Promise<Guild>;
    public setRolePositions(rolePositions: readonly RolePosition[]): Promise<Guild>;
    public setRulesChannel(rulesChannel: ChannelResolvable | null, reason?: string): Promise<Guild>;
    public setSplash(splash: Base64Resolvable | null, reason?: string): Promise<Guild>;
    public setSystemChannel(systemChannel: ChannelResolvable | null, reason?: string): Promise<Guild>;
    public setSystemChannelFlags(systemChannelFlags: SystemChannelFlagsResolvable, reason?: string): Promise<Guild>;
    public setVerificationLevel(verificationLevel: VerificationLevel | number, reason?: string): Promise<Guild>;
    public setWidget(widget: GuildWidgetData, reason?: string): Promise<Guild>;
    public toJSON(): unknown;
  }

  export class GuildAuditLogs {
    constructor(guild: Guild, data: unknown);
    private webhooks: Collection<Snowflake, Webhook>;
    private integrations: Collection<Snowflake, Integration>;

    public entries: Collection<Snowflake, GuildAuditLogsEntry>;

    public static Actions: GuildAuditLogsActions;
    public static Targets: GuildAuditLogsTargets;
    public static Entry: typeof GuildAuditLogsEntry;
    public static actionType(action: number): GuildAuditLogsActionType;
    public static build(...args: any[]): Promise<GuildAuditLogs>;
    public static targetType(target: number): GuildAuditLogsTarget;
    public toJSON(): unknown;
  }

  class GuildAuditLogsEntry {
    constructor(logs: GuildAuditLogs, guild: Guild, data: unknown);
    public action: GuildAuditLogsAction;
    public actionType: GuildAuditLogsActionType;
    public changes: AuditLogChange[] | null;
    public readonly createdAt: Date;
    public readonly createdTimestamp: number;
    public executor: User | null;
    public extra: unknown | Role | GuildMember | null;
    public id: Snowflake;
    public reason: string | null;
    public target:
      | Guild
      | GuildChannel
      | User
      | Role
      | GuildEmoji
      | Invite
      | Webhook
      | Message
      | Integration
      | StageInstance
      | { id: Snowflake }
      | null;
    public targetType: GuildAuditLogsTarget;
    public toJSON(): unknown;
  }

  export class GuildBan extends Base {
    constructor(client: Client, data: unknown, guild: Guild);
    public guild: Guild;
    public user: User;
    public readonly partial: boolean;
    public reason?: string | null;
    public fetch(force?: boolean): Promise<GuildBan>;
  }

  export class GuildChannel extends Channel {
    constructor(guild: Guild, data?: unknown);
    private memberPermissions(member: GuildMember): Readonly<Permissions>;
    private rolePermissions(role: Role): Readonly<Permissions>;

    public readonly calculatedPosition: number;
    public readonly deletable: boolean;
    public guild: Guild;
    public readonly manageable: boolean;
    public readonly members: Collection<Snowflake, GuildMember>;
    public name: string;
    public readonly parent: CategoryChannel | null;
    public parentID: Snowflake | null;
    public permissionOverwrites: PermissionOverwriteManager;
    public readonly permissionsLocked: boolean | null;
    public readonly position: number;
    public rawPosition: number;
    public type: Exclude<keyof typeof ChannelType, 'dm' | 'group' | 'unknown'>;
    public readonly viewable: boolean;
    public clone(options?: GuildChannelCloneOptions): Promise<this>;
    public createInvite(options?: CreateInviteOptions): Promise<Invite>;
    public edit(data: ChannelData, reason?: string): Promise<this>;
    public equals(channel: GuildChannel): boolean;
    public fetchInvites(): Promise<Collection<string, Invite>>;
    public lockPermissions(): Promise<this>;
    public permissionsFor(memberOrRole: GuildMember | Role): Readonly<Permissions>;
    public permissionsFor(memberOrRole: GuildMemberResolvable | RoleResolvable): Readonly<Permissions> | null;
    public setName(name: string, reason?: string): Promise<this>;
    public setParent(channel: CategoryChannel | Snowflake | null, options?: SetParentOptions): Promise<this>;
    public setPosition(position: number, options?: SetChannelPositionOptions): Promise<this>;
    public setTopic(topic: string | null, reason?: string): Promise<this>;
    public isText(): this is TextChannel | NewsChannel;
  }

  export class GuildEmoji extends BaseGuildEmoji {
    constructor(client: Client, data: unknown, guild: Guild);
    private _roles: Snowflake[];

    public readonly deletable: boolean;
    public guild: Guild;
    public author: User | null;
    public readonly roles: GuildEmojiRoleManager;
    public readonly url: string;
    public delete(reason?: string): Promise<GuildEmoji>;
    public edit(data: GuildEmojiEditData, reason?: string): Promise<GuildEmoji>;
    public equals(other: GuildEmoji | unknown): boolean;
    public fetchAuthor(): Promise<User>;
    public setName(name: string, reason?: string): Promise<GuildEmoji>;
  }

  export class GuildMember extends PartialTextBasedChannel(Base) {
    constructor(client: Client, data: unknown, guild: Guild);
    public readonly bannable: boolean;
    public deleted: boolean;
    public readonly displayColor: number;
    public readonly displayHexColor: HexColorString;
    public readonly displayName: string;
    public guild: Guild;
    public readonly id: Snowflake;
    public pending: boolean;
    public readonly joinedAt: Date | null;
    public joinedTimestamp: number | null;
    public readonly kickable: boolean;
    public lastMessageChannelID: Snowflake | null;
    public readonly manageable: boolean;
    public nickname: string | null;
    public readonly partial: false;
    public readonly permissions: Readonly<Permissions>;
    public readonly premiumSince: Date | null;
    public premiumSinceTimestamp: number | null;
    public readonly presence: Presence;
    public readonly roles: GuildMemberRoleManager;
    public user: User;
    public readonly voice: VoiceState;
    public ban(options?: BanOptions): Promise<GuildMember>;
    public fetch(force?: boolean): Promise<GuildMember>;
    public createDM(force?: boolean): Promise<DMChannel>;
    public deleteDM(): Promise<DMChannel>;
    public edit(data: GuildMemberEditData, reason?: string): Promise<GuildMember>;
    public kick(reason?: string): Promise<GuildMember>;
    public permissionsIn(channel: GuildChannelResolvable): Readonly<Permissions>;
    public setNickname(nickname: string | null, reason?: string): Promise<GuildMember>;
    public toJSON(): unknown;
    public toString(): MemberMention;
    public valueOf(): string;
  }

  export class GuildPreview extends Base {
    constructor(client: Client, data: unknown);
    public approximateMemberCount: number;
    public approximatePresenceCount: number;
    public description: string | null;
    public discoverySplash: string | null;
    public emojis: Collection<Snowflake, GuildPreviewEmoji>;
    public features: GuildFeatures[];
    public icon: string | null;
    public id: Snowflake;
    public name: string;
    public splash: string | null;
    public discoverySplashURL(options?: StaticImageURLOptions): string | null;
    public iconURL(options?: ImageURLOptions): string | null;
    public splashURL(options?: StaticImageURLOptions): string | null;
    public fetch(): Promise<GuildPreview>;
    public toJSON(): unknown;
    public toString(): string;
  }

  export class GuildTemplate extends Base {
    constructor(client: Client, data: unknown);
    public readonly createdTimestamp: number;
    public readonly updatedTimestamp: number;
    public readonly url: string;
    public code: string;
    public name: string;
    public description: string | null;
    public usageCount: number;
    public creator: User;
    public creatorID: Snowflake;
    public createdAt: Date;
    public updatedAt: Date;
    public guild: Guild | null;
    public guildID: Snowflake;
    public serializedGuild: unknown;
    public unSynced: boolean | null;
    public createGuild(name: string, icon?: BufferResolvable | Base64Resolvable): Promise<Guild>;
    public delete(): Promise<GuildTemplate>;
    public edit(options?: EditGuildTemplateOptions): Promise<GuildTemplate>;
    public sync(): Promise<GuildTemplate>;
    public static GUILD_TEMPLATES_PATTERN: RegExp;
  }

  export class GuildPreviewEmoji extends BaseGuildEmoji {
    constructor(client: Client, data: unknown, guild: GuildPreview);
    public guild: GuildPreview;
    public roles: Snowflake[];
  }

  export class HTTPError extends Error {
    constructor(message: string, name: string, code: number, request: unknown);
    public code: number;
    public method: string;
    public name: string;
    public path: string;
    public requestData: HTTPErrorData;
  }

  // tslint:disable-next-line:no-empty-interface - Merge RateLimitData into RateLimitError to not have to type it again
  interface RateLimitError extends RateLimitData {}
  export class RateLimitError extends Error {
    constructor(data: RateLimitData);
    public name: 'RateLimitError';
  }

  export class Integration extends Base {
    constructor(client: Client, data: unknown, guild: Guild);
    public account: IntegrationAccount;
    public application: IntegrationApplication | null;
    public enabled: boolean;
    public expireBehavior: number;
    public expireGracePeriod: number;
    public guild: Guild;
    public id: Snowflake;
    public name: string;
    public role: Role;
    public readonly roles: Collection<Snowflake, Role>;
    public syncedAt: number;
    public syncing: boolean;
    public type: string;
    public user: User | null;
    public delete(reason?: string): Promise<Integration>;
    public edit(data: IntegrationEditData, reason?: string): Promise<Integration>;
    public sync(): Promise<Integration>;
  }

  export class IntegrationApplication extends Application {
    public bot: User | null;
    public termsOfServiceURL: string | null;
    public privacyPolicyURL: string | null;
    public rpcOrigins: string[];
    public summary: string | null;
    public hook: boolean | null;
    public cover: string | null;
    public verifyKey: string | null;
  }

  export class Intents extends BitField<IntentsString> {
    public static FLAGS: Record<IntentsString, number>;
    public static PRIVILEGED: number;
    public static ALL: number;
    public static NON_PRIVILEGED: number;
    public static resolve(bit?: BitFieldResolvable<IntentsString, number>): number;
  }

  export class Interaction extends Base {
    constructor(client: Client, data: unknown);
    public applicationID: Snowflake;
    public readonly channel: Channel | null;
    public channelID: Snowflake | null;
    public readonly createdAt: Date;
    public readonly createdTimestamp: number;
    public readonly guild: Guild | null;
    public guildID: Snowflake | null;
    public id: Snowflake;
    public member: GuildMember | APIInteractionGuildMember | null;
    public readonly token: string;
    public type: InteractionType;
    public user: User;
    public version: number;
    public inGuild(): boolean;
    public isButton(): this is ButtonInteraction;
    public isCommand(): this is CommandInteraction;
    public isMessageComponent(): this is MessageComponentInteraction;
    public isSelectMenu(): this is SelectMenuInteraction;
  }

  export class InteractionCollector<T extends Interaction> extends Collector<Snowflake, T> {
    constructor(client: Client, options?: InteractionCollectorOptions<T>);
    private _handleMessageDeletion(message: Message): void;
    private _handleChannelDeletion(channel: GuildChannel): void;
    private _handleGuildDeletion(guild: Guild): void;

    public channel: TextChannel | NewsChannel | DMChannel | null;
    public componentType: MessageComponentType | null;
    public readonly endReason: string | null;
    public guild: Guild | null;
    public interactionType: InteractionType | null;
    public message: Message | null;
    public options: InteractionCollectorOptions<T>;
    public total: number;
    public users: Collection<Snowflake, User>;

    public collect(interaction: Interaction): Snowflake;
    public empty(): void;
    public dispose(interaction: Interaction): Snowflake;
    public on(event: 'collect' | 'dispose', listener: (interaction: T) => Awaited<void>): this;
    public on(event: 'end', listener: (collected: Collection<Snowflake, T>, reason: string) => Awaited<void>): this;
    public on(event: string, listener: (...args: any[]) => Awaited<void>): this;

    public once(event: 'collect' | 'dispose', listener: (interaction: T) => Awaited<void>): this;
    public once(event: 'end', listener: (collected: Collection<Snowflake, T>, reason: string) => Awaited<void>): this;
    public once(event: string, listener: (...args: any[]) => Awaited<void>): this;
  }

  export class InteractionWebhook extends PartialWebhookMixin() {
    constructor(client: Client, id: Snowflake, token: string);
    public token: string;
    public send(options: string | MessagePayload | InteractionReplyOptions): Promise<Message | APIMessage>;
  }

  export class Invite extends Base {
    constructor(client: Client, data: unknown);
    public channel: GuildChannel | PartialGroupDMChannel;
    public code: string;
    public readonly deletable: boolean;
    public readonly createdAt: Date | null;
    public createdTimestamp: number | null;
    public readonly expiresAt: Date | null;
    public readonly expiresTimestamp: number | null;
    public guild: InviteGuild | Guild | null;
    public inviter: User | null;
    public maxAge: number | null;
    public maxUses: number | null;
    public memberCount: number;
    public presenceCount: number;
    public targetApplication: IntegrationApplication | null;
    public targetUser: User | null;
    public targetType: InviteTargetType | null;
    public temporary: boolean | null;
    public readonly url: string;
    public uses: number | null;
    public delete(reason?: string): Promise<Invite>;
    public toJSON(): unknown;
    public toString(): string;
    public static INVITES_PATTERN: RegExp;
    public stageInstance: InviteStageInstance | null;
  }

  export class InviteStageInstance extends Base {
    constructor(client: Client, data: unknown, channelID: Snowflake, guildID: Snowflake);
    public channelID: Snowflake;
    public guildID: Snowflake;
    public members: Collection<Snowflake, GuildMember>;
    public topic: string;
    public participantCount: number;
    public speakerCount: number;
    public readonly channel: StageChannel | null;
    public readonly guild: Guild | null;
  }

  export class InviteGuild extends AnonymousGuild {
    constructor(client: Client, data: unknown);
    public welcomeScreen: WelcomeScreen | null;
  }

  export class Message extends Base {
    constructor(client: Client, data: unknown, channel: TextChannel | DMChannel | NewsChannel | ThreadChannel);
    private patch(data: unknown): Message;

    public activity: MessageActivity | null;
    public applicationID: Snowflake | null;
    public attachments: Collection<Snowflake, MessageAttachment>;
    public author: User;
    public channel: TextChannel | DMChannel | NewsChannel | ThreadChannel;
    public readonly cleanContent: string;
    public components: MessageActionRow[];
    public content: string;
    public readonly createdAt: Date;
    public createdTimestamp: number;
    public readonly crosspostable: boolean;
    public readonly deletable: boolean;
    public deleted: boolean;
    public readonly editable: boolean;
    public readonly editedAt: Date | null;
    public editedTimestamp: number | null;
    public embeds: MessageEmbed[];
    public groupActivityApplication: ClientApplication | null;
    public readonly guild: Guild | null;
    public id: Snowflake;
    public interaction: MessageInteraction | null;
    public readonly member: GuildMember | null;
    public mentions: MessageMentions;
    public nonce: string | number | null;
    public readonly partial: false;
    public readonly pinnable: boolean;
    public pinned: boolean;
    public reactions: ReactionManager;
    public stickers: Collection<Snowflake, Sticker>;
    public system: boolean;
    public thread: ThreadChannel;
    public tts: boolean;
    public type: MessageType;
    public readonly url: string;
    public webhookID: Snowflake | null;
    public flags: Readonly<MessageFlags>;
    public reference: MessageReference | null;
    public awaitMessageComponent<T extends MessageComponentInteraction = MessageComponentInteraction>(
      options?: AwaitMessageComponentOptions<T>,
    ): Promise<T>;
    public awaitReactions(options?: AwaitReactionsOptions): Promise<Collection<Snowflake | string, MessageReaction>>;
    public createReactionCollector(options?: ReactionCollectorOptions): ReactionCollector;
    public createMessageComponentCollector<T extends MessageComponentInteraction = MessageComponentInteraction>(
      options?: InteractionCollectorOptions<T>,
    ): InteractionCollector<T>;
    public delete(): Promise<Message>;
    public edit(content: string | MessageEditOptions | MessagePayload): Promise<Message>;
    public equals(message: Message, rawData: unknown): boolean;
    public fetchReference(): Promise<Message>;
    public fetchWebhook(): Promise<Webhook>;
    public crosspost(): Promise<Message>;
    public fetch(force?: boolean): Promise<Message>;
    public pin(): Promise<Message>;
    public react(emoji: EmojiIdentifierResolvable): Promise<MessageReaction>;
    public removeAttachments(): Promise<Message>;
    public reply(options: string | MessagePayload | ReplyMessageOptions): Promise<Message>;
    public startThread(
      name: string,
      autoArchiveDuration: ThreadAutoArchiveDuration,
      reason?: string,
    ): Promise<ThreadChannel>;
    public suppressEmbeds(suppress?: boolean): Promise<Message>;
    public toJSON(): unknown;
    public toString(): string;
    public unpin(): Promise<Message>;
  }

  export class MessageActionRow extends BaseMessageComponent {
    constructor(data?: MessageActionRow | MessageActionRowOptions);
    public type: 'ACTION_ROW';
    public components: MessageActionRowComponent[];
    public addComponents(
      ...components: MessageActionRowComponentResolvable[] | MessageActionRowComponentResolvable[][]
    ): this;
    public spliceComponents(
      index: number,
      deleteCount: number,
      ...components: MessageActionRowComponentResolvable[] | MessageActionRowComponentResolvable[][]
    ): this;
    public toJSON(): unknown;
  }

  export class MessageAttachment {
    constructor(attachment: BufferResolvable | Stream, name?: string, data?: unknown);

    public attachment: BufferResolvable | Stream;
    public contentType: string | null;
    public height: number | null;
    public id: Snowflake;
    public name: string | null;
    public proxyURL: string;
    public size: number;
    public readonly spoiler: boolean;
    public url: string;
    public width: number | null;
    public setFile(attachment: BufferResolvable | Stream, name?: string): this;
    public setName(name: string): this;
    public toJSON(): unknown;
  }

  export class MessageButton extends BaseMessageComponent {
    constructor(data?: MessageButton | MessageButtonOptions);
    public customID: string | null;
    public disabled: boolean;
    public emoji: APIPartialEmoji | null;
    public label: string | null;
    public style: MessageButtonStyle | null;
    public type: 'BUTTON';
    public url: string | null;
    public setCustomID(customID: string): this;
    public setDisabled(disabled: boolean): this;
    public setEmoji(emoji: EmojiIdentifierResolvable): this;
    public setLabel(label: string): this;
    public setStyle(style: MessageButtonStyleResolvable): this;
    public setURL(url: string): this;
    public toJSON(): unknown;
    private static resolveStyle(style: MessageButtonStyleResolvable): MessageButtonStyle;
  }

  export class MessageCollector extends Collector<Snowflake, Message> {
    constructor(channel: TextChannel | DMChannel | ThreadChannel, options?: MessageCollectorOptions);
    private _handleChannelDeletion(channel: GuildChannel): void;
    private _handleGuildDeletion(guild: Guild): void;

    public channel: TextChannel | DMChannel | ThreadChannel;
    public readonly endReason: string | null;
    public options: MessageCollectorOptions;
    public received: number;

    public collect(message: Message): Snowflake | null;
    public dispose(message: Message): Snowflake | null;
  }

  export class MessageComponentInteraction extends Interaction {
    public readonly channel: TextChannel | DMChannel | NewsChannel | PartialDMChannel | ThreadChannel | null;
    public readonly component: MessageActionRowComponent | Exclude<APIMessageComponent, APIActionRowComponent> | null;
    public componentType: MessageComponentType;
    public customID: string;
    public deferred: boolean;
    public ephemeral: boolean | null;
    public message: Message | APIMessage;
    public replied: boolean;
    public webhook: InteractionWebhook;
    public defer(options?: InteractionDeferOptions & { fetchReply: true }): Promise<Message | APIMessage>;
    public defer(options?: InteractionDeferOptions): Promise<void>;
    public deferUpdate(options?: InteractionDeferUpdateOptions & { fetchReply: true }): Promise<Message | APIMessage>;
    public deferUpdate(options?: InteractionDeferUpdateOptions): Promise<void>;
    public deleteReply(): Promise<void>;
    public editReply(options: string | MessagePayload | WebhookEditMessageOptions): Promise<Message | APIMessage>;
    public fetchReply(): Promise<Message | APIMessage>;
    public followUp(options: string | MessagePayload | InteractionReplyOptions): Promise<Message | APIMessage>;
    public reply(options: InteractionReplyOptions & { fetchReply: true }): Promise<Message | APIMessage>;
    public reply(options: string | MessagePayload | InteractionReplyOptions): Promise<void>;
    public update(content: InteractionUpdateOptions & { fetchReply: true }): Promise<Message | APIMessage>;
    public update(content: string | MessagePayload | InteractionUpdateOptions): Promise<void>;

    public static resolveType(type: MessageComponentTypeResolvable): MessageComponentType;
  }

  export class MessageEmbed {
    constructor(data?: MessageEmbed | MessageEmbedOptions);
    public author: MessageEmbedAuthor | null;
    public color: number | null;
    public readonly createdAt: Date | null;
    public description: string | null;
    public fields: EmbedField[];
    public footer: MessageEmbedFooter | null;
    public readonly hexColor: HexColorString | null;
    public image: MessageEmbedImage | null;
    public readonly length: number;
    public provider: MessageEmbedProvider | null;
    public thumbnail: MessageEmbedThumbnail | null;
    public timestamp: number | null;
    public title: string | null;
    /** @deprecated */
    public type: string;
    public url: string | null;
    public readonly video: MessageEmbedVideo | null;
    public addField(name: string, value: string, inline?: boolean): this;
    public addFields(...fields: EmbedFieldData[] | EmbedFieldData[][]): this;
    public setAuthor(name: string, iconURL?: string, url?: string): this;
    public setColor(color: ColorResolvable): this;
    public setDescription(description: string): this;
    public setFooter(text: string, iconURL?: string): this;
    public setImage(url: string): this;
    public setThumbnail(url: string): this;
    public setTimestamp(timestamp?: Date | number): this;
    public setTitle(title: string): this;
    public setURL(url: string): this;
    public spliceFields(index: number, deleteCount: number, ...fields: EmbedFieldData[] | EmbedFieldData[][]): this;
    public toJSON(): unknown;

    public static normalizeField(name: string, value: string, inline?: boolean): Required<EmbedFieldData>;
    public static normalizeFields(...fields: EmbedFieldData[] | EmbedFieldData[][]): Required<EmbedFieldData>[];
  }

  export class MessageFlags extends BitField<MessageFlagsString> {
    public static FLAGS: Record<MessageFlagsString, number>;
    public static resolve(bit?: BitFieldResolvable<MessageFlagsString, number>): number;
  }

  export class MessageMentions {
    constructor(
      message: Message,
      users: APIUser[] | Collection<Snowflake, User>,
      roles: Snowflake[] | Collection<Snowflake, Role>,
      everyone: boolean,
      repliedUser?: APIUser | User,
    );
    private _channels: Collection<Snowflake, Channel> | null;
    private readonly _content: string;
    private _members: Collection<Snowflake, GuildMember> | null;

    public readonly channels: Collection<Snowflake, Channel>;
    public readonly client: Client;
    public everyone: boolean;
    public readonly guild: Guild;
    public has(data: UserResolvable | RoleResolvable | ChannelResolvable, options?: MessageMentionsHasOptions): boolean;
    public readonly members: Collection<Snowflake, GuildMember> | null;
    public repliedUser: User | null;
    public roles: Collection<Snowflake, Role>;
    public users: Collection<Snowflake, User>;
    public crosspostedChannels: Collection<Snowflake, CrosspostedChannel>;
    public toJSON(): unknown;

    public static CHANNELS_PATTERN: RegExp;
    public static EVERYONE_PATTERN: RegExp;
    public static ROLES_PATTERN: RegExp;
    public static USERS_PATTERN: RegExp;
  }

  export class MessageReaction {
    constructor(client: Client, data: unknown, message: Message);
    private _emoji: GuildEmoji | ReactionEmoji;

    public readonly client: Client;
    public count: number | null;
    public readonly emoji: GuildEmoji | ReactionEmoji;
    public me: boolean;
    public message: Message | PartialMessage;
    public readonly partial: boolean;
    public users: ReactionUserManager;
    public remove(): Promise<MessageReaction>;
    public fetch(): Promise<MessageReaction>;
    public toJSON(): unknown;
  }

  class MessageSelectMenu extends BaseMessageComponent {
    constructor(data?: MessageSelectMenu | MessageSelectMenuOptions);
    public customID: string | null;
    public disabled: boolean;
    public maxValues: number | null;
    public minValues: number | null;
    public options: MessageSelectOption[];
    public placeholder: string | null;
    public type: 'SELECT_MENU';
    public addOptions(...options: MessageSelectOptionData[] | MessageSelectOptionData[][]): this;
    public setCustomID(customID: string): this;
    public setDisabled(disabled: boolean): this;
    public setMaxValues(maxValues: number): this;
    public setMinValues(minValues: number): this;
    public setPlaceholder(placeholder: string): this;
    public spliceOptions(
      index: number,
      deleteCount: number,
      ...options: MessageSelectOptionData[] | MessageSelectOptionData[][]
    ): this;
    public toJSON(): unknown;
  }

  export class NewsChannel extends TextBasedChannel(GuildChannel) {
    constructor(guild: Guild, data?: unknown);
    public defaultAutoArchiveDuration?: ThreadAutoArchiveDuration;
    public messages: MessageManager;
    public nsfw: boolean;
    public threads: ThreadManager<AllowedThreadTypeForNewsChannel>;
    public topic: string | null;
    public type: 'news';
    public createWebhook(name: string, options?: ChannelWebhookCreateOptions): Promise<Webhook>;
    public setDefaultAutoArchiveDuration(
      defaultAutoArchiveDuration: ThreadAutoArchiveDuration,
      reason?: string,
    ): Promise<NewsChannel>;
    public setNSFW(nsfw: boolean, reason?: string): Promise<NewsChannel>;
    public setType(type: Pick<typeof ChannelType, 'text' | 'news'>, reason?: string): Promise<GuildChannel>;
    public fetchWebhooks(): Promise<Collection<Snowflake, Webhook>>;
    public addFollower(channel: GuildChannelResolvable, reason?: string): Promise<NewsChannel>;
  }

  export class OAuth2Guild extends BaseGuild {
    public owner: boolean;
    public permissions: Readonly<Permissions>;
  }

  export class PartialGroupDMChannel extends Channel {
    constructor(client: Client, data: unknown);
    public name: string;
    public icon: string | null;
    public iconURL(options?: StaticImageURLOptions): string | null;
  }

  export class PermissionOverwrites extends Base {
    constructor(client: Client, data: object, channel: GuildChannel);
    public allow: Readonly<Permissions>;
    public readonly channel: GuildChannel;
    public deny: Readonly<Permissions>;
    public id: Snowflake;
    public type: OverwriteType;
    public edit(options: PermissionOverwriteOptions, reason?: string): Promise<PermissionOverwrites>;
    public delete(reason?: string): Promise<PermissionOverwrites>;
    public toJSON(): unknown;
    public static resolveOverwriteOptions(
      options: PermissionOverwriteOptions,
      initialPermissions: { allow?: PermissionResolvable; deny?: PermissionResolvable },
    ): ResolvedOverwriteOptions;
    public static resolve(overwrite: OverwriteResolvable, guild: Guild): APIOverwrite;
  }

  export class Permissions extends BitField<PermissionString, bigint> {
    public any(permission: PermissionResolvable, checkAdmin?: boolean): boolean;
    public has(permission: PermissionResolvable, checkAdmin?: boolean): boolean;
    public missing(bits: BitFieldResolvable<PermissionString, bigint>, checkAdmin?: boolean): PermissionString[];
    public serialize(checkAdmin?: boolean): Record<PermissionString, boolean>;
    public toArray(checkAdmin?: boolean): PermissionString[];

    public static ALL: bigint;
    public static DEFAULT: bigint;
    public static STAGE_MODERATOR: bigint;
    public static FLAGS: PermissionFlags;
    public static resolve(permission?: PermissionResolvable): bigint;
  }

  export class Presence {
    constructor(client: Client, data?: unknown);
    public activities: Activity[];
    public clientStatus: ClientPresenceStatusData | null;
    public guild: Guild | null;
    public readonly member: GuildMember | null;
    public status: PresenceStatus;
    public readonly user: User | null;
    public userID: Snowflake;
    public equals(presence: Presence): boolean;
  }

  export class ReactionCollector extends Collector<Snowflake | string, MessageReaction, [User]> {
    constructor(message: Message, options?: ReactionCollectorOptions);
    private _handleChannelDeletion(channel: GuildChannel): void;
    private _handleGuildDeletion(guild: Guild): void;
    private _handleMessageDeletion(message: Message): void;

    public readonly endReason: string | null;
    public message: Message;
    public options: ReactionCollectorOptions;
    public total: number;
    public users: Collection<Snowflake, User>;

    public static key(reaction: MessageReaction): Snowflake | string;

    public collect(reaction: MessageReaction, user: User): Promise<Snowflake | string | null>;
    public dispose(reaction: MessageReaction, user: User): Snowflake | string | null;
    public empty(): void;

    public on(event: 'collect' | 'dispose' | 'remove', listener: (reaction: MessageReaction, user: User) => void): this;
    public on(
      event: 'end',
      listener: (collected: Collection<Snowflake, MessageReaction>, reason: string) => void,
    ): this;
    public on(event: string, listener: (...args: any[]) => void): this;

    public once(
      event: 'collect' | 'dispose' | 'remove',
      listener: (reaction: MessageReaction, user: User) => void,
    ): this;
    public once(
      event: 'end',
      listener: (collected: Collection<Snowflake, MessageReaction>, reason: string) => void,
    ): this;
    public once(event: string, listener: (...args: any[]) => void): this;
  }

  export class ReactionEmoji extends Emoji {
    constructor(reaction: MessageReaction, emoji: unknown);
    public reaction: MessageReaction;
    public toJSON(): unknown;
  }

  export class RichPresenceAssets {
    constructor(activity: Activity, assets: unknown);
    public largeImage: Snowflake | null;
    public largeText: string | null;
    public smallImage: Snowflake | null;
    public smallText: string | null;
    public largeImageURL(options?: StaticImageURLOptions): string | null;
    public smallImageURL(options?: StaticImageURLOptions): string | null;
  }

  export class Role extends Base {
    constructor(client: Client, data: unknown, guild: Guild);
    public color: number;
    public readonly createdAt: Date;
    public readonly createdTimestamp: number;
    public deleted: boolean;
    public readonly editable: boolean;
    public guild: Guild;
    public readonly hexColor: HexColorString;
    public hoist: boolean;
    public id: Snowflake;
    public managed: boolean;
    public readonly members: Collection<Snowflake, GuildMember>;
    public mentionable: boolean;
    public name: string;
    public permissions: Readonly<Permissions>;
    public readonly position: number;
    public rawPosition: number;
    public tags: RoleTagData | null;
    public comparePositionTo(role: Role): number;
    public delete(reason?: string): Promise<Role>;
    public edit(data: RoleData, reason?: string): Promise<Role>;
    public equals(role: Role): boolean;
    public permissionsIn(channel: ChannelResolvable): Readonly<Permissions>;
    public setColor(color: ColorResolvable, reason?: string): Promise<Role>;
    public setHoist(hoist: boolean, reason?: string): Promise<Role>;
    public setMentionable(mentionable: boolean, reason?: string): Promise<Role>;
    public setName(name: string, reason?: string): Promise<Role>;
    public setPermissions(permissions: PermissionResolvable, reason?: string): Promise<Role>;
    public setPosition(position: number, options?: SetRolePositionOptions): Promise<Role>;
    public toJSON(): unknown;
    public toString(): RoleMention;

    public static comparePositions(role1: Role, role2: Role): number;
  }

  export class SelectMenuInteraction extends MessageComponentInteraction {
    public componentType: 'SELECT_MENU';
    public values: string[] | null;
  }

  export class Shard extends EventEmitter {
    constructor(manager: ShardingManager, id: number);
    private _evals: Map<string, Promise<any>>;
    private _exitListener: (...args: any[]) => void;
    private _fetches: Map<string, Promise<any>>;
    private _handleExit(respawn?: boolean): void;
    private _handleMessage(message: any): void;

    public args: string[];
    public execArgv: string[];
    public env: unknown;
    public id: number;
    public manager: ShardingManager;
    public process: ChildProcess | null;
    public ready: boolean;
    public worker: any | null;
    public eval(script: string): Promise<any>;
    public eval<T>(fn: (client: Client) => T): Promise<T[]>;
    public fetchClientValue(prop: string): Promise<any>;
    public kill(): void;
    public respawn(options?: { delay?: number; timeout?: number }): Promise<ChildProcess>;
    public send(message: any): Promise<Shard>;
    public spawn(timeout?: number): Promise<ChildProcess>;

    public on(event: 'spawn' | 'death', listener: (child: ChildProcess) => Awaited<void>): this;
    public on(event: 'disconnect' | 'ready' | 'reconnecting', listener: () => Awaited<void>): this;
    public on(event: 'error', listener: (error: Error) => Awaited<void>): this;
    public on(event: 'message', listener: (message: any) => Awaited<void>): this;
    public on(event: string, listener: (...args: any[]) => Awaited<void>): this;

    public once(event: 'spawn' | 'death', listener: (child: ChildProcess) => Awaited<void>): this;
    public once(event: 'disconnect' | 'ready' | 'reconnecting', listener: () => Awaited<void>): this;
    public once(event: 'error', listener: (error: Error) => Awaited<void>): this;
    public once(event: 'message', listener: (message: any) => Awaited<void>): this;
    public once(event: string, listener: (...args: any[]) => Awaited<void>): this;
  }

  export class ShardClientUtil {
    constructor(client: Client, mode: ShardingManagerMode);
    private _handleMessage(message: any): void;
    private _respond(type: string, message: any): void;

    public client: Client;
    public readonly count: number;
    public readonly ids: number[];
    public mode: ShardingManagerMode;
    public parentPort: any | null;
    public broadcastEval<T>(fn: (client: Client) => Awaited<T>): Promise<Serialized<T>[]>;
    public broadcastEval<T>(fn: (client: Client) => Awaited<T>, options: { shard: number }): Promise<Serialized<T>>;
    public broadcastEval<T, P>(
      fn: (client: Client, context: Serialized<P>) => Awaited<T>,
      options: { context: P },
    ): Promise<Serialized<T>[]>;
    public broadcastEval<T, P>(
      fn: (client: Client, context: Serialized<P>) => Awaited<T>,
      options: { context: P; shard: number },
    ): Promise<Serialized<T>>;
    public fetchClientValues(prop: string): Promise<any[]>;
    public fetchClientValues(prop: string, shard: number): Promise<any>;
    public respawnAll(options?: MultipleShardRespawnOptions): Promise<void>;
    public send(message: any): Promise<void>;

    public static singleton(client: Client, mode: ShardingManagerMode): ShardClientUtil;
    public static shardIDForGuildID(guildID: Snowflake, shardCount: number): number;
  }

  export class ShardingManager extends EventEmitter {
    constructor(file: string, options?: ShardingManagerOptions);
    private _performOnShards(method: string, args: any[]): Promise<any[]>;
    private _performOnShards(method: string, args: any[], shard: number): Promise<any>;

    public file: string;
    public respawn: boolean;
    public shardArgs: string[];
    public shards: Collection<number, Shard>;
    public token: string | null;
    public totalShards: number | 'auto';
    public shardList: number[] | 'auto';
    public broadcast(message: any): Promise<Shard[]>;
    public broadcastEval<T>(fn: (client: Client) => Awaited<T>): Promise<Serialized<T>[]>;
    public broadcastEval<T>(fn: (client: Client) => Awaited<T>, options: { shard: number }): Promise<Serialized<T>>;
    public broadcastEval<T, P>(
      fn: (client: Client, context: Serialized<P>) => Awaited<T>,
      options: { context: P },
    ): Promise<Serialized<T>[]>;
    public broadcastEval<T, P>(
      fn: (client: Client, context: Serialized<P>) => Awaited<T>,
      options: { context: P; shard: number },
    ): Promise<Serialized<T>>;
    public createShard(id: number): Shard;
    public fetchClientValues(prop: string): Promise<any[]>;
    public fetchClientValues(prop: string, shard: number): Promise<any>;
    public respawnAll(options?: MultipleShardRespawnOptions): Promise<Collection<number, Shard>>;
    public spawn(options?: MultipleShardSpawnOptions): Promise<Collection<number, Shard>>;

    public on(event: 'shardCreate', listener: (shard: Shard) => Awaited<void>): this;

    public once(event: 'shardCreate', listener: (shard: Shard) => Awaited<void>): this;
  }

  export class SnowflakeUtil extends null {
    private constructor();
    public static deconstruct(snowflake: Snowflake): DeconstructedSnowflake;
    public static generate(timestamp?: number | Date): Snowflake;
    public static readonly EPOCH: number;
  }

  export class StageChannel extends BaseGuildVoiceChannel {
    public topic: string | null;
    public type: 'stage';
    public readonly stageInstance: StageInstance | null;
    public createStageInstance(options: StageInstanceCreateOptions): Promise<StageInstance>;
  }

  export class StageInstance extends Base {
    constructor(client: Client, data: unknown, channel: StageChannel);
    public id: Snowflake;
    public deleted: boolean;
    public guildID: Snowflake;
    public channelID: Snowflake;
    public topic: string;
    public privacyLevel: PrivacyLevel;
    public discoverableDisabled: boolean;
    public readonly channel: StageChannel | null;
    public readonly guild: Guild | null;
    public edit(options: StageInstanceEditOptions): Promise<StageInstance>;
    public delete(): Promise<StageInstance>;
    public setTopic(topic: string): Promise<StageInstance>;
    public readonly createdTimestamp: number;
    public readonly createdAt: Date;
  }

  export class StoreChannel extends GuildChannel {
    constructor(guild: Guild, data?: unknown);
    public nsfw: boolean;
    public type: 'store';
  }

  export class SystemChannelFlags extends BitField<SystemChannelFlagsString> {
    public static FLAGS: Record<SystemChannelFlagsString, number>;
    public static resolve(bit?: BitFieldResolvable<SystemChannelFlagsString, number>): number;
  }

  export class Team extends Base {
    constructor(client: Client, data: unknown);
    public id: Snowflake;
    public name: string;
    public icon: string | null;
    public ownerID: Snowflake | null;
    public members: Collection<Snowflake, TeamMember>;

    public readonly owner: TeamMember;
    public readonly createdAt: Date;
    public readonly createdTimestamp: number;

    public iconURL(options?: StaticImageURLOptions): string;
    public toJSON(): unknown;
    public toString(): string;
  }

  export class TeamMember extends Base {
    constructor(team: Team, data: unknown);
    public team: Team;
    public readonly id: Snowflake;
    public permissions: string[];
    public membershipState: MembershipState;
    public user: User;

    public toString(): string;
  }

  export class TextChannel extends TextBasedChannel(GuildChannel) {
    constructor(guild: Guild, data?: unknown);
    public defaultAutoArchiveDuration?: ThreadAutoArchiveDuration;
    public messages: MessageManager;
    public nsfw: boolean;
    public type: 'text';
    public rateLimitPerUser: number;
    public threads: ThreadManager<AllowedThreadTypeForTextChannel>;
    public topic: string | null;
    public createWebhook(name: string, options?: ChannelWebhookCreateOptions): Promise<Webhook>;
    public setDefaultAutoArchiveDuration(
      defaultAutoArchiveDuration: ThreadAutoArchiveDuration,
      reason?: string,
    ): Promise<TextChannel>;
    public setNSFW(nsfw: boolean, reason?: string): Promise<TextChannel>;
    public setRateLimitPerUser(rateLimitPerUser: number, reason?: string): Promise<TextChannel>;
    public setType(type: Pick<typeof ChannelType, 'text' | 'news'>, reason?: string): Promise<GuildChannel>;
    public fetchWebhooks(): Promise<Collection<Snowflake, Webhook>>;
  }

  export class ThreadChannel extends TextBasedChannel(Channel) {
    constructor(guild: Guild, data?: object);
    public archived: boolean;
    public readonly archivedAt: Date;
    public archiveTimestamp: number;
    public autoArchiveDuration: ThreadAutoArchiveDuration;
    public readonly editable: boolean;
    public guild: Guild;
    public readonly guildMembers: Collection<Snowflake, GuildMember>;
    public readonly joinable: boolean;
    public readonly joined: boolean;
    public locked: boolean;
    public readonly manageable: boolean;
    public readonly sendable: boolean;
    public memberCount: number | null;
    public messageCount: number | null;
    public messages: MessageManager;
    public members: ThreadMemberManager;
    public name: string;
    public ownerID: Snowflake;
    public readonly parent: TextChannel | NewsChannel | null;
    public parentID: Snowflake;
    public rateLimitPerUser: number;
    public type: ThreadChannelType;
    public readonly unarchivable: boolean;
    public delete(reason?: string): Promise<ThreadChannel>;
    public edit(data: ThreadEditData, reason?: string): Promise<ThreadChannel>;
    public join(): Promise<ThreadChannel>;
    public leave(): Promise<ThreadChannel>;
    public permissionsFor(memberOrRole: GuildMember | Role): Readonly<Permissions>;
    public permissionsFor(memberOrRole: GuildMemberResolvable | RoleResolvable): Readonly<Permissions> | null;
    public setArchived(archived?: boolean, reason?: string): Promise<ThreadChannel>;
    public setAutoArchiveDuration(
      autoArchiveDuration: ThreadAutoArchiveDuration,
      reason?: string,
    ): Promise<ThreadChannel>;
    public setLocked(locked?: boolean, reason?: string): Promise<ThreadChannel>;
    public setName(name: string, reason?: string): Promise<ThreadChannel>;
    public setRateLimitPerUser(rateLimitPerUser: number, reason?: string): Promise<ThreadChannel>;
  }

  export class ThreadMember extends Base {
    constructor(thread: ThreadChannel, data?: object);
    public flags: ThreadMemberFlags;
    public readonly guildMember: GuildMember | null;
    public id: Snowflake;
    public readonly joinedAt: Date | null;
    public joinedTimestamp: number | null;
    public readonly manageable: boolean;
    public thread: ThreadChannel;
    public readonly user: User | null;
    public remove(reason?: string): Promise<ThreadMember>;
  }

  export class ThreadMemberFlags extends BitField<ThreadMemberFlagsString> {
    public static FLAGS: Record<ThreadMemberFlagsString, number>;
    public static resolve(bit?: BitFieldResolvable<ThreadMemberFlagsString, number>): number;
  }

  export class User extends PartialTextBasedChannel(Base) {
    constructor(client: Client, data: unknown);
    public avatar: string | null;
    public banner: string | null;
    public bot: boolean;
    public readonly createdAt: Date;
    public readonly createdTimestamp: number;
    public discriminator: string;
    public readonly defaultAvatarURL: string;
    public readonly dmChannel: DMChannel | null;
    public flags: Readonly<UserFlags> | null;
    public id: Snowflake;
    public lastMessageID: Snowflake | null;
    public readonly partial: false;
    public readonly presence: Presence;
    public system: boolean;
    public readonly tag: string;
    public username: string;
    public avatarURL(options?: ImageURLOptions): string | null;
    public bannerURL(options?: ImageURLOptions): string | null;
    public createDM(): Promise<DMChannel>;
    public deleteDM(): Promise<DMChannel>;
    public displayAvatarURL(options?: ImageURLOptions): string;
    public equals(user: User): boolean;
    public fetch(force?: boolean): Promise<User>;
    public fetchFlags(force?: boolean): Promise<UserFlags>;
    public toString(): UserMention;
    public typingDurationIn(channel: ChannelResolvable): number;
    public typingIn(channel: ChannelResolvable): boolean;
    public typingSinceIn(channel: ChannelResolvable): Date;
  }

  export class UserFlags extends BitField<UserFlagsString> {
    public static FLAGS: Record<UserFlagsString, number>;
    public static resolve(bit?: BitFieldResolvable<UserFlagsString, number>): number;
  }

  export class Util extends null {
    private constructor();
    public static basename(path: string, ext?: string): string;
    public static binaryToID(num: string): Snowflake;
    public static cleanContent(str: string, channel: Channel): string;
    public static removeMentions(str: string): string;
    public static cloneObject(obj: unknown): unknown;
    public static delayFor(ms: number): Promise<void>;
    public static discordSort<K, V extends { rawPosition: number; id: Snowflake }>(
      collection: Collection<K, V>,
    ): Collection<K, V>;
    public static escapeMarkdown(text: string, options?: EscapeMarkdownOptions): string;
    public static escapeCodeBlock(text: string): string;
    public static escapeInlineCode(text: string): string;
    public static escapeBold(text: string): string;
    public static escapeItalic(text: string): string;
    public static escapeUnderline(text: string): string;
    public static escapeStrikethrough(text: string): string;
    public static escapeSpoiler(text: string): string;
    public static cleanCodeBlockContent(text: string): string;
    public static fetchRecommendedShards(token: string, guildsPerShard?: number): Promise<number>;
    public static flatten(obj: unknown, ...props: { [key: string]: boolean | string }[]): unknown;
    public static idToBinary(num: Snowflake): string;
    public static makeError(obj: MakeErrorOptions): Error;
    public static makePlainError(err: Error): MakeErrorOptions;
    public static mergeDefault(def: unknown, given: unknown): unknown;
    public static moveElementInArray(array: any[], element: any, newIndex: number, offset?: boolean): number;
    public static parseEmoji(text: string): { animated: boolean; name: string; id: Snowflake | null } | null;
    public static resolveColor(color: ColorResolvable): number;
    public static resolvePartialEmoji(emoji: EmojiIdentifierResolvable): Partial<APIPartialEmoji> | null;
    public static verifyString(data: string, error?: typeof Error, errorMessage?: string, allowEmpty?: boolean): string;
    public static setPosition<T extends Channel | Role>(
      item: T,
      position: number,
      relative: boolean,
      sorted: Collection<Snowflake, T>,
      route: unknown,
      reason?: string,
    ): Promise<{ id: Snowflake; position: number }[]>;
    public static splitMessage(text: string, options?: SplitOptions): string[];
  }

  export class Formatters extends null {
    public static blockQuote: typeof blockQuote;
    public static bold: typeof bold;
    public static codeBlock: typeof codeBlock;
    public static hideLinkEmbed: typeof hideLinkEmbed;
    public static hyperlink: typeof hyperlink;
    public static inlineCode: typeof inlineCode;
    public static italic: typeof italic;
    public static quote: typeof quote;
    public static strikethrough: typeof strikethrough;
    public static time: typeof time;
    public static TimestampStyles: typeof TimestampStyles;
    public static TimestampStylesString: TimestampStylesString;
    public static underscore: typeof underscore;
  }

  export class VoiceChannel extends BaseGuildVoiceChannel {
    public readonly editable: boolean;
    public readonly speakable: boolean;
    public type: 'voice';
    public setBitrate(bitrate: number, reason?: string): Promise<VoiceChannel>;
    public setUserLimit(userLimit: number, reason?: string): Promise<VoiceChannel>;
  }

  export class VoiceRegion {
    constructor(data: unknown);
    public custom: boolean;
    public deprecated: boolean;
    public id: string;
    public name: string;
    public optimal: boolean;
    public vip: boolean;
    public toJSON(): unknown;
  }

  export class VoiceState extends Base {
    constructor(guild: Guild, data: unknown);
    public readonly channel: VoiceChannel | StageChannel | null;
    public channelID: Snowflake | null;
    public readonly deaf: boolean | null;
    public guild: Guild;
    public id: Snowflake;
    public readonly member: GuildMember | null;
    public readonly mute: boolean | null;
    public selfDeaf: boolean | null;
    public selfMute: boolean | null;
    public serverDeaf: boolean | null;
    public serverMute: boolean | null;
    public sessionID: string | null;
    public streaming: boolean;
    public selfVideo: boolean | null;
    public suppress: boolean;
    public requestToSpeakTimestamp: number | null;

    public setDeaf(deaf: boolean, reason?: string): Promise<GuildMember>;
    public setMute(mute: boolean, reason?: string): Promise<GuildMember>;
    public kick(reason?: string): Promise<GuildMember>;
    public setChannel(channel: ChannelResolvable | null, reason?: string): Promise<GuildMember>;
    public setRequestToSpeak(request: boolean): Promise<void>;
    public setSuppressed(suppressed: boolean): Promise<void>;
  }

  class VolumeInterface extends EventEmitter {
    constructor(options?: { volume?: number });
    public readonly volume: number;
    public readonly volumeDecibels: number;
    public readonly volumeEditable: boolean;
    public readonly volumeLogarithmic: number;
    public setVolume(volume: number): void;
    public setVolumeDecibels(db: number): void;
    public setVolumeLogarithmic(value: number): void;

    public on(event: 'volumeChange', listener: (oldVolume: number, newVolume: number) => Awaited<void>): this;

    public once(event: 'volumeChange', listener: (oldVolume: number, newVolume: number) => Awaited<void>): this;
  }

  export class Webhook extends WebhookMixin() {
    constructor(client: Client, data?: unknown);
    public avatar: string;
    public avatarURL(options?: StaticImageURLOptions): string | null;
    public channelID: Snowflake;
    public client: Client;
    public guildID: Snowflake;
    public name: string;
    public owner: User | unknown | null;
    public sourceGuild: Guild | unknown | null;
    public sourceChannel: Channel | unknown | null;
    public token: string | null;
    public type: WebhookType;
  }

  export class WebhookClient extends WebhookMixin(BaseClient) {
    constructor(id: Snowflake, token: string, options?: WebhookClientOptions);
    public client: this;
    public options: WebhookClientOptions;
    public token: string;
    public editMessage(
      message: MessageResolvable,
      options: string | MessagePayload | WebhookEditMessageOptions,
    ): Promise<APIMessage>;
    public fetchMessage(message: Snowflake, cache?: boolean): Promise<APIMessage>;
    public send(options: string | MessagePayload | WebhookMessageOptions): Promise<APIMessage>;
  }

  export class WebSocketManager extends EventEmitter {
    constructor(client: Client);
    private totalShards: number | string;
    private shardQueue: Set<WebSocketShard>;
    private packetQueue: unknown[];
    private destroyed: boolean;
    private reconnecting: boolean;

    public readonly client: Client;
    public gateway: string | null;
    public shards: Collection<number, WebSocketShard>;
    public status: Status;
    public readonly ping: number;

    public on(event: WSEventType, listener: (data: any, shardID: number) => void): this;
    public once(event: WSEventType, listener: (data: any, shardID: number) => void): this;

    private debug(message: string, shard?: WebSocketShard): void;
    private connect(): Promise<void>;
    private createShards(): Promise<void>;
    private reconnect(): Promise<void>;
    private broadcast(packet: unknown): void;
    private destroy(): void;
    private handlePacket(packet?: unknown, shard?: WebSocketShard): boolean;
    private checkShardsReady(): void;
    private triggerClientReady(): void;
  }

  export class WebSocketShard extends EventEmitter {
    constructor(manager: WebSocketManager, id: number);
    private sequence: number;
    private closeSequence: number;
    private sessionID: string | null;
    private lastPingTimestamp: number;
    private lastHeartbeatAcked: boolean;
    private ratelimit: { queue: unknown[]; total: number; remaining: number; time: 60e3; timer: NodeJS.Timeout | null };
    private connection: WebSocket | null;
    private helloTimeout: NodeJS.Timeout | null;
    private eventsAttached: boolean;
    private expectedGuilds: Set<Snowflake> | null;
    private readyTimeout: NodeJS.Timeout | null;

    public manager: WebSocketManager;
    public id: number;
    public status: Status;
    public ping: number;

    private debug(message: string): void;
    private connect(): Promise<void>;
    private onOpen(): void;
    private onMessage(event: MessageEvent): void;
    private onError(error: ErrorEvent | unknown): void;
    private onClose(event: CloseEvent): void;
    private onPacket(packet: unknown): void;
    private checkReady(): void;
    private setHelloTimeout(time?: number): void;
    private setHeartbeatTimer(time: number): void;
    private sendHeartbeat(): void;
    private ackHeartbeat(): void;
    private identify(): void;
    private identifyNew(): void;
    private identifyResume(): void;
    private _send(data: unknown): void;
    private processQueue(): void;
    private destroy(destroyOptions?: { closeCode?: number; reset?: boolean; emit?: boolean; log?: boolean }): void;
    private _cleanupConnection(): void;
    private _emitDestroyed(): void;

    public send(data: unknown, important?: boolean): void;

    public on(event: 'ready' | 'resumed' | 'invalidSession', listener: () => Awaited<void>): this;
    public on(event: 'close', listener: (event: CloseEvent) => Awaited<void>): this;
    public on(event: 'allReady', listener: (unavailableGuilds?: Set<Snowflake>) => Awaited<void>): this;
    public on(event: string, listener: (...args: any[]) => Awaited<void>): this;

    public once(event: 'ready' | 'resumed' | 'invalidSession', listener: () => Awaited<void>): this;
    public once(event: 'close', listener: (event: CloseEvent) => Awaited<void>): this;
    public once(event: 'allReady', listener: (unavailableGuilds?: Set<Snowflake>) => Awaited<void>): this;
    public once(event: string, listener: (...args: any[]) => Awaited<void>): this;
  }

  export class Widget extends Base {
    constructor(client: Client, data: object);
    private _patch(data: object): void;
    public fetch(): Promise<Widget>;
    public id: Snowflake;
    public instantInvite?: string;
    public channels: Collection<Snowflake, WidgetChannel>;
    public members: Collection<string, WidgetMember>;
    public presenceCount: number;
  }

  export class WidgetMember extends Base {
    constructor(client: Client, data: object);
    public id: string;
    public username: string;
    public discriminator: string;
    public avatar?: string;
    public status: PresenceStatus;
    public deaf?: boolean;
    public mute?: boolean;
    public selfDeaf?: boolean;
    public selfMute?: boolean;
    public suppress?: boolean;
    public channelID?: Snowflake;
    public avatarURL: string;
    public activity?: WidgetActivity;
  }

  export class WelcomeChannel extends Base {
    private _emoji: unknown;
    public channelID: Snowflake;
    public guild: Guild | InviteGuild;
    public description: string;
    public readonly channel: TextChannel | NewsChannel | null;
    public readonly emoji: GuildEmoji | Emoji;
  }

  export class WelcomeScreen extends Base {
    public readonly enabled: boolean;
    public guild: Guild | InviteGuild;
    public description: string | null;
    public welcomeChannels: Collection<Snowflake, WelcomeChannel>;
  }

  //#endregion

  //#region Collections

  export class Collection<K, V> extends BaseCollection<K, V> {
    public flatMap<T>(
      fn: (value: V, key: K, collection: this) => Collection<K, T>,
      thisArg?: unknown,
    ): Collection<K, T>;
    public flatMap<T, This>(
      fn: (this: This, value: V, key: K, collection: this) => Collection<K, T>,
      thisArg: This,
    ): Collection<K, T>;
    public mapValues<T>(fn: (value: V, key: K, collection: this) => T, thisArg?: unknown): Collection<K, T>;
    public mapValues<This, T>(
      fn: (this: This, value: V, key: K, collection: this) => T,
      thisArg: This,
    ): Collection<K, T>;
    public toJSON(): unknown;
  }

  //#endregion

  //#region Managers

  export abstract class BaseManager {
    constructor(client: Client);
    public readonly client: Client;
  }

  export abstract class DataManager<K, Holds, R> extends BaseManager {
    constructor(client: Client, holds: Constructable<Holds>);
    public readonly holds: Constructable<Holds>;
    public readonly cache: Collection<K, Holds>;
    public resolve(resolvable: Holds): Holds;
    public resolve(resolvable: R): Holds | null;
    public resolveID(resolvable: Holds): K;
    public resolveID(resolvable: R): K | null;
    public valueOf(): Collection<K, Holds>;
  }

  export abstract class CachedManager<K, Holds, R> extends DataManager<K, Holds, R> {
    constructor(client: Client, holds: Constructable<Holds>);
    public add(data: any, cache?: boolean, { id, extras }?: { id: K; extras: any[] }): Holds;
  }

  export class ApplicationCommandManager<
    ApplicationCommandType = ApplicationCommand<{ guild: GuildResolvable }>,
    PermissionsOptionsExtras = { guild: GuildResolvable },
    PermissionsGuildType = null,
  > extends CachedManager<Snowflake, ApplicationCommandType, ApplicationCommandResolvable> {
    constructor(client: Client, iterable?: Iterable<any>);
    public permissions: ApplicationCommandPermissionsManager<
      { command?: ApplicationCommandResolvable } & PermissionsOptionsExtras,
      { command: ApplicationCommandResolvable } & PermissionsOptionsExtras,
      PermissionsOptionsExtras,
      PermissionsGuildType,
      null
    >;
    private commandPath({ id, guildID }: { id?: Snowflake; guildID?: Snowflake }): unknown;
    public create(command: ApplicationCommandData, guildID: Snowflake): Promise<ApplicationCommand>;
    public create(command: ApplicationCommandData, guildID?: Snowflake): Promise<ApplicationCommandType>;
    public delete(command: ApplicationCommandResolvable, guildID?: Snowflake): Promise<ApplicationCommandType | null>;
    public edit(
      command: ApplicationCommandResolvable,
      data: ApplicationCommandData,
      guildID: Snowflake,
    ): Promise<ApplicationCommand>;
    public edit(
      command: ApplicationCommandResolvable,
      data: ApplicationCommandData,
      guildID?: Snowflake,
    ): Promise<ApplicationCommandType>;
    public fetch(
      id: Snowflake,
      options: FetchApplicationCommandOptions & { guildID: Snowflake },
    ): Promise<ApplicationCommand>;
    public fetch(id: Snowflake, options?: FetchApplicationCommandOptions): Promise<ApplicationCommandType>;
    public fetch(
      id?: Snowflake,
      options?: FetchApplicationCommandOptions,
    ): Promise<Collection<Snowflake, ApplicationCommandType>>;
    public set(
      commands: ApplicationCommandData[],
      guildID?: Snowflake,
    ): Promise<Collection<Snowflake, ApplicationCommand>>;
    public set(
      commands: ApplicationCommandData[],
      guildID?: Snowflake,
    ): Promise<Collection<Snowflake, ApplicationCommandType>>;
    private static transformCommand(command: ApplicationCommandData): unknown;
  }

  export class ApplicationCommandPermissionsManager<
    BaseOptions,
    FetchSingleOptions,
    FullPermissionsOptions,
    GuildType,
    CommandIDType,
  > extends BaseManager {
    constructor(manager: ApplicationCommandManager | GuildApplicationCommandManager | ApplicationCommand);
    public client: Client;
    public commandID: CommandIDType;
    public guild: GuildType;
    public guildID: Snowflake | null;
    public manager: ApplicationCommandManager | GuildApplicationCommandManager | ApplicationCommand;
    public add(
      options: FetchSingleOptions & { permissions: ApplicationCommandPermissionData[] },
    ): Promise<ApplicationCommandPermissions[]>;
    public has(options: FetchSingleOptions & { permissionsID: UserResolvable | RoleResolvable }): Promise<boolean>;
    public fetch(options: FetchSingleOptions): Promise<ApplicationCommandPermissions[]>;
    public fetch(options: BaseOptions): Promise<Collection<Snowflake, ApplicationCommandPermissions[]>>;
    public remove(
      options:
        | (FetchSingleOptions & {
            users: UserResolvable | UserResolvable[];
            roles?: RoleResolvable | RoleResolvable[];
          })
        | (FetchSingleOptions & {
            users?: UserResolvable | UserResolvable[];
            roles: RoleResolvable | RoleResolvable[];
          }),
    ): Promise<ApplicationCommandPermissions[]>;
    public set(
      options: FetchSingleOptions & { permissions: ApplicationCommandPermissionData[] },
    ): Promise<ApplicationCommandPermissions[]>;
    public set(
      options: FullPermissionsOptions & {
        fullPermissions: GuildApplicationCommandPermissionData[];
      },
    ): Promise<Collection<Snowflake, ApplicationCommandPermissions[]>>;
    private permissionsPath(guildID: Snowflake, commandID?: Snowflake): unknown;
    private static transformPermissions(permissions: ApplicationCommandPermissionData, received?: boolean): unknown;
  }

  export class BaseGuildEmojiManager extends CachedManager<Snowflake, GuildEmoji, EmojiResolvable> {
    constructor(client: Client, iterable?: Iterable<any>);
    public resolveIdentifier(emoji: EmojiIdentifierResolvable): string | null;
  }

  export class ChannelManager extends CachedManager<Snowflake, Channel, ChannelResolvable> {
    constructor(client: Client, iterable: Iterable<any>);
    public fetch(id: Snowflake, options?: BaseFetchOptions): Promise<Channel | null>;
  }

  export class GuildApplicationCommandManager extends ApplicationCommandManager<ApplicationCommand, {}, Guild> {
    constructor(guild: Guild, iterable?: Iterable<any>);
    public guild: Guild;
    public create(command: ApplicationCommandData): Promise<ApplicationCommand>;
    public delete(command: ApplicationCommandResolvable): Promise<ApplicationCommand | null>;
    public edit(command: ApplicationCommandResolvable, data: ApplicationCommandData): Promise<ApplicationCommand>;
    public fetch(id: Snowflake, options?: BaseFetchOptions): Promise<ApplicationCommand>;
    public fetch(id?: Snowflake, options?: BaseFetchOptions): Promise<Collection<Snowflake, ApplicationCommand>>;
    public set(commands: ApplicationCommandData[]): Promise<Collection<Snowflake, ApplicationCommand>>;
  }

  export class GuildChannelManager extends CachedManager<
    Snowflake,
    GuildChannel | ThreadChannel,
    GuildChannelResolvable
  > {
    constructor(guild: Guild, iterable?: Iterable<any>);
    public readonly channelCountWithoutThreads: number;
    public guild: Guild;
    public create(name: string, options: GuildChannelCreateOptions & { type: 'voice' }): Promise<VoiceChannel>;
    public create(name: string, options: GuildChannelCreateOptions & { type: 'category' }): Promise<CategoryChannel>;
    public create(name: string, options?: GuildChannelCreateOptions & { type?: 'text' }): Promise<TextChannel>;
    public create(name: string, options: GuildChannelCreateOptions & { type: 'news' }): Promise<NewsChannel>;
    public create(name: string, options: GuildChannelCreateOptions & { type: 'store' }): Promise<StoreChannel>;
    public create(name: string, options: GuildChannelCreateOptions & { type: 'stage' }): Promise<StageChannel>;
    public create(
      name: string,
      options: GuildChannelCreateOptions,
    ): Promise<TextChannel | VoiceChannel | CategoryChannel | NewsChannel | StoreChannel | StageChannel>;
    public fetch(
      id: Snowflake,
      options?: BaseFetchOptions,
    ): Promise<TextChannel | VoiceChannel | CategoryChannel | NewsChannel | StoreChannel | StageChannel | null>;
    public fetch(
      id?: Snowflake,
      options?: BaseFetchOptions,
    ): Promise<
      Collection<Snowflake, TextChannel | VoiceChannel | CategoryChannel | NewsChannel | StoreChannel | StageChannel>
    >;
  }

  export class GuildEmojiManager extends BaseGuildEmojiManager {
    constructor(guild: Guild, iterable?: Iterable<any>);
    public guild: Guild;
    public create(
      attachment: BufferResolvable | Base64Resolvable,
      name: string,
      options?: GuildEmojiCreateOptions,
    ): Promise<GuildEmoji>;
    public fetch(id: Snowflake, options?: BaseFetchOptions): Promise<GuildEmoji>;
    public fetch(id?: Snowflake, options?: BaseFetchOptions): Promise<Collection<Snowflake, GuildEmoji>>;
  }

  export class GuildEmojiRoleManager extends DataManager<Snowflake, Role, RoleResolvable> {
    constructor(emoji: GuildEmoji);
    public emoji: GuildEmoji;
    public guild: Guild;
    public add(
      roleOrRoles: RoleResolvable | readonly RoleResolvable[] | Collection<Snowflake, Role>,
    ): Promise<GuildEmoji>;
    public set(roles: readonly RoleResolvable[] | Collection<Snowflake, Role>): Promise<GuildEmoji>;
    public remove(
      roleOrRoles: RoleResolvable | readonly RoleResolvable[] | Collection<Snowflake, Role>,
    ): Promise<GuildEmoji>;
  }

  export class GuildManager extends CachedManager<Snowflake, Guild, GuildResolvable> {
    constructor(client: Client, iterable?: Iterable<any>);
    public create(name: string, options?: GuildCreateOptions): Promise<Guild>;
    public fetch(options: Snowflake | FetchGuildOptions): Promise<Guild>;
    public fetch(options?: FetchGuildsOptions): Promise<Collection<Snowflake, OAuth2Guild>>;
  }

  export class GuildMemberManager extends CachedManager<Snowflake, GuildMember, GuildMemberResolvable> {
    constructor(guild: Guild, iterable?: Iterable<any>);
    public guild: Guild;
    public ban(user: UserResolvable, options?: BanOptions): Promise<GuildMember | User | Snowflake>;
    public edit(user: UserResolvable, data: GuildMemberEditData, reason?: string): Promise<void>;
    public fetch(
      options: UserResolvable | FetchMemberOptions | (FetchMembersOptions & { user: UserResolvable }),
    ): Promise<GuildMember>;
    public fetch(options?: FetchMembersOptions): Promise<Collection<Snowflake, GuildMember>>;
    public kick(user: UserResolvable, reason?: string): Promise<GuildMember | User | Snowflake>;
    public prune(options: GuildPruneMembersOptions & { dry?: false; count: false }): Promise<null>;
    public prune(options?: GuildPruneMembersOptions): Promise<number>;
    public search(options: GuildSearchMembersOptions): Promise<Collection<Snowflake, GuildMember>>;
    public unban(user: UserResolvable, reason?: string): Promise<User>;
  }

  export class GuildBanManager extends CachedManager<Snowflake, GuildBan, GuildBanResolvable> {
    constructor(guild: Guild, iterable?: Iterable<any>);
    public guild: Guild;
    public create(user: UserResolvable, options?: BanOptions): Promise<GuildMember | User | Snowflake>;
    public fetch(options: UserResolvable | FetchBanOptions): Promise<GuildBan>;
    public fetch(options?: FetchBansOptions): Promise<Collection<Snowflake, GuildBan>>;
    public remove(user: UserResolvable, reason?: string): Promise<User>;
  }

  export class GuildMemberRoleManager extends DataManager<Snowflake, Role, RoleResolvable> {
    constructor(member: GuildMember);
    public readonly hoist: Role | null;
    public readonly color: Role | null;
    public readonly highest: Role;
    public readonly premiumSubscriberRole: Role | null;
    public readonly botRole: Role | null;
    public member: GuildMember;
    public guild: Guild;

    public add(
      roleOrRoles: RoleResolvable | readonly RoleResolvable[] | Collection<Snowflake, Role>,
      reason?: string,
    ): Promise<GuildMember>;
    public set(roles: readonly RoleResolvable[] | Collection<Snowflake, Role>, reason?: string): Promise<GuildMember>;
    public remove(
      roleOrRoles: RoleResolvable | readonly RoleResolvable[] | Collection<Snowflake, Role>,
      reason?: string,
    ): Promise<GuildMember>;
  }

  export class MessageManager extends CachedManager<Snowflake, Message, MessageResolvable> {
    constructor(channel: TextChannel | DMChannel | ThreadChannel, iterable?: Iterable<any>);
    public channel: TextBasedChannelFields;
    public cache: Collection<Snowflake, Message>;
    public crosspost(message: MessageResolvable): Promise<Message>;
    public delete(message: MessageResolvable): Promise<void>;
    public edit(message: MessageResolvable, options: MessagePayload | MessageEditOptions): Promise<Message>;
    public fetch(message: Snowflake, options?: BaseFetchOptions): Promise<Message>;
    public fetch(
      options?: ChannelLogsQueryOptions,
      cacheOptions?: BaseFetchOptions,
    ): Promise<Collection<Snowflake, Message>>;
    public fetchPinned(cache?: boolean): Promise<Collection<Snowflake, Message>>;
    public react(message: MessageResolvable, emoji: EmojiIdentifierResolvable): Promise<void>;
    public pin(message: MessageResolvable): Promise<void>;
    public unpin(message: MessageResolvable): Promise<void>;
  }

  export class PermissionOverwriteManager extends CachedManager<
    Snowflake,
    PermissionOverwrites,
    PermissionOverwriteResolvable
  > {
    constructor(client: Client, iterable?: Iterable<any>);
    public set(
      overwrites: readonly OverwriteResolvable[] | Collection<Snowflake, OverwriteResolvable>,
      reason?: string,
    ): Promise<GuildChannel>;
    private upsert(
      userOrRole: RoleResolvable | UserResolvable,
      options: PermissionOverwriteOptions,
      overwriteOptions?: GuildChannelOverwriteOptions,
      existing?: PermissionOverwrites,
    ): Promise<GuildChannel>;
    public create(
      userOrRole: RoleResolvable | UserResolvable,
      options: PermissionOverwriteOptions,
      overwriteOptions?: GuildChannelOverwriteOptions,
    ): Promise<GuildChannel>;
    public edit(
      userOrRole: RoleResolvable | UserResolvable,
      options: PermissionOverwriteOptions,
      overwriteOptions?: GuildChannelOverwriteOptions,
    ): Promise<GuildChannel>;
    public delete(userOrRole: RoleResolvable | UserResolvable, reason?: string): Promise<GuildChannel>;
  }

  export class PresenceManager extends CachedManager<Snowflake, Presence, PresenceResolvable> {
    constructor(client: Client, iterable?: Iterable<any>);
  }

  export class ReactionManager extends CachedManager<Snowflake | string, MessageReaction, MessageReactionResolvable> {
    constructor(message: Message, iterable?: Iterable<any>);
    public message: Message;
    public removeAll(): Promise<Message>;
  }

  export class ReactionUserManager extends CachedManager<Snowflake, User, UserResolvable> {
    constructor(reaction: MessageReaction, iterable?: Iterable<any>);
    public reaction: MessageReaction;
    public fetch(options?: FetchReactionUsersOptions): Promise<Collection<Snowflake, User>>;
    public remove(user?: UserResolvable): Promise<MessageReaction>;
  }

  export class RoleManager extends CachedManager<Snowflake, Role, RoleResolvable> {
    constructor(guild: Guild, iterable?: Iterable<any>);
    public readonly everyone: Role;
    public readonly highest: Role;
    public guild: Guild;
    public readonly premiumSubscriberRole: Role | null;
    public botRoleFor(user: UserResolvable): Role | null;
    public fetch(id: Snowflake, options?: BaseFetchOptions): Promise<Role | null>;
    public fetch(id?: Snowflake, options?: BaseFetchOptions): Promise<Collection<Snowflake, Role>>;
    public create(options?: CreateRoleOptions): Promise<Role>;
    public edit(role: RoleResolvable, options: RoleData, reason?: string): Promise<Role>;
  }

  export class StageInstanceManager extends CachedManager<Snowflake, StageInstance, StageInstanceResolvable> {
    constructor(guild: Guild, iterable?: Iterable<any>);
    public guild: Guild;
    public create(channel: StageChannel | Snowflake, options: StageInstanceCreateOptions): Promise<StageInstance>;
    public fetch(channel: StageChannel | Snowflake, options?: BaseFetchOptions): Promise<StageInstance>;
    public edit(channel: StageChannel | Snowflake, options: StageInstanceEditOptions): Promise<StageInstance>;
    public delete(channel: StageChannel | Snowflake): Promise<void>;
  }

  export class ThreadManager<AllowedThreadType> extends CachedManager<
    Snowflake,
    ThreadChannel,
    ThreadChannelResolvable
  > {
    constructor(channel: TextChannel | NewsChannel, iterable?: Iterable<any>);
    public channel: TextChannel | NewsChannel;
    public create(options: ThreadCreateOptions<AllowedThreadType>): Promise<ThreadChannel>;
    public fetch(options: ThreadChannelResolvable, cacheOptions?: BaseFetchOptions): Promise<ThreadChannel | null>;
    public fetch(options?: FetchThreadsOptions, cacheOptions?: { cache?: boolean }): Promise<FetchedThreads>;
    public fetchArchived(options?: FetchArchivedThreadOptions, cache?: boolean): Promise<FetchedThreads>;
    public fetchActive(cache?: boolean): Promise<FetchedThreads>;
  }

  export interface ThreadMemberManager
    extends Omit<CachedManager<Snowflake, ThreadMember, ThreadMemberResolvable>, 'add'> {}
  export class ThreadMemberManager {
    constructor(thread: ThreadChannel, iterable?: Iterable<any>);
    public thread: ThreadChannel;
    public _add(data: any, cache?: boolean): ThreadMember;
    public add(member: UserResolvable | '@me', reason?: string): Promise<Snowflake>;
    public fetch(cache?: boolean): Promise<Collection<Snowflake, ThreadMember>>;
    public remove(id: Snowflake | '@me', reason?: string): Promise<Snowflake>;
  }

  export class UserManager extends CachedManager<Snowflake, User, UserResolvable> {
    constructor(client: Client, iterable?: Iterable<any>);
    public fetch(id: Snowflake, options?: BaseFetchOptions): Promise<User>;
  }

  export class VoiceStateManager extends CachedManager<Snowflake, VoiceState, typeof VoiceState> {
    constructor(guild: Guild, iterable?: Iterable<any>);
    public guild: Guild;
  }

  //#endregion

  //#region Mixins

  // Model the TextBasedChannel mixin system, allowing application of these fields
  // to the classes that use these methods without having to manually add them
  // to each of those classes

  type Constructable<T> = new (...args: any[]) => T;
  function PartialTextBasedChannel<T>(Base?: Constructable<T>): Constructable<T & PartialTextBasedChannelFields>;
  function TextBasedChannel<T, I extends keyof TextBasedChannelFields = never>(
    Base?: Constructable<T>,
    ignore?: I[],
  ): Constructable<T & Omit<TextBasedChannelFields, I>>;

  interface PartialTextBasedChannelFields {
    lastMessageID: Snowflake | null;
    readonly lastMessage: Message | null;
    send(options: string | MessagePayload | MessageOptions): Promise<Message>;
  }

  interface TextBasedChannelFields extends PartialTextBasedChannelFields {
    _typing: Map<string, TypingData>;
    lastPinTimestamp: number | null;
    readonly lastPinAt: Date | null;
    typing: boolean;
    typingCount: number;
    awaitMessageComponent<T extends MessageComponentInteraction = MessageComponentInteraction>(
      options?: AwaitMessageComponentOptions<T>,
    ): Promise<T>;
    awaitMessages(options?: AwaitMessagesOptions): Promise<Collection<Snowflake, Message>>;
    bulkDelete(
      messages: Collection<Snowflake, Message> | readonly MessageResolvable[] | number,
      filterOld?: boolean,
    ): Promise<Collection<Snowflake, Message>>;
    createMessageComponentCollector<T extends MessageComponentInteraction = MessageComponentInteraction>(
      options?: InteractionCollectorOptions<T>,
    ): InteractionCollector<T>;
    createMessageCollector(options?: MessageCollectorOptions): MessageCollector;
    startTyping(count?: number): Promise<void>;
    stopTyping(force?: boolean): void;
  }

  function PartialWebhookMixin<T>(Base?: Constructable<T>): Constructable<T & PartialWebhookFields>;
  function WebhookMixin<T>(Base?: Constructable<T>): Constructable<T & WebhookFields>;

  function VolumeMixin<T>(base: Constructable<T>): Constructable<T & VolumeInterface>;

  interface PartialWebhookFields {
    id: Snowflake;
    readonly url: string;
    deleteMessage(message: MessageResolvable | '@original'): Promise<void>;
    editMessage(
      message: MessageResolvable | '@original',
      options: string | MessagePayload | WebhookEditMessageOptions,
    ): Promise<Message | APIMessage>;
    fetchMessage(message: Snowflake | '@original', cache?: boolean): Promise<Message | APIMessage>;
    send(options: string | MessagePayload | WebhookMessageOptions): Promise<Message | APIMessage>;
  }

  interface WebhookFields extends PartialWebhookFields {
    readonly createdAt: Date;
    readonly createdTimestamp: number;
    delete(reason?: string): Promise<void>;
    edit(options: WebhookEditData, reason?: string): Promise<Webhook>;
    sendSlackMessage(body: object): Promise<boolean>;
  }

  //#endregion

  //#region Typedefs

  type ActivityFlagsString = 'INSTANCE' | 'JOIN' | 'SPECTATE' | 'JOIN_REQUEST' | 'SYNC' | 'PLAY';

  type ActivitiesOptions = Omit<ActivityOptions, 'shardID'>;

  interface ActivityOptions {
    name?: string;
    url?: string;
    type?: ActivityType | number;
    shardID?: number | readonly number[];
  }

  type ActivityPlatform = 'desktop' | 'samsung' | 'xbox';

  type ActivityType = keyof typeof ActivityTypes;

  interface AddGuildMemberOptions {
    accessToken: string;
    nick?: string;
    roles?: Collection<Snowflake, Role> | RoleResolvable[];
    mute?: boolean;
    deaf?: boolean;
  }

  type AllowedThreadTypeForNewsChannel = 'news_thread' | 10;

  type AllowedThreadTypeForTextChannel = 'public_thread' | 'private_thread' | 11 | 12;

  interface APIErrors {
    UNKNOWN_ACCOUNT: 10001;
    UNKNOWN_APPLICATION: 10002;
    UNKNOWN_CHANNEL: 10003;
    UNKNOWN_GUILD: 10004;
    UNKNOWN_INTEGRATION: 10005;
    UNKNOWN_INVITE: 10006;
    UNKNOWN_MEMBER: 10007;
    UNKNOWN_MESSAGE: 10008;
    UNKNOWN_OVERWRITE: 10009;
    UNKNOWN_PROVIDER: 10010;
    UNKNOWN_ROLE: 10011;
    UNKNOWN_TOKEN: 10012;
    UNKNOWN_USER: 10013;
    UNKNOWN_EMOJI: 10014;
    UNKNOWN_WEBHOOK: 10015;
    UNKNOWN_WEBHOOK_SERVICE: 10016;
    UNKNOWN_SESSION: 10020;
    UNKNOWN_BAN: 10026;
    UNKNOWN_SKU: 10027;
    UNKNOWN_STORE_LISTING: 10028;
    UNKNOWN_ENTITLEMENT: 10029;
    UNKNOWN_BUILD: 10030;
    UNKNOWN_LOBBY: 10031;
    UNKNOWN_BRANCH: 10032;
    UNKNOWN_STORE_DIRECTORY_LAYOUT: 10033;
    UNKNOWN_REDISTRIBUTABLE: 10036;
    UNKNOWN_GIFT_CODE: 10038;
    UNKNOWN_GUILD_TEMPLATE: 10057;
    UNKNOWN_DISCOVERABLE_SERVER_CATEGORY: 10059;
    UNKNOWN_STICKER: 10060;
    UNKNOWN_INTERACTION: 10062;
    UNKNOWN_APPLICATION_COMMAND: 10063;
    UNKNOWN_APPLICATION_COMMAND_PERMISSIONS: 10066;
    UNKNOWN_STAGE_INSTANCE: 10067;
    UNKNOWN_GUILD_MEMBER_VERIFICATION_FORM: 10068;
    UNKNOWN_GUILD_WELCOME_SCREEN: 10069;
    BOT_PROHIBITED_ENDPOINT: 20001;
    BOT_ONLY_ENDPOINT: 20002;
    CANNOT_SEND_EXPLICIT_CONTENT: 20009;
    NOT_AUTHORIZED: 20012;
    SLOWMODE_RATE_LIMIT: 20016;
    ACCOUNT_OWNER_ONLY: 20018;
    ANNOUNCEMENT_EDIT_LIMIT_EXCEEDED: 20022;
    CHANNEL_HIT_WRITE_RATELIMIT: 20028;
    CONTENT_NOT_ALLOWED: 20031;
    GUILD_PREMIUM_LEVEL_TOO_LOW: 20035;
    MAXIMUM_GUILDS: 30001;
    MAXIMUM_FRIENDS: 30002;
    MAXIMUM_PINS: 30003;
    MAXIMUM_RECIPIENTS: 30004;
    MAXIMUM_ROLES: 30005;
    MAXIMUM_WEBHOOKS: 30007;
    MAXIMUM_EMOJIS: 30008;
    MAXIMUM_REACTIONS: 30010;
    MAXIMUM_CHANNELS: 30013;
    MAXIMUM_ATTACHMENTS: 30015;
    MAXIMUM_INVITES: 30016;
    MAXIMUM_ANIMATED_EMOJIS: 30018;
    MAXIMUM_SERVER_MEMBERS: 30019;
    MAXIMUM_NUMBER_OF_SERVER_CATEGORIES: 30030;
    GUILD_ALREADY_HAS_TEMPLATE: 30031;
    MAXIMUM_THREAD_PARICIPANTS: 30033;
    MAXIMUM_NON_GUILD_MEMBERS_BANS: 30035;
    MAXIMUM_BAN_FETCHES: 30037;
    MAXIMUM_NUMBER_OF_STICKERS_REACHED: 30039;
    UNAUTHORIZED: 40001;
    ACCOUNT_VERIFICATION_REQUIRED: 40002;
    DIRECT_MESSAGES_TOO_FAST: 40003;
    REQUEST_ENTITY_TOO_LARGE: 40005;
    FEATURE_TEMPORARILY_DISABLED: 40006;
    USER_BANNED: 40007;
    TARGET_USER_NOT_CONNECTED_TO_VOICE: 40032;
    ALREADY_CROSSPOSTED: 40033;
    MISSING_ACCESS: 50001;
    INVALID_ACCOUNT_TYPE: 50002;
    CANNOT_EXECUTE_ON_DM: 50003;
    EMBED_DISABLED: 50004;
    CANNOT_EDIT_MESSAGE_BY_OTHER: 50005;
    CANNOT_SEND_EMPTY_MESSAGE: 50006;
    CANNOT_MESSAGE_USER: 50007;
    CANNOT_SEND_MESSAGES_IN_VOICE_CHANNEL: 50008;
    CHANNEL_VERIFICATION_LEVEL_TOO_HIGH: 50009;
    OAUTH2_APPLICATION_BOT_ABSENT: 50010;
    MAXIMUM_OAUTH2_APPLICATIONS: 50011;
    INVALID_OAUTH_STATE: 50012;
    MISSING_PERMISSIONS: 50013;
    INVALID_AUTHENTICATION_TOKEN: 50014;
    NOTE_TOO_LONG: 50015;
    INVALID_BULK_DELETE_QUANTITY: 50016;
    CANNOT_PIN_MESSAGE_IN_OTHER_CHANNEL: 50019;
    INVALID_OR_TAKEN_INVITE_CODE: 50020;
    CANNOT_EXECUTE_ON_SYSTEM_MESSAGE: 50021;
    CANNOT_EXECUTE_ON_CHANNEL_TYPE: 50024;
    INVALID_OAUTH_TOKEN: 50025;
    MISSING_OAUTH_SCOPE: 50026;
    INVALID_WEBHOOK_TOKEN: 50027;
    INVALID_ROLE: 50028;
    INVALID_RECIPIENTS: 50033;
    BULK_DELETE_MESSAGE_TOO_OLD: 50034;
    INVALID_FORM_BODY: 50035;
    INVITE_ACCEPTED_TO_GUILD_NOT_CONTAINING_BOT: 50036;
    INVALID_API_VERSION: 50041;
    CANNOT_SELF_REDEEM_GIFT: 50054;
    PAYMENT_SOURCE_REQUIRED: 50070;
    CANNOT_DELETE_COMMUNITY_REQUIRED_CHANNEL: 50074;
    INVALID_STICKER_SENT: 50081;
    INVALID_THREAD_ARCHIVE_STATE: 50083;
    INVALID_THREAD_NOTIFICATION_SETTINGS: 50084;
    PARAMETER_EARLIER_THAN_CREATION: 50085;
    TWO_FACTOR_REQUIRED: 60003;
    NO_USERS_WITH_DISCORDTAG_EXIST: 80004;
    REACTION_BLOCKED: 90001;
    RESOURCE_OVERLOADED: 130000;
    STAGE_ALREADY_OPEN: 150006;
    MESSAGE_ALREADY_HAS_THREAD: 160004;
    THREAD_LOCKED: 160005;
    MAXIMUM_ACTIVE_THREADS: 160006;
    MAXIMUM_ACTIVE_ANNOUCEMENT_THREAD: 160007;
  }

  interface ApplicationAsset {
    name: string;
    id: Snowflake;
    type: 'BIG' | 'SMALL';
  }

  interface ApplicationCommandData {
    name: string;
    description: string;
    options?: ApplicationCommandOptionData[];
    defaultPermission?: boolean;
  }

  interface ApplicationCommandOptionData {
    type: ApplicationCommandOptionType | ApplicationCommandOptionTypes;
    name: string;
    description: string;
    required?: boolean;
    choices?: ApplicationCommandOptionChoice[];
    options?: this[];
  }

  interface ApplicationCommandOption extends ApplicationCommandOptionData {
    type: ApplicationCommandOptionType;
  }

  interface ApplicationCommandOptionChoice {
    name: string;
    value: string | number;
  }

  type ApplicationCommandOptionType = keyof typeof ApplicationCommandOptionTypes;

  interface ApplicationCommandPermissionData {
    id: Snowflake;
    type: ApplicationCommandPermissionType | ApplicationCommandPermissionTypes;
    permission: boolean;
  }

  interface ApplicationCommandPermissions extends ApplicationCommandPermissionData {
    type: ApplicationCommandPermissionType;
  }

  type ApplicationCommandPermissionType = keyof typeof ApplicationCommandPermissionTypes;

  type ApplicationCommandResolvable = ApplicationCommand | Snowflake;

  type ApplicationFlagsString =
    | 'MANAGED_EMOJI'
    | 'GROUP_DM_CREATE'
    | 'RPC_HAS_CONNECTED'
    | 'GATEWAY_PRESENCE'
    | 'GATEWAY_PRESENCE_LIMITED'
    | 'GATEWAY_GUILD_MEMBERS'
    | 'GATEWAY_GUILD_MEMBERS_LIMITED'
    | 'VERIFICATION_PENDING_GUILD_LIMIT'
    | 'EMBEDDED';

  interface AuditLogChange {
    key: string;
    old?: any;
    new?: any;
  }

  interface AwaitMessageComponentOptions<T extends MessageComponentInteraction>
    extends Omit<MessageComponentCollectorOptions<T>, 'max' | 'maxComponents' | 'maxUsers'> {}

  interface AwaitMessagesOptions extends MessageCollectorOptions {
    errors?: string[];
  }

  interface AwaitReactionsOptions extends ReactionCollectorOptions {
    errors?: string[];
  }

  interface BanOptions {
    days?: number;
    reason?: string;
  }

  type Base64Resolvable = Buffer | Base64String;

  type Base64String = string;

  interface BaseFetchOptions {
    cache?: boolean;
    force?: boolean;
  }

  interface BaseMessageComponentOptions {
    type?: MessageComponentType | MessageComponentTypes;
  }

  type BitFieldResolvable<T extends string, N extends number | bigint> =
    | RecursiveReadonlyArray<T | N | `${bigint}` | Readonly<BitField<T, N>>>
    | T
    | N
    | `${bigint}`
    | Readonly<BitField<T, N>>;

  type BufferResolvable = Buffer | string;

  type CacheFactory = <T>(manager: { name: string }, holds: { name: string }) => Collection<Snowflake, T>;

  interface ChannelCreationOverwrites {
    allow?: PermissionResolvable;
    deny?: PermissionResolvable;
    id: RoleResolvable | UserResolvable;
  }

  interface ChannelData {
    name?: string;
    type?: Pick<typeof ChannelType, 'text' | 'news'>;
    position?: number;
    topic?: string;
    nsfw?: boolean;
    bitrate?: number;
    userLimit?: number;
    parentID?: Snowflake | null;
    rateLimitPerUser?: number;
    lockPermissions?: boolean;
    permissionOverwrites?: readonly OverwriteResolvable[] | Collection<Snowflake, OverwriteResolvable>;
    defaultAutoArchiveDuration?: ThreadAutoArchiveDuration;
    rtcRegion?: string | null;
  }

  interface ChannelLogsQueryOptions {
    limit?: number;
    before?: Snowflake;
    after?: Snowflake;
    around?: Snowflake;
  }

  type ChannelMention = `<#${Snowflake}>`;

  interface ChannelPosition {
    channel: ChannelResolvable;
    lockPermissions?: boolean;
    parent?: CategoryChannelResolvable | null;
    position?: number;
  }

  type GuildTextChannelResolvable = TextChannel | NewsChannel | Snowflake;
  type ChannelResolvable = Channel | Snowflake;

  interface ChannelWebhookCreateOptions {
    avatar?: BufferResolvable | Base64Resolvable;
    reason?: string;
  }

  interface ClientEvents {
    applicationCommandCreate: [command: ApplicationCommand];
    applicationCommandDelete: [command: ApplicationCommand];
    applicationCommandUpdate: [oldCommand: ApplicationCommand | null, newCommand: ApplicationCommand];
    channelCreate: [channel: GuildChannel];
    channelDelete: [channel: DMChannel | GuildChannel];
    channelPinsUpdate: [channel: TextChannel | NewsChannel | DMChannel | PartialDMChannel, date: Date];
    channelUpdate: [oldChannel: DMChannel | GuildChannel, newChannel: DMChannel | GuildChannel];
    debug: [message: string];
    warn: [message: string];
    emojiCreate: [emoji: GuildEmoji];
    emojiDelete: [emoji: GuildEmoji];
    emojiUpdate: [oldEmoji: GuildEmoji, newEmoji: GuildEmoji];
    error: [error: Error];
    guildBanAdd: [ban: GuildBan];
    guildBanRemove: [ban: GuildBan];
    guildCreate: [guild: Guild];
    guildDelete: [guild: Guild];
    guildUnavailable: [guild: Guild];
    guildIntegrationsUpdate: [guild: Guild];
    guildMemberAdd: [member: GuildMember];
    guildMemberAvailable: [member: GuildMember | PartialGuildMember];
    guildMemberRemove: [member: GuildMember | PartialGuildMember];
    guildMembersChunk: [
      members: Collection<Snowflake, GuildMember>,
      guild: Guild,
      data: { count: number; index: number; nonce: string | undefined },
    ];
    guildMemberUpdate: [oldMember: GuildMember | PartialGuildMember, newMember: GuildMember];
    guildUpdate: [oldGuild: Guild, newGuild: Guild];
    inviteCreate: [invite: Invite];
    inviteDelete: [invite: Invite];
    /** @deprecated Use messageCreate instead */
    message: [message: Message];
    messageCreate: [message: Message];
    messageDelete: [message: Message | PartialMessage];
    messageReactionRemoveAll: [message: Message | PartialMessage];
    messageReactionRemoveEmoji: [reaction: MessageReaction];
    messageDeleteBulk: [messages: Collection<Snowflake, Message | PartialMessage>];
    messageReactionAdd: [message: MessageReaction, user: User | PartialUser];
    messageReactionRemove: [reaction: MessageReaction, user: User | PartialUser];
    messageUpdate: [oldMessage: Message | PartialMessage, newMessage: Message | PartialMessage];
    presenceUpdate: [oldPresence: Presence | undefined, newPresence: Presence];
    rateLimit: [rateLimitData: RateLimitData];
    invalidRequestWarning: [invalidRequestWarningData: InvalidRequestWarningData];
    ready: [];
    invalidated: [];
    roleCreate: [role: Role];
    roleDelete: [role: Role];
    roleUpdate: [oldRole: Role, newRole: Role];
    threadCreate: [thread: ThreadChannel];
    threadDelete: [thread: ThreadChannel];
    threadListSync: [threads: Collection<Snowflake, ThreadChannel>];
    threadMemberUpdate: [oldMember: ThreadMember, newMember: ThreadMember];
    threadMembersUpdate: [
      oldMembers: Collection<Snowflake, ThreadMember>,
      mewMembers: Collection<Snowflake, ThreadMember>,
    ];
    threadUpdate: [oldThread: ThreadChannel, newThread: ThreadChannel];
    typingStart: [channel: Channel | PartialDMChannel, user: User | PartialUser];
    userUpdate: [oldUser: User | PartialUser, newUser: User];
    voiceStateUpdate: [oldState: VoiceState, newState: VoiceState];
    webhookUpdate: [channel: TextChannel];
    /** @deprecated Use interactionCreate instead */
    interaction: [interaction: Interaction];
    interactionCreate: [interaction: Interaction];
    shardDisconnect: [closeEvent: CloseEvent, shardID: number];
    shardError: [error: Error, shardID: number];
    shardReady: [shardID: number, unavailableGuilds: Set<Snowflake> | undefined];
    shardReconnecting: [shardID: number];
    shardResume: [shardID: number, replayedEvents: number];
    stageInstanceCreate: [stageInstance: StageInstance];
    stageInstanceUpdate: [oldStageInstance: StageInstance | null, newStageInstance: StageInstance];
    stageInstanceDelete: [stageInstance: StageInstance];
  }

  interface ClientOptions {
    shards?: number | number[] | 'auto';
    shardCount?: number;
    makeCache?: CacheFactory;
    messageCacheLifetime?: number;
    messageSweepInterval?: number;
    allowedMentions?: MessageMentionOptions;
    invalidRequestWarningInterval?: number;
    partials?: PartialTypes[];
    restWsBridgeTimeout?: number;
    restTimeOffset?: number;
    restRequestTimeout?: number;
    restGlobalRateLimit?: number;
    restSweepInterval?: number;
    retryLimit?: number;
    presence?: PresenceData;
    intents: BitFieldResolvable<IntentsString, number>;
    ws?: WebSocketOptions;
    http?: HTTPOptions;
    rejectOnRateLimit?: string[] | ((data: RateLimitData) => boolean | Promise<boolean>);
  }

  type ClientPresenceStatus = 'online' | 'idle' | 'dnd';

  interface ClientPresenceStatusData {
    web?: ClientPresenceStatus;
    mobile?: ClientPresenceStatus;
    desktop?: ClientPresenceStatus;
  }

  interface ClientUserEditData {
    username?: string;
    avatar?: BufferResolvable | Base64Resolvable;
  }

  interface CloseEvent {
    wasClean: boolean;
    code: number;
    reason: string;
    target: WebSocket;
  }

  type CollectorFilter<T extends any[]> = (...args: T) => boolean | Promise<boolean>;

  interface CollectorOptions<T extends any[]> {
    filter?: CollectorFilter<T>;
    time?: number;
    idle?: number;
    dispose?: boolean;
  }

  interface CollectorResetTimerOptions {
    time?: number;
    idle?: number;
  }

  type ColorResolvable =
    | 'DEFAULT'
    | 'WHITE'
    | 'AQUA'
    | 'GREEN'
    | 'BLUE'
    | 'YELLOW'
    | 'PURPLE'
    | 'LUMINOUS_VIVID_PINK'
    | 'FUCHSIA'
    | 'GOLD'
    | 'ORANGE'
    | 'RED'
    | 'GREY'
    | 'DARKER_GREY'
    | 'NAVY'
    | 'DARK_AQUA'
    | 'DARK_GREEN'
    | 'DARK_BLUE'
    | 'DARK_PURPLE'
    | 'DARK_VIVID_PINK'
    | 'DARK_GOLD'
    | 'DARK_ORANGE'
    | 'DARK_RED'
    | 'DARK_GREY'
    | 'LIGHT_GREY'
    | 'DARK_NAVY'
    | 'BLURPLE'
    | 'GREYPLE'
    | 'DARK_BUT_NOT_BLACK'
    | 'NOT_QUITE_BLACK'
    | 'RANDOM'
    | [number, number, number]
    | number
    | HexColorString;

  interface CommandInteractionOption {
    name: string;
    type: ApplicationCommandOptionType;
    value?: string | number | boolean;
    options?: Collection<string, CommandInteractionOption>;
    user?: User;
    member?: GuildMember | APIInteractionDataResolvedGuildMember;
    channel?: GuildChannel | APIInteractionDataResolvedChannel;
    role?: Role | APIRole;
  }

  interface CreateRoleOptions extends RoleData {
    reason?: string;
  }

  interface StageInstanceCreateOptions {
    topic: string;
    privacyLevel?: PrivacyLevel | number;
  }

  interface CrosspostedChannel {
    channelID: Snowflake;
    guildID: Snowflake;
    type: keyof typeof ChannelType;
    name: string;
  }

  type DateResolvable = Date | number | string;

  interface DeconstructedSnowflake {
    timestamp: number;
    readonly date: Date;
    workerID: number;
    processID: number;
    increment: number;
    binary: string;
  }

  type DefaultMessageNotificationLevel = keyof typeof DefaultMessageNotificationLevels;

  interface EditGuildTemplateOptions {
    name?: string;
    description?: string;
  }

  interface EmbedField {
    name: string;
    value: string;
    inline: boolean;
  }

  interface EmbedFieldData {
    name: string;
    value: string;
    inline?: boolean;
  }

  type EmojiIdentifierResolvable = string | EmojiResolvable;

  type EmojiResolvable = Snowflake | GuildEmoji | ReactionEmoji;

  interface ErrorEvent {
    error: any;
    message: string;
    type: string;
    target: WebSocket;
  }

  interface EscapeMarkdownOptions {
    codeBlock?: boolean;
    inlineCode?: boolean;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
    spoiler?: boolean;
    inlineCodeContent?: boolean;
    codeBlockContent?: boolean;
  }

  type ExplicitContentFilterLevel = keyof typeof ExplicitContentFilterLevels;

  interface FetchApplicationCommandOptions extends BaseFetchOptions {
    guildID?: Snowflake;
  }

  interface FetchBanOptions extends BaseFetchOptions {
    user: UserResolvable;
  }

  interface FetchBansOptions {
    cache: boolean;
  }

  interface FetchGuildOptions extends BaseFetchOptions {
    guild: GuildResolvable;
  }

  interface FetchGuildsOptions {
    before?: Snowflake;
    after?: Snowflake;
    limit?: number;
  }

  interface FetchArchivedThreadOptions {
    type?: 'public' | 'private';
    fetchAll?: boolean;
    before?: ThreadChannelResolvable | DateResolvable;
    limit?: number;
  }

  interface FetchedThreads {
    threads: Collection<Snowflake, ThreadChannel>;
    hasMore?: boolean;
  }

  interface FetchMemberOptions extends BaseFetchOptions {
    user: UserResolvable;
  }

  interface FetchMembersOptions {
    user?: UserResolvable | UserResolvable[];
    query?: string;
    limit?: number;
    withPresences?: boolean;
    time?: number;
    nonce?: string;
    force?: boolean;
  }

  type FetchOwnerOptions = Omit<FetchMemberOptions, 'user'>;

  interface FetchReactionUsersOptions {
    limit?: number;
    after?: Snowflake;
  }

  interface FetchThreadsOptions {
    archived?: FetchArchivedThreadOptions;
    active?: boolean;
  }

  interface FileOptions {
    attachment: BufferResolvable | Stream;
    name?: string;
  }

  interface GuildApplicationCommandPermissionData {
    id: Snowflake;
    permissions: ApplicationCommandPermissionData[];
  }

  type GuildAuditLogsAction = keyof GuildAuditLogsActions;

  interface GuildAuditLogsActions {
    ALL?: null;
    GUILD_UPDATE?: number;
    CHANNEL_CREATE?: number;
    CHANNEL_UPDATE?: number;
    CHANNEL_DELETE?: number;
    CHANNEL_OVERWRITE_CREATE?: number;
    CHANNEL_OVERWRITE_UPDATE?: number;
    CHANNEL_OVERWRITE_DELETE?: number;
    MEMBER_KICK?: number;
    MEMBER_PRUNE?: number;
    MEMBER_BAN_ADD?: number;
    MEMBER_BAN_REMOVE?: number;
    MEMBER_UPDATE?: number;
    MEMBER_ROLE_UPDATE?: number;
    MEMBER_MOVE?: number;
    MEMBER_DISCONNECT?: number;
    BOT_ADD?: number;
    ROLE_CREATE?: number;
    ROLE_UPDATE?: number;
    ROLE_DELETE?: number;
    INVITE_CREATE?: number;
    INVITE_UPDATE?: number;
    INVITE_DELETE?: number;
    WEBHOOK_CREATE?: number;
    WEBHOOK_UPDATE?: number;
    WEBHOOK_DELETE?: number;
    EMOJI_CREATE?: number;
    EMOJI_UPDATE?: number;
    EMOJI_DELETE?: number;
    MESSAGE_DELETE?: number;
    MESSAGE_BULK_DELETE?: number;
    MESSAGE_PIN?: number;
    MESSAGE_UNPIN?: number;
    INTEGRATION_CREATE?: number;
    INTEGRATION_UPDATE?: number;
    INTEGRATION_DELETE?: number;
    STAGE_INSTANCE_CREATE?: number;
    STAGE_INSTANCE_UPDATE?: number;
    STAGE_INSTANCE_DELETE?: number;
  }

  type GuildAuditLogsActionType = 'CREATE' | 'DELETE' | 'UPDATE' | 'ALL';

  interface GuildAuditLogsFetchOptions {
    before?: Snowflake | GuildAuditLogsEntry;
    limit?: number;
    user?: UserResolvable;
    type?: GuildAuditLogsAction | number;
  }

  type GuildAuditLogsTarget = keyof GuildAuditLogsTargets;

  interface GuildAuditLogsTargets {
    ALL?: string;
    GUILD?: string;
    CHANNEL?: string;
    USER?: string;
    ROLE?: string;
    INVITE?: string;
    WEBHOOK?: string;
    EMOJI?: string;
    MESSAGE?: string;
    INTEGRATION?: string;
    STAGE_INSTANCE?: string;
    UNKNOWN?: string;
  }

  type GuildBanResolvable = GuildBan | UserResolvable;

  interface GuildChannelOverwriteOptions {
    reason?: string;
    type?: number;
  }

  type GuildChannelResolvable = Snowflake | GuildChannel | ThreadChannel;

  interface GuildChannelCreateOptions {
    permissionOverwrites?: OverwriteResolvable[] | Collection<Snowflake, OverwriteResolvable>;
    topic?: string;
    type?: Exclude<
      keyof typeof ChannelType | ChannelType,
      | 'dm'
      | 'group'
      | 'unknown'
      | 'public_thread'
      | 'private_thread'
      | ChannelType.dm
      | ChannelType.group
      | ChannelType.unknown
      | ChannelType.public_thread
      | ChannelType.private_thread
    >;
    nsfw?: boolean;
    parent?: ChannelResolvable;
    bitrate?: number;
    userLimit?: number;
    rateLimitPerUser?: number;
    position?: number;
    reason?: string;
  }

  interface GuildChannelCloneOptions extends GuildChannelCreateOptions {
    name?: string;
  }

  interface GuildChannelOverwriteOptions {
    reason?: string;
    type?: number;
  }

  interface GuildCreateOptions {
    afkChannelID?: Snowflake | number;
    afkTimeout?: number;
    channels?: PartialChannelData[];
    defaultMessageNotifications?: DefaultMessageNotificationLevel | number;
    explicitContentFilter?: ExplicitContentFilterLevel | number;
    icon?: BufferResolvable | Base64Resolvable | null;
    roles?: PartialRoleData[];
    systemChannelFlags?: SystemChannelFlagsResolvable;
    systemChannelID?: Snowflake | number;
    verificationLevel?: VerificationLevel | number;
  }

  interface GuildWidget {
    enabled: boolean;
    channel: GuildChannel | null;
  }

  interface GuildEditData {
    name?: string;
    verificationLevel?: VerificationLevel | number;
    explicitContentFilter?: ExplicitContentFilterLevel | number;
    defaultMessageNotifications?: DefaultMessageNotificationLevel | number;
    afkChannel?: ChannelResolvable;
    systemChannel?: ChannelResolvable;
    systemChannelFlags?: SystemChannelFlagsResolvable;
    afkTimeout?: number;
    icon?: Base64Resolvable;
    owner?: GuildMemberResolvable;
    splash?: Base64Resolvable;
    discoverySplash?: Base64Resolvable;
    banner?: Base64Resolvable;
    rulesChannel?: ChannelResolvable;
    publicUpdatesChannel?: ChannelResolvable;
    preferredLocale?: string;
    description?: string | null;
    features?: GuildFeatures[];
  }

  interface GuildEmojiCreateOptions {
    roles?: Collection<Snowflake, Role> | RoleResolvable[];
    reason?: string;
  }

  interface GuildEmojiEditData {
    name?: string;
    roles?: Collection<Snowflake, Role> | RoleResolvable[];
  }

  type GuildFeatures =
    | 'ANIMATED_ICON'
    | 'BANNER'
    | 'COMMERCE'
    | 'COMMUNITY'
    | 'DISCOVERABLE'
    | 'FEATURABLE'
    | 'INVITE_SPLASH'
    | 'MEMBER_VERIFICATION_GATE_ENABLED'
    | 'MONETIZATION_ENABLED'
    | 'MORE_STICKERS'
    | 'NEWS'
    | 'PARTNERED'
    | 'PREVIEW_ENABLED'
    | 'PRIVATE_THREADS'
    | 'RELAY_ENABLED'
    | 'SEVEN_DAY_THREAD_ARCHIVE'
    | 'THREE_DAY_THREAD_ARCHIVE'
    | 'TICKETED_EVENTS_ENABLED'
    | 'VANITY_URL'
    | 'VERIFIED'
    | 'VIP_REGIONS'
    | 'WELCOME_SCREEN_ENABLED';

  interface GuildMemberEditData {
    nick?: string | null;
    roles?: Collection<Snowflake, Role> | readonly RoleResolvable[];
    mute?: boolean;
    deaf?: boolean;
    channel?: ChannelResolvable | null;
  }

  type GuildMemberResolvable = GuildMember | UserResolvable;

  type GuildResolvable = Guild | GuildChannel | GuildMember | GuildEmoji | Invite | Role | Snowflake;

  interface GuildPruneMembersOptions {
    count?: boolean;
    days?: number;
    dry?: boolean;
    reason?: string;
    roles?: RoleResolvable[];
  }

  interface GuildWidgetData {
    enabled: boolean;
    channel: GuildChannelResolvable | null;
  }

  interface GuildSearchMembersOptions {
    query: string;
    limit?: number;
    cache?: boolean;
  }

  type GuildTemplateResolvable = string;

  type HexColorString = `#${string}`;

  interface HTTPAttachmentData {
    attachment: string | Buffer | Stream;
    name: string;
    file: Buffer | Stream;
  }

  interface HTTPErrorData {
    json: unknown;
    files: HTTPAttachmentData[];
  }

  interface HTTPOptions {
    api?: string;
    version?: number;
    host?: string;
    cdn?: string;
    invite?: string;
    template?: string;
    headers?: Record<string, string>;
  }

  type ImageSize = 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096;

  interface ImageURLOptions extends StaticImageURLOptions {
    dynamic?: boolean;
  }

  interface IntegrationData {
    id: Snowflake;
    type: string;
  }

  interface IntegrationEditData {
    expireBehavior?: number;
    expireGracePeriod?: number;
  }

  interface IntegrationAccount {
    id: string | Snowflake;
    name: string;
  }

  interface InteractionCollectorOptions<T extends Interaction> extends CollectorOptions<[T]> {
    channel?: TextChannel | DMChannel | NewsChannel | ThreadChannel;
    componentType?: MessageComponentType | MessageComponentTypes;
    guild?: Guild;
    interactionType?: InteractionType | InteractionTypes;
    max?: number;
    maxComponents?: number;
    maxUsers?: number;
    message?: Message;
  }

  interface InteractionDeferOptions {
    ephemeral?: boolean;
    fetchReply?: boolean;
  }

  interface InteractionDeferUpdateOptions extends Omit<InteractionDeferOptions, 'ephemeral'> {}

  interface InteractionReplyOptions extends Omit<WebhookMessageOptions, 'username' | 'avatarURL'> {
    ephemeral?: boolean;
    fetchReply?: boolean;
  }

  type InteractionResponseType = keyof typeof InteractionResponseTypes;

  type InteractionType = keyof typeof InteractionTypes;

  interface InteractionUpdateOptions extends Omit<InteractionReplyOptions, 'ephemeral'> {}

  type IntentsString =
    | 'GUILDS'
    | 'GUILD_MEMBERS'
    | 'GUILD_BANS'
    | 'GUILD_EMOJIS'
    | 'GUILD_INTEGRATIONS'
    | 'GUILD_WEBHOOKS'
    | 'GUILD_INVITES'
    | 'GUILD_VOICE_STATES'
    | 'GUILD_PRESENCES'
    | 'GUILD_MESSAGES'
    | 'GUILD_MESSAGE_REACTIONS'
    | 'GUILD_MESSAGE_TYPING'
    | 'DIRECT_MESSAGES'
    | 'DIRECT_MESSAGE_REACTIONS'
    | 'DIRECT_MESSAGE_TYPING';

  interface InviteGenerationOptions {
    permissions?: PermissionResolvable;
    guild?: GuildResolvable;
    disableGuildSelect?: boolean;
    additionalScopes?: InviteScope[];
  }

  interface CreateInviteOptions {
    temporary?: boolean;
    maxAge?: number;
    maxUses?: number;
    unique?: boolean;
    reason?: string;
    targetApplication?: ApplicationResolvable;
    targetUser?: UserResolvable;
    targetType?: InviteTargetType;
  }

  type InviteResolvable = string;

  type InviteScope =
    | 'applications.builds.read'
    | 'applications.commands'
    | 'applications.entitlements'
    | 'applications.store.update'
    | 'connections'
    | 'email'
    | 'identity'
    | 'guilds'
    | 'guilds.join'
    | 'gdm.join'
    | 'webhook.incoming';

  interface MakeErrorOptions {
    name: string;
    message: string;
    stack: string;
  }

  type MemberMention = UserMention | `<@!${Snowflake}>`;

  type MembershipState = keyof typeof MembershipStates;

  type MessageActionRowComponent = MessageButton | MessageSelectMenu;

  type MessageActionRowComponentOptions = MessageButtonOptions | MessageSelectMenuOptions;

  type MessageActionRowComponentResolvable = MessageActionRowComponent | MessageActionRowComponentOptions;

  interface MessageActionRowOptions extends BaseMessageComponentOptions {
    components: MessageActionRowComponentResolvable[];
  }

  interface MessageActivity {
    partyID: string;
    type: number;
  }

  type MessageAdditions = MessageEmbed | MessageAttachment | (MessageEmbed | MessageAttachment)[];

  interface MessageButtonOptions extends BaseMessageComponentOptions {
    customID?: string;
    disabled?: boolean;
    emoji?: EmojiIdentifierResolvable;
    label?: string;
    style: MessageButtonStyleResolvable;
    url?: string;
  }

  type MessageButtonStyle = keyof typeof MessageButtonStyles;

  type MessageButtonStyleResolvable = MessageButtonStyle | MessageButtonStyles;

  interface MessageCollectorOptions extends CollectorOptions<[Message]> {
    max?: number;
    maxProcessed?: number;
  }

  type MessageComponent = BaseMessageComponent | MessageActionRow | MessageButton | MessageSelectMenu;

  interface MessageComponentCollectorOptions<T extends MessageComponentInteraction>
    extends Omit<InteractionCollectorOptions<T>, 'channel' | 'message' | 'guild' | 'interactionType'> {}

  type MessageComponentOptions =
    | BaseMessageComponentOptions
    | MessageActionRowOptions
    | MessageButtonOptions
    | MessageSelectMenuOptions;

  type MessageComponentType = keyof typeof MessageComponentTypes;

  type MessageComponentTypeResolvable = MessageComponentType | MessageComponentTypes;

  interface MessageEditOptions {
    attachments?: MessageAttachment[];
    content?: string | null;
    embeds?: (MessageEmbed | MessageEmbedOptions)[] | null;
    files?: (FileOptions | BufferResolvable | Stream | MessageAttachment)[];
    flags?: BitFieldResolvable<MessageFlagsString, number>;
    allowedMentions?: MessageMentionOptions;
    components?: (MessageActionRow | MessageActionRowOptions | MessageActionRowComponentResolvable[])[];
  }

  interface MessageEmbedAuthor {
    name?: string;
    url?: string;
    iconURL?: string;
    proxyIconURL?: string;
  }

  interface MessageEmbedFooter {
    text?: string;
    iconURL?: string;
    proxyIconURL?: string;
  }

  interface MessageEmbedImage {
    url: string;
    proxyURL?: string;
    height?: number;
    width?: number;
  }

  interface MessageEmbedOptions {
    title?: string;
    description?: string;
    url?: string;
    timestamp?: Date | number;
    color?: ColorResolvable;
    fields?: EmbedFieldData[];
    author?: Partial<MessageEmbedAuthor> & { icon_url?: string; proxy_icon_url?: string };
    thumbnail?: Partial<MessageEmbedThumbnail> & { proxy_url?: string };
    image?: Partial<MessageEmbedImage> & { proxy_url?: string };
    video?: Partial<MessageEmbedVideo> & { proxy_url?: string };
    footer?: Partial<MessageEmbedFooter> & { icon_url?: string; proxy_icon_url?: string };
  }

  interface MessageEmbedProvider {
    name: string;
    url: string;
  }

  interface MessageEmbedThumbnail {
    url: string;
    proxyURL?: string;
    height?: number;
    width?: number;
  }

  interface MessageEmbedVideo {
    url?: string;
    proxyURL?: string;
    height?: number;
    width?: number;
  }

  interface MessageEvent {
    data: WebSocket.Data;
    type: string;
    target: WebSocket;
  }

  type MessageFlagsString =
    | 'CROSSPOSTED'
    | 'IS_CROSSPOST'
    | 'SUPPRESS_EMBEDS'
    | 'SOURCE_MESSAGE_DELETED'
    | 'URGENT'
    | 'HAS_THREAD'
    | 'EPHEMERAL'
    | 'LOADING';

  interface MessageInteraction {
    id: Snowflake;
    type: InteractionType;
    commandName: string;
    user: User;
  }

  interface MessageMentionsHasOptions {
    ignoreDirect?: boolean;
    ignoreRoles?: boolean;
    ignoreEveryone?: boolean;
  }

  interface MessageMentionOptions {
    parse?: MessageMentionTypes[];
    roles?: Snowflake[];
    users?: Snowflake[];
    repliedUser?: boolean;
  }

  type MessageMentionTypes = 'roles' | 'users' | 'everyone';

  interface MessageOptions {
    tts?: boolean;
    nonce?: string | number;
    content?: string | null;
    embeds?: (MessageEmbed | MessageEmbedOptions)[];
    components?: (MessageActionRow | MessageActionRowOptions | MessageActionRowComponentResolvable[])[];
    allowedMentions?: MessageMentionOptions;
    files?: (FileOptions | BufferResolvable | Stream | MessageAttachment)[];
    reply?: ReplyOptions;
  }

  type MessageReactionResolvable =
    | MessageReaction
    | Snowflake
    | `${string}:${Snowflake}`
    | `<:${string}:${Snowflake}>`
    | `<a:${string}:${Snowflake}>`
    | string;

  interface MessageReference {
    channelID: Snowflake;
    guildID: Snowflake;
    messageID: Snowflake | null;
  }

  type MessageResolvable = Message | Snowflake;

  interface MessageSelectMenuOptions extends BaseMessageComponentOptions {
    customID?: string;
    disabled?: boolean;
    maxValues?: number;
    minValues?: number;
    options?: MessageSelectOptionData[];
    placeholder?: string;
  }

  interface MessageSelectOption {
    default: boolean;
    description: string | null;
    emoji: APIPartialEmoji | null;
    label: string;
    value: string;
  }

  interface MessageSelectOptionData {
    default?: boolean;
    description?: string;
    emoji?: EmojiIdentifierResolvable;
    label: string;
    value: string;
  }

  type MessageTarget =
    | Interaction
    | InteractionWebhook
    | TextChannel
    | NewsChannel
    | ThreadChannel
    | DMChannel
    | User
    | GuildMember
    | Webhook
    | WebhookClient
    | Message
    | MessageManager;

  type MessageType =
    | 'DEFAULT'
    | 'RECIPIENT_ADD'
    | 'RECIPIENT_REMOVE'
    | 'CALL'
    | 'CHANNEL_NAME_CHANGE'
    | 'CHANNEL_ICON_CHANGE'
    | 'PINS_ADD'
    | 'GUILD_MEMBER_JOIN'
    | 'USER_PREMIUM_GUILD_SUBSCRIPTION'
    | 'USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_1'
    | 'USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_2'
    | 'USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_3'
    | 'CHANNEL_FOLLOW_ADD'
    | 'GUILD_DISCOVERY_DISQUALIFIED'
    | 'GUILD_DISCOVERY_REQUALIFIED'
    | 'GUILD_DISCOVERY_GRACE_PERIOD_INITIAL_WARNING'
    | 'GUILD_DISCOVERY_GRACE_PERIOD_FINAL_WARNING'
    | 'THREAD_CREATED'
    | 'REPLY'
    | 'APPLICATION_COMMAND'
    | 'THREAD_STARTER_MESSAGE'
    | 'GUILD_INVITE_REMINDER';

  type MFALevel = keyof typeof MFALevels;

  interface MultipleShardRespawnOptions {
    shardDelay?: number;
    respawnDelay?: number;
    timeout?: number;
  }

  interface MultipleShardSpawnOptions {
    amount?: number | 'auto';
    delay?: number;
    timeout?: number;
  }

  type NSFWLevel = keyof typeof NSFWLevels;

  interface OverwriteData {
    allow?: PermissionResolvable;
    deny?: PermissionResolvable;
    id: GuildMemberResolvable | RoleResolvable;
    type?: OverwriteType;
  }

  type OverwriteResolvable = PermissionOverwrites | OverwriteData;

  type OverwriteType = 'member' | 'role';

  interface PermissionFlags extends Record<PermissionString, bigint> {}

  interface PermissionObject extends Record<PermissionString, boolean> {}

  interface PermissionOverwriteOptions extends Partial<Record<PermissionString, boolean | null>> {}

  type PermissionResolvable = BitFieldResolvable<PermissionString, bigint>;

  type PermissionOverwriteResolvable = UserResolvable | RoleResolvable | PermissionOverwrites;

  type PermissionString =
    | 'CREATE_INSTANT_INVITE'
    | 'KICK_MEMBERS'
    | 'BAN_MEMBERS'
    | 'ADMINISTRATOR'
    | 'MANAGE_CHANNELS'
    | 'MANAGE_GUILD'
    | 'ADD_REACTIONS'
    | 'VIEW_AUDIT_LOG'
    | 'PRIORITY_SPEAKER'
    | 'STREAM'
    | 'VIEW_CHANNEL'
    | 'SEND_MESSAGES'
    | 'SEND_TTS_MESSAGES'
    | 'MANAGE_MESSAGES'
    | 'EMBED_LINKS'
    | 'ATTACH_FILES'
    | 'READ_MESSAGE_HISTORY'
    | 'MENTION_EVERYONE'
    | 'USE_EXTERNAL_EMOJIS'
    | 'VIEW_GUILD_INSIGHTS'
    | 'CONNECT'
    | 'SPEAK'
    | 'MUTE_MEMBERS'
    | 'DEAFEN_MEMBERS'
    | 'MOVE_MEMBERS'
    | 'USE_VAD'
    | 'CHANGE_NICKNAME'
    | 'MANAGE_NICKNAMES'
    | 'MANAGE_ROLES'
    | 'MANAGE_WEBHOOKS'
    | 'MANAGE_EMOJIS'
    | 'USE_APPLICATION_COMMANDS'
    | 'REQUEST_TO_SPEAK'
    | 'MANAGE_THREADS'
    | 'USE_PUBLIC_THREADS'
    | 'USE_PRIVATE_THREADS';

  interface RecursiveArray<T> extends ReadonlyArray<T | RecursiveArray<T>> {}

  type RecursiveReadonlyArray<T> = ReadonlyArray<T | RecursiveReadonlyArray<T>>;

  type PremiumTier = keyof typeof PremiumTiers;

  interface PresenceData {
    status?: PresenceStatusData;
    afk?: boolean;
    activities?: ActivitiesOptions[];
    shardID?: number | number[];
  }

  type PresenceResolvable = Presence | UserResolvable | Snowflake;

  type Partialize<T, O extends string> = {
    readonly client: Client;
    readonly createdAt: Date;
    readonly createdTimestamp: number;
    deleted: boolean;
    id: Snowflake;
    partial: true;
    fetch(): Promise<T>;
  } & {
    [K in keyof Omit<
      T,
      'client' | 'createdAt' | 'createdTimestamp' | 'id' | 'partial' | 'fetch' | 'deleted' | O
    >]: T[K] extends (...args: any) => void ? T[K] : T[K] | null;
  };

  interface PartialDMChannel
    extends Partialize<
      DMChannel,
      'lastMessage' | 'lastMessageID' | 'messages' | 'recipient' | 'type' | 'typing' | 'typingCount'
    > {
    lastMessage: null;
    lastMessageID: undefined;
    messages: MessageManager;
    recipient: User | PartialUser;
    type: 'dm';
    readonly typing: boolean;
    readonly typingCount: number;
  }

  interface PartialChannelData {
    id?: Snowflake | number;
    name: string;
    topic?: string;
    type?: ChannelType;
    parentID?: Snowflake | number;
    permissionOverwrites?: PartialOverwriteData[];
  }

  interface PartialGuildMember
    extends Partialize<
      GuildMember,
      | 'bannable'
      | 'displayColor'
      | 'displayHexColor'
      | 'displayName'
      | 'guild'
      | 'kickable'
      | 'permissions'
      | 'roles'
      | 'manageable'
      | 'presence'
      | 'voice'
    > {
    readonly bannable: boolean;
    readonly displayColor: number;
    readonly displayHexColor: HexColorString;
    readonly displayName: string;
    guild: Guild;
    readonly manageable: boolean;
    joinedAt: null;
    joinedTimestamp: null;
    readonly kickable: boolean;
    readonly permissions: GuildMember['permissions'];
    readonly presence: GuildMember['presence'];
    readonly roles: GuildMember['roles'];
    readonly voice: GuildMember['voice'];
  }

  interface PartialMessage
    extends Partialize<
      Message,
      | 'attachments'
      | 'channel'
      | 'deletable'
      | 'crosspostable'
      | 'editable'
      | 'mentions'
      | 'pinnable'
      | 'url'
      | 'flags'
      | 'embeds'
    > {
    attachments: Message['attachments'];
    channel: Message['channel'];
    readonly deletable: boolean;
    readonly crosspostable: boolean;
    readonly editable: boolean;
    embeds: Message['embeds'];
    flags: Message['flags'];
    mentions: Message['mentions'];
    readonly pinnable: boolean;
    reactions: Message['reactions'];
    readonly url: string;
  }

  interface PartialOverwriteData {
    id: Snowflake | number;
    type?: OverwriteType;
    allow?: PermissionResolvable;
    deny?: PermissionResolvable;
  }

  interface PartialRoleData extends RoleData {
    id?: Snowflake | number;
  }

  type PartialTypes = 'USER' | 'CHANNEL' | 'GUILD_MEMBER' | 'MESSAGE' | 'REACTION';

  interface PartialUser extends Omit<Partialize<User, 'bot' | 'flags' | 'system' | 'tag' | 'username'>, 'deleted'> {
    bot: null;
    flags: User['flags'];
    system: null;
    readonly tag: null;
    username: null;
  }

  type PresenceStatusData = ClientPresenceStatus | 'invisible';

  type PresenceStatus = PresenceStatusData | 'offline';

  type PrivacyLevel = keyof typeof PrivacyLevels;

  interface RateLimitData {
    timeout: number;
    limit: number;
    method: string;
    path: string;
    route: string;
    global: boolean;
  }

  interface InvalidRequestWarningData {
    count: number;
    remainingTime: number;
  }

  interface ReactionCollectorOptions extends CollectorOptions<[MessageReaction, User]> {
    max?: number;
    maxEmojis?: number;
    maxUsers?: number;
  }

  interface ReplyOptions {
    messageReference: MessageResolvable;
    failIfNotExists?: boolean;
  }

  interface ReplyMessageOptions extends Omit<MessageOptions, 'reply'> {
    failIfNotExists?: boolean;
  }

  interface ResolvedOverwriteOptions {
    allow: Permissions;
    deny: Permissions;
  }

  interface RoleData {
    name?: string;
    color?: ColorResolvable;
    hoist?: boolean;
    position?: number;
    permissions?: PermissionResolvable;
    mentionable?: boolean;
  }

  type RoleMention = '@everyone' | `<@&${Snowflake}>`;

  interface RolePosition {
    role: RoleResolvable;
    position: number;
  }

  type RoleResolvable = Role | Snowflake;

  interface RoleTagData {
    botID?: Snowflake;
    integrationID?: Snowflake;
    premiumSubscriberRole?: true;
  }

  interface SetChannelPositionOptions {
    relative?: boolean;
    reason?: string;
  }

  interface SetParentOptions {
    lockPermissions?: boolean;
    reason?: string;
  }

  interface SetRolePositionOptions {
    relative?: boolean;
    reason?: string;
  }

  type ShardingManagerMode = 'process' | 'worker';

  interface ShardingManagerOptions {
    totalShards?: number | 'auto';
    shardList?: number[] | 'auto';
    mode?: ShardingManagerMode;
    respawn?: boolean;
    shardArgs?: string[];
    token?: string;
    execArgv?: string[];
  }

  type Snowflake = APISnowflake;

  interface SplitOptions {
    maxLength?: number;
    char?: string | string[] | RegExp | RegExp[];
    prepend?: string;
    append?: string;
  }

  interface StaticImageURLOptions {
    format?: AllowedImageFormat;
    size?: ImageSize;
  }

  type StageInstanceResolvable = StageInstance | Snowflake;

  type Status = number;

  export class Sticker extends Base {
    constructor(client: Client, data: unknown);
    public asset: string;
    public readonly createdTimestamp: number;
    public readonly createdAt: Date;
    public description: string;
    public format: StickerFormatType;
    public id: Snowflake;
    public name: string;
    public packID: Snowflake;
    public tags: string[];
    public readonly url: string;
  }

  type StickerFormatType = keyof typeof StickerFormatTypes;

  type SystemChannelFlagsString =
    | 'SUPPRESS_JOIN_NOTIFICATIONS'
    | 'SUPPRESS_PREMIUM_SUBSCRIPTIONS'
    | 'SUPPRESS_GUILD_REMINDER_NOTIFICATIONS';

  type SystemChannelFlagsResolvable = BitFieldResolvable<SystemChannelFlagsString, number>;

  type SystemMessageType = Exclude<MessageType, 'DEFAULT' | 'REPLY' | 'APPLICATION_COMMAND'>;

  interface TypingData {
    user: User | PartialUser;
    since: Date;
    lastTimestamp: Date;
    elapsedTime: number;
    timeout: NodeJS.Timeout;
  }

  interface StageInstanceEditOptions {
    topic?: string;
    privacyLevel?: PrivacyLevel | number;
  }

  type ThreadAutoArchiveDuration = 60 | 1440 | 4320 | 10080;

  type ThreadChannelResolvable = ThreadChannel | Snowflake;

  type ThreadChannelType = 'news_thread' | 'public_thread' | 'private_thread';

  interface ThreadCreateOptions<AllowedThreadType> {
    name: string;
    autoArchiveDuration: ThreadAutoArchiveDuration;
    startMessage?: MessageResolvable;
    type?: AllowedThreadType;
    reason?: string;
  }

  interface ThreadEditData {
    name?: string;
    archived?: boolean;
    autoArchiveDuration?: ThreadAutoArchiveDuration;
    rateLimitPerUser?: number;
    locked?: boolean;
  }

  type ThreadMemberFlagsString = '';

  type ThreadMemberResolvable = ThreadMember | UserResolvable;

  type UserFlagsString =
    | 'DISCORD_EMPLOYEE'
    | 'PARTNERED_SERVER_OWNER'
    | 'HYPESQUAD_EVENTS'
    | 'BUGHUNTER_LEVEL_1'
    | 'HOUSE_BRAVERY'
    | 'HOUSE_BRILLIANCE'
    | 'HOUSE_BALANCE'
    | 'EARLY_SUPPORTER'
    | 'TEAM_USER'
    | 'BUGHUNTER_LEVEL_2'
    | 'VERIFIED_BOT'
    | 'EARLY_VERIFIED_BOT_DEVELOPER'
    | 'DISCORD_CERTIFIED_MODERATOR';

  type UserMention = `<@${Snowflake}>`;

  type UserResolvable = User | Snowflake | Message | GuildMember | ThreadMember;

  interface Vanity {
    code: string | null;
    uses: number | null;
  }

  type VerificationLevel = keyof typeof VerificationLevels;

  type WebhookClientOptions = Pick<
    ClientOptions,
    'allowedMentions' | 'restTimeOffset' | 'restRequestTimeout' | 'retryLimit' | 'http'
  >;

  interface WebhookEditData {
    name?: string;
    avatar?: BufferResolvable;
    channel?: ChannelResolvable;
  }

  type WebhookEditMessageOptions = Pick<
    WebhookMessageOptions,
    'content' | 'embeds' | 'files' | 'allowedMentions' | 'components'
  >;

  interface WebhookMessageOptions extends Omit<MessageOptions, 'reply'> {
    username?: string;
    avatarURL?: string;
    threadID?: Snowflake;
  }

  type WebhookType = keyof typeof WebhookTypes;

  interface WebSocketOptions {
    large_threshold?: number;
    compress?: boolean;
    properties?: WebSocketProperties;
  }

  interface WebSocketProperties {
    $os?: string;
    $browser?: string;
    $device?: string;
  }

  interface WidgetActivity {
    name: string;
  }

  interface WidgetChannel {
    id: Snowflake;
    name: string;
    position: number;
  }

  interface WelcomeChannelData {
    description: string;
    channel: GuildChannelResolvable;
    emoji?: EmojiIdentifierResolvable;
  }

  interface WelcomeScreenEditData {
    enabled?: boolean;
    description?: string;
    welcomeChannels?: WelcomeChannelData[];
  }

  type WSEventType =
    | 'READY'
    | 'RESUMED'
    | 'APPLICATION_COMMAND_CREATE'
    | 'APPLICATION_COMMAND_DELETE'
    | 'APPLICATION_COMMAND_UPDATE'
    | 'GUILD_CREATE'
    | 'GUILD_DELETE'
    | 'GUILD_UPDATE'
    | 'INVITE_CREATE'
    | 'INVITE_DELETE'
    | 'GUILD_MEMBER_ADD'
    | 'GUILD_MEMBER_REMOVE'
    | 'GUILD_MEMBER_UPDATE'
    | 'GUILD_MEMBERS_CHUNK'
    | 'GUILD_ROLE_CREATE'
    | 'GUILD_ROLE_DELETE'
    | 'GUILD_ROLE_UPDATE'
    | 'GUILD_BAN_ADD'
    | 'GUILD_BAN_REMOVE'
    | 'GUILD_EMOJIS_UPDATE'
    | 'GUILD_INTEGRATIONS_UPDATE'
    | 'CHANNEL_CREATE'
    | 'CHANNEL_DELETE'
    | 'CHANNEL_UPDATE'
    | 'CHANNEL_PINS_UPDATE'
    | 'MESSAGE_CREATE'
    | 'MESSAGE_DELETE'
    | 'MESSAGE_UPDATE'
    | 'MESSAGE_DELETE_BULK'
    | 'MESSAGE_REACTION_ADD'
    | 'MESSAGE_REACTION_REMOVE'
    | 'MESSAGE_REACTION_REMOVE_ALL'
    | 'MESSAGE_REACTION_REMOVE_EMOJI'
    | 'USER_UPDATE'
    | 'PRESENCE_UPDATE'
    | 'TYPING_START'
    | 'VOICE_STATE_UPDATE'
    | 'VOICE_SERVER_UPDATE'
    | 'WEBHOOKS_UPDATE'
    | 'INTERACTION_CREATE'
    | 'STAGE_INSTANCE_CREATE'
    | 'STAGE_INSTANCE_UPDATE'
    | 'STAGE_INSTANCE_DELETE';

  type Serialized<T> = T extends symbol | bigint | (() => unknown)
    ? never
    : T extends number | string | boolean | undefined
    ? T
    : T extends { toJSON(): infer R }
    ? R
    : T extends ReadonlyArray<infer V>
    ? Serialized<V>[]
    : T extends ReadonlyMap<unknown, unknown> | ReadonlySet<unknown>
    ? {}
    : { [K in keyof T]: Serialized<T[K]> };

  //#endregion
}
