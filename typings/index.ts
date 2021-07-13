import {
  ApplicationCommand,
  ApplicationCommandData,
  ApplicationCommandManager,
  ApplicationCommandResolvable,
  CategoryChannel,
  Client,
  Collection,
  Constants,
  DMChannel,
  GuildApplicationCommandManager,
  GuildChannelManager,
  GuildEmoji,
  GuildEmojiManager,
  GuildMember,
  GuildResolvable,
  Intents,
  Interaction,
  Message,
  MessageActionRow,
  MessageAttachment,
  MessageButton,
  MessageCollector,
  MessageEmbed,
  MessageReaction,
  NewsChannel,
  Options,
  PartialTextBasedChannelFields,
  Permissions,
  ReactionCollector,
  Role,
  RoleManager,
  Serialized,
  ShardClientUtil,
  ShardingManager,
  Snowflake,
  StageChannel,
  StoreChannel,
  TextBasedChannelFields,
  TextChannel,
  ThreadChannel,
  User,
  VoiceChannel,
} from '..';

const client: Client = new Client({
  intents: Intents.FLAGS.GUILDS,
  makeCache: Options.cacheWithLimits({
    MessageManager: 200,
  }),
});

const testGuildId = '222078108977594368'; // DJS
const testUserId = '987654321098765432'; // example id
const globalCommandId = '123456789012345678'; // example id
const guildCommandId = '234567890123456789'; // example id

client.on('ready', async () => {
  console.log(`Client is logged in as ${client.user!.tag} and ready!`);

  // Test command manager methods
  const globalCommand = await client.application?.commands.fetch(globalCommandId);
  const guildCommandFromGlobal = await client.application?.commands.fetch(guildCommandId, { guildId: testGuildId });
  const guildCommandFromGuild = await client.guilds.cache.get(testGuildId)?.commands.fetch(guildCommandId);

  // @ts-expect-error
  await client.guilds.cache.get(testGuildId)?.commands.fetch(guildCommandId, { guildId: testGuildId });

  // Test command permissions
  const globalPermissionsManager = client.application?.commands.permissions;
  const guildPermissionsManager = client.guilds.cache.get(testGuildId)?.commands.permissions;
  const originalPermissions = await client.application?.commands.permissions.fetch({ guild: testGuildId });

  // Permissions from global manager
  await globalPermissionsManager?.add({
    command: globalCommandId,
    guild: testGuildId,
    permissions: [{ type: 'ROLE', id: testGuildId, permission: true }],
  });
  await globalPermissionsManager?.has({ command: globalCommandId, guild: testGuildId, permissionId: testGuildId });
  await globalPermissionsManager?.fetch({ guild: testGuildId });
  await globalPermissionsManager?.fetch({ command: globalCommandId, guild: testGuildId });
  await globalPermissionsManager?.remove({ command: globalCommandId, guild: testGuildId, roles: [testGuildId] });
  await globalPermissionsManager?.remove({ command: globalCommandId, guild: testGuildId, users: [testUserId] });
  await globalPermissionsManager?.remove({
    command: globalCommandId,
    guild: testGuildId,
    roles: [testGuildId],
    users: [testUserId],
  });
  await globalPermissionsManager?.set({
    command: globalCommandId,
    guild: testGuildId,
    permissions: [{ type: 'ROLE', id: testGuildId, permission: true }],
  });
  await globalPermissionsManager?.set({
    guild: testGuildId,
    fullPermissions: [{ id: globalCommandId, permissions: [{ type: 'ROLE', id: testGuildId, permission: true }] }],
  });

  // @ts-expect-error
  await globalPermissionsManager?.add({
    command: globalCommandId,
    permissions: [{ type: 'ROLE', id: testGuildId, permission: true }],
  });
  // @ts-expect-error
  await globalPermissionsManager?.has({ command: globalCommandId, permissionId: testGuildId });
  // @ts-expect-error
  await globalPermissionsManager?.fetch();
  // @ts-expect-error
  await globalPermissionsManager?.fetch({ command: globalCommandId });
  // @ts-expect-error
  await globalPermissionsManager?.remove({ command: globalCommandId, roles: [testGuildId] });
  // @ts-expect-error
  await globalPermissionsManager?.remove({ command: globalCommandId, users: [testUserId] });
  // @ts-expect-error
  await globalPermissionsManager?.remove({ command: globalCommandId, roles: [testGuildId], users: [testUserId] });
  // @ts-expect-error
  await globalPermissionsManager?.set({
    command: globalCommandId,
    permissions: [{ type: 'ROLE', id: testGuildId, permission: true }],
  });
  // @ts-expect-error
  await globalPermissionsManager?.set({
    fullPermissions: [{ id: globalCommandId, permissions: [{ type: 'ROLE', id: testGuildId, permission: true }] }],
  });
  // @ts-expect-error
  await globalPermissionsManager?.set({
    command: globalCommandId,
    guild: testGuildId,
    fullPermissions: [{ id: globalCommandId, permissions: [{ type: 'ROLE', id: testGuildId, permission: true }] }],
  });

  // @ts-expect-error
  await globalPermissionsManager?.add({
    guild: testGuildId,
    permissions: [{ type: 'ROLE', id: testGuildId, permission: true }],
  });
  // @ts-expect-error
  await globalPermissionsManager?.has({ guild: testGuildId, permissionId: testGuildId });
  // @ts-expect-error
  await globalPermissionsManager?.remove({ guild: testGuildId, roles: [testGuildId] });
  // @ts-expect-error
  await globalPermissionsManager?.remove({ guild: testGuildId, users: [testUserId] });
  // @ts-expect-error
  await globalPermissionsManager?.remove({ guild: testGuildId, roles: [testGuildId], users: [testUserId] });
  // @ts-expect-error
  await globalPermissionsManager?.set({
    guild: testGuildId,
    permissions: [{ type: 'ROLE', id: testGuildId, permission: true }],
  });

  // Permissions from guild manager
  await guildPermissionsManager?.add({
    command: globalCommandId,
    permissions: [{ type: 'ROLE', id: testGuildId, permission: true }],
  });
  await guildPermissionsManager?.has({ command: globalCommandId, permissionId: testGuildId });
  await guildPermissionsManager?.fetch({});
  await guildPermissionsManager?.fetch({ command: globalCommandId });
  await guildPermissionsManager?.remove({ command: globalCommandId, roles: [testGuildId] });
  await guildPermissionsManager?.remove({ command: globalCommandId, users: [testUserId] });
  await guildPermissionsManager?.remove({ command: globalCommandId, roles: [testGuildId], users: [testUserId] });
  await guildPermissionsManager?.set({
    command: globalCommandId,
    permissions: [{ type: 'ROLE', id: testGuildId, permission: true }],
  });
  await guildPermissionsManager?.set({
    fullPermissions: [{ id: globalCommandId, permissions: [{ type: 'ROLE', id: testGuildId, permission: true }] }],
  });

  await guildPermissionsManager?.add({
    command: globalCommandId,
    // @ts-expect-error
    guild: testGuildId,
    permissions: [{ type: 'ROLE', id: testGuildId, permission: true }],
  });
  // @ts-expect-error
  await guildPermissionsManager?.has({ command: globalCommandId, guild: testGuildId, permissionId: testGuildId });
  // @ts-expect-error
  await guildPermissionsManager?.fetch({ guild: testGuildId });
  // @ts-expect-error
  await guildPermissionsManager?.fetch({ command: globalCommandId, guild: testGuildId });
  // @ts-expect-error
  await guildPermissionsManager?.remove({ command: globalCommandId, guild: testGuildId, roles: [testGuildId] });
  // @ts-expect-error
  await guildPermissionsManager?.remove({ command: globalCommandId, guild: testGuildId, users: [testUserId] });
  await guildPermissionsManager?.remove({
    command: globalCommandId,
    // @ts-expect-error
    guild: testGuildId,
    roles: [testGuildId],
    users: [testUserId],
  });
  // @ts-expect-error
  await guildPermissionsManager?.set({
    command: globalCommandId,
    guild: testGuildId,
    permissions: [{ type: 'ROLE', id: testGuildId, permission: true }],
  });
  await guildPermissionsManager?.set({
    // @ts-expect-error
    guild: testGuildId,
    fullPermissions: [{ id: globalCommandId, permissions: [{ type: 'ROLE', id: testGuildId, permission: true }] }],
  });

  // @ts-expect-error
  await guildPermissionsManager?.add({ permissions: [{ type: 'ROLE', id: testGuildId, permission: true }] });
  // @ts-expect-error
  await guildPermissionsManager?.has({ permissionId: testGuildId });
  // @ts-expect-error
  await guildPermissionsManager?.remove({ roles: [testGuildId] });
  // @ts-expect-error
  await guildPermissionsManager?.remove({ users: [testUserId] });
  // @ts-expect-error
  await guildPermissionsManager?.remove({ roles: [testGuildId], users: [testUserId] });
  // @ts-expect-error
  await guildPermissionsManager?.set({ permissions: [{ type: 'ROLE', id: testGuildId, permission: true }] });
  // @ts-expect-error
  await guildPermissionsManager?.set({
    command: globalCommandId,
    fullPermissions: [{ id: globalCommandId, permissions: [{ type: 'ROLE', id: testGuildId, permission: true }] }],
  });

  // Permissions from cached global ApplicationCommand
  await globalCommand?.permissions.add({
    guild: testGuildId,
    permissions: [{ type: 'ROLE', id: testGuildId, permission: true }],
  });
  await globalCommand?.permissions.has({ guild: testGuildId, permissionId: testGuildId });
  await globalCommand?.permissions.fetch({ guild: testGuildId });
  await globalCommand?.permissions.remove({ guild: testGuildId, roles: [testGuildId] });
  await globalCommand?.permissions.remove({ guild: testGuildId, users: [testUserId] });
  await globalCommand?.permissions.remove({ guild: testGuildId, roles: [testGuildId], users: [testUserId] });
  await globalCommand?.permissions.set({
    guild: testGuildId,
    permissions: [{ type: 'ROLE', id: testGuildId, permission: true }],
  });

  await globalCommand?.permissions.add({
    // @ts-expect-error
    command: globalCommandId,
    guild: testGuildId,
    permissions: [{ type: 'ROLE', id: testGuildId, permission: true }],
  });
  // @ts-expect-error
  await globalCommand?.permissions.has({ command: globalCommandId, guild: testGuildId, permissionId: testGuildId });
  // @ts-expect-error
  await globalCommand?.permissions.fetch({ command: globalCommandId, guild: testGuildId });
  // @ts-expect-error
  await globalCommand?.permissions.remove({ command: globalCommandId, guild: testGuildId, roles: [testGuildId] });
  // @ts-expect-error
  await globalCommand?.permissions.remove({ command: globalCommandId, guild: testGuildId, users: [testUserId] });
  await globalCommand?.permissions.remove({
    // @ts-expect-error
    command: globalCommandId,
    guild: testGuildId,
    roles: [testGuildId],
    users: [testUserId],
  });
  await globalCommand?.permissions.set({
    // @ts-expect-error
    command: globalCommandId,
    guild: testGuildId,
    permissions: [{ type: 'ROLE', id: testGuildId, permission: true }],
  });

  // @ts-expect-error
  await globalCommand?.permissions.add({ permissions: [{ type: 'ROLE', id: testGuildId, permission: true }] });
  // @ts-expect-error
  await globalCommand?.permissions.has({ permissionId: testGuildId });
  // @ts-expect-error
  await globalCommand?.permissions.fetch({});
  // @ts-expect-error
  await globalCommand?.permissions.remove({ roles: [testGuildId] });
  // @ts-expect-error
  await globalCommand?.permissions.remove({ users: [testUserId] });
  // @ts-expect-error
  await globalCommand?.permissions.remove({ roles: [testGuildId], users: [testUserId] });
  // @ts-expect-error
  await globalCommand?.permissions.set({ permissions: [{ type: 'ROLE', id: testGuildId, permission: true }] });

  // Permissions from cached guild ApplicationCommand
  await guildCommandFromGlobal?.permissions.add({ permissions: [{ type: 'ROLE', id: testGuildId, permission: true }] });
  await guildCommandFromGlobal?.permissions.has({ permissionId: testGuildId });
  await guildCommandFromGlobal?.permissions.fetch({});
  await guildCommandFromGlobal?.permissions.remove({ roles: [testGuildId] });
  await guildCommandFromGlobal?.permissions.remove({ users: [testUserId] });
  await guildCommandFromGlobal?.permissions.remove({ roles: [testGuildId], users: [testUserId] });
  await guildCommandFromGlobal?.permissions.set({ permissions: [{ type: 'ROLE', id: testGuildId, permission: true }] });

  await guildCommandFromGlobal?.permissions.add({
    // @ts-expect-error
    command: globalCommandId,
    permissions: [{ type: 'ROLE', id: testGuildId, permission: true }],
  });
  // @ts-expect-error
  await guildCommandFromGlobal?.permissions.has({ command: guildCommandId, permissionId: testGuildId });
  // @ts-expect-error
  await guildCommandFromGlobal?.permissions.remove({ command: guildCommandId, roles: [testGuildId] });
  // @ts-expect-error
  await guildCommandFromGlobal?.permissions.remove({ command: guildCommandId, users: [testUserId] });
  await guildCommandFromGlobal?.permissions.remove({
    // @ts-expect-error
    command: guildCommandId,
    roles: [testGuildId],
    users: [testUserId],
  });
  await guildCommandFromGlobal?.permissions.set({
    // @ts-expect-error
    command: guildCommandId,
    permissions: [{ type: 'ROLE', id: testGuildId, permission: true }],
  });

  await guildCommandFromGlobal?.permissions.add({
    // @ts-expect-error
    guild: testGuildId,
    permissions: [{ type: 'ROLE', id: testGuildId, permission: true }],
  });
  // @ts-expect-error
  await guildCommandFromGlobal?.permissions.has({ guild: testGuildId, permissionId: testGuildId });
  // @ts-expect-error
  await guildCommandFromGlobal?.permissions.remove({ guild: testGuildId, roles: [testGuildId] });
  // @ts-expect-error
  await guildCommandFromGlobal?.permissions.remove({ guild: testGuildId, users: [testUserId] });
  // @ts-expect-error
  await guildCommandFromGlobal?.permissions.remove({ guild: testGuildId, roles: [testGuildId], users: [testUserId] });
  await guildCommandFromGlobal?.permissions.set({
    // @ts-expect-error
    guild: testGuildId,
    permissions: [{ type: 'ROLE', id: testGuildId, permission: true }],
  });

  await guildCommandFromGuild?.permissions.add({ permissions: [{ type: 'ROLE', id: testGuildId, permission: true }] });
  await guildCommandFromGuild?.permissions.has({ permissionId: testGuildId });
  await guildCommandFromGuild?.permissions.fetch({});
  await guildCommandFromGuild?.permissions.remove({ roles: [testGuildId] });
  await guildCommandFromGuild?.permissions.remove({ users: [testUserId] });
  await guildCommandFromGuild?.permissions.remove({ roles: [testGuildId], users: [testUserId] });
  await guildCommandFromGuild?.permissions.set({ permissions: [{ type: 'ROLE', id: testGuildId, permission: true }] });

  await guildCommandFromGuild?.permissions.add({
    // @ts-expect-error
    command: globalCommandId,
    permissions: [{ type: 'ROLE', id: testGuildId, permission: true }],
  });
  // @ts-expect-error
  await guildCommandFromGuild?.permissions.has({ command: guildCommandId, permissionId: testGuildId });
  // @ts-expect-error
  await guildCommandFromGuild?.permissions.remove({ command: guildCommandId, roles: [testGuildId] });
  // @ts-expect-error
  await guildCommandFromGuild?.permissions.remove({ command: guildCommandId, users: [testUserId] });
  await guildCommandFromGuild?.permissions.remove({
    // @ts-expect-error
    command: guildCommandId,
    roles: [testGuildId],
    users: [testUserId],
  });
  await guildCommandFromGuild?.permissions.set({
    // @ts-expect-error
    command: guildCommandId,
    permissions: [{ type: 'ROLE', id: testGuildId, permission: true }],
  });

  await guildCommandFromGuild?.permissions.add({
    // @ts-expect-error
    guild: testGuildId,
    permissions: [{ type: 'ROLE', id: testGuildId, permission: true }],
  });
  // @ts-expect-error
  await guildCommandFromGuild?.permissions.has({ guild: testGuildId, permissionId: testGuildId });
  // @ts-expect-error
  await guildCommandFromGuild?.permissions.remove({ guild: testGuildId, roles: [testGuildId] });
  // @ts-expect-error
  await guildCommandFromGuild?.permissions.remove({ guild: testGuildId, users: [testUserId] });
  // @ts-expect-error
  await guildCommandFromGuild?.permissions.remove({ guild: testGuildId, roles: [testGuildId], users: [testUserId] });
  await guildCommandFromGuild?.permissions.set({
    // @ts-expect-error
    guild: testGuildId,
    permissions: [{ type: 'ROLE', id: testGuildId, permission: true }],
  });

  client.application?.commands.permissions.set({
    guild: testGuildId,
    fullPermissions: originalPermissions?.map((permissions, id) => ({ permissions, id })) ?? [],
  });
});

client.on('guildCreate', g => {
  const channel = g.channels.cache.random();
  if (!channel) return;

  channel.setName('foo').then(updatedChannel => {
    console.log(`New channel name: ${updatedChannel.name}`);
  });
});

client.on('messageReactionRemoveAll', async message => {
  console.log(`messageReactionRemoveAll - id: ${message.id} (${message.id.length})`);

  if (message.partial) message = await message.fetch();

  console.log(`messageReactionRemoveAll - content: ${message.content}`);
});

// This is to check that stuff is the right type
declare const assertIsMessage: (m: Promise<Message>) => void;

client.on('messageCreate', ({ channel }) => {
  assertIsMessage(channel.send('string'));
  assertIsMessage(channel.send({}));
  assertIsMessage(channel.send({ embeds: [] }));

  const attachment = new MessageAttachment('file.png');
  const embed = new MessageEmbed();
  assertIsMessage(channel.send({ files: [attachment] }));
  assertIsMessage(channel.send({ embeds: [embed] }));
  assertIsMessage(channel.send({ embeds: [embed], files: [attachment] }));

  // @ts-expect-error
  channel.send();
  // @ts-expect-error
  channel.send({ another: 'property' });
});

client.on('interaction', async interaction => {
  if (!interaction.isCommand()) return;

  void new MessageActionRow();

  const button = new MessageButton();

  const actionRow = new MessageActionRow({ components: [button] });

  await interaction.reply({ content: 'Hi!', components: [actionRow] });

  // @ts-expect-error
  await interaction.reply({ content: 'Hi!', components: [[button]] });

  // @ts-expect-error
  void new MessageActionRow({});

  // @ts-expect-error
  await interaction.reply({ content: 'Hi!', components: [button] });
});

client.login('absolutely-valid-token');

// Test type transformation:
declare const assertType: <T>(value: T) => asserts value is T;
declare const serialize: <T>(value: T) => Serialized<T>;
declare const notPropertyOf: <T, P extends PropertyKey>(value: T, property: P & Exclude<P, keyof T>) => void;

assertType<undefined>(serialize(undefined));
assertType<null>(serialize(null));
assertType<number[]>(serialize([1, 2, 3]));
assertType<{}>(serialize(new Set([1, 2, 3])));
assertType<{}>(
  serialize(
    new Map([
      [1, '2'],
      [2, '4'],
    ]),
  ),
);
assertType<string>(serialize(new Permissions(Permissions.FLAGS.ATTACH_FILES)));
assertType<number>(serialize(new Intents(Intents.FLAGS.GUILDS)));
assertType<unknown>(
  serialize(
    new Collection([
      [1, '2'],
      [2, '4'],
    ]),
  ),
);
assertType<never>(serialize(Symbol('a')));
assertType<never>(serialize(() => {}));
assertType<never>(serialize(BigInt(42)));

// Test type return of broadcastEval:
declare const shardClientUtil: ShardClientUtil;
declare const shardingManager: ShardingManager;

assertType<Promise<number[]>>(shardingManager.broadcastEval(() => 1));
assertType<Promise<number[]>>(shardClientUtil.broadcastEval(() => 1));
assertType<Promise<number[]>>(shardingManager.broadcastEval(async () => 1));
assertType<Promise<number[]>>(shardClientUtil.broadcastEval(async () => 1));

declare const dmChannel: DMChannel;
declare const threadChannel: ThreadChannel;
declare const newsChannel: NewsChannel;
declare const textChannel: TextChannel;
declare const user: User;
declare const guildMember: GuildMember;

// Test whether the structures implement send
assertType<TextBasedChannelFields['send']>(dmChannel.send);
assertType<TextBasedChannelFields>(threadChannel);
assertType<TextBasedChannelFields>(newsChannel);
assertType<TextBasedChannelFields>(textChannel);
assertType<PartialTextBasedChannelFields>(user);
assertType<PartialTextBasedChannelFields>(guildMember);

assertType<Message | null>(dmChannel.lastMessage);
assertType<Message | null>(threadChannel.lastMessage);
assertType<Message | null>(newsChannel.lastMessage);
assertType<Message | null>(textChannel.lastMessage);

notPropertyOf(user, 'lastMessage');
notPropertyOf(user, 'lastMessageId');
notPropertyOf(guildMember, 'lastMessage');
notPropertyOf(guildMember, 'lastMessageId');

// Test collector event parameters
declare const messageCollector: MessageCollector;
messageCollector.on('collect', (...args) => {
  assertType<[Message]>(args);
});

declare const reactionCollector: ReactionCollector;
reactionCollector.on('dispose', (...args) => {
  assertType<[MessageReaction, User]>(args);
});

// Make sure the properties are typed correctly, and that no backwards properties
// (K -> V and V -> K) exist:
assertType<'messageCreate'>(Constants.Events.MESSAGE_CREATE);
assertType<'close'>(Constants.ShardEvents.CLOSE);
assertType<1>(Constants.Status.CONNECTING);
assertType<0>(Constants.Opcodes.DISPATCH);
assertType<2>(Constants.ClientApplicationAssetTypes.BIG);

declare const applicationCommandData: ApplicationCommandData;
declare const applicationCommandResolvable: ApplicationCommandResolvable;
declare const applicationCommandManager: ApplicationCommandManager;
{
  type ApplicationCommandType = ApplicationCommand<{ guild: GuildResolvable }>;

  assertType<Promise<ApplicationCommandType>>(applicationCommandManager.create(applicationCommandData));
  assertType<Promise<ApplicationCommand>>(applicationCommandManager.create(applicationCommandData, '0'));
  assertType<Promise<ApplicationCommandType>>(
    applicationCommandManager.edit(applicationCommandResolvable, applicationCommandData),
  );
  assertType<Promise<ApplicationCommand>>(
    applicationCommandManager.edit(applicationCommandResolvable, applicationCommandData, '0'),
  );
  assertType<Promise<Collection<Snowflake, ApplicationCommandType>>>(
    applicationCommandManager.set([applicationCommandData]),
  );
  assertType<Promise<Collection<Snowflake, ApplicationCommand>>>(
    applicationCommandManager.set([applicationCommandData], '0'),
  );
}

declare const guildApplicationCommandManager: GuildApplicationCommandManager;
assertType<Promise<Collection<Snowflake, ApplicationCommand>>>(guildApplicationCommandManager.fetch());
assertType<Promise<Collection<Snowflake, ApplicationCommand>>>(guildApplicationCommandManager.fetch(undefined, {}));
assertType<Promise<ApplicationCommand>>(guildApplicationCommandManager.fetch('0'));

declare const guildChannelManager: GuildChannelManager;
{
  type AnyChannel = TextChannel | VoiceChannel | CategoryChannel | NewsChannel | StoreChannel | StageChannel;

  assertType<Promise<VoiceChannel>>(guildChannelManager.create('name', { type: 'GUILD_VOICE' }));
  assertType<Promise<CategoryChannel>>(guildChannelManager.create('name', { type: 'GUILD_CATEGORY' }));
  assertType<Promise<TextChannel>>(guildChannelManager.create('name', { type: 'GUILD_TEXT' }));
  assertType<Promise<NewsChannel>>(guildChannelManager.create('name', { type: 'GUILD_NEWS' }));
  assertType<Promise<StoreChannel>>(guildChannelManager.create('name', { type: 'GUILD_STORE' }));
  assertType<Promise<StageChannel>>(guildChannelManager.create('name', { type: 'GUILD_STAGE_VOICE' }));

  assertType<Promise<Collection<Snowflake, AnyChannel>>>(guildChannelManager.fetch());
  assertType<Promise<Collection<Snowflake, AnyChannel>>>(guildChannelManager.fetch(undefined, {}));
  assertType<Promise<AnyChannel | null>>(guildChannelManager.fetch('0'));
}

declare const roleManager: RoleManager;
assertType<Promise<Collection<Snowflake, Role>>>(roleManager.fetch());
assertType<Promise<Collection<Snowflake, Role>>>(roleManager.fetch(undefined, {}));
assertType<Promise<Role | null>>(roleManager.fetch('0'));

declare const guildEmojiManager: GuildEmojiManager;
assertType<Promise<Collection<Snowflake, GuildEmoji>>>(guildEmojiManager.fetch());
assertType<Promise<Collection<Snowflake, GuildEmoji>>>(guildEmojiManager.fetch(undefined, {}));
assertType<Promise<GuildEmoji | null>>(guildEmojiManager.fetch('0'));

// Test partials structures
client.on('typingStart', (channel, user) => {
  if (channel.partial) assertType<undefined>(channel.lastMessageId);
  if (user.partial) return assertType<null>(user.username);
  assertType<string>(user.username);
});

client.on('guildMemberRemove', member => {
  if (member.partial) return assertType<null>(member.joinedAt);
  assertType<Date | null>(member.joinedAt);
});

client.on('messageReactionAdd', async reaction => {
  if (reaction.partial) {
    assertType<null>(reaction.count);
    reaction = await reaction.fetch();
  }
  assertType<number>(reaction.count);
  if (reaction.message.partial) return assertType<string | null>(reaction.message.content);
  assertType<string>(reaction.message.content);
});

// Test interactions
declare const interaction: Interaction;
if (interaction.inGuild()) assertType<Snowflake>(interaction.guildId);
