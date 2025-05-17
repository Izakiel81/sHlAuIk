import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pathToFileURL } from 'url';

// ES Modules path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['DISCORD_BOT_TOKEN', 'DISCORD_CLIENT_ID', 'DISCORD_GUILD_ID'];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
}

async function loadCommands() {
    const commands = [];
    const foldersPath = path.join(__dirname, 'commands');
    
    try {
        const commandFolders = fs.readdirSync(foldersPath);
        
        for (const folder of commandFolders) {
            const commandsPath = path.join(foldersPath, folder);
            const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
            
            for (const file of commandFiles) {
                const filePath = path.join(commandsPath, file);
                const fileUrl = pathToFileURL(filePath).href; // Convert to file:// URL
                
                try {
                    // Dynamic import with proper URL format
                    const command = await import(fileUrl);
                    
                    if ('data' in command.default && 'execute' in command.default) {
                        commands.push(command.default.data.toJSON());
                        console.log(`✅ Loaded command: ${command.default.data.name}`);
                    } else {
                        console.warn(`⚠️ The command at ${filePath} is missing required properties.`);
                    }
                } catch (error) {
                    console.error(`❌ Error loading command ${filePath}:`, error);
                }
            }
        }
        
        return commands;
    } catch (error) {
        console.error('❌ Error reading commands directory:', error);
        throw error;
    }
}

async function deployCommands() {
    try {
        const commands = await loadCommands();
        const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);
        
        console.log(`🔄 Starting deployment of ${commands.length} application (/) commands...`);
        
        const data = await rest.put(
            Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID),
            { body: commands }
        );
        
        console.log(`✅ Successfully deployed ${data.length} commands!`);
    } catch (error) {
        console.error('❌ Command deployment failed:', error);
        process.exit(1);
    }
}

deployCommands();