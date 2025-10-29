import { ChatInputCommandInteraction, CacheType, MessageFlags, Guild } from "discord.js";
import Command from "./Command";
import logger from "../Logger";
import meshRedis from "../MeshRedis";
import { fetchNodeId } from "../NodeUtils";
import { fetchUserRoles } from "../DiscordUtils";

export default class UnbanNodeCommand extends Command {

    constructor() {
        super("unbannode");
    }

    public async handle(guild: Guild, interaction: ChatInputCommandInteraction): Promise<void> {
        const roles = await fetchUserRoles(guild, interaction.user.id);
        if (roles && (roles.includes("Moderator") || roles.includes("Admin"))) {
            let nodeId = fetchNodeId(interaction);

            if (!nodeId) {
                logger.warn("Received /unbannode command with no nodeid");
                await interaction.reply({
                    content: "Please provide a nodeid",
                    ephemeral: true,
                });
                return;
            }

            await meshRedis.removeBannedNode(nodeId);

            await interaction.reply({
                content: "Node unbanned.",
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