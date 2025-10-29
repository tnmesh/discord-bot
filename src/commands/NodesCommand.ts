import { ChatInputCommandInteraction, CacheType, MessageFlags, Guild } from "discord.js";
import Command from "./Command";
import logger from "../Logger";
import meshRedis from "../../src/MeshRedis";
import { fetchNodeId } from "../NodeUtils";

export default class NodesCommand extends Command {

    constructor() {
        super("nodes");
    }

    public async handle(guild: Guild, interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
        let userArg = interaction.options.getUser('user');

        if (userArg === null) {
            userArg = interaction.user;
        }

        await interaction.reply({
            content: `hi ${userArg.displayName}`,
            flags: MessageFlags.Ephemeral,
        });
    }
}