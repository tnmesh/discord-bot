import * as fsPromises from 'fs/promises';
import logger from './Logger';

interface ConfigInterface {
    availableLinkTypes: string[];
}

class Config {
    content: ConfigInterface | undefined = undefined;

    public async init() {
        try {
            const fileContent = await fsPromises.readFile("./config.json", 'utf-8');
            this.content = JSON.parse(fileContent) as ConfigInterface;

            logger.info('Loading config.json');
        } catch (error: any) {
            logger.error(error)
        }
    }
}

const config = new Config();
export default config;