import ApiClient, { ApiOptions } from "../ApiClient";

class MallaApiClient extends ApiClient {

    public async get<T>(endpoint: string, options?: ApiOptions): Promise<T> {
        const response = super.get(endpoint, options);

        if (response === null || response === undefined) {
            throw new Error('Invalid response from Malla');
        }

        return response as T;
    }

}

const mallaAPI = new MallaApiClient('https://malla.tnmesh.org/api');
export default mallaAPI;