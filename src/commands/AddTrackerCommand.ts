import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import Command from "./Command";
import logger from "../Logger";
import meshRedis from "../../src/MeshRedis";
import { fetchNodeId } from "../NodeUtils";
import { fetchUserRoles } from "../DiscordUtils";

export default class AddTrackerCommand extends Command {

    constructor() {
        super("addtracker");
    }

    public async handle(interaction: ChatInputCommandInteraction): Promise<void> {
        // logger.info(interaction.user);
        const roles: string[] = await fetchUserRoles(interaction.guild, interaction.user.id);
        // logger.info(roles);
        if (roles && (roles.includes("Moderator") || roles.includes("Admin"))) {
            let nodeId = fetchNodeId(interaction);

            if (!nodeId) {
                logger.warn("Received /addtracker command with no nodeid");
                await interaction.reply({
                    content: "Please provide a nodeid",
                    ephemeral: true,
                });
                return;
            }

            meshRedis.addTrackerNode(nodeId);

            await interaction.reply({
                content: "Node added to tracking list.",
                flags: MessageFlags.Ephemeral,
            });
        } else {
            await interaction.reply({
                content: "You do not have permission to use this command",
                flags: MessageFlags.Ephemeral,
            });
            return;
        }
    }
}

