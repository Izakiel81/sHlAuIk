import { SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("join")
        .setDescription("Join a voice channel"),
    async execute(interaction) {
        const { member } = interaction;
        const voiceChannel = member.voice.channel;

        if (!voiceChannel) {
            return interaction.reply("ГдЄ тИ шЮкА?");
        }

        await interaction.reply(`Я хАчЮ кЮшАтЬ`);
        await member.voice.setChannel(voiceChannel);
    }
}