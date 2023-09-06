const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const db = require('quick.db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('Verify yourself.'),
    async execute(interaction, config) {
        const verificationChannelId = db.get('verificationChannel');
        const verificationRoleId = db.get('verificationRole');

        if (!verificationChannelId || !verificationRoleId) {
                    const embed = new Discord.EmbedBuilder()
                    .setTitle('\`🕷️\`〃Verify not configured')
                    .setDescription('> *The verification system is not configured on this server.*')
                    .setColor(config.color)
                    .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
                    .setTimestamp();
                await interaction.reply({ embeds: [embed], ephemeral: true });
                return;
        }

        if (interaction.channelId !== verificationChannelId) {
            const embed = new Discord.EmbedBuilder()
            .setDescription(`\`❌\`〃*Please run \`/verify\` command in <#${verificationChannelId}> channel.*`)
            .setColor(config.color)
        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
        }

        const member = interaction.member;
        const role = interaction.guild.roles.cache.get(verificationRoleId);

        if (!role) {
            const embed = new Discord.EmbedBuilder()
            .setTitle('\`🕷️\`〃The role does not exist')
            .setDescription('> *Verification role does not exist on this server.*')
            .setColor(config.color)
            .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
            .setTimestamp();
        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
        }

        if (member.roles.cache.has(verificationRoleId)) {
            const embed = new Discord.EmbedBuilder()
            .setTitle('\`🕷️\`〃Already verified')
            .setDescription('> *You are already verified.*')
            .setColor(config.color)
            .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
            .setTimestamp();
        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
        }

        await member.roles.add(role);

        const dmEmbed = new Discord.EmbedBuilder()
        .setTitle('\`✅\`〃Verification Successful')
        .setDescription('> *You have successfully passed the verification.*')
        .setColor(config.color)
        .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
        .setTimestamp();

        try {
            const embed = new Discord.EmbedBuilder()
            .setTitle('\`✅\`〃Verification Successful')
            .setDescription('> *You have successfully passed the verification.*')
            .setColor(config.color)
            .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
            .setTimestamp();
            interaction.reply({ embeds: [embed], ephemeral: true });
            return interaction.user.send({ embeds: [dmEmbed] });
        } catch (e) {
            console.error(`Failed to send DM to user ${interaction.user.tag} :`, e);
        }
    },
};
