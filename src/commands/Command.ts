import { ChatInputCommandInteraction, Guild } from "discord.js";

export default abstract class Command {
    protected name: string;

    constructor(name: string) {
        this.name = name;
    }

    abstract handle(guild: Guild, interaction: ChatInputCommandInteraction): Promise<void>;
}