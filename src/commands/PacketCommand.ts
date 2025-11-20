import { ChatInputCommandInteraction } from "discord.js";
import Command from "./Command";

export default class PacketCommand extends Command {

    constructor() {
        super("packet");
    }

    public async handle(interaction: ChatInputCommandInteraction): Promise<void> {


    }
}