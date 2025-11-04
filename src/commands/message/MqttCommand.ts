import { EmbedBuilder, Guild, Message, TextChannel } from "discord.js";
import CommandMessage from "./CommandMessage";
import meshDB from "../../MeshDB";
import { fetchUserRoles } from "../../DiscordUtils";

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

    /**
     * Add a link for a tag
     * @param channel
     * @param url
     * @returns
     */
    private async addLink(channel: TextChannel, url: string): Promise<void> {
        return await meshDB.client.links.create({
            data: {
                url: url,
                type: this.name,
                guildId: channel.guildId
            }
        }).then(() => {
            channel.send('Added link successfully');
        })
    }

    /**
     * Delete a link for a tag
     * @param channel
     * @param url
     * @returns
     */
    private async deleteLink(channel: TextChannel, url: string): Promise<void> {
        return await meshDB.client.links.delete({
            where: {
                url: url
            }
        }).then(() => {
            channel.send('Deleted link successfully');
        }, () => {
            channel.send('Link not found matching URL');
        })
    }

    /**
     * Display links for tag
     * @param channel
     */
    private async displayLinks(channel: TextChannel): Promise<void> {
        const links = await meshDB.client.links.findMany({
            where: {
                type: this.name,
                guildId: channel.guildId
            }
        });

        if (links.length === 0) {
            await channel.send('No links are currently stored');
            return;
        }

        let content: string = '';
        links.forEach(link => {
            content += `- ${link.url}\n`
        });

        await channel.send(content);
    }
}