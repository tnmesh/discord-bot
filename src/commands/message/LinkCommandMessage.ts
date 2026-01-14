import { Guild, Message, TextChannel } from "discord.js";
import CommandMessage from "./CommandMessage";
import meshDB from "../../MeshDB";
import { fetchUserRoles } from "../../DiscordUtils";
import logger from "../../Logger";

export default class LinkCommandMessage extends CommandMessage {

    /** {@inheritdoc} */
    constructor(tag: string) {
        super(tag);
    }


    /** {@inheritdoc} */
    public async handle(guild: Guild | null, commandArgs: string[], message: Message): Promise<void> {
        if (guild === null) {
            return;
        }

        let channel: TextChannel = <TextChannel>message.channel;
        let subCommand = commandArgs[0] ?? undefined;

        if (subCommand === undefined) {
            return await this.displayLinks(channel);
        }

        const roles: string[] = await fetchUserRoles(guild, message.author.id);

        if (roles.length === 0 || !roles.includes("Admin")) {
            await channel.send('You do not have permission to use this command');
            return;
        }

        let subCommandArgument = commandArgs[1] ?? undefined;

        switch(subCommand) {
            case 'add':
                if (subCommandArgument === undefined) {
                    await channel.send(`Usage: !${this.name} add <url>`);
                    return;
                }

                this.addLink(channel, subCommandArgument);
                break;
            case 'del':
            case 'delete':
                if (subCommandArgument === undefined) {
                    await channel.send(`Usage: !${this.name} del <url>`);
                    return;
                }

                this.deleteLink(channel, subCommandArgument);
                break;
            // case 'set-affiliate':
            //     if (subCommandArgument === undefined || !['true', 'false'].includes(subCommandArgument.toLowerCase())) {
            //         await channel.send(`Usage: !${this.name} set-affiliate <true|false>`);
            //         return;
            //     }

            //     const flag = subCommandArgument === 'true';
            //     this.setAffiliateFlag(channel, flag);
            //     break;
            default:
                await channel.send(`Unrecongnized sub-command: ${subCommand}`);
        }
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

    // private async setAffiliateFlag(channel: TextChannel, flag: boolean): Promise<void> {
    //     return await meshDB.client.links.update({
    //         data: {
    //             isAffiliate: flag
    //         },
    //         where: {
    //             type: this.name,
    //             guildId: channel.guildId,
    //         }
    //     }).then(() => {
    //         if (flag) {
    //             channel.send(`!${this.name} is marked as affiliate`);
    //             return;
    //         }

    //         channel.send(`!${this.name} is no longer marked as affiliate`);
    //     }, () => {
    //         channel.send('Link not found matching URL');
    //     })
    // }

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

        let hasAffiliate = false;

        let rows = [];
        links.forEach(link => {
            rows.push(`- ${link.url}`);
            hasAffiliate ||= link.isAffiliate
        });

        if (rows.length === 1) {
            rows = [];
            rows.push(`${links[0].url}`);
        }

        if (hasAffiliate) {
            if (rows.length === 1) {
                rows.unshift('Support our infrastructure by using our affiliate link!');
            } else {
                rows.unshift('Support our infrastructure by using our affiliate links!');
            }
        }

        await channel.send(rows.join('\n'));
    }
}