/**
 * @file airhorn command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = async (Bastion, message) => {
  if (message.guild.voiceConnection) {
    if (!message.guild.voiceConnection.channel.permissionsFor(message.member).has(this.help.userPermission)) {
      /**
      * User has missing permissions.
      * @fires userMissingPermissions
      */
      return Bastion.emit('userMissingPermissions', this.help.userPermission);
    }

    if (message.guild.voiceConnection.speaking) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return Bastion.emit('error', string('busy', 'errors'), string('isSpeaking', 'errorMessage'), message.channel);
    }

    if (!message.guild.voiceConnection.channel.speakable) {
      /**
      * Bastion has missing permissions.
      * @fires bastionMissingPermissions
      */
      return Bastion.emit('bastionMissingPermissions', 'SPEAK', message);
    }

    message.guild.voiceConnection.playFile('./data/airhorn.wav', { passes: 1 });
  }
  else if (message.member.voiceChannel) {
    if (!message.member.voiceChannel.permissionsFor(message.member).has(this.help.userPermission)) {
      /**
      * User has missing permissions.
      * @fires userMissingPermissions
      */
      return Bastion.emit('userMissingPermissions', this.help.userPermission);
    }

    if (!message.member.voiceChannel.joinable) {
      /**
      * Bastion has missing permissions.
      * @fires bastionMissingPermissions
      */
      return Bastion.emit('bastionMissingPermissions', 'CONNECT', message);
    }

    if (!message.member.voiceChannel.speakable) {
      /**
      * Bastion has missing permissions.
      * @fires bastionMissingPermissions
      */
      return Bastion.emit('bastionMissingPermissions', 'SPEAK', message);
    }

    try {
      let connection = await message.member.voiceChannel.join();
      const dispatcher = connection.playFile('./data/airhorn.wav', { passes: 1 });

      dispatcher.on('error', error => {
        Bastion.log.error(error);
      });

      dispatcher.on('end', () => {
        connection.channel.leave();
      });
    }
    catch (e) {
      Bastion.log.error(e);
    }
  }
  else {
    /**
    * Error condition is encountered.
    * @fires error
    */
    return Bastion.emit('error', '', string('eitherOneInVC', 'errorMessage'), message.channel);
  }
};

exports.config = {
  aliases: [ 'horn' ],
  enabled: true
};

exports.help = {
  name: 'airhorn',
  description: string('airhorn', 'commandDescription'),
  botPermission: '',
  userPermission: 'MUTE_MEMBERS',
  usage: 'airhorn',
  example: []
};