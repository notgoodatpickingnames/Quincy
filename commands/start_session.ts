import { SlashCommandBuilder, CommandInteraction } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('set_session')
    .setDescription('Replies with Pong!');
    
export async function execute(interaction: CommandInteraction) {
    await interaction.reply('Pong!');
}
