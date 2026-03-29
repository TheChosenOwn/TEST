const express = require('express');
const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageFlags } = require('discord.js');
require('dotenv').config();

// ==================
// WEB SERVER (For Render)
// ==================
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('🔫 Agent 7 is online!');
});

app.listen(PORT, () => {
    console.log(`🌐 Web server running on port ${PORT}`);
});

// ==================
// CONFIG
// ==================
const OWNER_ID = process.env.OWNER_ID || 'YOUR_DISCORD_USER_ID';

// ==================
// DISCORD CLIENT
// ==================
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// ==================
// HARDCODED MESSAGES
// ==================
const SPAM_MESSAGE = `# PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP
# PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP
https://tenor.com/view/tno-black-league-the-great-trial-gif-14945226216622592251
# PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP
# PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP
# PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP
https://discord.gg/sbkjphvQnG`;

const BUTTON_LABEL = 'PROVIDENCE ON TOP';
const RAID_COUNT = 5;

// ==================
// ZALGO TEXT GENERATOR
// ==================
const zalgoChars = {
    up: ['̵', '̶', '̷', '̸', '̡', '̢', '̛', '̤', '̈́', '̈', '̊', '͊', '͋', '͌'],
    mid: ['̵', '̶', '̷', '̸', '̹', '̺', '̻', '̼', '̽', '̾', '͛', '͜', '͟', '͝'],
    down: ['̖', '̗', '̘', '̙', '̜', '̝', '̞', '̟', '̠', '̤', '̥', '̦', '̩', '̫']
};

function zalgoify(text) {
    let result = '';
    for (const char of text) {
        result += char;
        for (let i = 0; i < 5; i++) {
            result += zalgoChars.up[Math.floor(Math.random() * zalgoChars.up.length)];
            result += zalgoChars.mid[Math.floor(Math.random() * zalgoChars.mid.length)];
            result += zalgoChars.down[Math.floor(Math.random() * zalgoChars.down.length)];
        }
    }
    return result;
}

// ==================
// ASCII ART GENERATOR
// ==================
const asciiFont = {
    'A': [' █████ ', '██   ██', '███████', '██   ██', '██   ██'],
    'B': ['██████ ', '██   ██', '██████ ', '██   ██', '██████ '],
    'C': [' ██████', '██     ', '██     ', '██     ', ' ██████'],
    'D': ['██████ ', '██   ██', '██   ██', '██   ██', '██████ '],
    'E': ['███████', '██     ', '█████  ', '██     ', '███████'],
    'F': ['███████', '██     ', '█████  ', '██     ', '██     '],
    'G': [' ██████ ', '██      ', '██  ████', '██    ██', ' ██████ '],
    'H': ['██   ██', '██   ██', '███████', '██   ██', '██   ██'],
    'I': ['██', '██', '██', '██', '██'],
    'J': ['     ██', '     ██', '     ██', '██   ██', ' █████ '],
    'K': ['██   ██', '██  ██ ', '█████  ', '██  ██ ', '██   ██'],
    'L': ['██     ', '██     ', '██     ', '██     ', '███████'],
    'M': ['███   ███', '████ ████', '██ ███ ██', '██     ██', '██     ██'],
    'N': ['███    ██', '████   ██', '██ ██  ██', '██  ██ ██', '██   ████'],
    'O': [' █████ ', '██   ██', '██   ██', '██   ██', ' █████ '],
    'P': ['██████ ', '██   ██', '██████ ', '██     ', '██     '],
    'Q': [' █████ ', '██   ██', '██ █ ██', '██  ██ ', ' ████ ██'],
    'R': ['██████ ', '██   ██', '██████ ', '██  ██ ', '██   ██'],
    'S': [' ██████', '██     ', ' █████ ', '     ██', '██████ '],
    'T': ['███████', '  ██   ', '  ██   ', '  ██   ', '  ██   '],
    'U': ['██   ██', '██   ██', '██   ██', '██   ██', ' █████ '],
    'V': ['██   ██', '██   ██', '██   ██', ' ████  ', '  ██   '],
    'W': ['██     ██', '██     ██', '██  █  ██', '██ ███ ██', ' ███ ███ '],
    'X': ['██   ██', ' ███ █ ', '  ███  ', ' ███ █ ', '██   ██'],
    'Y': ['██   ██', ' ███ █ ', '  ██   ', '  ██   ', '  ██   '],
    'Z': ['███████', '    ██ ', '  ██   ', ' ██    ', '███████'],
    ' ': ['   ', '   ', '   ', '   ', '   '],
    '!': ['██', '██', '██', '   ', '██'],
    '?': [' █████ ', '██   ██', '   ███ ', '       ', '   ██  '],
    '0': [' █████ ', '██  ███', '██ █ ██', '███  ██', ' █████ '],
    '1': ['  ██   ', ' ███   ', '  ██   ', '  ██   ', '██████ '],
    '2': [' █████ ', '██   ██', '    ██ ', '  ██   ', '███████'],
    '3': [' █████ ', '     ██', '  ████ ', '     ██', ' █████ '],
    '4': ['██   ██', '██   ██', '███████', '     ██', '     ██'],
    '5': ['███████', '██     ', '██████ ', '     ██', '██████ '],
    '6': [' █████ ', '██     ', '██████ ', '██   ██', ' █████ '],
    '7': ['███████', '    ██ ', '   ██  ', '  ██   ', '  ██   '],
    '8': [' █████ ', '██   ██', ' █████ ', '██   ██', ' █████ '],
    '9': [' █████ ', '██   ██', ' ██████', '     ██', ' █████ ']
};

function generateAscii(text) {
    const chars = text.toUpperCase().split('');
    const lines = ['', '', '', '', ''];
    
    for (const char of chars) {
        const art = asciiFont[char] || asciiFont[' '];
        for (let i = 0; i < 5; i++) {
            lines[i] += art[i] + ' ';
        }
    }
    
    return '```\n' + lines.join('\n') + '\n```';
}

// ==================
// COMMANDS
// ==================
const commands = [
    new SlashCommandBuilder()
        .setName('raid')
        .setDescription('Spam Providence messages (5x)'),

    new SlashCommandBuilder()
        .setName('buttonraid')
        .setDescription('Spam Providence buttons (5x)'),

    new SlashCommandBuilder()
        .setName('embedspam')
        .setDescription('Spam colorful embeds (5x)'),

    new SlashCommandBuilder()
        .setName('codeblock')
        .setDescription('Spam in big code blocks (5x)'),

    new SlashCommandBuilder()
        .setName('zalgo')
        .setDescription('Glitchy text spam (5x)')
        .addStringOption(opt => opt.setName('text').setDescription('Text to zalgoify').setRequired(true)),

    new SlashCommandBuilder()
        .setName('ascii')
        .setDescription('Big ASCII art')
        .addStringOption(opt => opt.setName('text').setDescription('Text for ASCII art (max 10 chars)').setRequired(true)),

    new SlashCommandBuilder()
        .setName('say')
        .setDescription('Make the bot say something')
        .addStringOption(opt => opt.setName('message').setDescription('Message to send').setRequired(true)),

    new SlashCommandBuilder()
        .setName('announce')
        .setDescription('Send formatted announcement (Owner only)'),

    new SlashCommandBuilder()
        .setName('ghost')
        .setDescription('Ghost ping a user')
        .addUserOption(opt => opt.setName('user').setDescription('User to ping').setRequired(true)),

    new SlashCommandBuilder()
        .setName('everyone')
        .setDescription('Ghost ping @everyone'),

    new SlashCommandBuilder()
        .setName('info')
        .setDescription('User info')
        .addUserOption(opt => opt.setName('user').setDescription('User')),

    new SlashCommandBuilder()
        .setName('help')
        .setDescription('Commands list')
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

async function registerCommands() {
    try {
        console.log('Registering commands...');
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
        console.log('✅ Commands registered!');
    } catch (e) {
        console.error('Register error:', e);
    }
}

// ==================
// RAID FUNCTIONS
// ==================
async function executeRaid(interaction) {
    let sent = 0;
    
    for (let i = 0; i < RAID_COUNT; i++) {
        try {
            await interaction.followUp({ content: SPAM_MESSAGE });
            sent++;
        } catch (e) {}
    }
    
    try {
        await interaction.followUp({ content: `✅ Sent **${sent}/${RAID_COUNT}** messages.`, flags: MessageFlags.Ephemeral });
    } catch (e) {}
}

async function executeButtonRaid(interaction) {
    let sent = 0;
    
    for (let i = 0; i < RAID_COUNT; i++) {
        const button = new ButtonBuilder()
            .setCustomId(`providence_${Date.now()}_${i}`)
            .setLabel(BUTTON_LABEL)
            .setStyle(ButtonStyle.Danger);
        const row = new ActionRowBuilder().addComponents(button);
        
        try {
            await interaction.followUp({ components: [row] });
            sent++;
        } catch (e) {}
    }
    
    try {
        await interaction.followUp({ content: `✅ Sent **${sent}/${RAID_COUNT}** buttons.`, flags: MessageFlags.Ephemeral });
    } catch (e) {}
}

async function executeEmbedSpam(interaction) {
    const colors = [0xFF0000, 0x00FF00, 0x0000FF, 0xFFFF00, 0xFF00FF, 0x00FFFF, 0xFFA500, 0x800080];
    let sent = 0;
    
    for (let i = 0; i < RAID_COUNT; i++) {
        const embed = new EmbedBuilder()
            .setTitle('# PROVIDENCE ON TOP')
            .setDescription('**PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP PROVIDENCE ON TOP**')
            .setURL('https://discord.gg/sbkjphvQnG')
            .setColor(colors[Math.floor(Math.random() * colors.length)])
            .setFooter({ text: 'PROVIDENCE ON TOP' })
            .setTimestamp();
        
        try {
            await interaction.followUp({ embeds: [embed] });
            sent++;
        } catch (e) {}
    }
    
    try {
        await interaction.followUp({ content: `✅ Sent **${sent}/${RAID_COUNT}** embeds.`, flags: MessageFlags.Ephemeral });
    } catch (e) {}
}

async function executeCodeBlock(interaction) {
    let sent = 0;
    
    for (let i = 0; i < RAID_COUNT; i++) {
        const codeMsg = `\`\`\`fix\n` +
            `░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░\n` +
            `░░░░░░░██╗███████╗██████╗ ░██████╗ ██████╗ ██████╗ ░░░░░░░\n` +
            `░░░░░░░██║██╔════╝██╔══██╗██╔════╝██╔═══██╗██╔══██╗░░░░░░\n` +
            `░░░░░░░██║█████╗░░██████╔╝██║░░░░░██║░░░██║██║░░██║░░░░░░\n` +
            `░░░░░░░██║██╔══╝░░██╔══██╗██║░░░░░██║░░░██║██║░░██║░░░░░░\n` +
            `░░░░░░░██║███████╗██║░░██║╚██████╗╚██████╔╝██████╔╝░░░░░░\n` +
            `░░░░░░░╚═╝╚══════╝╚═╝░░╚═╝░╚═════╝░╚═════╝░╚═════╝░░░░░░\n` +
            `░░░░░░░░░░░░░░░░░░░░PROVIDENCE ON TOP░░░░░░░░░░░░░░░░░░░░░\n` +
            `░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░\n` +
            `\`\`\``;
        
        try {
            await interaction.followUp({ content: codeMsg });
            sent++;
        } catch (e) {}
    }
    
    try {
        await interaction.followUp({ content: `✅ Sent **${sent}/${RAID_COUNT}** code blocks.`, flags: MessageFlags.Ephemeral });
    } catch (e) {}
}

async function executeZalgo(interaction, text) {
    let sent = 0;
    
    for (let i = 0; i < RAID_COUNT; i++) {
        const zalgoText = zalgoify(text);
        
        try {
            await interaction.followUp({ content: zalgoText });
            sent++;
        } catch (e) {}
    }
    
    try {
        await interaction.followUp({ content: `✅ Sent **${sent}/${RAID_COUNT}** zalgo messages.`, flags: MessageFlags.Ephemeral });
    } catch (e) {}
}

async function executeAscii(interaction, text) {
    const limitedText = text.substring(0, 10);
    const asciiArt = generateAscii(limitedText);
    
    try {
        await interaction.followUp({ content: asciiArt });
        await interaction.followUp({ content: `✅ Sent ASCII art.`, flags: MessageFlags.Ephemeral });
    } catch (e) {
        await interaction.followUp({ content: `❌ Text too long or invalid.`, flags: MessageFlags.Ephemeral });
    }
}

async function executeSay(interaction, message) {
    try {
        await interaction.followUp({ content: message });
        await interaction.followUp({ content: `✅ Message sent.`, flags: MessageFlags.Ephemeral });
    } catch (e) {
        await interaction.followUp({ content: `❌ Failed to send message.`, flags: MessageFlags.Ephemeral });
    }
}

async function executeAnnounce(interaction) {
    const announcement = `**━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━**

# 🔫 AGENT 7

**━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━**

**📥 ADD THE BOT:**
https://discord.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}&scope=applications.commands

**━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━**

**💥 COMMANDS:**

• \`/raid\` — Spam messages
• \`/buttonraid\` — Spam buttons
• \`/embedspam\` — Spam embeds
• \`/codeblock\` — ASCII blocks
• \`/zalgo\` — Glitchy text
• \`/ascii\` — Big ASCII art
• \`/say\` — Custom message
• \`/ghost\` — Ghost ping
• \`/everyone\` — Ping everyone

**━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━**

# 🔥 PROVIDENCE ON TOP 🔥`;

    try {
        await interaction.followUp({ content: announcement });
        await interaction.followUp({ content: `✅ Announcement sent.`, flags: MessageFlags.Ephemeral });
    } catch (e) {
        await interaction.followUp({ content: `❌ Failed.`, flags: MessageFlags.Ephemeral });
    }
}

async function executeGhost(interaction, userId) {
    try {
        const msg = await interaction.followUp({ content: `<@${userId}>` });
        await msg.delete().catch(() => {});
        
        await interaction.followUp({ content: `✅ Ghost pinged <@${userId}>.`, flags: MessageFlags.Ephemeral });
    } catch (e) {
        await interaction.followUp({ content: `❌Your ass is GETTING BANNED Coal.`, flags: MessageFlags.Ephemeral });
    }
}

async function executeEveryone(interaction) {
    try {
        const msg = await interaction.followUp({ content: `@everyone` });
        await msg.delete().catch(() => {});
        
        await interaction.followUp({ content: `✅ Ghost pinged @everyone.`, flags: MessageFlags.Ephemeral });
    } catch (e) {
        await interaction.followUp({ content: `❌ FUCKING SAAAAAAAAAAAAAAR.`, flags: MessageFlags.Ephemeral });
    }
}

// ==================
// INTERACTION HANDLER
// ==================
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;

    try {
        if (commandName === 'raid') {
            await interaction.reply({ content: `🔥 Raiding...`, flags: MessageFlags.Ephemeral });
            executeRaid(interaction);
        }

        if (commandName === 'buttonraid') {
            await interaction.reply({ content: `🔘 Sending buttons...`, flags: MessageFlags.Ephemeral });
            executeButtonRaid(interaction);
        }

        if (commandName === 'embedspam') {
            await interaction.reply({ content: `📊 Sending embeds...`, flags: MessageFlags.Ephemeral });
            executeEmbedSpam(interaction);
        }

        if (commandName === 'codeblock') {
            await interaction.reply({ content: `💻 Sending code blocks...`, flags: MessageFlags.Ephemeral });
            executeCodeBlock(interaction);
        }

        if (commandName === 'zalgo') {
            const text = options.getString('text');
            await interaction.reply({ content: `̷̸̷̸̷̢̢̢̛̛̛̤̤̤Sending zalgo...`, flags: MessageFlags.Ephemeral });
            executeZalgo(interaction, text);
        }

        if (commandName === 'ascii') {
            const text = options.getString('text');
            await interaction.reply({ content: `🎨 Generating ASCII...`, flags: MessageFlags.Ephemeral });
            executeAscii(interaction, text);
        }

        if (commandName === 'say') {
            const message = options.getString('message');
            await interaction.reply({ content: `💬 Sending...`, flags: MessageFlags.Ephemeral });
            executeSay(interaction, message);
        }

        if (commandName === 'announce') {
            if (interaction.user.id !== OWNER_ID) {
                await interaction.reply({ content: `❌ You don't have permission to use this command.`, flags: MessageFlags.Ephemeral });
                return;
            }
            await interaction.reply({ content: `📢 Sending announcement...`, flags: MessageFlags.Ephemeral });
            executeAnnounce(interaction);
        }

        if (commandName === 'ghost') {
            const user = options.getUser('user');
            await interaction.reply({ content: `👻 Ghost pinging...`, flags: MessageFlags.Ephemeral });
            executeGhost(interaction, user.id);
        }

        if (commandName === 'everyone') {
            await interaction.reply({ content: `📢 Pinging everyone...`, flags: MessageFlags.Ephemeral });
            executeEveryone(interaction);
        }

        if (commandName === 'info') {
            const user = options.getUser('user') || interaction.user;

            const embed = new EmbedBuilder()
                .setTitle(`👤 ${user.tag}`)
                .setThumbnail(user.displayAvatarURL({ size: 256 }))
                .addFields(
                    { name: 'ID', value: `\`${user.id}\``, inline: true },
                    { name: 'Created', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true }
                )
                .setColor(0xFF0000);

            await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
        }

        if (commandName === 'help') {
            const embed = new EmbedBuilder()
                .setTitle('🔫 Agent 7')
                .setDescription('*The ultimate SOY RAIDER XER POWER*')
                .setThumbnail(client.user.displayAvatarURL({ size: 256 }))
                .addFields(
                    { name: '━━━ SPAM ━━━', value: '', inline: false },
                    { name: '💥 `/raid`', value: 'Spam Providence messages', inline: true },
                    { name: '🔘 `/buttonraid`', value: 'Spam Providence buttons', inline: true },
                    { name: '📊 `/embedspam`', value: 'Spam colorful embeds', inline: true },
                    { name: '💻 `/codeblock`', value: 'Spam code blocks', inline: true },
                    { name: '̷̷̷ `/zalgo`', value: 'Glitchy text spam', inline: true },
                    { name: '🎨 `/ascii`', value: 'Big ASCII art', inline: true },
                    { name: '💬 `/say`', value: 'Say custom message', inline: true },
                    { name: '━━━ GHOST PING ━━━', value: '', inline: false },
                    { name: '👻 `/ghost`', value: 'Ghost ping user', inline: true },
                    { name: '📢 `/everyone`', value: 'Ghost ping everyone', inline: true },
                    { name: '━━━ INFO ━━━', value: '', inline: false },
                    { name: '👤 `/info`', value: 'User info', inline: true }
                )
                .setFooter({ text: 'Agent 7 • Providence', iconURL: client.user.displayAvatarURL() })
                .setColor(0xFF0000)
                .setTimestamp();

            await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
        }
    } catch (e) {
        console.error('Error:', e);
    }
});

// ==================
// READY
// ==================
client.on('ready', () => {
    console.log(`✅ Agent 7 online as ${client.user.tag}`);
    registerCommands();
});

client.login(process.env.TOKEN);
