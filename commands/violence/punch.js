import { SlashCommandBuilder } from "discord.js";
import { getVoiceConnection, createAudioPlayer, createAudioResource, entersState, VoiceConnectionStatus } from '@discordjs/voice';
import { createReadStream } from 'fs';
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const responses = [
    "Ай",
    "ПєРєСтАнЬ",
    "НєНаДа"
];

const sounds = [
    "groan-1",
    "groan-2",
    "groan-3",
    "stop"
];

export default {
    data: new SlashCommandBuilder()
        .setName("punch")
        .setDescription("Вдарити ШлЯуІкА"),
    async execute(interaction) {
        const { guild } = interaction;
        const connection = getVoiceConnection(guild.id);

        // If no connection, send random text response
        if (!connection) {
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            return interaction.reply({ content: randomResponse });
        }

        try {
            // Ensure connection is ready
            await entersState(connection, VoiceConnectionStatus.Ready, 1_000);

            // Create and setup player
            const player = createAudioPlayer();
            connection.subscribe(player);

            // Get random sound
            const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
            const soundPath = join(__dirname, '../..', 'assets', `${randomSound}.mp3`);

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
}