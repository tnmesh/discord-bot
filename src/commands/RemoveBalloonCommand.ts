import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import Command from "./Command";
import logger from "../Logger";
import meshRedis from "../MeshRedis";
import { fetchNodeId } from "../NodeUtils";
import { fetchUserRoles } from "../DiscordUtils";

export default class RemoveBalloonCoomand extends Command {

    constructor() {
        super("removeballoon");
    }

    public async handle(interaction: ChatInputCommandInteraction): Promise<void> {
        // logger.info(interaction.user);
        const roles = await fetchUserRoles(interaction.guild, interaction.user.id);
        // logger.info(roles);
        if (roles && (roles.includes("Moderator") || roles.includes("Admin"))) {
            let nodeId = fetchNodeId(interaction);

            if (!nodeId) {
                logger.warn("Received /removeballoon command with no nodeid");
                await interaction.reply({
                    content: "Please provide a nodeid",
                    ephemeral: true,
                });
                return;
            }

            meshRedis.removeBalloonNode(nodeId);

            await interaction.reply({
                content: "Node removed from balloon list",
                flags: MessageFlags.Ephemeral,
            });
        }
    }
}

