import { ChatInputCommandInteraction, CacheType, MessageFlags, Guild, userMention } from "discord.js";
import Command from "./Command";
import logger from "../Logger";
import { fetchNodeId } from "../NodeUtils";
import meshDB from "../MeshDB";
import { Flag, Node } from "generated/prisma/client";

export default class UnlinkNodeCommand extends Command {

    constructor() {
        super("unlinknode");
    }

    public async handle(guild: Guild, interaction: ChatInputCommandInteraction): Promise<void> {
        let nodeId = fetchNodeId(interaction);

        if (!nodeId) {
            logger.warn("Received /unlinknode command with no nodeid");
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

        await meshDB.client.node.update({
            data: {
                discordId: null
            },
            where: {
                hexId: nodeId
            }
        }).then(() => {
            interaction.reply({
                content: `Node unlinked from ${userMention(interaction.user.id)}`,
                flags: MessageFlags.Ephemeral,
            });

            // maybe instead reset flags back to defaults
            meshDB.client.flag.deleteMany({
                where: {
                    node: {
                        hexId: nodeId
                    }
                }
            })
        });
    }
}