const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const db = require('quick.db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vouch')
        .setDescription('Give your opinion on the service.')
        .addUserOption(option => option.setName('member').setDescription('The member concerned').setRequired(true))
        .addStringOption(option => option.setName('service').setDescription('The service concerned').setRequired(true))
        .addIntegerOption(option => option.setName('note').setDescription('The score must be between 1 and 5').setRequired(true))
        .addStringOption(option => option.setName('reviews').setDescription('Your opinion').setRequired(true))
        .addStringOption(option => option.setName('image').setDescription('Image URL').setRequired(false)),
    async execute(interaction, config) {
        const member = interaction.options.getUser('member');
        const service = interaction.options.getString('service');
        const note = interaction.options.getInteger('note');
        const reviews = interaction.options.getString('reviews');
        const image = interaction.options.getString('image');

        if (note < 1 || note > 5) {
            const embed = new Discord.EmbedBuilder()
            .setDescription(`\`❌\`〃*The score provided must be between 1 and 5.*`)
            .setColor(config.color);
            interaction.reply({ embeds: [embed], ephemeral: true});
        }

        if (interaction.user.id === member.id) {
            const embed = new Discord.EmbedBuilder()
                .setDescription(`\`❌\`〃*You can't vouch yourself.*`)
                .setColor(config.color);
            interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }

        if (member.bot){
            const embed = new Discord.EmbedBuilder()
            .setDescription(`\`❌\`〃*You can't vouch a bot.*`)
            .setColor(config.color);
            interaction.reply({ embeds: [embed], ephemeral: true});
            return;
        }

        const vouchData = {
            member: member.id,
            service,
            note,
            reviews,
            image,
            reviewer: interaction.user.id
        };

        db.push('vouches', vouchData);

        const ownersList = config.owner.map(ownerId => {
            const owner = interaction.guild.members.cache.get(ownerId);
            return owner ? `${owner.user} (**\`${ownerId}\`**)` : ownerId;
          });

          const membre = interaction.guild.members.cache.get(member.id);
          
          const vouchEmbed = new Discord.EmbedBuilder()
              .setTitle(`\`🕷️\`〃Rating given by ${interaction.user.tag} to ${membre.user.tag}`)
              .setThumbnail(membre.user.displayAvatarURL({ dynamic: true, size: 1024 }))
              .setColor(config.color)
              .setDescription(`> *Member :* ${membre.toString()} (\`${membre.id}\`)\n> *Service :* \`${service}\`\n> *Review :* \`${reviews}\`\n> *Note :* \`${'⭐'.repeat(note)}\``)
              .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
              .setTimestamp();
               

        if (image) {
            vouchEmbed.setImage(image);
        }

        const vouchChannel = interaction.guild.channels.cache.get(config.vouchlogs);
        if (vouchChannel) {
            vouchChannel.send({ embeds: [vouchEmbed] });
            const embed = new Discord.EmbedBuilder()
            .setTitle("\`✅\`〃Successful rated")
            .setDescription(`> *Your review has been sent successfully.*`)
            .setColor(config.color)
            .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
            .setTimestamp();
        await interaction.reply({ embeds: [embed], ephemeral: true });
        } else {
            const embed = new Discord.EmbedBuilder()
            .setDescription(`> *The vouch logs channel was not found. Please contact an owner below.*\n${ownersList.length > 0 ? ownersList.join('\n') : "*No owner configured*"}`)
            .setColor(config.color);
        await interaction.reply({ embeds: [embed], ephemeral: true });        
        }
    },
};