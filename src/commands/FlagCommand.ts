import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import Command from "@commands/Command";
import meshDB from "MeshDB";
import { Flag, Node } from "generated/prisma/client";
import { FlagProperties, Flags, FlagValue } from "Flags";
import { FlagRepository } from "@repositories/FlagRepository";

const typeMap = {
    'boolean': Boolean,
    'string': String,
    'number': Number
}

export default class FlagCommand extends Command {

    static commands: object = {
        'set': this.setCommand,
        'get': this.getCommand,
    };

    constructor() {
        super("flag");
    }

    public async handle(interaction: ChatInputCommandInteraction): Promise<void> {
        const nodeId = this.fetchNodeId(interaction);
        const command = interaction.options.getString('command');

        if (!nodeId) {
            await interaction.reply({
                content: "Please provide a valid `nodeid` that you own",
                ephemeral: true,
            });
            return;
        }

        await this.handleCommand(command, nodeId, interaction);
    }

    /**
     * Handle flag command
     * @param command
     * @param nodeId
     * @param interaction
     * @returns
     */
    private async handleCommand(command: string, nodeId: string, interaction: ChatInputCommandInteraction): Promise<void> {
        if (!FlagCommand.commands[command]) {
            return;
        }

        await FlagCommand.commands[command](nodeId, interaction);
    }

    /**
     * `set` command handler
     * @param nodeId
     * @param interaction
     * @returns
     */
    private static async setCommand(nodeId: string, interaction: ChatInputCommandInteraction): Promise<void> {
        const node = await FlagCommand.getNodeForUser(nodeId, interaction);

        if (!node) {
            return;
        }

        const key = interaction.options.getString('key');

        let value: FlagValue | null = null;

        try {
            value = <FlagValue>(interaction.options.get('value', true)).value;
        } catch (error) {
            await interaction.reply({ content: `:flag_white: Please provide a \`value\``, flags: MessageFlags.Ephemeral });
            return;
        }

        // get flag properties if they exist
        const flagProperties: FlagProperties | undefined = Flags.getFlagProperties(key);
        if (flagProperties === undefined) {
            await interaction.reply({ content: `:flag_white: Flag \'${key}\' does not exist`, flags: MessageFlags.Ephemeral });
            return;
        }

        const type = typeMap[flagProperties.type]

        // convert to type defined by flag
        switch (type) {
            case Boolean:
                value = value.toString().toLowerCase();

                if (value !== 'false' && value !== 'true') {
                    await interaction.reply({ content: `:flag_white: \`${key}\` must be either \`true\` or \`false\``, flags: MessageFlags.Ephemeral });
                    return;
                }

                value = value === 'true';
                break;
            case Number:
                value = Number(value);
                break;
        }

        // one final type check
        if (typeof value !== flagProperties.type) {
            await interaction.reply({ content: `:flag_white: \`${key}\` must be of type \`${flagProperties.type}\``, flags: MessageFlags.Ephemeral });
            return;
        }

        // is the value different from the current value set, if one already exists
        const flag: Flag = await FlagRepository.getFlag(node, key);
        if (flag && flag.value === value) {
            await interaction.reply({ content: `:flag_white: \`${key}\` **is already set to** \`${value.toString()}\` **for** \`!${node.hexId}\``, flags: MessageFlags.Ephemeral });
            return;
        }

        // add flag to node with key and value
        await FlagRepository.setFlag(node, key, value);

        await interaction.reply({ content: `:flag_white: \`${key}\` **is now set to** \`${value.toString()}\` **for** \`!${node.hexId}\``, flags: MessageFlags.Ephemeral });
    }

    /**
     * `get` command handler
     * @param nodeId
     * @param interaction
     * @returns
     */
    private static async getCommand(nodeId: string, interaction: ChatInputCommandInteraction): Promise<void> {
        const node = await FlagCommand.getNodeForUser(nodeId, interaction);

        const key = interaction.options.getString('key');
        const flagProperties: FlagProperties | undefined = Flags.getFlagProperties(key);

        if (flagProperties === undefined) {
            await interaction.reply({ content: `:flag_white: Flag \'${key}\' does not exist`, flags: MessageFlags.Ephemeral });
            return;
        }

        const flag = await FlagRepository.getFlag(node, key);
        if (flag === null) {
            await interaction.reply({ content: `:flag_white: \`${key}\` **is currently set to** \`${flagProperties.default.toString()}\` **for** \`!${node.hexId}\``, flags: MessageFlags.Ephemeral });
            return;
        }

        let value = flag.value;
        const type = typeMap[flagProperties.type]

        if (typeof value !== flagProperties.type) {
            return;
        }

        switch (type) {
            case Boolean:
                value = value.toString().toLowerCase();

                value = value === 'true';
                break;
            case Number:
                value = Number(value)
                break;
        }

        await interaction.reply({ content: `:flag_white: \`${key}\` **is currently set to** \`${value.toString()}\` **for** \`!${node.hexId}\``, flags: MessageFlags.Ephemeral });
    }

    private static async getNodeForUser(nodeId: string, interaction: ChatInputCommandInteraction): Promise<Node | null> {
        const node = await meshDB.client.node.findFirst({
            where: {
                hexId: nodeId
            }
        });

        if (!node) {
            await interaction.reply({ content: 'This node has not been seen yet by an MQTT gateway node', flags: MessageFlags.Ephemeral });
            return null;
        }

        // @todo
        if (!node.discordId) {
            await interaction.reply({ content: 'This node is not linked to anyone. If you own this node, use the `/linknode` command', flags: MessageFlags.Ephemeral });
            return null;
        }

        if (node.discordId !== interaction.user.id) {
            await interaction.reply({ content: 'This node does not belong to you', flags: MessageFlags.Ephemeral });
            return null;
        }

        return node;
    }
}


