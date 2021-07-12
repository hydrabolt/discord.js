'use strict';

const Base = require('./Base');
const VoiceState = require('./VoiceState');
const TextBasedChannel = require('./interfaces/TextBasedChannel');
const { Error } = require('../errors');
const GuildMemberRoleManager = require('../managers/GuildMemberRoleManager');
const Permissions = require('../util/Permissions');

/**
 * Represents a member of a guild on Discord.
 * @implements {TextBasedChannel}
 * @extends {Base}
 */
class GuildMember extends Base {
  /**
   * @param {Client} client The instantiating client
   * @param {APIGuildMember} data The data for the guild member
   * @param {Guild} guild The guild the member is part of
   */
  constructor(client, data, guild) {
    super(client);

    /**
     * The guild that this member is part of
     * @type {Guild}
     */
    this.guild = guild;

    /**
     * The timestamp the member joined the guild at
     * @type {?number}
     */
    this.joinedTimestamp = null;

    /**
     * The timestamp of when the member used their Nitro boost on the guild, if it was used
     * @type {?number}
     */
    this.premiumSinceTimestamp = null;

    /**
     * Whether the member has been removed from the guild
     * @type {boolean}
     */
    this.deleted = false;

    /**
     * The nickname of this member, if they have one
     * @type {?string}
     */
    this.nickname = null;

    /**
     * Whether this member has yet to pass the guild's membership gate
     * @type {boolean}
     */
    this.pending = false;

    this._roles = [];
    if (data) this._patch(data);
  }

  _patch(data) {
    if ('user' in data) {
      /**
       * The user that this guild member instance represents
       * @type {?User}
       */
      this.user = this.client.users._add(data.user, true);
    }

    if ('nick' in data) this.nickname = data.nick;
    if ('avatar' in data) {
      /**
       * The guild member's avatar hash
       * @type {?string}
       */
      this.avatar = data.avatar;
    } else if (typeof this.avatar !== 'string') {
      this.avatar = null;
    }
    if ('joined_at' in data) this.joinedTimestamp = new Date(data.joined_at).getTime();
    if ('premium_since' in data) {
      this.premiumSinceTimestamp = data.premium_since ? new Date(data.premium_since).getTime() : null;
    }
    if ('roles' in data) this._roles = data.roles;
    this.pending = data.pending ?? false;
  }

  _clone() {
    const clone = super._clone();
    clone._roles = this._roles.slice();
    return clone;
  }

  /**
   * Whether this GuildMember is a partial
   * @type {boolean}
   * @readonly
   */
  get partial() {
    return !this.joinedTimestamp;
  }

  /**
   * A manager for the roles belonging to this member
   * @type {GuildMemberRoleManager}
   * @readonly
   */
  get roles() {
    return new GuildMemberRoleManager(this);
  }

  /**
   * The voice state of this member
   * @type {VoiceState}
   * @readonly
   */
  get voice() {
    return this.guild.voiceStates.cache.get(this.id) ?? new VoiceState(this.guild, { user_id: this.id });
  }

  /**
   * A link to the member's guild avatar.
   * @param {ImageURLOptions} [options={}] Options for the Image URL
   * @returns {?string}
   */
  avatarURL({ format, size, dynamic } = {}) {
    if (!this.avatar) return null;
    return this.client.rest.cdn.GuildMemberAvatar(this.guild.id, this.id, this.avatar, format, size, dynamic);
  }

  /**
   * A link to the member's guild avatar if they have one.
   * Otherwise, a link to their {@link User#displayAvatarURL} will be returned.
   * @param {ImageURLOptions} [options={}] Options for the Image URL
   * @returns {string}
   */
  displayAvatarURL(options) {
    return this.avatarURL(options) || this.user.displayAvatarURL(options);
  }

  /**
   * The time this member joined the guild
   * @type {?Date}
   * @readonly
   */
  get joinedAt() {
    return this.joinedTimestamp ? new Date(this.joinedTimestamp) : null;
  }

  /**
   * The time of when the member used their Nitro boost on the guild, if it was used
   * @type {?Date}
   * @readonly
   */
  get premiumSince() {
    return this.premiumSinceTimestamp ? new Date(this.premiumSinceTimestamp) : null;
  }

  /**
   * The presence of this guild member
   * @type {?Presence}
   * @readonly
   */
  get presence() {
    return this.guild.presences.resolve(this.id);
  }

  /**
   * The displayed color of this member in base 10
   * @type {number}
   * @readonly
   */
  get displayColor() {
    return this.roles.color?.color ?? 0;
  }

  /**
   * The displayed color of this member in hexadecimal
   * @type {string}
   * @readonly
   */
  get displayHexColor() {
    return this.roles.color?.hexColor ?? '#000000';
  }

  /**
   * The member's id
   * @type {Snowflake}
   * @readonly
   */
  get id() {
    return this.user.id;
  }

  /**
   * The nickname of this member, or their username if they don't have one
   * @type {?string}
   * @readonly
   */
  get displayName() {
    return this.nickname ?? this.user.username;
  }

  /**
   * The overall set of permissions for this member, taking only roles and owner status into account
   * @type {Readonly<Permissions>}
   * @readonly
   */
  get permissions() {
    if (this.user.id === this.guild.ownerId) return new Permissions(Permissions.ALL).freeze();
    return new Permissions(this.roles.cache.map(role => role.permissions)).freeze();
  }

  /**
   * Whether the client user is above this user in the hierarchy, according to role position and guild ownership.
   * This is a prerequisite for many moderative actions.
   * @type {boolean}
   * @readonly
   */
  get manageable() {
    if (this.user.id === this.guild.ownerId) return false;
    if (this.user.id === this.client.user.id) return false;
    if (this.client.user.id === this.guild.ownerId) return true;
    if (!this.guild.me) throw new Error('GUILD_UNCACHED_ME');
    return this.guild.me.roles.highest.comparePositionTo(this.roles.highest) > 0;
  }

  /**
   * Whether this member is kickable by the client user
   * @type {boolean}
   * @readonly
   */
  get kickable() {
    return this.manageable && this.guild.me.permissions.has(Permissions.FLAGS.KICK_MEMBERS);
  }

  /**
   * Whether this member is bannable by the client user
   * @type {boolean}
   * @readonly
   */
  get bannable() {
    return this.manageable && this.guild.me.permissions.has(Permissions.FLAGS.BAN_MEMBERS);
  }

  /**
   * Returns `channel.permissionsFor(guildMember)`. Returns permissions for a member in a guild channel,
   * taking into account roles and permission overwrites.
   * @param {GuildChannelResolvable} channel The guild channel to use as context
   * @returns {Readonly<Permissions>}
   */
  permissionsIn(channel) {
    channel = this.guild.channels.resolve(channel);
    if (!channel) throw new Error('GUILD_CHANNEL_RESOLVE');
    return channel.permissionsFor(this);
  }

  /**
   * The data for editing a guild member.
   * @typedef {Object} GuildMemberEditData
   * @property {?string} [nick] The nickname to set for the member
   * @property {Collection<Snowflake, Role>|RoleResolvable[]} [roles] The roles or role ids to apply
   * @property {boolean} [mute] Whether or not the member should be muted
   * @property {boolean} [deaf] Whether or not the member should be deafened
   * @property {ChannelResolvable|null} [channel] Channel to move member to (if they are connected to voice), or `null`
   * if you want to kick them from voice
   */

  /**
   * Edits this member.
   * @param {GuildMemberEditData} data The data to edit the member with
   * @param {string} [reason] Reason for editing this user
   * @returns {Promise<GuildMember>}
   */
  edit(data, reason) {
    return this.guild.members.edit(this, data, reason);
  }

  /**
   * Sets the nickname for this member.
   * @param {?string} nick The nickname for the guild member, or `null` if you want to reset their nickname
   * @param {string} [reason] Reason for setting the nickname
   * @returns {Promise<GuildMember>}
   */
  setNickname(nick, reason) {
    return this.edit({ nick }, reason);
  }

  /**
   * Creates a DM channel between the client and this member.
   * @returns {Promise<DMChannel>}
   */
  createDM() {
    return this.user.createDM();
  }

  /**
   * Deletes any DMs with this member.
   * @returns {Promise<DMChannel>}
   */
  deleteDM() {
    return this.user.deleteDM();
  }

  /**
   * Kicks this member from the guild.
   * @param {string} [reason] Reason for kicking user
   * @returns {Promise<GuildMember>}
   */
  kick(reason) {
    return this.guild.members.kick(this, reason);
  }

  /**
   * Bans this guild member.
   * @param {BanOptions} [options] Options for the ban
   * @returns {Promise<GuildMember>}
   * @example
   * // ban a guild member
   * guildMember.ban({ days: 7, reason: 'They deserved it' })
   *   .then(console.log)
   *   .catch(console.error);
   */
  ban(options) {
    return this.guild.members.ban(this, options);
  }

  /**
   * Fetches this GuildMember.
   * @param {boolean} [force=false] Whether to skip the cache check and request the API
   * @returns {Promise<GuildMember>}
   */
  fetch(force = false) {
    return this.guild.members.fetch({ user: this.id, cache: true, force });
  }

  /**
   * Whether this guild member equals another guild member. It compares all properties, so for most
   * comparison it is advisable to just compare `member.id === member2.id` as it is significantly faster
   * and is often what most users need.
   * @param {GuildMember} member The member to compare with
   * @returns {boolean}
   */
  equals(member) {
    return (
      member instanceof this.constructor &&
      this.id === member.id &&
      this.partial === member.partial &&
      this.guild.id === member.guild.id &&
      this.joinedTimestamp === member.joinedTimestamp &&
      this.nickname === member.nickname &&
      this.avatar === member.avatar &&
      this.pending === member.pending &&
      (this._roles === member._roles ||
        (this._roles.length === member._roles.length && this._roles.every((role, i) => role === member._roles[i])))
    );
  }

  /**
   * When concatenated with a string, this automatically returns the user's mention instead of the GuildMember object.
   * @returns {string}
   * @example
   * // Logs: Hello from <@123456789012345678>!
   * console.log(`Hello from ${member}!`);
   */
  toString() {
    return `<@${this.nickname ? '!' : ''}${this.user.id}>`;
  }

  toJSON() {
    const json = super.toJSON({
      guild: 'guildId',
      user: 'userId',
      displayName: true,
      roles: true,
    });
    json.avatarURL = this.avatarURL();
    json.displayAvatarURL = this.displayAvatarURL();
    return json;
  }

  // These are here only for documentation purposes - they are implemented by TextBasedChannel
  /* eslint-disable no-empty-function */
  send() {}
}

TextBasedChannel.applyToClass(GuildMember);

module.exports = GuildMember;

/**
 * @external APIGuildMember
 * @see {@link https://discord.com/developers/docs/resources/guild#guild-member-object}
 */
