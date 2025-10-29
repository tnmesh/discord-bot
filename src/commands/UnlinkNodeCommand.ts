import { ChatInputCommandInteraction, CacheType, MessageFlags, Guild } from "discord.js";
import Command from "./Command";
import logger from "../Logger";
import meshRedis from "../../src/MeshRedis";
import { fetchNodeId } from "../NodeUtils";

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

        const result = await meshRedis.unlinkNode(nodeId, interaction.user.id);
        await interaction.reply({
            content: result,
            flags: MessageFlags.Ephemeral,
        });
    }
}