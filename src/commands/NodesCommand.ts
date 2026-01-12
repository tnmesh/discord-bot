import { ChatInputCommandInteraction, CacheType, MessageFlags, EmbedAuthorOptions } from "discord.js";
import { nodeHex2id} from "../NodeUtils";
import Command from "./Command";
import meshDB from "MeshDB";
import { Pagination } from "pagination.djs";

export default class NodesCommand extends Command {

    constructor() {
        super("nodes");
    }

    public async handle(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
        let userArg = interaction.options.getUser('user');

        if (userArg === null) {
            userArg = interaction.user;
        }

        await meshDB.client.node.findMany({
            where: {
                discordId: userArg.id
            }
        }).then((nodes) => {
            if (nodes.length === 0) {
                interaction.reply({
                    content: "No nodes found for user",
                    flags: MessageFlags.Ephemeral,
                });
                return;
            }

            const fields = [];
            nodes.forEach(node => {
                fields.push({
                    name: `[!${node.hexId}] ${node.longName ?? 'Unknown'}`,
                    value: `[View on Malla](https://malla.tnmesh.org/node/${nodeHex2id(node.hexId)})`
                })
            });

            const pagination = new Pagination(interaction);
            const authorOptions: EmbedAuthorOptions = {
                name: userArg.displayName,
                iconURL: userArg.displayAvatarURL().toString()
            };

            pagination.setFields(fields);
            pagination.setTitle('Linked Nodes')
            pagination.setAuthor(authorOptions)
            pagination.setEphemeral(true);
            pagination.paginateFields();
            pagination.render();
        })
    }
}