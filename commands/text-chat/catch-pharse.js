import { SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('catch-phrase')
        .setDescription('Короночка ШлЯуІкА'),
    async execute(interaction) {
        return interaction.reply({
            content: 'ШаШи!',
        });
    }
};