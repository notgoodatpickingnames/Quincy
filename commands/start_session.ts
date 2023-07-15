import { SlashCommandBuilder, CommandInteraction, VoiceChannel, Client } from 'discord.js';
import {joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus} from '@discordjs/voice';

export const data = new SlashCommandBuilder()
    .setName('set_session')
    .setDescription('Replies with Pong!');

export async function execute(interaction: CommandInteraction, client: Client) {
    if (interaction.isChatInputCommand()) {
        if (interaction.commandName === 'join') {
            
            interaction.reply({
                content: 'ok',
            });

            const voiceChannel = interaction.options.getChannel('channel');
            
            const voiceConnection = joinVoiceChannel({
                channelId: interaction.channelId,
                guildId: interaction.guildId!,
                adapterCreator: interaction.guild!.voiceAdapterCreator,
            })

            const player = createAudioPlayer();
            const resource = createAudioResource('C:\\Users\\user\\Documents\\DiscordBot\\sounds\\audio.mp3');

            player.play(resource);

            player.on(AudioPlayerStatus.Playing, () => {
                console.log('Playing');
            })

            player.on('error', error => {
                console.error(`Error: ${error.message} with resource`);
            })
        }
    }
}
