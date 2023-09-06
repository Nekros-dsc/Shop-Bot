const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-suggestion')
        .setDescription('Define the channel of vouchs.')
        .addChannelOption(option =>
            option.setName('channel').setDescription('The channel where suggestions should be saved.').setRequired(true)),
    async execute(interaction, config) {
        const suggestionChannel = interaction.options.getChannel('channel');

        try {
            const embed = new Discord.EmbedBuilder()
            .setTitle('\`🕷️\`〃Suggestion System')
            .setDescription(`> *Suggestion system successfully implemented in this channel.*`)
            .setColor(config.color)
            .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
            .setTimestamp();
          await suggestionChannel.send({ embeds: [embed] })

          const embed2 = new Discord.EmbedBuilder()
          .setTitle('\`✅\`〃Suggestion system successfully')
          .setDescription(`> *Suggestion system successfully implemented in channel ${suggestionChannel} (\`${suggestionChannel.id}\`)*`)
          .setColor(config.color)
          .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
          .setTimestamp();
          await interaction.reply({ embeds: [embed2], ephemeral: true });

          config.suggestionlogs = suggestionChannel.id;
          fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));
          
        } catch (e) {
            const embed = new Discord.EmbedBuilder()
            .setDescription(`\`❌\`〃*An error occurred while suggestion system. Please verify that this is a valid channel text.*`)
            .setColor(config.color)
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
};