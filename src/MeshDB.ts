
import { PrismaClient } from "./generated/prisma/client";

class MeshDB {
    client: PrismaClient;

    constructor() {
        this.client = new PrismaClient();
    }

    async init() {
        return this.client.$connect
    }
}

const meshDB = new MeshDB();
export default meshDB;