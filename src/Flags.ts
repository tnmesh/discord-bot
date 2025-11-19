import { Node } from "generated/prisma/client";
import meshDB from "MeshDB";

export type FlagValue = number | boolean | string;
export interface FlagProperties {
    readonly key: string;
    readonly type: string;
    readonly default?: boolean | string | number;
}

export class Flags {
    static readonly SHOW_POSITION: FlagProperties = {
        key: 'showPosition',
        type: 'boolean',
        default: false
    };

    // static readonly DEAD_NODE_TTL: FlagProperties = {
    //     key: 'deadNodeTTL',
    //     type: 'number',
    //     default: 60 * 60
    // };

    // static readonly DEAD_NODE_ALERT: FlagProperties = {
    //     key: 'deadNodeAlert',
    //     type: 'boolean',
    //     default: false
    // };

    static getFlags(): FlagProperties[] {
        return Object.values(Flags) as FlagProperties[];
    }

    static getFlagProperties(key: string): FlagProperties | undefined {
        const flags = Flags.getFlags();

        return flags.find(flag => flag.key === key);
    }

    static async resetNodeFlags(node: Node): Promise<void> {
        Flags.getFlags().forEach(async (properties: FlagProperties) => {
            await meshDB.client.flag.upsert({
                update: {
                    value: properties.default
                },
                create: {
                    key: properties.key,
                    nodeId: node.id,
                    value: properties.default
                },
                where: {
                    nodeId_key: {
                        nodeId: node.id,
                        key: properties.key
                    }
                }
            })
        });
    }
}