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

        let embed = (new EmbedBuilder())
            .setTitle('Current MQTT Details')
            .addFields(
                { name: 'MQTT Host', value: 'mqtt.tnmesh.org', inline: true },
                { name: 'MQTT Username', value: 'mqtt', inline: true },
                { name: 'MQTT Password', value: 'meshville', inline: true },
                { name: '`Primary` Channel Uplink', value: 'enabled' },
                { name: 'OK to MQTT', value: 'enabled' },
                { name: 'West Topic', value: 'msh/US/TN/West', inline: true },
                { name: 'Middle Topic', value: 'msh/US/TN/Middle', inline: true },
                { name: 'East Topic', value: 'msh/US/TN/East', inline: true },
            ).setFooter({ text: 'View @ tnmesh.org/mqtt'});

        await channel.send({ embeds: [embed] });
    }
}