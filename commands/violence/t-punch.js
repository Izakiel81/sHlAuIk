import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("t-punch")
    .setDescription("Вдарити ШлЯуІкА")
    .addStringOption(option =>
      option
        .setName("куди")
        .setDescription("Куди вдарити?")
        .setRequired(true)
        .addChoices(
          { name: "НиРкИ", value: "nyrky" },
          { name: "ПеЧіНкУ", value: "pechinka" },
          { name: "ГоЛоВу", value: "holova" },
          { name: "ОбЛиЧчЯ", value: "oblychcha" },
          { name: "КоЛіНа", value: "kolina" },
          { name: "ХрЕбЕт", value: "khrebet" }
        )
    ),
  async execute(interaction) {
    const bodyPart = interaction.options.getString("куди");

    const randomResponses = ["Ай", "ПєРєСтАнЬ", "НєНаДа"];

    const responses = {
      nyrky: "Ой-Ой, МоИ ПоЧкИ!",
      pechinka: "МоЯ ПеЧьОнКА!",
      holova: "Ай, МоЯ ГоЛоВа!",
      oblychcha: "МаЙо ПрЄкРаСнОє ЛиЧиКо!",
      kolina: "МоИ КоЛєНа, АаАаАаАаАаАа!",
      khrebet: "МоЯ СпиНа! КаК я ТеПерЬ бУдУ кЮшАтЬ?"
    };

    const response = responses[bodyPart] || 
                    randomResponses[Math.floor(Math.random() * randomResponses.length)];

    await interaction.reply({
      content: response
    });
  }
};