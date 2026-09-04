import api from "./api";

import type {
    Negotiation,
    NegotiationRequest,
} from "../types/negotiation";

const API_URL = "/negotiations";

class NegotiationService {

    /**
     * Creates a new negotiation.
     */
    async create(payload: NegotiationRequest): Promise<Negotiation> {
        const response = await api.post<Negotiation>(API_URL, payload);

        return response.data;
    }

    /**
     * Lists all negotiations of the authenticated user.
     */
    async getAll(): Promise<Negotiation[]> {
        const response = await api.get<Negotiation[]>(API_URL);

        return response.data;
    }

    /**
     * Finds a negotiation by ID.
     */
    async getById(id: number | string): Promise<Negotiation> {
        const response = await api.get<Negotiation>(
            `${API_URL}/${id}`,
        );

        return response.data;
    }

    /**
     * Accepts a negotiation.
     */
    async accept(id: number | string): Promise<Negotiation> {
        const response = await api.put<Negotiation>(
            `${API_URL}/${id}/accept`,
        );

        return response.data;
    }

    /**
     * Rejects a negotiation.
     */
    async reject(id: number | string): Promise<Negotiation> {
        const response = await api.put<Negotiation>(
            `${API_URL}/${id}/reject`,
        );

        return response.data;
    }

    /**
     * Cancels a negotiation.
     */
    async cancel(id: number | string): Promise<Negotiation> {
        const response = await api.put<Negotiation>(
            `${API_URL}/${id}/cancel`,
        );

        return response.data;
    }
}

const negotiationService = new NegotiationService();

export default negotiationService;