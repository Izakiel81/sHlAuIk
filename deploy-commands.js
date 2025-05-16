import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ES Modules path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['DISCORD_TOKEN', 'DISCORD_CLIENT_ID', 'DISCORD_GUILD_ID'];
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
                
                try {
                    // Dynamic import for ES modules
                    const command = await import(filePath);
                    
                    if ('data' in command && 'execute' in command) {
                        commands.push(command.data.toJSON());
                    } else {
                        console.warn(`[WARNING] The command at ${filePath} is missing required properties.`);
                    }
                } catch (error) {
                    console.error(`Error loading command ${filePath}:`, error);
                }
            }
        }
        
        return commands;
    } catch (error) {
        console.error('Error reading commands directory:', error);
        throw error;
    }
}

async function deployCommands() {
    try {
        const commands = await loadCommands();
        const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
        
        console.log(`Starting deployment of ${commands.length} application (/) commands.`);
        
        const data = await rest.put(
            Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID),
            { body: commands }
        );
        
        console.log(`Successfully deployed ${data.length} commands.`);
    } catch (error) {
        console.error('Command deployment failed:', error);
        process.exit(1);
    }
}

deployCommands();