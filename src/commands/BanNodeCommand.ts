import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import Command from "./Command";
import logger from "../Logger";
import meshRedis from "../MeshRedis";
import { fetchNodeId } from "../NodeUtils";
import { fetchUserRoles } from "../DiscordUtils";

export default class BanNodeCommand extends Command {

    constructor() {
        super("bannode");
    }

    public async handle(interaction: ChatInputCommandInteraction): Promise<void> {
        const roles = await fetchUserRoles(interaction.guild, interaction.user.id);
        if (roles && (roles.includes("Moderator") || roles.includes("Admin"))) {
            let nodeId = fetchNodeId(interaction);

            if (!nodeId) {
                logger.warn("Received /bannode command with no nodeid");
                await interaction.reply({
                    content: "Please provide a nodeid",
                    ephemeral: true,
                });
                return;
            }

            await meshRedis.addBannedNode(nodeId);

            await interaction.reply({
                content: "Node banned.",
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