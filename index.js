import {
  Client,
  Events,
  GatewayIntentBits,
  Collection
} from "discord.js";
import dotenv from "dotenv";
import { readdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

// ES Modules path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.commands = new Collection();

async function loadCommands() {
  try {
    const commandsPath = join(__dirname, "commands");
    const commandFolders = readdirSync(commandsPath);

    for (const folder of commandFolders) {
      const folderPath = join(commandsPath, folder);
      const commandFiles = readdirSync(folderPath)
        .filter(file => file.endsWith(".js"));

      for (const file of commandFiles) {
        const filePath = join(folderPath, file);
        const commandUrl = new URL(`file://${filePath}`);
        
        try {
          const commandModule = await import(commandUrl.href);
          const command = commandModule.default;
          
          if ("data" in command && "execute" in command) {
            client.commands.set(command.data.name, command);
            console.log(`✅ Loaded command: ${command.data.name}`);
          } else {
            console.warn(`⚠️ Command at ${filePath} is missing required properties`);
          }
        } catch (error) {
          console.error(`❌ Failed to load command ${filePath}:`, error);
        }
      }
    }
  } catch (error) {
    console.error("❌ Failed to load commands:", error);
    throw error;
  }
}

client.once(Events.ClientReady, () => {
  console.log(`🤖 Ready! Logged in as ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`⚠️ No command matching ${interaction.commandName} was found`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`❌ Error executing ${interaction.commandName}:`, error);
    
    const errorResponse = {
      content: "There was an error while executing this command!",
      ephemeral: true
    };

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(errorResponse);
    } else {
      await interaction.reply(errorResponse);
    }
  }
});

// Start the bot
loadCommands()
  .then(() => client.login(process.env.DISCORD_BOT_TOKEN))
  .catch(error => {
    console.error("❌ Failed to start bot:", error);
    process.exit(1);
  });