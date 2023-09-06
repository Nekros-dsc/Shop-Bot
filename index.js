// By https://github.com/Nekros-dsc
const { Client, Collection, EmbedBuilder, ActivityType } = require('discord.js');
const { Routes } = require('discord-api-types/v9');
const { REST } = require('@discordjs/rest');
const config = require('./config.json');
const fs = require('fs');

const client = new Client({ intents: 3276799 });

client.commands = new Collection();
const commandFiles = fs.readdirSync('./Commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./Commands/${file}`);
    if (command.data && command.data.name) {
        client.commands.set(command.data.name, command);
    } else {
        console.warn(`Command (${file}) is missing the "data" or "name" property and will not be saved.`);
    }
}

const rest = new REST({ version: '9' }).setToken(config.token);

async function deployCommands() {
    const commands = Array.from(client.commands.values()).map(command => command.data.toJSON());

    try {
        console.log('Slash commands are being deployed...');
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands },
        );

        console.log('Slash commands successfully deployed !');
    } catch (error) {
        console.error('An error occurred when deploying the slash commands :', error);
    }
}

client.once('ready', () => {
    // By https://github.com/Nekros-dsc
    console.log(`Logged in as ${client.user.tag} (${client.user.id})`);
    if(config.activity == "streaming") activity = ActivityType.Streaming
    if(config.activity == "competing") activity = ActivityType.Competing
    if(config.activity == "playing") activity = ActivityType.Playing
    if(config.activity == "watching") activity = ActivityType.Watching
    if(config.activity == "listening") activity = ActivityType.Listening
    client.user.setPresence({
        activities: [
          {
            name: config.statut,
            type: activity,
            url: "https://www.twitch.tv/nekros_dsc",
          },
        ],
        status: config.status,
      });
    deployCommands();
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    const publicCommands = ['vouch','invite','help','payement','profile','suggest','verify'];

    if (!config.owner.includes(interaction.user.id) && !publicCommands.includes(interaction.commandName)) {
        const embed = new EmbedBuilder()
            .setDescription('\`🕷️\` 〃*You are not authorized to use this command !*')
            .setColor(config.color);
        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
    }
    try {
        await command.execute(interaction, config);
    } catch (error) {
        console.error('An error occurred while executing the command:', error);
    }
});

client.on('messageCreate', async (message) => {
  if (message.channel.id === config.vouchlogs) {
    if (message.author.bot) return;

    const embed = new EmbedBuilder()
    .setDescription('\`🕷️\` 〃*Please use the \`/vouch\` command to give your opinion !*')
    .setColor(config.color);
cc = await message.reply({ content: `${message.author}`, embeds: [embed]});

    setTimeout(() => {
      message.delete().catch();
      cc.delete().catch();
    }, 8000);
  }
});

client.login(config.token);

 process.on('unhandledRejection', (reason, promise) => {
     const ignoredCodes = [10008, 50013, 50035, 40060, 10003, 10014, 50001, 10015];
     if (ignoredCodes.includes(reason.code)) return;
    // console.error('An unhandled promise rejection occurred :', reason);
 });
 // By https://github.com/Nekros-dsc