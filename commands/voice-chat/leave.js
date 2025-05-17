import {SlashCommandBuilder} from 'discord.js';
import { getVoiceConnection } from '@discordjs/voice';

export default {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('Вигнади цю твариниу з голосового каналу!'),
    async execute(interaction) {

        await interaction.deferReply();

        const {member} = interaction;
        const voiceChannel = member.voice.channel;

        if (!voiceChannel) {
            return interaction.editReply('ГдЄ тИ шЮкА?');
        }

        const connection = getVoiceConnection(interaction.guild.id);

        if (!connection) {
            return interaction.editReply('Я нЄ вГоЛоСнИй');
        }
        try {
            connection.destroy();
            await interaction.editReply(`ШаШиТє ЛоХи!`);

        } catch (error) {
            console.log('Leave command error:', error);
            await interaction.editReply('АтПуСтИ!');
        }

        await member.voice.disconnect();
    }
};