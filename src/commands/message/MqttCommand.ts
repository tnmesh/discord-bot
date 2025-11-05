import { EmbedBuilder, Guild, Message, TextChannel } from "discord.js";
import CommandMessage from "./CommandMessage";

export default class MqttCommand extends CommandMessage {

    /** {@inheritdoc} */
    constructor() {
        super('mqtt');
    }


    /** {@inheritdoc} */
    public async handle(guild: Guild | null, commandArgs: string[], message: Message): Promise<void> {
        if (guild === null) {
            return;
        }

        let channel: TextChannel = <TextChannel>message.channel;
        let subCommand = commandArgs[0] ?? undefined;

        let embed = (new EmbedBuilder())
            .setTitle('Current MQTT Details')
            .addFields(
                { name: 'MQTT Host', value: 'mqtt.tnmesh.org', inline: true },
                { name: 'MQTT Username', value: 'mqtt', inline: true },
                { name: 'MQTT Password', value: 'meshville', inline: true },
                { name: '`Primary` Channel Uplink', value: 'enabled' },
                { name: 'OK to MQTT', value: 'enabled' },
                { name: 'Root Topic', value: 'msh/US' },
            );

        await channel.send({ embeds: [embed] });
    }
}