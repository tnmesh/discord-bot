import { ChatInputCommandInteraction, Guild, Message } from "discord.js";

export default abstract class CommandMessage {
    protected name: string;

    constructor(name: string) {
        this.name = name;
    }

    abstract handle(guild: Guild, commandArgs: string[], message: Message): Promise<void>;
}