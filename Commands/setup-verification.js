const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const db = require('quick.db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-verification')
        .setDescription('Setup verification system.')
        .addChannelOption(option => option.setName('channel').setDescription('Channel for verification').setRequired(true))
        .addRoleOption(option => option.setName('role').setDescription('Role to be assigned after verification').setRequired(true)),
    async execute(interaction, config) {

        const channel = interaction.options.getChannel('channel');
        const role = interaction.options.getRole('role');
try{
        const embed = new Discord.EmbedBuilder()
            .setTitle('\`🕷️\`〃Verification System')
            .setDescription(`> *This server asks you to verify yourself, please run the command \`/verify\` to get the role* ${role} (\`${role.id}\`).`)
            .setColor(config.color)
            .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
            .setTimestamp();
          await channel.send({ embeds: [embed] })

          db.set('verificationChannel', channel.id);
          db.set('verificationRole', role.id);

        } catch (e) {
            const embed = new Discord.EmbedBuilder()
            .setDescription(`\`❌\`〃*An error occurred while verification system. Please verify that this is a valid channel text.*`)
            .setColor(config.color)
            await interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }

        const embed = new Discord.EmbedBuilder()
            .setTitle('\`✅\`〃Verification system successfully')
            .setDescription(`> *Verification system successfully implemented in channel ${channel} (\`${channel.id}\`) with role ${role} (\`${role.id}\`)*`)
            .setColor(config.color)
            .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
            .setTimestamp();
            await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};