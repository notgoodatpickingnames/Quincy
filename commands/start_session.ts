import {
    SlashCommandBuilder,
    CommandInteraction,
    VoiceChannel,
    Client,
} from 'discord.js';
import {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    AudioPlayerStatus,
    VoiceConnectionStatus,
} from '@discordjs/voice';

const player = createAudioPlayer();
const resource = createAudioResource('./9_Before_The_Storm.mp3');

export const data = new SlashCommandBuilder()
    .setName('start_session')
    .setDescription('Replies with Pong!');

export async function execute(interaction: CommandInteraction, client: Client) {
    if (interaction.isChatInputCommand()) {
        const voiceChannel = interaction.options.getChannel('channel');

        const voiceConnection = joinVoiceChannel({
            channelId: interaction.channelId,
            guildId: interaction.guildId!,
            adapterCreator: interaction.guild!.voiceAdapterCreator,
            selfDeaf: false,
            selfMute: false,
        });

        voiceConnection.subscribe(player);
        voiceConnection.on(VoiceConnectionStatus.Ready, () => {
            player.play(resource);
        });
        // console.log('RESOURCE', resource);

        player.on(AudioPlayerStatus.Playing, () => {
            console.log('Playing', resource);
        });

        player.on('error', (error) => {
            console.error(`Error: ${error.message} with resource`);
        });

        player.on('debug', (message) => {
            console.log('MESSAGE', message);
        });

        await interaction.reply('Joining');
    }
}
