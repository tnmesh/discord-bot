import { ChatInputCommandInteraction, CacheType, MessageFlags, Guild } from "discord.js";
import Command from "./Command";

export default class NodesCommand extends Command {

    constructor() {
        super("nodes");
    }

    public async handle(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
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