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

const voicePlayer = createAudioPlayer();

const voiceResource = createAudioResource('./intro.mp3');

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

        voiceConnection.subscribe(voicePlayer);

        voiceConnection.on(VoiceConnectionStatus.Ready, () => {
            setTimeout(() => {
                voicePlayer.play(voiceResource);
            }, 1000);
        });
        // console.log('RESOURCE', resource);

        voicePlayer.on(AudioPlayerStatus.Playing, () => {
            console.log('Playing Music');
        });

        voicePlayer.on(AudioPlayerStatus.Playing, () => {
            console.log('Playing Voice');
        });

        voicePlayer.on('error', (error) => {
            console.error(`Error: ${error.message} with resource`);
        });

        voicePlayer.on('debug', (message) => {
            console.log('MESSAGE', message);
        });

        await interaction.reply('Joining');
    }
}
