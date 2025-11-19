import mallaAPI from "./ApiClient";

export interface NodeSearchNodeResponse {
    gateway_packet_count_24h: number;
    hex_id: string;
    hw_model: string;
    last_packet_str: string;
    last_packet_time: number;
    last_updated: number;
    long_name: string;
    node_id: number;
    packet_count_24h: number;
    primary_channel: string;
    role: string;
    short_name: string;
}

export interface NodeSearchResponse {
    is_popular: boolean;
    nodes: NodeSearchNodeResponse[];
    query: string;
    total_count: number;
}

export async function searchNode(nodeId: string) {
    return await mallaAPI.get<NodeSearchResponse>(`/nodes/search?q=${nodeId}`);
}