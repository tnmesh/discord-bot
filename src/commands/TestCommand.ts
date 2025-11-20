import { ChatInputCommandInteraction, CacheType, MessageFlags, Guild } from "discord.js";
import Command from "./Command";
import { fetchStats } from "../api/malla/Stats";
import logger from "../Logger";

export default class TestCommand extends Command {

    constructor() {
        super("test");
    }

    public async handle(interaction: ChatInputCommandInteraction): Promise<void> {
        const stats = await fetchStats();

        logger.info(stats?.active_nodes_24h);
    }
}