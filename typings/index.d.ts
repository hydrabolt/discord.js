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
  GatewayVoiceServerUpdateDispatchData,
  GatewayVoiceStateUpdateDispatchData,
  Snowflake,
} from 'discord-api-types/v8';
import { EventEmitter } from 'events';
import { Stream } from 'stream';
import * as WebSocket from 'ws';
import {
  ActivityTypes,
  ApplicationCommandOptionTypes,
  ApplicationCommandPermissionTypes,
  ChannelTypes,
  ConstantsClientApplicationAssetTypes,
  ConstantsColors,
  DefaultMessageNotificationLevels,
  ConstantsEvents,
  ExplicitContentFilterLevels,
  InteractionResponseTypes,
  InteractionTypes,
  InviteTargetType,
  MembershipStates,
  MessageButtonStyles,
  MessageComponentTypes,
  MFALevels,
  NSFWLevels,
  ConstantsOpcodes,
  OverwriteTypes,
  PremiumTiers,
  PrivacyLevels,
  ConstantsStatus,
  StickerFormatTypes,
  VerificationLevels,
  WebhookTypes,
  ConstantsShardEvents,
} from './enums';

//#region Classes

export class Activity {
  public constructor(presence: Presence, data?: unknown);
  public applicationId: Snowflake | null;
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
  public sessionId: string | null;
  public state: string | null;
  public syncId: string | null;
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
  public constructor(client: Client, data: unknown, immediatePatch?: boolean);
  public banner: string | null;
  public description: string | null;
  public nsfwLevel: NSFWLevel;
  public splash: string | null;
  public vanityURLCode: string | null;
  public verificationLevel: VerificationLevel;
  public bannerURL(options?: StaticImageURLOptions): string | null;
  public splashURL(options?: StaticImageURLOptions): string | null;
}

export abstract class Application extends Base {
  public constructor(client: Client, data: unknown);
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
  public constructor(client: Client, data: unknown, guild?: Guild, guildId?: Snowflake);
  public readonly createdAt: Date;
  public readonly createdTimestamp: number;
  public defaultPermission: boolean;
  public description: string;
  public guild: Guild | null;
  public guildId: Snowflake | null;
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

export type ApplicationResolvable = Application | Activity | Snowflake;

export class ApplicationFlags extends BitField<ApplicationFlagsString> {
  public static FLAGS: Record<ApplicationFlagsString, number>;
  public static resolve(bit?: BitFieldResolvable<ApplicationFlagsString, number>): number;
}

export class Base {
  public constructor(client: Client);
  public readonly client: Client;
  public toJSON(...props: Record<string, boolean | string>[]): unknown;
  public valueOf(): string;
}

export class BaseClient extends EventEmitter {
  public constructor(options?: ClientOptions | WebhookClientOptions);
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
  public setInterval<T extends any[]>(fn: (...args: T) => Awaited<void>, delay: number, ...args: T): NodeJS.Timeout;
  public setTimeout<T extends any[]>(fn: (...args: T) => Awaited<void>, delay: number, ...args: T): NodeJS.Timeout;
  public setImmediate<T extends any[]>(fn: (...args: T) => Awaited<void>, ...args: T): NodeJS.Immediate;
  public toJSON(...props: Record<string, boolean | string>[]): unknown;
}

export abstract class BaseGuild extends Base {
  public constructor(client: Client, data: unknown);
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
  public constructor(client: Client, data: unknown, guild: Guild | GuildPreview);
  public available: boolean | null;
  public readonly createdAt: Date;
  public readonly createdTimestamp: number;
  public guild: Guild | GuildPreview;
  public id: Snowflake;
  public managed: boolean | null;
  public requiresColons: boolean | null;
}

export class BaseGuildVoiceChannel extends GuildChannel {
  public constructor(guild: Guild, data?: unknown);
  public readonly members: Collection<Snowflake, GuildMember>;
  public readonly full: boolean;
  public readonly joinable: boolean;
  public rtcRegion: string | null;
  public bitrate: number;
  public userLimit: number;
  public setRTCRegion(region: string | null): Promise<this>;
}

export class BaseMessageComponent {
  public constructor(data?: BaseMessageComponent | BaseMessageComponentOptions);
  public type: MessageComponentType | null;
  private static create(
    data: MessageComponentOptions,
    client?: Client | WebhookClient,
    skipValidation?: boolean,
  ): MessageComponent | undefined;
  private static resolveType(type: MessageComponentTypeResolvable): MessageComponentType;
}

export class BitField<S extends string, N extends number | bigint = number> {
  public constructor(bits?: BitFieldResolvable<S, N>);
  public bitfield: N;
  public add(...bits: BitFieldResolvable<S, N>[]): BitField<S, N>;
  public any(bit: BitFieldResolvable<S, N>): boolean;
  public equals(bit: BitFieldResolvable<S, N>): boolean;
  public freeze(): Readonly<BitField<S, N>>;
  public has(bit: BitFieldResolvable<S, N>): boolean;
  public missing(bits: BitFieldResolvable<S, N>, ...hasParams: readonly unknown[]): S[];
  public remove(...bits: BitFieldResolvable<S, N>[]): BitField<S, N>;
  public serialize(...hasParams: readonly unknown[]): Record<S, boolean>;
  public toArray(...hasParams: readonly unknown[]): S[];
  public toJSON(): N extends number ? number : string;
  public valueOf(): N;
  public [Symbol.iterator](): IterableIterator<S>;
  public static FLAGS: unknown;
  public static resolve(bit?: BitFieldResolvable<string, number | bigint>): number | bigint;
}

export class ButtonInteraction extends MessageComponentInteraction {
  public componentType: 'BUTTON';
}

export class CategoryChannel extends GuildChannel {
  public readonly children: Collection<Snowflake, GuildChannel>;
  public type: 'GUILD_CATEGORY';
}

export type CategoryChannelResolvable = Snowflake | CategoryChannel;

export class Channel extends Base {
  public constructor(client: Client, data?: unknown, immediatePatch?: boolean);
  public readonly createdAt: Date;
  public readonly createdTimestamp: number;
  public deleted: boolean;
  public id: Snowflake;
  public readonly partial: false;
  public type: keyof typeof ChannelTypes;
  public delete(): Promise<Channel>;
  public fetch(force?: boolean): Promise<Channel>;
  public isText(): this is TextChannel | DMChannel | NewsChannel | ThreadChannel;
  public isThread(): this is ThreadChannel;
  public toString(): ChannelMention;
}

export class Client extends BaseClient {
  public constructor(options: ClientOptions);
  private actions: unknown;
  private _eval(script: string): unknown;
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
  public fetchWidget(guild: GuildResolvable): Promise<Widget>;
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
  public emit<S extends string | symbol>(event: Exclude<S, keyof ClientEvents>, ...args: unknown[]): boolean;

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
  public setAFK(afk: boolean, shardId?: number | number[]): Presence;
  public setAvatar(avatar: BufferResolvable | Base64Resolvable): Promise<this>;
  public setPresence(data: PresenceData): Presence;
  public setStatus(status: PresenceStatusData, shardId?: number | number[]): Presence;
  public setUsername(username: string): Promise<this>;
}

export class Options extends null {
  private constructor();
  public static createDefaultOptions(): ClientOptions;
  public static cacheWithLimits(limits?: Record<string, number>): CacheFactory;
  public static cacheEverything(): CacheFactory;
}

export class ClientVoiceManager {
  public constructor(client: Client);
  public readonly client: Client;
  public adapters: Map<Snowflake, InternalDiscordGatewayAdapterLibraryMethods>;
}

export class Collection<K, V> extends BaseCollection<K, V> {
  public toJSON(): unknown;
}

export abstract class Collector<K, V, F extends unknown[] = []> extends EventEmitter {
  public constructor(client: Client, options?: CollectorOptions<[V, ...F]>);
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
  public handleCollect(...args: unknown[]): Promise<void>;
  public handleDispose(...args: unknown[]): Promise<void>;
  public stop(reason?: string): void;
  public resetTimer(options?: CollectorResetTimerOptions): void;
  public [Symbol.asyncIterator](): AsyncIterableIterator<V>;
  public toJSON(): unknown;

  protected listener: (...args: any[]) => void;
  public abstract collect(...args: unknown[]): K | null | Promise<K | null>;
  public abstract dispose(...args: unknown[]): K | null;

  public on(event: 'collect' | 'dispose', listener: (...args: [V, ...F]) => Awaited<void>): this;
  public on(event: 'end', listener: (collected: Collection<K, V>, reason: string) => Awaited<void>): this;

  public once(event: 'collect' | 'dispose', listener: (...args: [V, ...F]) => Awaited<void>): this;
  public once(event: 'end', listener: (collected: Collection<K, V>, reason: string) => Awaited<void>): this;
}

export class CommandInteraction extends Interaction {
  public readonly command: ApplicationCommand | ApplicationCommand<{ guild: GuildResolvable }> | null;
  public readonly channel: TextChannel | DMChannel | NewsChannel | PartialDMChannel | ThreadChannel | null;
  public channelId: Snowflake;
  public commandId: Snowflake;
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

export class DataResolver extends null {
  private constructor();
  public static resolveBase64(data: Base64Resolvable): string;
  public static resolveCode(data: string, regx: RegExp): string;
  public static resolveFile(resource: BufferResolvable | Stream): Promise<Buffer | Stream>;
  public static resolveFileAsBuffer(resource: BufferResolvable | Stream): Promise<Buffer>;
  public static resolveImage(resource: BufferResolvable | Base64Resolvable): Promise<string | null>;
  public static resolveInviteCode(data: InviteResolvable): string;
  public static resolveGuildTemplateCode(data: GuildTemplateResolvable): string;
}

export class DiscordAPIError extends Error {
  public constructor(error: unknown, status: number, request: unknown);
  private static flattenErrors(obj: unknown, key: string): string[];

  public code: number;
  public method: string;
  public path: string;
  public httpStatus: number;
  public requestData: HTTPErrorData;
}

export class DMChannel extends TextBasedChannel(Channel, ['bulkDelete']) {
  public constructor(client: Client, data?: unknown);
  public messages: MessageManager;
  public recipient: User;
  public type: 'DM';
  public fetch(force?: boolean): Promise<this>;
}

export class Emoji extends Base {
  public constructor(client: Client, emoji: unknown);
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
  public constructor(client: Client, data: unknown);
  private _sortedRoles(): Collection<Snowflake, Role>;
  private _sortedChannels(channel: Channel): Collection<Snowflake, GuildChannel>;

  public readonly afkChannel: VoiceChannel | null;
  public afkChannelId: Snowflake | null;
  public afkTimeout: number;
  public applicationId: Snowflake | null;
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
  public invites: GuildInviteManager;
  public readonly joinedAt: Date;
  public joinedTimestamp: number;
  public large: boolean;
  public maximumMembers: number | null;
  public maximumPresences: number | null;
  public readonly me: GuildMember | null;
  public memberCount: number;
  public members: GuildMemberManager;
  public mfaLevel: MFALevel;
  public ownerId: Snowflake;
  public preferredLocale: string;
  public premiumSubscriptionCount: number | null;
  public premiumTier: PremiumTier;
  public presences: PresenceManager;
  public readonly publicUpdatesChannel: TextChannel | null;
  public publicUpdatesChannelId: Snowflake | null;
  public roles: RoleManager;
  public readonly rulesChannel: TextChannel | null;
  public rulesChannelId: Snowflake | null;
  public readonly shard: WebSocketShard;
  public shardId: number;
  public stageInstances: StageInstanceManager;
  public readonly systemChannel: TextChannel | null;
  public systemChannelFlags: Readonly<SystemChannelFlags>;
  public systemChannelId: Snowflake | null;
  public vanityURLUses: number | null;
  public readonly voiceAdapterCreator: InternalDiscordGatewayAdapterCreator;
  public readonly voiceStates: VoiceStateManager;
  public readonly widgetChannel: TextChannel | null;
  public widgetChannelId: Snowflake | null;
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
  public fetchOwner(options?: FetchOwnerOptions): Promise<GuildMember>;
  public fetchPreview(): Promise<GuildPreview>;
  public fetchTemplates(): Promise<Collection<GuildTemplate['code'], GuildTemplate>>;
  public fetchVanityData(): Promise<Vanity>;
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
  public constructor(guild: Guild, data: unknown);
  private webhooks: Collection<Snowflake, Webhook>;
  private integrations: Collection<Snowflake, Integration>;

  public entries: Collection<Snowflake, GuildAuditLogsEntry>;

  public static Actions: GuildAuditLogsActions;
  public static Targets: GuildAuditLogsTargets;
  public static Entry: typeof GuildAuditLogsEntry;
  public static actionType(action: number): GuildAuditLogsActionType;
  public static build(...args: unknown[]): Promise<GuildAuditLogs>;
  public static targetType(target: number): GuildAuditLogsTarget;
  public toJSON(): unknown;
}

export class GuildAuditLogsEntry {
  public constructor(logs: GuildAuditLogs, guild: Guild, data: unknown);
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
  public constructor(client: Client, data: unknown, guild: Guild);
  public guild: Guild;
  public user: User;
  public readonly partial: boolean;
  public reason?: string | null;
  public fetch(force?: boolean): Promise<GuildBan>;
}

export class GuildChannel extends Channel {
  public constructor(guild: Guild, data?: unknown, client?: Client);
  private memberPermissions(member: GuildMember): Readonly<Permissions>;
  private rolePermissions(role: Role): Readonly<Permissions>;

  public readonly calculatedPosition: number;
  public readonly deletable: boolean;
  public guild: Guild;
  public guildId: Snowflake;
  public readonly manageable: boolean;
  public readonly members: Collection<Snowflake, GuildMember>;
  public name: string;
  public readonly parent: CategoryChannel | null;
  public parentId: Snowflake | null;
  public permissionOverwrites: PermissionOverwriteManager;
  public readonly permissionsLocked: boolean | null;
  public readonly position: number;
  public rawPosition: number;
  public type: Exclude<keyof typeof ChannelTypes, 'DM' | 'GROUP_DM' | 'UNKNOWN'>;
  public readonly viewable: boolean;
  public clone(options?: GuildChannelCloneOptions): Promise<this>;
  public createInvite(options?: CreateInviteOptions): Promise<Invite>;
  public edit(data: ChannelData, reason?: string): Promise<this>;
  public equals(channel: GuildChannel): boolean;
  public fetchInvites(cache?: boolean): Promise<Collection<string, Invite>>;
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
  public constructor(client: Client, data: unknown, guild: Guild);
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
  public constructor(client: Client, data: unknown, guild: Guild);
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
  public readonly manageable: boolean;
  public nickname: string | null;
  public readonly partial: false;
  public readonly permissions: Readonly<Permissions>;
  public readonly premiumSince: Date | null;
  public premiumSinceTimestamp: number | null;
  public readonly presence: Presence | null;
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
  public constructor(client: Client, data: unknown);
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
  public constructor(client: Client, data: unknown);
  public readonly createdTimestamp: number;
  public readonly updatedTimestamp: number;
  public readonly url: string;
  public code: string;
  public name: string;
  public description: string | null;
  public usageCount: number;
  public creator: User;
  public creatorId: Snowflake;
  public createdAt: Date;
  public updatedAt: Date;
  public guild: Guild | null;
  public guildId: Snowflake;
  public serializedGuild: unknown;
  public unSynced: boolean | null;
  public createGuild(name: string, icon?: BufferResolvable | Base64Resolvable): Promise<Guild>;
  public delete(): Promise<GuildTemplate>;
  public edit(options?: EditGuildTemplateOptions): Promise<GuildTemplate>;
  public sync(): Promise<GuildTemplate>;
  public static GUILD_TEMPLATES_PATTERN: RegExp;
}

export class GuildPreviewEmoji extends BaseGuildEmoji {
  public constructor(client: Client, data: unknown, guild: GuildPreview);
  public guild: GuildPreview;
  public roles: Snowflake[];
}

export class HTTPError extends Error {
  public constructor(message: string, name: string, code: number, request: unknown);
  public code: number;
  public method: string;
  public name: string;
  public path: string;
  public requestData: HTTPErrorData;
}

// tslint:disable-next-line:no-empty-interface - Merge RateLimitData into RateLimitError to not have to type it again
export interface RateLimitError extends RateLimitData {}
export class RateLimitError extends Error {
  public constructor(data: RateLimitData);
  public name: 'RateLimitError';
}

export class Integration extends Base {
  public constructor(client: Client, data: unknown, guild: Guild);
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
  public static resolve(bit?: BitFieldResolvable<IntentsString, number>): number;
}

export class Interaction extends Base {
  public constructor(client: Client, data: unknown);
  public applicationId: Snowflake;
  public readonly channel: Channel | PartialDMChannel | null;
  public channelId: Snowflake | null;
  public readonly createdAt: Date;
  public readonly createdTimestamp: number;
  public readonly guild: Guild | null;
  public guildId: Snowflake | null;
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
  public constructor(client: Client, options?: InteractionCollectorOptions<T>);
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
  public constructor(client: Client, id: Snowflake, token: string);
  public token: string;
  public send(options: string | MessagePayload | InteractionReplyOptions): Promise<Message | APIMessage>;
}

export class Invite extends Base {
  public constructor(client: Client, data: unknown);
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
  public constructor(client: Client, data: unknown, channelId: Snowflake, guildId: Snowflake);
  public channelId: Snowflake;
  public guildId: Snowflake;
  public members: Collection<Snowflake, GuildMember>;
  public topic: string;
  public participantCount: number;
  public speakerCount: number;
  public readonly channel: StageChannel | null;
  public readonly guild: Guild | null;
}

export class InviteGuild extends AnonymousGuild {
  public constructor(client: Client, data: unknown);
  public welcomeScreen: WelcomeScreen | null;
}

export class LimitedCollection<K, V> extends Collection<K, V> {
  public constructor(maxSize?: number, iterable?: Iterable<readonly [K, V]>);
  public maxSize: number;
}

export class Message extends Base {
  public constructor(client: Client, data: unknown, channel: TextChannel | DMChannel | NewsChannel | ThreadChannel);
  private patch(data: unknown): Message;

  public activity: MessageActivity | null;
  public applicationId: Snowflake | null;
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
  public webhookId: Snowflake | null;
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
  public constructor(data?: MessageActionRow | MessageActionRowOptions);
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
  public constructor(attachment: BufferResolvable | Stream, name?: string, data?: unknown);

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
  public constructor(data?: MessageButton | MessageButtonOptions);
  public customId: string | null;
  public disabled: boolean;
  public emoji: APIPartialEmoji | null;
  public label: string | null;
  public style: MessageButtonStyle | null;
  public type: 'BUTTON';
  public url: string | null;
  public setCustomId(customId: string): this;
  public setDisabled(disabled: boolean): this;
  public setEmoji(emoji: EmojiIdentifierResolvable): this;
  public setLabel(label: string): this;
  public setStyle(style: MessageButtonStyleResolvable): this;
  public setURL(url: string): this;
  public toJSON(): unknown;
  private static resolveStyle(style: MessageButtonStyleResolvable): MessageButtonStyle;
}

export class MessageCollector extends Collector<Snowflake, Message> {
  public constructor(channel: TextChannel | DMChannel | ThreadChannel, options?: MessageCollectorOptions);
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
  public customId: string;
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
  public constructor(data?: MessageEmbed | MessageEmbedOptions);
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
  public constructor(
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

export class MessagePayload {
  public constructor(target: MessageTarget, options: MessageOptions | WebhookMessageOptions);
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

export class MessageReaction {
  public constructor(client: Client, data: unknown, message: Message);
  private _emoji: GuildEmoji | ReactionEmoji;

  public readonly client: Client;
  public count: number;
  public readonly emoji: GuildEmoji | ReactionEmoji;
  public me: boolean;
  public message: Message | PartialMessage;
  public readonly partial: false;
  public users: ReactionUserManager;
  public remove(): Promise<MessageReaction>;
  public fetch(): Promise<MessageReaction>;
  public toJSON(): unknown;
}

export class MessageSelectMenu extends BaseMessageComponent {
  public constructor(data?: MessageSelectMenu | MessageSelectMenuOptions);
  public customId: string | null;
  public disabled: boolean;
  public maxValues: number | null;
  public minValues: number | null;
  public options: MessageSelectOption[];
  public placeholder: string | null;
  public type: 'SELECT_MENU';
  public addOptions(...options: MessageSelectOptionData[] | MessageSelectOptionData[][]): this;
  public setCustomId(customId: string): this;
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
  public constructor(guild: Guild, data?: unknown);
  public defaultAutoArchiveDuration?: ThreadAutoArchiveDuration;
  public messages: MessageManager;
  public nsfw: boolean;
  public threads: ThreadManager<AllowedThreadTypeForNewsChannel>;
  public topic: string | null;
  public type: 'GUILD_NEWS';
  public createWebhook(name: string, options?: ChannelWebhookCreateOptions): Promise<Webhook>;
  public setDefaultAutoArchiveDuration(
    defaultAutoArchiveDuration: ThreadAutoArchiveDuration,
    reason?: string,
  ): Promise<NewsChannel>;
  public setNSFW(nsfw: boolean, reason?: string): Promise<NewsChannel>;
  public setType(type: Pick<typeof ChannelTypes, 'GUILD_TEXT' | 'GUILD_NEWS'>, reason?: string): Promise<GuildChannel>;
  public fetchWebhooks(): Promise<Collection<Snowflake, Webhook>>;
  public addFollower(channel: GuildChannelResolvable, reason?: string): Promise<NewsChannel>;
}

export class OAuth2Guild extends BaseGuild {
  public owner: boolean;
  public permissions: Readonly<Permissions>;
}

export class PartialGroupDMChannel extends Channel {
  public constructor(client: Client, data: unknown);
  public name: string;
  public icon: string | null;
  public iconURL(options?: StaticImageURLOptions): string | null;
}

export class PermissionOverwrites extends Base {
  public constructor(client: Client, data: object, channel: GuildChannel);
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

export class Presence extends Base {
  public constructor(client: Client, data?: unknown);
  public activities: Activity[];
  public clientStatus: ClientPresenceStatusData | null;
  public guild: Guild | null;
  public readonly member: GuildMember | null;
  public status: PresenceStatus;
  public readonly user: User | null;
  public userId: Snowflake;
  public equals(presence: Presence): boolean;
}

export class ReactionCollector extends Collector<Snowflake | string, MessageReaction, [User]> {
  public constructor(message: Message, options?: ReactionCollectorOptions);
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
  public on(event: 'end', listener: (collected: Collection<Snowflake, MessageReaction>, reason: string) => void): this;
  public on(event: string, listener: (...args: any[]) => void): this;

  public once(event: 'collect' | 'dispose' | 'remove', listener: (reaction: MessageReaction, user: User) => void): this;
  public once(
    event: 'end',
    listener: (collected: Collection<Snowflake, MessageReaction>, reason: string) => void,
  ): this;
  public once(event: string, listener: (...args: any[]) => void): this;
}

export class ReactionEmoji extends Emoji {
  public constructor(reaction: MessageReaction, emoji: unknown);
  public reaction: MessageReaction;
  public toJSON(): unknown;
}

export class RichPresenceAssets {
  public constructor(activity: Activity, assets: unknown);
  public largeImage: Snowflake | null;
  public largeText: string | null;
  public smallImage: Snowflake | null;
  public smallText: string | null;
  public largeImageURL(options?: StaticImageURLOptions): string | null;
  public smallImageURL(options?: StaticImageURLOptions): string | null;
}

export class Role extends Base {
  public constructor(client: Client, data: unknown, guild: Guild);
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
  public values: string[];
}

export class Shard extends EventEmitter {
  public constructor(manager: ShardingManager, id: number);
  private _evals: Map<string, Promise<unknown>>;
  private _exitListener: (...args: any[]) => void;
  private _fetches: Map<string, Promise<unknown>>;
  private _handleExit(respawn?: boolean): void;
  private _handleMessage(message: unknown): void;

  public args: string[];
  public execArgv: string[];
  public env: unknown;
  public id: number;
  public manager: ShardingManager;
  public process: ChildProcess | null;
  public ready: boolean;
  public worker: unknown | null;
  public eval(script: string): Promise<unknown>;
  public eval<T>(fn: (client: Client) => T): Promise<T[]>;
  public fetchClientValue(prop: string): Promise<unknown>;
  public kill(): void;
  public respawn(options?: { delay?: number; timeout?: number }): Promise<ChildProcess>;
  public send(message: unknown): Promise<Shard>;
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
  public constructor(client: Client, mode: ShardingManagerMode);
  private _handleMessage(message: unknown): void;
  private _respond(type: string, message: unknown): void;

  public client: Client;
  public readonly count: number;
  public readonly ids: number[];
  public mode: ShardingManagerMode;
  public parentPort: unknown | null;
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
  public fetchClientValues(prop: string): Promise<unknown[]>;
  public fetchClientValues(prop: string, shard: number): Promise<unknown>;
  public respawnAll(options?: MultipleShardRespawnOptions): Promise<void>;
  public send(message: unknown): Promise<void>;

  public static singleton(client: Client, mode: ShardingManagerMode): ShardClientUtil;
  public static shardIdForGuildId(guildId: Snowflake, shardCount: number): number;
}

export class ShardingManager extends EventEmitter {
  public constructor(file: string, options?: ShardingManagerOptions);
  private _performOnShards(method: string, args: unknown[]): Promise<unknown[]>;
  private _performOnShards(method: string, args: unknown[], shard: number): Promise<unknown>;

  public file: string;
  public respawn: boolean;
  public shardArgs: string[];
  public shards: Collection<number, Shard>;
  public token: string | null;
  public totalShards: number | 'auto';
  public shardList: number[] | 'auto';
  public broadcast(message: unknown): Promise<Shard[]>;
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
  public fetchClientValues(prop: string): Promise<unknown[]>;
  public fetchClientValues(prop: string, shard: number): Promise<unknown>;
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
  public type: 'GUILD_STAGE_VOICE';
  public readonly stageInstance: StageInstance | null;
  public createStageInstance(options: StageInstanceCreateOptions): Promise<StageInstance>;
}

export class StageInstance extends Base {
  public constructor(client: Client, data: unknown, channel: StageChannel);
  public id: Snowflake;
  public deleted: boolean;
  public guildId: Snowflake;
  public channelId: Snowflake;
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

export class Sticker extends Base {
  public constructor(client: Client, data: unknown);
  public asset: string;
  public readonly createdTimestamp: number;
  public readonly createdAt: Date;
  public description: string;
  public format: StickerFormatType;
  public id: Snowflake;
  public name: string;
  public packId: Snowflake;
  public tags: string[];
  public readonly url: string;
}

export class StoreChannel extends GuildChannel {
  public constructor(guild: Guild, data?: unknown, client?: Client);
  public nsfw: boolean;
  public type: 'GUILD_STORE';
}

export class SystemChannelFlags extends BitField<SystemChannelFlagsString> {
  public static FLAGS: Record<SystemChannelFlagsString, number>;
  public static resolve(bit?: BitFieldResolvable<SystemChannelFlagsString, number>): number;
}

export class Team extends Base {
  public constructor(client: Client, data: unknown);
  public id: Snowflake;
  public name: string;
  public icon: string | null;
  public ownerId: Snowflake | null;
  public members: Collection<Snowflake, TeamMember>;

  public readonly owner: TeamMember | null;
  public readonly createdAt: Date;
  public readonly createdTimestamp: number;

  public iconURL(options?: StaticImageURLOptions): string | null;
  public toJSON(): unknown;
  public toString(): string;
}

export class TeamMember extends Base {
  public constructor(team: Team, data: unknown);
  public team: Team;
  public readonly id: Snowflake;
  public permissions: string[];
  public membershipState: MembershipState;
  public user: User;

  public toString(): UserMention;
}

export class TextChannel extends TextBasedChannel(GuildChannel) {
  public constructor(guild: Guild, data?: unknown, client?: Client);
  public defaultAutoArchiveDuration?: ThreadAutoArchiveDuration;
  public messages: MessageManager;
  public nsfw: boolean;
  public type: 'GUILD_TEXT';
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
  public setType(type: Pick<typeof ChannelTypes, 'GUILD_TEXT' | 'GUILD_NEWS'>, reason?: string): Promise<GuildChannel>;
  public fetchWebhooks(): Promise<Collection<Snowflake, Webhook>>;
}

export class ThreadChannel extends TextBasedChannel(Channel) {
  public constructor(guild: Guild, data?: object, client?: Client);
  public archived: boolean;
  public readonly archivedAt: Date;
  public archiveTimestamp: number;
  public autoArchiveDuration: ThreadAutoArchiveDuration;
  public readonly editable: boolean;
  public guild: Guild;
  public guildId: Snowflake;
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
  public ownerId: Snowflake;
  public readonly parent: TextChannel | NewsChannel | null;
  public parentId: Snowflake;
  public rateLimitPerUser: number;
  public type: ThreadChannelTypes;
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
  public constructor(thread: ThreadChannel, data?: object);
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
  public constructor(client: Client, data: unknown);
  public avatar: string | null;
  public bot: boolean;
  public readonly createdAt: Date;
  public readonly createdTimestamp: number;
  public discriminator: string;
  public readonly defaultAvatarURL: string;
  public readonly dmChannel: DMChannel | null;
  public flags: Readonly<UserFlags> | null;
  public id: Snowflake;
  public readonly partial: false;
  public system: boolean;
  public readonly tag: string;
  public username: string;
  public avatarURL(options?: ImageURLOptions): string | null;
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
  public static binaryToId(num: string): Snowflake;
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
  public static flatten(obj: unknown, ...props: Record<string, boolean | string>[]): unknown;
  public static idToBinary(num: Snowflake): string;
  public static makeError(obj: MakeErrorOptions): Error;
  public static makePlainError(err: Error): MakeErrorOptions;
  public static mergeDefault(def: unknown, given: unknown): unknown;
  public static moveElementInArray(array: unknown[], element: unknown, newIndex: number, offset?: boolean): number;
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
  public type: 'GUILD_VOICE';
  public setBitrate(bitrate: number, reason?: string): Promise<VoiceChannel>;
  public setUserLimit(userLimit: number, reason?: string): Promise<VoiceChannel>;
}

export class VoiceRegion {
  public constructor(data: unknown);
  public custom: boolean;
  public deprecated: boolean;
  public id: string;
  public name: string;
  public optimal: boolean;
  public vip: boolean;
  public toJSON(): unknown;
}

export class VoiceState extends Base {
  public constructor(guild: Guild, data: unknown);
  public readonly channel: VoiceChannel | StageChannel | null;
  public channelId: Snowflake | null;
  public readonly deaf: boolean | null;
  public guild: Guild;
  public id: Snowflake;
  public readonly member: GuildMember | null;
  public readonly mute: boolean | null;
  public selfDeaf: boolean | null;
  public selfMute: boolean | null;
  public serverDeaf: boolean | null;
  public serverMute: boolean | null;
  public sessionId: string | null;
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

export class Webhook extends WebhookMixin() {
  public constructor(client: Client, data?: unknown);
  public avatar: string;
  public avatarURL(options?: StaticImageURLOptions): string | null;
  public channelId: Snowflake;
  public client: Client;
  public guildId: Snowflake;
  public name: string;
  public owner: User | unknown | null;
  public sourceGuild: Guild | unknown | null;
  public sourceChannel: Channel | unknown | null;
  public token: string | null;
  public type: WebhookType;
}

export class WebhookClient extends WebhookMixin(BaseClient) {
  public constructor(id: Snowflake, token: string, options?: WebhookClientOptions);
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
  public constructor(client: Client);
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

  public on(event: WSEventType, listener: (data: any, shardId: number) => void): this;
  public once(event: WSEventType, listener: (data: any, shardId: number) => void): this;

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
  public constructor(manager: WebSocketManager, id: number);
  private sequence: number;
  private closeSequence: number;
  private sessionId: string | null;
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
  public constructor(client: Client, data: object);
  private _patch(data: object): void;
  public fetch(): Promise<Widget>;
  public id: Snowflake;
  public instantInvite?: string;
  public channels: Collection<Snowflake, WidgetChannel>;
  public members: Collection<string, WidgetMember>;
  public presenceCount: number;
}

export class WidgetMember extends Base {
  public constructor(client: Client, data: object);
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
  public channelId?: Snowflake;
  public avatarURL: string;
  public activity?: WidgetActivity;
}

export class WelcomeChannel extends Base {
  private _emoji: unknown;
  public channelId: Snowflake;
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

//#region Constants

export const Constants: {
  Package: {
    name: string;
    version: string;
    description: string;
    author: string;
    license: string;
    main: string;
    types: string;
    homepage: string;
    keywords: string[];
    bugs: { url: string };
    repository: { type: string; url: string };
    scripts: Record<string, string>;
    engines: Record<string, string>;
    dependencies: Record<string, string>;
    peerDependencies: Record<string, string>;
    devDependencies: Record<string, string>;
    [key: string]: unknown;
  };
  UserAgent: string;
  Endpoints: {
    botGateway: string;
    invite: (root: string, code: string) => string;
    CDN: (root: string) => {
      Asset: (name: string) => string;
      DefaultAvatar: (id: Snowflake | number) => string;
      Emoji: (emojiId: Snowflake, format: 'png' | 'gif') => string;
      Avatar: (userId: Snowflake | number, hash: string, format: AllowedImageFormat, size: AllowedImageSize) => string;
      GuildMemberAvatar: (
        guildId: Snowflake | number,
        userId: Snowflake | number,
        hash: string,
        format: AllowedImageFormat,
        size: AllowedImageSize,
      ) => string;
      Banner: (guildId: Snowflake | number, hash: string, format: AllowedImageFormat, size: AllowedImageSize) => string;
      Icon: (userId: Snowflake | number, hash: string, format: AllowedImageFormat, size: AllowedImageSize) => string;
      AppIcon: (userId: Snowflake | number, hash: string, format: AllowedImageFormat, size: AllowedImageSize) => string;
      AppAsset: (
        userId: Snowflake | number,
        hash: string,
        format: AllowedImageFormat,
        size: AllowedImageSize,
      ) => string;
      GDMIcon: (userId: Snowflake | number, hash: string, format: AllowedImageFormat, size: AllowedImageSize) => string;
      Splash: (guildId: Snowflake | number, hash: string, format: AllowedImageFormat, size: AllowedImageSize) => string;
      DiscoverySplash: (
        guildId: Snowflake | number,
        hash: string,
        format: AllowedImageFormat,
        size: AllowedImageSize,
      ) => string;
      TeamIcon: (
        teamId: Snowflake | number,
        hash: string,
        format: AllowedImageFormat,
        size: AllowedImageSize,
      ) => string;
    };
  };
  WSCodes: {
    1000: 'WS_CLOSE_REQUESTED';
    4004: 'TOKEN_INVALID';
    4010: 'SHARDING_INVALID';
    4011: 'SHARDING_REQUIRED';
  };
  Events: typeof ConstantsEvents;
  ShardEvents: typeof ConstantsShardEvents;
  PartialTypes: {
    [K in PartialTypes]: K;
  };
  WSEvents: {
    [K in WSEventType]: K;
  };
  Colors: typeof ConstantsColors;
  Status: typeof ConstantsStatus;
  Opcodes: typeof ConstantsOpcodes;
  APIErrors: APIErrors;
  ChannelTypes: typeof ChannelTypes;
  ThreadChannelTypes: ThreadChannelTypes[];
  TextBasedChannelTypes: TextBasedChannelTypes[];
  VoiceBasedChannelTypes: VoiceBasedChannelTypes[];
  ClientApplicationAssetTypes: typeof ConstantsClientApplicationAssetTypes;
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

export const version: string;

//#endregion

//#region Managers

export abstract class BaseManager {
  public constructor(client: Client);
  public readonly client: Client;
}

export abstract class DataManager<K, Holds, R> extends BaseManager {
  public constructor(client: Client, holds: Constructable<Holds>);
  public readonly holds: Constructable<Holds>;
  public readonly cache: Collection<K, Holds>;
  public resolve(resolvable: Holds): Holds;
  public resolve(resolvable: R): Holds | null;
  public resolveId(resolvable: Holds): K;
  public resolveId(resolvable: R): K | null;
  public valueOf(): Collection<K, Holds>;
}

export abstract class CachedManager<K, Holds, R> extends DataManager<K, Holds, R> {
  public constructor(client: Client, holds: Constructable<Holds>);
  private _add(data: unknown, cache?: boolean, { id, extras }?: { id: K; extras: unknown[] }): Holds;
}

export class ApplicationCommandManager<
  ApplicationCommandType = ApplicationCommand<{ guild: GuildResolvable }>,
  PermissionsOptionsExtras = { guild: GuildResolvable },
  PermissionsGuildType = null,
> extends CachedManager<Snowflake, ApplicationCommandType, ApplicationCommandResolvable> {
  public constructor(client: Client, iterable?: Iterable<unknown>);
  public permissions: ApplicationCommandPermissionsManager<
    { command?: ApplicationCommandResolvable } & PermissionsOptionsExtras,
    { command: ApplicationCommandResolvable } & PermissionsOptionsExtras,
    PermissionsOptionsExtras,
    PermissionsGuildType,
    null
  >;
  private commandPath({ id, guildId }: { id?: Snowflake; guildId?: Snowflake }): unknown;
  public create(command: ApplicationCommandData): Promise<ApplicationCommandType>;
  public create(command: ApplicationCommandData, guildId: Snowflake): Promise<ApplicationCommand>;
  public delete(command: ApplicationCommandResolvable, guildId?: Snowflake): Promise<ApplicationCommandType | null>;
  public edit(command: ApplicationCommandResolvable, data: ApplicationCommandData): Promise<ApplicationCommandType>;
  public edit(
    command: ApplicationCommandResolvable,
    data: ApplicationCommandData,
    guildId: Snowflake,
  ): Promise<ApplicationCommand>;
  public fetch(
    id: Snowflake,
    options: FetchApplicationCommandOptions & { guildId: Snowflake },
  ): Promise<ApplicationCommand>;
  public fetch(id: Snowflake, options?: FetchApplicationCommandOptions): Promise<ApplicationCommandType>;
  public fetch(
    id?: Snowflake,
    options?: FetchApplicationCommandOptions,
  ): Promise<Collection<Snowflake, ApplicationCommandType>>;
  public set(commands: ApplicationCommandData[]): Promise<Collection<Snowflake, ApplicationCommandType>>;
  public set(
    commands: ApplicationCommandData[],
    guildId: Snowflake,
  ): Promise<Collection<Snowflake, ApplicationCommand>>;
  private static transformCommand(command: ApplicationCommandData): unknown;
}

export class ApplicationCommandPermissionsManager<
  BaseOptions,
  FetchSingleOptions,
  FullPermissionsOptions,
  GuildType,
  CommandIdType,
> extends BaseManager {
  public constructor(manager: ApplicationCommandManager | GuildApplicationCommandManager | ApplicationCommand);
  public client: Client;
  public commandId: CommandIdType;
  public guild: GuildType;
  public guildId: Snowflake | null;
  public manager: ApplicationCommandManager | GuildApplicationCommandManager | ApplicationCommand;
  public add(
    options: FetchSingleOptions & { permissions: ApplicationCommandPermissionData[] },
  ): Promise<ApplicationCommandPermissions[]>;
  public has(options: FetchSingleOptions & { permissionId: UserResolvable | RoleResolvable }): Promise<boolean>;
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
  private permissionsPath(guildId: Snowflake, commandId?: Snowflake): unknown;
  private static transformPermissions(permissions: ApplicationCommandPermissionData, received?: boolean): unknown;
}

export class BaseGuildEmojiManager extends CachedManager<Snowflake, GuildEmoji, EmojiResolvable> {
  public constructor(client: Client, iterable?: Iterable<unknown>);
  public resolveIdentifier(emoji: EmojiIdentifierResolvable): string | null;
}

export class ChannelManager extends CachedManager<Snowflake, Channel, ChannelResolvable> {
  public constructor(client: Client, iterable: Iterable<unknown>);
  public fetch(id: Snowflake, options?: FetchChannelOptions): Promise<Channel | null>;
}

export class GuildApplicationCommandManager extends ApplicationCommandManager<ApplicationCommand, {}, Guild> {
  public constructor(guild: Guild, iterable?: Iterable<unknown>);
  public guild: Guild;
  public create(command: ApplicationCommandData): Promise<ApplicationCommand>;
  public delete(command: ApplicationCommandResolvable): Promise<ApplicationCommand | null>;
  public edit(command: ApplicationCommandResolvable, data: ApplicationCommandData): Promise<ApplicationCommand>;
  public fetch(id: Snowflake, options?: BaseFetchOptions): Promise<ApplicationCommand>;
  public fetch(id?: undefined, options?: BaseFetchOptions): Promise<Collection<Snowflake, ApplicationCommand>>;
  public set(commands: ApplicationCommandData[]): Promise<Collection<Snowflake, ApplicationCommand>>;
}

export class GuildChannelManager extends CachedManager<
  Snowflake,
  GuildChannel | ThreadChannel,
  GuildChannelResolvable
> {
  public constructor(guild: Guild, iterable?: Iterable<unknown>);
  public readonly channelCountWithoutThreads: number;
  public guild: Guild;
  public create(name: string, options: GuildChannelCreateOptions & { type: 'GUILD_VOICE' }): Promise<VoiceChannel>;
  public create(
    name: string,
    options: GuildChannelCreateOptions & { type: 'GUILD_CATEGORY' },
  ): Promise<CategoryChannel>;
  public create(name: string, options?: GuildChannelCreateOptions & { type?: 'GUILD_TEXT' }): Promise<TextChannel>;
  public create(name: string, options: GuildChannelCreateOptions & { type: 'GUILD_NEWS' }): Promise<NewsChannel>;
  public create(name: string, options: GuildChannelCreateOptions & { type: 'GUILD_STORE' }): Promise<StoreChannel>;
  public create(
    name: string,
    options: GuildChannelCreateOptions & { type: 'GUILD_STAGE_VOICE' },
  ): Promise<StageChannel>;
  public create(
    name: string,
    options: GuildChannelCreateOptions,
  ): Promise<TextChannel | VoiceChannel | CategoryChannel | NewsChannel | StoreChannel | StageChannel>;
  public fetch(
    id: Snowflake,
    options?: BaseFetchOptions,
  ): Promise<TextChannel | VoiceChannel | CategoryChannel | NewsChannel | StoreChannel | StageChannel | null>;
  public fetch(
    id?: undefined,
    options?: BaseFetchOptions,
  ): Promise<
    Collection<Snowflake, TextChannel | VoiceChannel | CategoryChannel | NewsChannel | StoreChannel | StageChannel>
  >;
}

export class GuildEmojiManager extends BaseGuildEmojiManager {
  public constructor(guild: Guild, iterable?: Iterable<unknown>);
  public guild: Guild;
  public create(
    attachment: BufferResolvable | Base64Resolvable,
    name: string,
    options?: GuildEmojiCreateOptions,
  ): Promise<GuildEmoji>;
  public fetch(id: Snowflake, options?: BaseFetchOptions): Promise<GuildEmoji>;
  public fetch(id?: undefined, options?: BaseFetchOptions): Promise<Collection<Snowflake, GuildEmoji>>;
}

export class GuildEmojiRoleManager extends DataManager<Snowflake, Role, RoleResolvable> {
  public constructor(emoji: GuildEmoji);
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
  public constructor(client: Client, iterable?: Iterable<unknown>);
  public create(name: string, options?: GuildCreateOptions): Promise<Guild>;
  public fetch(options: Snowflake | FetchGuildOptions): Promise<Guild>;
  public fetch(options?: FetchGuildsOptions): Promise<Collection<Snowflake, OAuth2Guild>>;
}

export class GuildMemberManager extends CachedManager<Snowflake, GuildMember, GuildMemberResolvable> {
  public constructor(guild: Guild, iterable?: Iterable<unknown>);
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
  public constructor(guild: Guild, iterable?: Iterable<unknown>);
  public guild: Guild;
  public create(user: UserResolvable, options?: BanOptions): Promise<GuildMember | User | Snowflake>;
  public fetch(options: UserResolvable | FetchBanOptions): Promise<GuildBan>;
  public fetch(options?: FetchBansOptions): Promise<Collection<Snowflake, GuildBan>>;
  public remove(user: UserResolvable, reason?: string): Promise<User>;
}

export class GuildInviteManager extends DataManager<Snowflake, Invite, InviteResolvable> {
  public constructor(guild: Guild, iterable?: Iterable<unknown>);
  public guild: Guild;
  public create(channel: GuildChannelResolvable, options?: CreateInviteOptions): Promise<Invite>;
  public fetch(options: InviteResolvable | FetchInviteOptions): Promise<Invite>;
  public fetch(options?: FetchInvitesOptions): Promise<Collection<string, Invite>>;
  public delete(invite: InviteResolvable, reason?: string): Promise<Invite>;
}

export class GuildMemberRoleManager extends DataManager<Snowflake, Role, RoleResolvable> {
  public constructor(member: GuildMember);
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
  public constructor(channel: TextChannel | DMChannel | ThreadChannel, iterable?: Iterable<unknown>);
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
  public constructor(client: Client, iterable?: Iterable<unknown>);
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
  public constructor(client: Client, iterable?: Iterable<unknown>);
}

export class ReactionManager extends CachedManager<Snowflake | string, MessageReaction, MessageReactionResolvable> {
  public constructor(message: Message, iterable?: Iterable<unknown>);
  public message: Message;
  public removeAll(): Promise<Message>;
}

export class ReactionUserManager extends CachedManager<Snowflake, User, UserResolvable> {
  public constructor(reaction: MessageReaction, iterable?: Iterable<unknown>);
  public reaction: MessageReaction;
  public fetch(options?: FetchReactionUsersOptions): Promise<Collection<Snowflake, User>>;
  public remove(user?: UserResolvable): Promise<MessageReaction>;
}

export class RoleManager extends CachedManager<Snowflake, Role, RoleResolvable> {
  public constructor(guild: Guild, iterable?: Iterable<unknown>);
  public readonly everyone: Role;
  public readonly highest: Role;
  public guild: Guild;
  public readonly premiumSubscriberRole: Role | null;
  public botRoleFor(user: UserResolvable): Role | null;
  public fetch(id: Snowflake, options?: BaseFetchOptions): Promise<Role | null>;
  public fetch(id?: undefined, options?: BaseFetchOptions): Promise<Collection<Snowflake, Role>>;
  public create(options?: CreateRoleOptions): Promise<Role>;
  public edit(role: RoleResolvable, options: RoleData, reason?: string): Promise<Role>;
}

export class StageInstanceManager extends CachedManager<Snowflake, StageInstance, StageInstanceResolvable> {
  public constructor(guild: Guild, iterable?: Iterable<unknown>);
  public guild: Guild;
  public create(channel: StageChannel | Snowflake, options: StageInstanceCreateOptions): Promise<StageInstance>;
  public fetch(channel: StageChannel | Snowflake, options?: BaseFetchOptions): Promise<StageInstance>;
  public edit(channel: StageChannel | Snowflake, options: StageInstanceEditOptions): Promise<StageInstance>;
  public delete(channel: StageChannel | Snowflake): Promise<void>;
}

export class ThreadManager<AllowedThreadType> extends CachedManager<Snowflake, ThreadChannel, ThreadChannelResolvable> {
  public constructor(channel: TextChannel | NewsChannel, iterable?: Iterable<unknown>);
  public channel: TextChannel | NewsChannel;
  public create(options: ThreadCreateOptions<AllowedThreadType>): Promise<ThreadChannel>;
  public fetch(options: ThreadChannelResolvable, cacheOptions?: BaseFetchOptions): Promise<ThreadChannel | null>;
  public fetch(options?: FetchThreadsOptions, cacheOptions?: { cache?: boolean }): Promise<FetchedThreads>;
  public fetchArchived(options?: FetchArchivedThreadOptions, cache?: boolean): Promise<FetchedThreads>;
  public fetchActive(cache?: boolean): Promise<FetchedThreads>;
}

export class ThreadMemberManager extends CachedManager<Snowflake, ThreadMember, ThreadMemberResolvable> {
  public constructor(thread: ThreadChannel, iterable?: Iterable<unknown>);
  public thread: ThreadChannel;
  public add(member: UserResolvable | '@me', reason?: string): Promise<Snowflake>;
  public fetch(cache?: boolean): Promise<Collection<Snowflake, ThreadMember>>;
  public remove(id: Snowflake | '@me', reason?: string): Promise<Snowflake>;
}

export class UserManager extends CachedManager<Snowflake, User, UserResolvable> {
  public constructor(client: Client, iterable?: Iterable<unknown>);
  public fetch(id: Snowflake, options?: BaseFetchOptions): Promise<User>;
}

export class VoiceStateManager extends CachedManager<Snowflake, VoiceState, typeof VoiceState> {
  public constructor(guild: Guild, iterable?: Iterable<unknown>);
  public guild: Guild;
}

//#endregion

//#region Mixins

// Model the TextBasedChannel mixin system, allowing application of these fields
// to the classes that use these methods without having to manually add them
// to each of those classes

export type Constructable<T> = new (...args: any[]) => T;
export function PartialTextBasedChannel<T>(Base?: Constructable<T>): Constructable<T & PartialTextBasedChannelFields>;
export function TextBasedChannel<T, I extends keyof TextBasedChannelFields = never>(
  Base?: Constructable<T>,
  ignore?: I[],
): Constructable<T & Omit<TextBasedChannelFields, I>>;

export interface PartialTextBasedChannelFields {
  send(options: string | MessagePayload | MessageOptions): Promise<Message>;
}

export interface TextBasedChannelFields extends PartialTextBasedChannelFields {
  _typing: Map<string, TypingData>;
  lastMessageId: Snowflake | null;
  readonly lastMessage: Message | null;
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

export function PartialWebhookMixin<T>(Base?: Constructable<T>): Constructable<T & PartialWebhookFields>;
export function WebhookMixin<T>(Base?: Constructable<T>): Constructable<T & WebhookFields>;

export interface PartialWebhookFields {
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

export interface WebhookFields extends PartialWebhookFields {
  readonly createdAt: Date;
  readonly createdTimestamp: number;
  delete(reason?: string): Promise<void>;
  edit(options: WebhookEditData, reason?: string): Promise<Webhook>;
  sendSlackMessage(body: object): Promise<boolean>;
}

//#endregion

//#region Typedefs

export type ActivityFlagsString = 'INSTANCE' | 'JOIN' | 'SPECTATE' | 'JOIN_REQUEST' | 'SYNC' | 'PLAY';

export type ActivitiesOptions = Omit<ActivityOptions, 'shardId'>;

export interface ActivityOptions {
  name?: string;
  url?: string;
  type?: ActivityType | number;
  shardId?: number | readonly number[];
}

export type ActivityPlatform = 'desktop' | 'samsung' | 'xbox';

export type ActivityType = keyof typeof ActivityTypes;

export interface AddGuildMemberOptions {
  accessToken: string;
  nick?: string;
  roles?: Collection<Snowflake, Role> | RoleResolvable[];
  mute?: boolean;
  deaf?: boolean;
}

export type AllowedImageFormat = 'webp' | 'png' | 'jpg' | 'jpeg' | 'gif';

export type AllowedImageSize = 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096;

export type AllowedPartial = User | Channel | GuildMember | Message | MessageReaction;

export type AllowedThreadTypeForNewsChannel = 'GUILD_NEWS_THREAD' | 10;

export type AllowedThreadTypeForTextChannel = 'GUILD_PUBLIC_THREAD' | 'GUILD_PRIVATE_THREAD' | 11 | 12;

export interface APIErrors {
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

export interface ApplicationAsset {
  name: string;
  id: Snowflake;
  type: 'BIG' | 'SMALL';
}

export interface ApplicationCommandData {
  name: string;
  description: string;
  options?: ApplicationCommandOptionData[];
  defaultPermission?: boolean;
}

export interface ApplicationCommandOptionData {
  type: ApplicationCommandOptionType | ApplicationCommandOptionTypes;
  name: string;
  description: string;
  required?: boolean;
  choices?: ApplicationCommandOptionChoice[];
  options?: this[];
}

export interface ApplicationCommandOption extends ApplicationCommandOptionData {
  type: ApplicationCommandOptionType;
}

export interface ApplicationCommandOptionChoice {
  name: string;
  value: string | number;
}

export type ApplicationCommandOptionType = keyof typeof ApplicationCommandOptionTypes;

export interface ApplicationCommandPermissionData {
  id: Snowflake;
  type: ApplicationCommandPermissionType | ApplicationCommandPermissionTypes;
  permission: boolean;
}

export interface ApplicationCommandPermissions extends ApplicationCommandPermissionData {
  type: ApplicationCommandPermissionType;
}

export type ApplicationCommandPermissionType = keyof typeof ApplicationCommandPermissionTypes;

export type ApplicationCommandResolvable = ApplicationCommand | Snowflake;

export type ApplicationFlagsString =
  | 'MANAGED_EMOJI'
  | 'GROUP_DM_CREATE'
  | 'RPC_HAS_CONNECTED'
  | 'GATEWAY_PRESENCE'
  | 'GATEWAY_PRESENCE_LIMITED'
  | 'GATEWAY_GUILD_MEMBERS'
  | 'GATEWAY_GUILD_MEMBERS_LIMITED'
  | 'VERIFICATION_PENDING_GUILD_LIMIT'
  | 'EMBEDDED';

export interface AuditLogChange {
  key: string;
  old?: unknown;
  new?: unknown;
}

export type Awaited<T> = T | PromiseLike<T>;

export type AwaitMessageComponentOptions<T extends MessageComponentInteraction> = Omit<
  MessageComponentCollectorOptions<T>,
  'max' | 'maxComponents' | 'maxUsers'
>;

export interface AwaitMessagesOptions extends MessageCollectorOptions {
  errors?: string[];
}

export interface AwaitReactionsOptions extends ReactionCollectorOptions {
  errors?: string[];
}

export interface BanOptions {
  days?: number;
  reason?: string;
}

export type Base64Resolvable = Buffer | Base64String;

export type Base64String = string;

export interface BaseFetchOptions {
  cache?: boolean;
  force?: boolean;
}

export interface BaseMessageComponentOptions {
  type?: MessageComponentType | MessageComponentTypes;
}

export type BitFieldResolvable<T extends string, N extends number | bigint> =
  | RecursiveReadonlyArray<T | N | `${bigint}` | Readonly<BitField<T, N>>>
  | T
  | N
  | `${bigint}`
  | Readonly<BitField<T, N>>;

export type BufferResolvable = Buffer | string;

export type CacheFactory = <T>(manager: { name: string }, holds: { name: string }) => Collection<Snowflake, T>;

export interface ChannelCreationOverwrites {
  allow?: PermissionResolvable;
  deny?: PermissionResolvable;
  id: RoleResolvable | UserResolvable;
}

export interface ChannelData {
  name?: string;
  type?: Pick<typeof ChannelTypes, 'GUILD_TEXT' | 'GUILD_NEWS'>;
  position?: number;
  topic?: string;
  nsfw?: boolean;
  bitrate?: number;
  userLimit?: number;
  parentId?: Snowflake | null;
  rateLimitPerUser?: number;
  lockPermissions?: boolean;
  permissionOverwrites?: readonly OverwriteResolvable[] | Collection<Snowflake, OverwriteResolvable>;
  defaultAutoArchiveDuration?: ThreadAutoArchiveDuration;
  rtcRegion?: string | null;
}

export interface ChannelLogsQueryOptions {
  limit?: number;
  before?: Snowflake;
  after?: Snowflake;
  around?: Snowflake;
}

export type ChannelMention = `<#${Snowflake}>`;

export interface ChannelPosition {
  channel: ChannelResolvable;
  lockPermissions?: boolean;
  parent?: CategoryChannelResolvable | null;
  position?: number;
}

export type GuildTextChannelResolvable = TextChannel | NewsChannel | Snowflake;
export type ChannelResolvable = Channel | Snowflake;

export interface ChannelWebhookCreateOptions {
  avatar?: BufferResolvable | Base64Resolvable;
  reason?: string;
}

export interface ClientEvents {
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
  messageReactionRemoveEmoji: [reaction: MessageReaction | PartialMessageReaction];
  messageDeleteBulk: [messages: Collection<Snowflake, Message | PartialMessage>];
  messageReactionAdd: [message: MessageReaction | PartialMessageReaction, user: User | PartialUser];
  messageReactionRemove: [reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser];
  messageUpdate: [oldMessage: Message | PartialMessage, newMessage: Message | PartialMessage];
  presenceUpdate: [oldPresence: Presence | null, newPresence: Presence];
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
  shardDisconnect: [closeEvent: CloseEvent, shardId: number];
  shardError: [error: Error, shardId: number];
  shardReady: [shardId: number, unavailableGuilds: Set<Snowflake> | undefined];
  shardReconnecting: [shardId: number];
  shardResume: [shardId: number, replayedEvents: number];
  stageInstanceCreate: [stageInstance: StageInstance];
  stageInstanceUpdate: [oldStageInstance: StageInstance | null, newStageInstance: StageInstance];
  stageInstanceDelete: [stageInstance: StageInstance];
}

export interface ClientOptions {
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
  failIfNotExists?: boolean;
  presence?: PresenceData;
  intents: BitFieldResolvable<IntentsString, number>;
  ws?: WebSocketOptions;
  http?: HTTPOptions;
  rejectOnRateLimit?: string[] | ((data: RateLimitData) => boolean | Promise<boolean>);
}

export type ClientPresenceStatus = 'online' | 'idle' | 'dnd';

export interface ClientPresenceStatusData {
  web?: ClientPresenceStatus;
  mobile?: ClientPresenceStatus;
  desktop?: ClientPresenceStatus;
}

export interface ClientUserEditData {
  username?: string;
  avatar?: BufferResolvable | Base64Resolvable;
}

export interface CloseEvent {
  wasClean: boolean;
  code: number;
  reason: string;
  target: WebSocket;
}

export type CollectorFilter<T extends unknown[]> = (...args: T) => boolean | Promise<boolean>;

export interface CollectorOptions<T extends unknown[]> {
  filter?: CollectorFilter<T>;
  time?: number;
  idle?: number;
  dispose?: boolean;
}

export interface CollectorResetTimerOptions {
  time?: number;
  idle?: number;
}

export type ColorResolvable =
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

export interface CommandInteractionOption {
  name: string;
  type: ApplicationCommandOptionType;
  value?: string | number | boolean;
  options?: Collection<string, CommandInteractionOption>;
  user?: User;
  member?: GuildMember | APIInteractionDataResolvedGuildMember;
  channel?: GuildChannel | APIInteractionDataResolvedChannel;
  role?: Role | APIRole;
}

export interface CreateRoleOptions extends RoleData {
  reason?: string;
}

export interface StageInstanceCreateOptions {
  topic: string;
  privacyLevel?: PrivacyLevel | number;
}

export interface CrosspostedChannel {
  channelId: Snowflake;
  guildId: Snowflake;
  type: keyof typeof ChannelTypes;
  name: string;
}

export type DateResolvable = Date | number | string;

export interface DeconstructedSnowflake {
  timestamp: number;
  readonly date: Date;
  workerId: number;
  processId: number;
  increment: number;
  binary: string;
}

export type DefaultMessageNotificationLevel = keyof typeof DefaultMessageNotificationLevels;

export interface EditGuildTemplateOptions {
  name?: string;
  description?: string;
}

export interface EmbedField {
  name: string;
  value: string;
  inline: boolean;
}

export interface EmbedFieldData {
  name: string;
  value: string;
  inline?: boolean;
}

export type EmojiIdentifierResolvable = string | EmojiResolvable;

export type EmojiResolvable = Snowflake | GuildEmoji | ReactionEmoji;

export interface ErrorEvent {
  error: unknown;
  message: string;
  type: string;
  target: WebSocket;
}

export interface EscapeMarkdownOptions {
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

export type ExplicitContentFilterLevel = keyof typeof ExplicitContentFilterLevels;

export interface FetchApplicationCommandOptions extends BaseFetchOptions {
  guildId?: Snowflake;
}

export interface FetchArchivedThreadOptions {
  type?: 'public' | 'private';
  fetchAll?: boolean;
  before?: ThreadChannelResolvable | DateResolvable;
  limit?: number;
}

export interface FetchBanOptions extends BaseFetchOptions {
  user: UserResolvable;
}

export interface FetchBansOptions {
  cache: boolean;
}

export interface FetchChannelOptions extends BaseFetchOptions {
  allowUnknownGuild?: boolean;
}

export interface FetchedThreads {
  threads: Collection<Snowflake, ThreadChannel>;
  hasMore?: boolean;
}

export interface FetchGuildOptions extends BaseFetchOptions {
  guild: GuildResolvable;
}

export interface FetchGuildsOptions {
  before?: Snowflake;
  after?: Snowflake;
  limit?: number;
}

interface FetchInviteOptions extends BaseFetchOptions {
  code: string;
}

interface FetchInvitesOptions {
  channelId?: GuildChannelResolvable;
  cache?: boolean;
}

export interface FetchMemberOptions extends BaseFetchOptions {
  user: UserResolvable;
}

export interface FetchMembersOptions {
  user?: UserResolvable | UserResolvable[];
  query?: string;
  limit?: number;
  withPresences?: boolean;
  time?: number;
  nonce?: string;
  force?: boolean;
}

export type FetchOwnerOptions = Omit<FetchMemberOptions, 'user'>;

export interface FetchReactionUsersOptions {
  limit?: number;
  after?: Snowflake;
}

export interface FetchThreadsOptions {
  archived?: FetchArchivedThreadOptions;
  active?: boolean;
}

export interface FileOptions {
  attachment: BufferResolvable | Stream;
  name?: string;
}

export interface GuildApplicationCommandPermissionData {
  id: Snowflake;
  permissions: ApplicationCommandPermissionData[];
}

export type GuildAuditLogsAction = keyof GuildAuditLogsActions;

export interface GuildAuditLogsActions {
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

export type GuildAuditLogsActionType = 'CREATE' | 'DELETE' | 'UPDATE' | 'ALL';

export interface GuildAuditLogsFetchOptions {
  before?: Snowflake | GuildAuditLogsEntry;
  limit?: number;
  user?: UserResolvable;
  type?: GuildAuditLogsAction | number;
}

export type GuildAuditLogsTarget = keyof GuildAuditLogsTargets;

export interface GuildAuditLogsTargets {
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

export type GuildBanResolvable = GuildBan | UserResolvable;

export interface GuildChannelOverwriteOptions {
  reason?: string;
  type?: number;
}

export type GuildChannelResolvable = Snowflake | GuildChannel | ThreadChannel;

export interface GuildChannelCreateOptions {
  permissionOverwrites?: OverwriteResolvable[] | Collection<Snowflake, OverwriteResolvable>;
  topic?: string;
  type?: Exclude<
    keyof typeof ChannelTypes | ChannelTypes,
    | 'DM'
    | 'GROUP_DM'
    | 'UNKNOWN'
    | 'GUILD_PUBLIC_THREAD'
    | 'GUILD_PRIVATE_THREAD'
    | ChannelTypes.DM
    | ChannelTypes.GROUP_DM
    | ChannelTypes.UNKNOWN
    | ChannelTypes.GUILD_PUBLIC_THREAD
    | ChannelTypes.GUILD_PRIVATE_THREAD
  >;
  nsfw?: boolean;
  parent?: ChannelResolvable;
  bitrate?: number;
  userLimit?: number;
  rateLimitPerUser?: number;
  position?: number;
  reason?: string;
}

export interface GuildChannelCloneOptions extends GuildChannelCreateOptions {
  name?: string;
}

export interface GuildChannelOverwriteOptions {
  reason?: string;
  type?: number;
}

export interface GuildCreateOptions {
  afkChannelId?: Snowflake | number;
  afkTimeout?: number;
  channels?: PartialChannelData[];
  defaultMessageNotifications?: DefaultMessageNotificationLevel | number;
  explicitContentFilter?: ExplicitContentFilterLevel | number;
  icon?: BufferResolvable | Base64Resolvable | null;
  roles?: PartialRoleData[];
  systemChannelFlags?: SystemChannelFlagsResolvable;
  systemChannelId?: Snowflake | number;
  verificationLevel?: VerificationLevel | number;
}

export interface GuildWidget {
  enabled: boolean;
  channel: GuildChannel | null;
}

export interface GuildEditData {
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

export interface GuildEmojiCreateOptions {
  roles?: Collection<Snowflake, Role> | RoleResolvable[];
  reason?: string;
}

export interface GuildEmojiEditData {
  name?: string;
  roles?: Collection<Snowflake, Role> | RoleResolvable[];
}

export type GuildFeatures =
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

export interface GuildMemberEditData {
  nick?: string | null;
  roles?: Collection<Snowflake, Role> | readonly RoleResolvable[];
  mute?: boolean;
  deaf?: boolean;
  channel?: ChannelResolvable | null;
}

export type GuildMemberResolvable = GuildMember | UserResolvable;

export type GuildResolvable = Guild | GuildChannel | GuildMember | GuildEmoji | Invite | Role | Snowflake;

export interface GuildPruneMembersOptions {
  count?: boolean;
  days?: number;
  dry?: boolean;
  reason?: string;
  roles?: RoleResolvable[];
}

export interface GuildWidgetData {
  enabled: boolean;
  channel: GuildChannelResolvable | null;
}

export interface GuildSearchMembersOptions {
  query: string;
  limit?: number;
  cache?: boolean;
}

export type GuildTemplateResolvable = string;

export type HexColorString = `#${string}`;

export interface HTTPAttachmentData {
  attachment: string | Buffer | Stream;
  name: string;
  file: Buffer | Stream;
}

export interface HTTPErrorData {
  json: unknown;
  files: HTTPAttachmentData[];
}

export interface HTTPOptions {
  api?: string;
  version?: number;
  host?: string;
  cdn?: string;
  invite?: string;
  template?: string;
  headers?: Record<string, string>;
}

export type ImageSize = 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096;

export interface ImageURLOptions extends StaticImageURLOptions {
  dynamic?: boolean;
}

export interface IntegrationData {
  id: Snowflake;
  type: string;
}

export interface IntegrationEditData {
  expireBehavior?: number;
  expireGracePeriod?: number;
}

export interface IntegrationAccount {
  id: string | Snowflake;
  name: string;
}

export interface InteractionCollectorOptions<T extends Interaction> extends CollectorOptions<[T]> {
  channel?: TextChannel | DMChannel | NewsChannel | ThreadChannel;
  componentType?: MessageComponentType | MessageComponentTypes;
  guild?: Guild;
  interactionType?: InteractionType | InteractionTypes;
  max?: number;
  maxComponents?: number;
  maxUsers?: number;
  message?: Message;
}

export interface InteractionDeferOptions {
  ephemeral?: boolean;
  fetchReply?: boolean;
}

export type InteractionDeferUpdateOptions = Omit<InteractionDeferOptions, 'ephemeral'>;

export interface InteractionReplyOptions extends Omit<WebhookMessageOptions, 'username' | 'avatarURL'> {
  ephemeral?: boolean;
  fetchReply?: boolean;
}

export type InteractionResponseType = keyof typeof InteractionResponseTypes;

export type InteractionType = keyof typeof InteractionTypes;

export type InteractionUpdateOptions = Omit<InteractionReplyOptions, 'ephemeral'>;

export type IntentsString =
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

export interface InviteGenerationOptions {
  permissions?: PermissionResolvable;
  guild?: GuildResolvable;
  disableGuildSelect?: boolean;
  scopes: InviteScope[];
}

export interface CreateInviteOptions {
  temporary?: boolean;
  maxAge?: number;
  maxUses?: number;
  unique?: boolean;
  reason?: string;
  targetApplication?: ApplicationResolvable;
  targetUser?: UserResolvable;
  targetType?: InviteTargetType;
}

export type InviteResolvable = string;

export type InviteScope =
  | 'applications.builds.read'
  | 'applications.commands'
  | 'applications.entitlements'
  | 'applications.store.update'
  | 'bot'
  | 'connections'
  | 'email'
  | 'identity'
  | 'guilds'
  | 'guilds.join'
  | 'gdm.join'
  | 'webhook.incoming';

export interface MakeErrorOptions {
  name: string;
  message: string;
  stack: string;
}

export type MemberMention = UserMention | `<@!${Snowflake}>`;

export type MembershipState = keyof typeof MembershipStates;

export type MessageActionRowComponent = MessageButton | MessageSelectMenu;

export type MessageActionRowComponentOptions = MessageButtonOptions | MessageSelectMenuOptions;

export type MessageActionRowComponentResolvable = MessageActionRowComponent | MessageActionRowComponentOptions;

export interface MessageActionRowOptions extends BaseMessageComponentOptions {
  components: MessageActionRowComponentResolvable[];
}

export interface MessageActivity {
  partyId: string;
  type: number;
}

export type MessageAdditions = MessageEmbed | MessageAttachment | (MessageEmbed | MessageAttachment)[];

export interface MessageButtonOptions extends BaseMessageComponentOptions {
  customId?: string;
  disabled?: boolean;
  emoji?: EmojiIdentifierResolvable;
  label?: string;
  style: MessageButtonStyleResolvable;
  url?: string;
}

export type MessageButtonStyle = keyof typeof MessageButtonStyles;

export type MessageButtonStyleResolvable = MessageButtonStyle | MessageButtonStyles;

export interface MessageCollectorOptions extends CollectorOptions<[Message]> {
  max?: number;
  maxProcessed?: number;
}

export type MessageComponent = BaseMessageComponent | MessageActionRow | MessageButton | MessageSelectMenu;

export type MessageComponentCollectorOptions<T extends MessageComponentInteraction> = Omit<
  InteractionCollectorOptions<T>,
  'channel' | 'message' | 'guild' | 'interactionType'
>;

export type MessageComponentOptions =
  | BaseMessageComponentOptions
  | MessageActionRowOptions
  | MessageButtonOptions
  | MessageSelectMenuOptions;

export type MessageComponentType = keyof typeof MessageComponentTypes;

export type MessageComponentTypeResolvable = MessageComponentType | MessageComponentTypes;

export interface MessageEditOptions {
  attachments?: MessageAttachment[];
  content?: string | null;
  embeds?: (MessageEmbed | MessageEmbedOptions)[] | null;
  files?: (FileOptions | BufferResolvable | Stream | MessageAttachment)[];
  flags?: BitFieldResolvable<MessageFlagsString, number>;
  allowedMentions?: MessageMentionOptions;
  components?: (MessageActionRow | MessageActionRowOptions)[];
}

export interface MessageEmbedAuthor {
  name?: string;
  url?: string;
  iconURL?: string;
  proxyIconURL?: string;
}

export interface MessageEmbedFooter {
  text?: string;
  iconURL?: string;
  proxyIconURL?: string;
}

export interface MessageEmbedImage {
  url: string;
  proxyURL?: string;
  height?: number;
  width?: number;
}

export interface MessageEmbedOptions {
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

export interface MessageEmbedProvider {
  name: string;
  url: string;
}

export interface MessageEmbedThumbnail {
  url: string;
  proxyURL?: string;
  height?: number;
  width?: number;
}

export interface MessageEmbedVideo {
  url?: string;
  proxyURL?: string;
  height?: number;
  width?: number;
}

export interface MessageEvent {
  data: WebSocket.Data;
  type: string;
  target: WebSocket;
}

export type MessageFlagsString =
  | 'CROSSPOSTED'
  | 'IS_CROSSPOST'
  | 'SUPPRESS_EMBEDS'
  | 'SOURCE_MESSAGE_DELETED'
  | 'URGENT'
  | 'HAS_THREAD'
  | 'EPHEMERAL'
  | 'LOADING';

export interface MessageInteraction {
  id: Snowflake;
  type: InteractionType;
  commandName: string;
  user: User;
}

export interface MessageMentionsHasOptions {
  ignoreDirect?: boolean;
  ignoreRoles?: boolean;
  ignoreEveryone?: boolean;
}

export interface MessageMentionOptions {
  parse?: MessageMentionTypes[];
  roles?: Snowflake[];
  users?: Snowflake[];
  repliedUser?: boolean;
}

export type MessageMentionTypes = 'roles' | 'users' | 'everyone';

export interface MessageOptions {
  tts?: boolean;
  nonce?: string | number;
  content?: string | null;
  embeds?: (MessageEmbed | MessageEmbedOptions)[];
  components?: (MessageActionRow | MessageActionRowOptions)[];
  allowedMentions?: MessageMentionOptions;
  files?: (FileOptions | BufferResolvable | Stream | MessageAttachment)[];
  reply?: ReplyOptions;
}

export type MessageReactionResolvable =
  | MessageReaction
  | Snowflake
  | `${string}:${Snowflake}`
  | `<:${string}:${Snowflake}>`
  | `<a:${string}:${Snowflake}>`
  | string;

export interface MessageReference {
  channelId: Snowflake;
  guildId: Snowflake;
  messageId: Snowflake | null;
}

export type MessageResolvable = Message | Snowflake;

export interface MessageSelectMenuOptions extends BaseMessageComponentOptions {
  customId?: string;
  disabled?: boolean;
  maxValues?: number;
  minValues?: number;
  options?: MessageSelectOptionData[];
  placeholder?: string;
}

export interface MessageSelectOption {
  default: boolean;
  description: string | null;
  emoji: APIPartialEmoji | null;
  label: string;
  value: string;
}

export interface MessageSelectOptionData {
  default?: boolean;
  description?: string;
  emoji?: EmojiIdentifierResolvable;
  label: string;
  value: string;
}

export type MessageTarget =
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

export type MessageType =
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

export type MFALevel = keyof typeof MFALevels;

export interface MultipleShardRespawnOptions {
  shardDelay?: number;
  respawnDelay?: number;
  timeout?: number;
}

export interface MultipleShardSpawnOptions {
  amount?: number | 'auto';
  delay?: number;
  timeout?: number;
}

export type NSFWLevel = keyof typeof NSFWLevels;

export interface OverwriteData {
  allow?: PermissionResolvable;
  deny?: PermissionResolvable;
  id: GuildMemberResolvable | RoleResolvable;
  type?: OverwriteType;
}

export type OverwriteResolvable = PermissionOverwrites | OverwriteData;

export type OverwriteType = 'member' | 'role';

export type PermissionFlags = Record<PermissionString, bigint>;

export type PermissionOverwriteOptions = Partial<Record<PermissionString, boolean | null>>;

export type PermissionResolvable = BitFieldResolvable<PermissionString, bigint>;

export type PermissionOverwriteResolvable = UserResolvable | RoleResolvable | PermissionOverwrites;

export type PermissionString =
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

export type RecursiveArray<T> = ReadonlyArray<T | RecursiveArray<T>>;

export type RecursiveReadonlyArray<T> = ReadonlyArray<T | RecursiveReadonlyArray<T>>;

export type PremiumTier = keyof typeof PremiumTiers;

export interface PresenceData {
  status?: PresenceStatusData;
  afk?: boolean;
  activities?: ActivitiesOptions[];
  shardId?: number | number[];
}

export type PresenceResolvable = Presence | UserResolvable | Snowflake;

export interface PartialChannelData {
  id?: Snowflake | number;
  name: string;
  topic?: string;
  type?: ChannelTypes;
  parentId?: Snowflake | number;
  permissionOverwrites?: PartialOverwriteData[];
}

export type Partialize<
  T extends AllowedPartial,
  N extends keyof T | null = null,
  M extends keyof T | null = null,
  E extends keyof T | '' = '',
> = {
  readonly client: Client;
  id: Snowflake;
  partial: true;
} & {
  [K in keyof Omit<T, 'client' | 'id' | 'partial' | E>]: K extends N ? null : K extends M ? T[K] | null : T[K];
};

export interface PartialDMChannel extends Partialize<DMChannel, null, null, 'lastMessageId'> {
  lastMessageId: undefined;
}

export interface PartialGuildMember extends Partialize<GuildMember, 'joinedAt' | 'joinedTimestamp', 'user'> {}

export interface PartialMessage
  extends Partialize<Message, 'type' | 'system' | 'pinned' | 'tts', 'content' | 'cleanContent' | 'author'> {}

export interface PartialMessageReaction extends Partialize<MessageReaction, 'count'> {}

export interface PartialOverwriteData {
  id: Snowflake | number;
  type?: OverwriteType;
  allow?: PermissionResolvable;
  deny?: PermissionResolvable;
}

export interface PartialRoleData extends RoleData {
  id?: Snowflake | number;
}

export type PartialTypes = 'USER' | 'CHANNEL' | 'GUILD_MEMBER' | 'MESSAGE' | 'REACTION';

export interface PartialUser extends Partialize<User, 'username' | 'tag' | 'discriminator'> {}

export type PresenceStatusData = ClientPresenceStatus | 'invisible';

export type PresenceStatus = PresenceStatusData | 'offline';

export type PrivacyLevel = keyof typeof PrivacyLevels;

export interface RateLimitData {
  timeout: number;
  limit: number;
  method: string;
  path: string;
  route: string;
  global: boolean;
}

export interface InvalidRequestWarningData {
  count: number;
  remainingTime: number;
}

export interface ReactionCollectorOptions extends CollectorOptions<[MessageReaction, User]> {
  max?: number;
  maxEmojis?: number;
  maxUsers?: number;
}

export interface ReplyOptions {
  messageReference: MessageResolvable;
  failIfNotExists?: boolean;
}

export interface ReplyMessageOptions extends Omit<MessageOptions, 'reply'> {
  failIfNotExists?: boolean;
}

export interface ResolvedOverwriteOptions {
  allow: Permissions;
  deny: Permissions;
}

export interface RoleData {
  name?: string;
  color?: ColorResolvable;
  hoist?: boolean;
  position?: number;
  permissions?: PermissionResolvable;
  mentionable?: boolean;
}

export type RoleMention = '@everyone' | `<@&${Snowflake}>`;

export interface RolePosition {
  role: RoleResolvable;
  position: number;
}

export type RoleResolvable = Role | Snowflake;

export interface RoleTagData {
  botId?: Snowflake;
  integrationId?: Snowflake;
  premiumSubscriberRole?: true;
}

export interface SetChannelPositionOptions {
  relative?: boolean;
  reason?: string;
}

export interface SetParentOptions {
  lockPermissions?: boolean;
  reason?: string;
}

export interface SetRolePositionOptions {
  relative?: boolean;
  reason?: string;
}

export type ShardingManagerMode = 'process' | 'worker';

export interface ShardingManagerOptions {
  totalShards?: number | 'auto';
  shardList?: number[] | 'auto';
  mode?: ShardingManagerMode;
  respawn?: boolean;
  shardArgs?: string[];
  token?: string;
  execArgv?: string[];
}

export { Snowflake };

export interface SplitOptions {
  maxLength?: number;
  char?: string | string[] | RegExp | RegExp[];
  prepend?: string;
  append?: string;
}

export interface StaticImageURLOptions {
  format?: AllowedImageFormat;
  size?: ImageSize;
}

export type StageInstanceResolvable = StageInstance | Snowflake;

export type Status = number;

export type StickerFormatType = keyof typeof StickerFormatTypes;

export type SystemChannelFlagsString =
  | 'SUPPRESS_JOIN_NOTIFICATIONS'
  | 'SUPPRESS_PREMIUM_SUBSCRIPTIONS'
  | 'SUPPRESS_GUILD_REMINDER_NOTIFICATIONS';

export type SystemChannelFlagsResolvable = BitFieldResolvable<SystemChannelFlagsString, number>;

export type SystemMessageType = Exclude<MessageType, 'DEFAULT' | 'REPLY' | 'APPLICATION_COMMAND'>;

export interface TypingData {
  user: User | PartialUser;
  since: Date;
  lastTimestamp: Date;
  elapsedTime: number;
  timeout: NodeJS.Timeout;
}

export interface StageInstanceEditOptions {
  topic?: string;
  privacyLevel?: PrivacyLevel | number;
}

export type TextBasedChannelTypes =
  | 'DM'
  | 'GUILD_TEXT'
  | 'GUILD_NEWS'
  | 'GUILD_NEWS_THREAD'
  | 'GUILD_PUBLIC_THREAD'
  | 'GUILD_PRIVATE_THREAD';

export type ThreadAutoArchiveDuration = 60 | 1440 | 4320 | 10080;

export type ThreadChannelResolvable = ThreadChannel | Snowflake;

export type ThreadChannelTypes = 'GUILD_NEWS_THREAD' | 'GUILD_PUBLIC_THREAD' | 'GUILD_PRIVATE_THREAD';

export interface ThreadCreateOptions<AllowedThreadType> {
  name: string;
  autoArchiveDuration: ThreadAutoArchiveDuration;
  startMessage?: MessageResolvable;
  type?: AllowedThreadType;
  reason?: string;
}

export interface ThreadEditData {
  name?: string;
  archived?: boolean;
  autoArchiveDuration?: ThreadAutoArchiveDuration;
  rateLimitPerUser?: number;
  locked?: boolean;
}

export type ThreadMemberFlagsString = '';

export type ThreadMemberResolvable = ThreadMember | UserResolvable;

export type UserFlagsString =
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

export type UserMention = `<@${Snowflake}>`;

export type UserResolvable = User | Snowflake | Message | GuildMember | ThreadMember;

export interface Vanity {
  code: string | null;
  uses: number | null;
}

export type VerificationLevel = keyof typeof VerificationLevels;

export type VoiceBasedChannelTypes = 'GUILD_VOICE' | 'GUILD_STAGE_VOICE';

export type WebhookClientOptions = Pick<
  ClientOptions,
  'allowedMentions' | 'restTimeOffset' | 'restRequestTimeout' | 'retryLimit' | 'http'
>;

export interface WebhookEditData {
  name?: string;
  avatar?: BufferResolvable;
  channel?: ChannelResolvable;
}

export type WebhookEditMessageOptions = Pick<
  WebhookMessageOptions,
  'content' | 'embeds' | 'files' | 'allowedMentions' | 'components'
>;

export interface WebhookMessageOptions extends Omit<MessageOptions, 'reply'> {
  username?: string;
  avatarURL?: string;
  threadId?: Snowflake;
}

export type WebhookType = keyof typeof WebhookTypes;

export interface WebSocketOptions {
  large_threshold?: number;
  compress?: boolean;
  properties?: WebSocketProperties;
}

export interface WebSocketProperties {
  $os?: string;
  $browser?: string;
  $device?: string;
}

export interface WidgetActivity {
  name: string;
}

export interface WidgetChannel {
  id: Snowflake;
  name: string;
  position: number;
}

export interface WelcomeChannelData {
  description: string;
  channel: GuildChannelResolvable;
  emoji?: EmojiIdentifierResolvable;
}

export interface WelcomeScreenEditData {
  enabled?: boolean;
  description?: string;
  welcomeChannels?: WelcomeChannelData[];
}

export type WSEventType =
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

export type Serialized<T> = T extends symbol | bigint | (() => any)
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

//#region Voice

/**
 * @internal Use `DiscordGatewayAdapterLibraryMethods` from `@discordjs/voice` instead.
 */
export interface InternalDiscordGatewayAdapterLibraryMethods {
  onVoiceServerUpdate(data: GatewayVoiceServerUpdateDispatchData): void;
  onVoiceStateUpdate(data: GatewayVoiceStateUpdateDispatchData): void;
  destroy(): void;
}

/**
 * @internal Use `DiscordGatewayAdapterImplementerMethods` from `@discordjs/voice` instead.
 */
export interface InternalDiscordGatewayAdapterImplementerMethods {
  sendPayload(payload: unknown): boolean;
  destroy(): void;
}

/**
 * @internal Use `DiscordGatewayAdapterCreator` from `@discordjs/voice` instead.
 */
export type InternalDiscordGatewayAdapterCreator = (
  methods: InternalDiscordGatewayAdapterLibraryMethods,
) => InternalDiscordGatewayAdapterImplementerMethods;

//#endregion
