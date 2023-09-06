const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('customer')
    .setDescription('Assigns the Customer role.')
    .addUserOption(option => option.setName('user').setDescription('User to assign the role to').setRequired(true)),
  async execute(interaction, config) {
    const user = interaction.options.getUser('user');
    const customerRole = interaction.guild.roles.cache.get(config.customer);

    const ownersList = config.owner.map(ownerId => {
      const owner = interaction.guild.members.cache.get(ownerId);
      return owner ? `${owner.user} (**\`${ownerId}\`**)` : ownerId;
    });

    if (!customerRole) {
      const embed = new Discord.EmbedBuilder()
        .setDescription(`\`🕷️\`〃*The customer role was not found. Please contact an owner below.*\n${ownersList.length > 0 ? ownersList.join('\n') : "*No owner configured*"}`)
        .setColor(config.color);
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    } 

    try {
        await interaction.guild.members.cache.get(user.id).roles.add(customerRole);
      
        const embed = new Discord.EmbedBuilder()
          .setTitle("\`✅\`〃Customer role added successfully")
          .setDescription(`> *The customer role ${customerRole} has been successfully added to the user ${user} (\`${user.id}\`).*`)
          .setColor(config.color);
        await interaction.reply({ embeds: [embed] });
      } catch (e) {
        const embed = new Discord.EmbedBuilder()
          .setDescription(`\`❌\`〃*An error occurred while assigning the customer role, please check that the role is assignable and that the bot has the necessary permissions.*`)
          .setColor(config.color);
        await interaction.reply({ embeds: [embed], ephemeral: true });
      }      
  },
};