import { ChatInputCommandInteraction, Guild } from "discord.js";
import Command from "./Command";

export default class PacketCommand extends Command {

    constructor() {
        super("packet");
    }

    public async handle(guild: Guild, interaction: ChatInputCommandInteraction): Promise<void> {


    }
}