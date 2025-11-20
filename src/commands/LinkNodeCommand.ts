import { ChatInputCommandInteraction, CacheType, MessageFlags, userMention } from "discord.js";
import Command from "./Command";
import logger from "../Logger";
import { fetchNodeId } from "../NodeUtils";
import meshDB from "../MeshDB";

export default class LinkNodeCommand extends Command {

    constructor() {
        super("linknode");
    }

    public async handle(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
        let nodeId = fetchNodeId(interaction);

        if (!nodeId) {
            logger.warn("Received /linknode command with no nodeid");
            await interaction.reply({
                content: "Please provide a nodeid",
                ephemeral: true,
            });
            return;
        }

        const nodeHasOwner: boolean = await this.nodeHasOwner(nodeId);

        if (nodeHasOwner === true) {
            await interaction.reply({
                content: "This node is already linked to an account",
                flags: MessageFlags.Ephemeral,
            });
            return;
        }

        await meshDB.client.node.upsert({
            update: {
                discordId: {
                    set: interaction.user.id,
                }
            },
            create: {
                discordId: interaction.user.id,
                hexId: nodeId
            },
            where: {
                hexId: nodeId
            }
        }).then(() => {
            interaction.reply({
                content: `Node linked to ${userMention(interaction.user.id)}`,
                flags: MessageFlags.Ephemeral,
            });
        });
    }
}