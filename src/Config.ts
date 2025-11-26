import * as fsPromises from 'fs/promises';
import logger from './Logger';

interface ConfigInterface {
    environment: string;
    discord: DiscordConfigInterface;
    availableLinkTypes: string[];
    mqtt: MqttConfigInterface;
    redis: RedisConfigInterface;
    version: string;
}

interface DiscordConfigInterface {
    token: string;
    clientId: string;
    guilds: GuildConfigMap[];
}

interface MqttConfigInterface {
    host: string;
    port: number;
    username: string;
    password: string;
}

interface RedisConfigInterface {
    dsn: string;
}

interface GuildConfigMap {
    [guildId: string]: GuildConfigInterface;
}

interface GuildConfigInterface {
    guildId: string;
    channelLongFast: string;
    channelMediumSlow: string;
    channelHighAltitudeBalloon: string;
    topics: string[];
}

class Config {
    content: ConfigInterface | undefined = undefined;

    public async init() {
        try {
            const fileContent = await fsPromises.readFile("./config.json", 'utf-8');
            this.content = JSON.parse(fileContent) as ConfigInterface;

            // this.validateConfiguration();
            logger.info(`Version: ${config.content.version}`);
            logger.info(`Environment: ${this.content.environment}`);
        } catch (error: any) {
            logger.error(error)
        }
    }

    public validateConfiguration() {
        if (this.content === undefined) {
            throw new Error('Missing config.json');
        }

        if (this.content.discord.guilds.length === 0) {
            throw new Error('No configured guilds. Exiting');
        }
    }
}

const config = new Config();
export default config;