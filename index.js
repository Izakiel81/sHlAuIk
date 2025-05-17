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
        // Fix for Windows paths - convert to proper file URL
        const fileUrl = `file:///${filePath.replace(/\\/g, '/')}`;

        try {
          const commandModule = await import(fileUrl);
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

const eventsPath = join(__dirname, "events");
const eventFiles = readdirSync(eventsPath)
  .filter(file => file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = join(eventsPath, file);
  const fileUrl = `file:///${filePath.replace(/\\/g, '/')}`;
  
  try {
    const eventModule = await import(fileUrl);
    const event = eventModule.default;

    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
    console.log(`✅ Loaded event: ${event.name}`);
  } catch (error) {
    console.error(`❌ Failed to load event ${filePath}:`, error);
  }
}

// Start the bot
loadCommands()
  .then(() => client.login(process.env.DISCORD_BOT_TOKEN))
  .catch(error => {
    console.error("❌ Failed to start bot:", error);
    process.exit(1);
  });