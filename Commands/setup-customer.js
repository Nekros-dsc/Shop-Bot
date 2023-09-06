const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-customer')
        .setDescription('Define the customer role.')
        .addRoleOption(option => option.setName('role').setDescription('The role to be assigned to customers').setRequired(true)),
    async execute(interaction, config) {
        const customerRole = interaction.options.getRole('role');

        try {
          const embed = new Discord.EmbedBuilder()
          .setTitle('\`✅\`〃Customer system successfully')
          .setDescription(`> *The customer role has been successfully configured as ${customerRole} (\`${customerRole.id}\`)*`)
          .setColor(config.color)
          .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
          .setTimestamp();
          await interaction.reply({ embeds: [embed], ephemeral: true });

          config.customer = customerRole.id;
          fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));

        } catch (e) {
            const embed = new Discord.EmbedBuilder()
            .setDescription(`\`❌\`〃*An error occurred while configuring the customer role. Please verify that this is a valid channel text.*`)
            .setColor(config.color)
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
};