import { ChatInputCommandInteraction, MessageFlags, userMention } from "discord.js";
import Command from "./Command";
import logger from "../Logger";
import { fetchNodeId } from "../NodeUtils";
import meshDB from "../MeshDB";

export default class UnlinkNodeCommand extends Command {

    constructor() {
        super("unlinknode");
    }

    public async handle(interaction: ChatInputCommandInteraction): Promise<void> {
        let nodeId = fetchNodeId(interaction);

        if (!nodeId) {
            logger.warn("Received /unlinknode command with no nodeid");
            await interaction.reply({
                content: "Please provide a nodeid",
                ephemeral: true,
            });
            return;
        }

        const nodeBelongsToUser: boolean = await this.nodeBelongsToUser(nodeId, interaction);

        if (nodeBelongsToUser === false) {
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