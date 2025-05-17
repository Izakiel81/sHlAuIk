import { SlashCommandBuilder } from 'discord.js';
import { getVoiceConnection, createAudioPlayer, createAudioResource, entersState, VoiceConnectionStatus } from '@discordjs/voice';
import { createReadStream } from 'fs';
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
    data: new SlashCommandBuilder()
        .setName('catch-phrase')
        .setDescription('Короночка ШлЯуІкА'),
    async execute(interaction) {

        const { guild } = interaction;  
        
        const connection = getVoiceConnection(guild.id);
        if (!connection) {
            return interaction.reply({
                content: 'ШаШи!',
            });
        }

        try {
            // Ensure connection is ready
            await entersState(connection, VoiceConnectionStatus.Ready, 1_000);

            // Create and setup player
            const player = createAudioPlayer();
            connection.subscribe(player);

            const soundPath = join(__dirname, '../..', 'assets', `catch-phrase.mp3`);

            // Create and play audio resource
            const resource = createAudioResource(createReadStream(soundPath));
            player.play(resource);

            // Handle player events
            player.on('error', error => {
                console.error('Audio player error:', error);
                interaction.channel.send('❌ Помилка відтворення звуку!');
            });

            player.on('stateChange', (oldState, newState) => {
                if (newState.status === 'idle') {
                    player.stop();
                }
            });

        } catch (error) {
            console.error('Punch command error:', error);
            await interaction.reply('❌ Щось пішло не так!');
        }
    }
};