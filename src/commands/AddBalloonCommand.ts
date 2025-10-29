import { ChatInputCommandInteraction, CacheType, MessageFlags, Guild } from "discord.js";
import Command from "./Command";
import logger from "../Logger";
import meshRedis from "../MeshRedis";
import { fetchNodeId } from "../NodeUtils";
import { fetchUserRoles } from "../DiscordUtils";

export default class AddBalloonCommand extends Command {

    constructor() {
        super("addballoon");
    }

    public async handle(guild: Guild, interaction: ChatInputCommandInteraction): Promise<void> {
        // logger.info(interaction.user);
        const roles = await fetchUserRoles(guild, interaction.user.id);
        // logger.info(roles);
        if (roles && (roles.includes("Moderator") || roles.includes("Admin"))) {
            let nodeId = fetchNodeId(interaction);

            if (!nodeId) {
                logger.warn("Received /addballoon command with no nodeid");
                await interaction.reply({
                    content: "Please provide a nodeid",
                    ephemeral: true,
                });
                return;
            }

            meshRedis.addBalloonNode(nodeId);

            await interaction.reply({
                content: "Node added to balloon list.",
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

