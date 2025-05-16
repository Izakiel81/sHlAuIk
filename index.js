import { Client, Events, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates
    ],
})

client.once(Events.ClientReady, () => {
    console.log('Ready!, Logged in as ' + client.user.tag); 
});

client.login(process.env.DISCORD_BOT_TOKEN);

