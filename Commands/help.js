const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Displays bot commands.'),
    execute(interaction, config) {

        const embed = new Discord.EmbedBuilder()
        .setTitle('\`🕷️\`〃Help')
        .setDescription(`\`/help\`\n*-Displays bot commands*\n\`/profile\`\n*-Shows profile member*\n\`/payment\`\n*-Show payment options*\n\`/invite\`\n*-Create a server invite*\n\`/vouch\`\n*-Give your opinion on the service*\n\`/suggest\`\n*-Submit a suggestion*\n\`/verify\`\n*-Verify yourself*\n\`/setup-verify\`\n*-Setup verification system*\n\`/setup-suggestion\`\n*-Setup suggestion system*\n\`/setup-vouch\`\n*-Setup vouch system*\n\`/setup-customer\`\n*-Setup customer system*\n\`/renew\`\n*-Renew a channel*\n\`/customer\`\n*-Assigns the Customer role*\n\`/mass-role\`\n*-Add/Remove a role to all users*`)
        .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
        .setTimestamp()
        .setColor(config.color);
        interaction.reply({ embeds: [embed]});
    },
};