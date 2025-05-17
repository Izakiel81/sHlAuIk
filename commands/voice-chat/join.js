import { SlashCommandBuilder } from "discord.js";
import { joinVoiceChannel } from '@discordjs/voice';

export default {
    data: new SlashCommandBuilder()
        .setName("join")
        .setDescription("Join a voice channel"),
    async execute(interaction) {

        await interaction.deferReply();

        const { member, guild } = interaction;
        const voiceChannel = member.voice.channel;

        if (!voiceChannel) {
            return interaction.editReply("ГдЄ тИ шЮкА?");
        }

        if (!voiceChannel.joinable) {
            return interaction.editReply("Я нЄ мАгЮ");
        }

        try {
            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: guild.id,
                adapterCreator: guild.voiceAdapterCreator,
            })
            await interaction.editReply(`Я хАчЮ кЮшАтЬ`);

            return connection;
        } catch (error) {
            console.error('Join command error:', error);
            await interaction.editReply('❌ Failed to join voice channel!');
        }
    }
}