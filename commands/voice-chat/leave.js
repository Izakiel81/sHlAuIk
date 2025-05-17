import {SlashCommandBuilder} from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('Leave a voice channel'),
    async execute(interaction) {
        const {member} = interaction;
        const voiceChannel = member.voice.channel;

        if (!voiceChannel) {
            return interaction.reply('ГдЄ тИ шЮкА?');
        }

        await interaction.reply(`ШаШиТє ${voiceChannel.name}...`);
        await member.voice.disconnect();
    }
};