import mallaAPI from "./ApiClient";

export interface AnalyticsResponse {
    gateway_distribution: GatewayDistrubutionResponse[];
    node_statistics: NodeStatisticsResponse;
}

export interface NodeStatisticsResponse {
    active_nodes: number;
    activity_distrubution: ActivityDistributionResponse;
    activity_rate: number;
    inactive_nodes: number;
    total_nodes: number;
}

export interface ActivityDistributionResponse {
    inactive: number;
    lightly_active: number;
    moderately_active: number;
    very_active: number;
}

export interface GatewayDistrubutionResponse {
    gateway_id: string;
    percentage_of_total: number;
    success_rate: number;
    successful_packets: number;
    total_packets: number;
}


export async function getAnalytics() {
    return await mallaAPI.get<AnalyticsResponse>('/analytics');
}