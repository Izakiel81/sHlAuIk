import { SlashCommandBuilder } from "discord.js";

const responses = [
    "Ай",
    "ПєРєСтАнЬ",
    "НєНаДа"
]

export default {
    data: new SlashCommandBuilder()
        .setName("punch")
        .setDescription("Вдарити ШлЯуІкА"),
    async execute(interaction) {
        interaction.reply({
            content: responses[Math.floor(Math.random() * responses.length)],
        });
    }


}