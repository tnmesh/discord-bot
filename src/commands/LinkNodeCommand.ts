import { ChatInputCommandInteraction, CacheType, MessageFlags, Guild } from "discord.js";
import Command from "./Command";
import logger from "../Logger";
import meshRedis from "../../src/MeshRedis";
import { fetchNodeId } from "../NodeUtils";

export default class LinkNodeCommand extends Command {

    constructor() {
        super("linknode");
    }

    public async handle(guild: Guild, interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
        let nodeId = fetchNodeId(interaction);

        if (!nodeId) {
            logger.warn("Received /linknode command with no nodeid");
            await interaction.reply({
                content: "Please provide a nodeid",
                ephemeral: true,
            });
            return;
        }

        // Get the invoking user's profile image URL.
        const profileImageUrl = interaction.user.displayAvatarURL({
            // dynamic: true,
            size: 1024,
        });

        // Log the desired output to the console.
        logger.info(`node: ${nodeId}, profile_image_url: ${profileImageUrl}`);

        const result = await meshRedis.linkNode(nodeId, interaction.user.id);

        logger.info(result);

        // Respond to the command to acknowledge receipt (ephemeral response).
        await interaction.reply({
            content: result,
            flags: MessageFlags.Ephemeral,
        });
    }
}