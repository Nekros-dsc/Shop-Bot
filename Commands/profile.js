const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const db = require('quick.db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('Shows profile member.')
        .addUserOption(option => option.setName('member').setDescription('The member to display.').setRequired(true)),
    async execute(interaction, config) {
        const member = interaction.options.getUser('member');

        const vouches = db.get('vouches') || [];

        const memberVouches = vouches.filter(vouch => vouch.member === member.id);

        if (memberVouches.length === 0) {
            const embed = new Discord.EmbedBuilder()
            .setTitle("\`🕷️\`〃No vouch found")
            .setDescription(`> *No vouch found for the member ${member} (\`${member.id}\`)*`)
            .setColor(config.color)
            .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
            .setTimestamp();
        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
        }

        const maxVouchesPerPage = 1;
        const maxPages = Math.ceil(memberVouches.length / maxVouchesPerPage);
        let currentPage = 1;
        let vouchIndex = (currentPage - 1) * maxVouchesPerPage;
        let vouch = memberVouches.slice(vouchIndex, vouchIndex + maxVouchesPerPage);

        const embed = new Discord.EmbedBuilder()
        .setTitle(`\`🕷️\`〃Vouch profile of ${member.tag}`)
        .setDescription(`> *Voucher :* <@${interaction.guild.members.cache.get(vouch[0].reviewer).id}>\n> *Service :* **\`${vouch[0].service}\`**\n> *Review :* **\`${vouch[0].reviews}\`**\n> *Note :* **\`${'⭐'.repeat(vouch[0].note)}\`**\n> *Image :* \`${vouch[0].image}\``)
        .setThumbnail(interaction.guild.members.cache.get(vouch[0].reviewer).user.displayAvatarURL({ dynamic: true, size: 1024 }))
        .setColor(config.color)
        .setFooter({text: `${currentPage}/${maxPages}`})
        .setTimestamp();

        const previousButton = new Discord.ButtonBuilder()
            .setCustomId('previous')
            .setLabel('◀')
            .setStyle(3)
            .setDisabled(currentPage === 1);

        const nextButton = new Discord.ButtonBuilder()
            .setCustomId('next')
            .setLabel('▶')
            .setStyle(3)
            .setDisabled(currentPage === maxPages);

        const homeButton = new Discord.ButtonBuilder()
            .setCustomId('home')
            .setLabel('🏠')
            .setStyle(3)
            .setDisabled(currentPage === 1);

        const buttonRow = new Discord.ActionRowBuilder().addComponents(previousButton, nextButton, homeButton);

        const message = await interaction.reply({ embeds: [embed], components: [buttonRow], fetchReply: true });
        const collector = message.createMessageComponentCollector({ time: 60000 });

        collector.on('collect', async interaction2 => {
            if (interaction2.user.id == interaction.user.id) {
                interaction2.deferUpdate();
                if (interaction2.customId === 'previous') {
                    await showPreviousVouch();
                } else if (interaction2.customId === 'next') {
                    await showNextVouch();
                } else if (interaction2.customId === 'home') {
                    await showFirstVouch();
                }
            }
        });

        const buttonInteractionCollector = message.createMessageComponentCollector({ componentType: 'BUTTON' });
        let buttonInteractionTimeout;

        buttonInteractionCollector.on('collect', async () => {
            clearTimeout(buttonInteractionTimeout);
            buttonInteractionTimeout = setTimeout(() => {
                buttonRow.components.forEach(component => component.setDisabled(true));
                interaction.editReply({ embeds: [embed], components: [buttonRow] });
            }, 15000);
        });

        async function showPreviousVouch() {
            currentPage--;
            vouchIndex -= maxVouchesPerPage;
            vouch = memberVouches.slice(vouchIndex, vouchIndex + maxVouchesPerPage);

            embed.setTitle(`\`🕷️\`〃Vouch profile of ${member.tag}`)
            embed.setDescription(`> *Voucher :* <@${interaction.guild.members.cache.get(vouch[0].reviewer).id}>\n> *Service :* **\`${vouch[0].service}\`**\n> *Review :* **\`${vouch[0].reviews}\`**\n> *Note :* **\`${'⭐'.repeat(vouch[0].note)}\`**\n> *Image :* \`${vouch[0].image}\``)
            embed.setThumbnail(interaction.guild.members.cache.get(vouch[0].reviewer).user.displayAvatarURL({ dynamic: true, size: 1024 }))
            embed.setColor(config.color)
            embed.setFooter({text: `${currentPage}/${maxPages}`})
            embed.setTimestamp();

            previousButton.setDisabled(currentPage === 1);
            nextButton.setDisabled(false);
            homeButton.setDisabled(currentPage === 1);

            await interaction.editReply({ embeds: [embed], components: [buttonRow] });
        }

        async function showNextVouch() {
            currentPage++;
            vouchIndex += maxVouchesPerPage;
            vouch = memberVouches.slice(vouchIndex, vouchIndex + maxVouchesPerPage);

            embed.setTitle(`\`🕷️\`〃Vouch profile of ${member.tag}`)
            embed.setDescription(`> *Voucher :* <@${interaction.guild.members.cache.get(vouch[0].reviewer).id}>\n> *Service :* **\`${vouch[0].service}\`**\n> *Review :* **\`${vouch[0].reviews}\`**\n> *Note :* **\`${'⭐'.repeat(vouch[0].note)}\`**\n> *Image :* \`${vouch[0].image}\``)
            embed.setThumbnail(interaction.guild.members.cache.get(vouch[0].reviewer).user.displayAvatarURL({ dynamic: true, size: 1024 }))
            embed.setColor(config.color)
            embed.setFooter({text: `${currentPage}/${maxPages}`})
            embed.setTimestamp();

            previousButton.setDisabled(false);
            nextButton.setDisabled(currentPage === maxPages);
            homeButton.setDisabled(currentPage === 1);

            await interaction.editReply({ embeds: [embed], components: [buttonRow] });
        }

        async function showFirstVouch() {
            currentPage = 1;
            vouchIndex = 0;
            vouch = memberVouches.slice(vouchIndex, vouchIndex + maxVouchesPerPage);

            embed.setTitle(`\`🕷️\`〃Vouch profile of ${member.tag}`)
            embed.setDescription(`> *Voucher :* <@${interaction.guild.members.cache.get(vouch[0].reviewer).id}>\n> *Service :* **\`${vouch[0].service}\`**\n> *Review :* **\`${vouch[0].reviews}\`**\n> *Note :* **\`${'⭐'.repeat(vouch[0].note)}\`**\n> *Image :* \`${vouch[0].image}\``)
            embed.setThumbnail(interaction.guild.members.cache.get(vouch[0].reviewer).user.displayAvatarURL({ dynamic: true, size: 1024 }))
            embed.setColor(config.color)
            embed.setFooter({text: `${currentPage}/${maxPages}`})
            embed.setTimestamp();

            previousButton.setDisabled(true);
            nextButton.setDisabled(false);
            homeButton.setDisabled(true);

            await interaction.editReply({ embeds: [embed], components: [buttonRow] });
        }
    },
};