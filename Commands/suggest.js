const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const db = require('quick.db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggest')
        .setDescription('Submit a suggestion.')
        .addStringOption(option => option.setName('suggestion').setDescription('Your suggestion').setRequired(true)),
    async execute(interaction, config) {
        const suggestion = interaction.options.getString('suggestion');

        db.push('suggestions', suggestion);

        const ownersList = config.owner.map(ownerId => {
            const owner = interaction.guild.members.cache.get(ownerId);
            return owner ? `${owner.user} (**\`${ownerId}\`**)` : ownerId;
          });

        const suggestionEmbed = new Discord.EmbedBuilder()
            .setTitle(`\`🕷️\`〃Suggestion given by ${interaction.user.tag}`)
            .setDescription(`\`\`\`${suggestion}\`\`\``)
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, size: 1024 }))
            .setColor(config.color)
            .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
            .setTimestamp();
            
            const suggestionChannel = interaction.guild.channels.cache.get(config.suggestionlogs);

            if (suggestionChannel) {
                suggestionChannel.send({ embeds: [suggestionEmbed] });
                
                const embed = new Discord.EmbedBuilder()
                .setTitle("\`✅\`〃Successful suggested")
                .setDescription(`> *Your suggest has been sent successfully.*`)
                .setColor(config.color)
                .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
                .setTimestamp();
            await interaction.reply({ embeds: [embed], ephemeral: true });
            } else {
                const embed = new Discord.EmbedBuilder()
                .setDescription(`> *The suggest logs channel was not found. Please contact an owner below.*\n${ownersList.length > 0 ? ownersList.join('\n') : "*No owner configured*"}`)
                .setColor(config.color);
            await interaction.reply({ embeds: [embed], ephemeral: true });        
            }
    },
};