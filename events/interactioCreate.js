import { Events, MessageFlags } from "discord.js";

export default {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;
        const commands = interaction.client.commands.get(interaction.commandName);

        if (!commands) {
            return interaction.reply({
                content: 'ШаШи! ШлЯуІк Нє ЗнАєТь ЄтУ кОмАнДу!',
            });
        }

        try {
            await commands.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: 'ШаШи! ШлЯуІк Нє ЗнАєТь ЄтУ кОмАнДу!',
                    ephemeral: true,
                });
            } else {
                await interaction.reply({
                    content: 'ШаШи! ШлЯуІк Нє ЗнАєТь ЄтУ кОмАнДу!',
                    ephemeral: true,
                });
            }
        }
    }
}