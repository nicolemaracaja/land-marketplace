import api from "./api";
import type { Land } from "../types/land";
import type { LandRequest } from "../types/landRequest";

const API_URL = "/lands";

class LandService {
  /**
   * Lists all lands.
   */
  async getAll(): Promise<Land[]> {
    const response = await api.get<Land[]>(API_URL);
    return response.data;
  }

  /**
   * Finds a land by user.
   */
  async getMyLands(): Promise<Land[]> {
    const response = await api.get<Land[]>(`${API_URL}/my`);
    return response.data;
  }

  /**
   * Finds a land by ID.
   */
  async getById(id: number | string): Promise<Land> {
    const response = await api.get<Land>(`${API_URL}/${id}`);
    return response.data;
  }

  /**
   * Creates a new land.
   */
  async create(payload: LandRequest): Promise<Land> {
    const response = await api.post<Land>(API_URL, payload);
    return response.data;
  }

  /**
   * Updates an existing land.
   */
  async update(id: number | string, payload: LandRequest): Promise<Land> {
    const response = await api.put<Land>(`${API_URL}/${id}`, payload);
    return response.data;
  }

  /**
   * Deletes a land.
   */
  async delete(id: number | string): Promise<void> {
    await api.delete(`${API_URL}/${id}`);
  }

  /**
   * Finds lands that intersect a circle.
   */
  async findWithinCircle(
    latitude: number,
    longitude: number,
    radiusMeters: number,
  ): Promise<Land[]> {
    const response = await api.get<Land[]>(`${API_URL}/search`, {
      params: {
        latitude,
        longitude,
        radiusMeters,
      },
    });

    return response.data;
  }
}

const landService = new LandService();

export default landService;
