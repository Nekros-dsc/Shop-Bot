const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mass-role')
        .setDescription('Add/Remove a role to all users.')
        .addStringOption(option => option.setName('action').setDescription('Action to perform (add/remove)').setRequired(true)
            .addChoice('Add', 'add')
            .addChoice('Remove', 'remove')
        )
        .addRoleOption(option => option.setName('role').setDescription('Role to add/remove to all users').setRequired(true)),
    async execute(interaction, config) {
        const action = interaction.options.getString('action');
        const role = interaction.options.getRole('role');

        if (!role.editable) {
            const embed = new Discord.EmbedBuilder()
            .setDescription(`\`❌\`〃*Please check that the role is assignable and that the bot has the necessary permissions.*`)
            .setColor(config.color)
        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
        }

        const guildMembers = await interaction.guild.members.fetch();
        const totalMembers = guildMembers.size;
        let modifiedMembers = 0;

        if (action === 'add') {
            guildMembers.forEach(member => {
                if (!member.roles.cache.has(role.id)) {
                    member.roles.add(role).catch(console.error);
                    modifiedMembers++;
                }
            });
        } else if (action === 'remove') {
            guildMembers.forEach(member => {
                if (member.roles.cache.has(role.id)) {
                    member.roles.remove(role).catch(console.error);
                    modifiedMembers++;
                }
            });
        }

        const embed = new Discord.EmbedBuilder()
        .setTitle("\`✅\`〃Mass role successfully")
        .setDescription(`> *Role ${role} (\`${role.id}\`) was ${action === 'add'? 'added' : 'removed'} from ${modifiedMembers}/${totalMembers} members.*`)
        .setColor(config.color)
    await interaction.reply({ embeds: [embed] });
    return;
    },
};