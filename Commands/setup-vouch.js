const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-vouch')
        .setDescription('Define the channel of vouchs.')
        .addChannelOption(option => option.setName('channel').setDescription('The channel where vouchs should be saved').setRequired(true)),
    async execute(interaction, config) {
        const vouchChannel = interaction.options.getChannel('channel');

        try {
            const embed = new Discord.EmbedBuilder()
            .setTitle('\`🕷️\`〃Vouch System')
            .setDescription(`> *Vouch system successfully implemented in this channel.*`)
            .setColor(config.color)
            .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
            .setTimestamp();
          await vouchChannel.send({ embeds: [embed] })

          const embed2 = new Discord.EmbedBuilder()
          .setTitle('\`✅\`〃Vouch system successfully')
          .setDescription(`> *Vouch system successfully implemented in channel ${vouchChannel} (\`${vouchChannel.id}\`)*`)
          .setColor(config.color)
          .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
          .setTimestamp();
          await interaction.reply({ embeds: [embed2], ephemeral: true });
          
          config.vouchlogs = vouchChannel.id;
          fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));

        } catch (e) {
            const embed = new Discord.EmbedBuilder()
            .setDescription(`\`❌\`〃*An error occurred while vouch system. Please verify that this is a valid channel text.*`)
            .setColor(config.color)
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
};