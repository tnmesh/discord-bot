import { Node } from "generated/prisma/client";
import { LinksModel } from "generated/prisma/models";
import meshDB from "MeshDB";

export class LinkService {
    static getLinks(): LinksModel[] {
        meshDB.client.links.findMany().then((links) => {
            return links;
        })

        return [];
    }
}