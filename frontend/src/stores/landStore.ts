import { makeAutoObservable, runInAction } from "mobx";

import landService from "../services/landService";
import type { Land } from "../types/land";
import type { LandRequest } from "../types/landRequest";

class LandStore {
  lands: Land[] = [];
  loading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async getAll() {
    this.loading = true;
    this.error = null;

    try {
      const lands = await landService.getAll();

      runInAction(() => {
        this.lands = lands;
      });
    } catch (error) {
      runInAction(() => {
        this.error = "Failed to load lands.";
      });

      throw error;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async getMyLands() {
    this.loading = true;
    this.error = null;

    try {
      const lands = await landService.getMyLands();

      runInAction(() => {
        this.lands = lands;
      });

      return lands;
    } catch (error) {
      runInAction(() => {
        this.error = "Failed to load your lands.";
      });

      throw error;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async createLand(payload: LandRequest) {
    this.loading = true;
    this.error = null;

    try {
      const land = await landService.create(payload);

      runInAction(() => {
        this.lands.push(land);
      });

      return land;
    } catch (error) {
      runInAction(() => {
        this.error = "Failed to register land.";
      });

      throw error;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async updateLand(id: number | string, payload: LandRequest) {
    this.loading = true;
    this.error = null;

    try {
      const updatedLand = await landService.update(id, payload);

      runInAction(() => {
        this.lands = this.lands.map((land) =>
          land.id === Number(id) ? updatedLand : land,
        );
      });

      return updatedLand;
    } catch (error) {
      runInAction(() => {
        this.error = "Failed to update land.";
      });

      throw error;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async deleteLand(id: number | string) {
    this.loading = true;
    this.error = null;

    try {
      await landService.delete(id);

      runInAction(() => {
        this.lands = this.lands.filter((land) => land.id !== Number(id));
      });
    } catch (error) {
      runInAction(() => {
        this.error = "Failed to delete land.";
      });

      throw error;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async searchLands(latitude: number, longitude: number, radiusMeters: number) {
    this.loading = true;
    this.error = null;

    try {
      const lands = await landService.findWithinCircle(
        latitude,
        longitude,
        radiusMeters,
      );

      runInAction(() => {
        this.lands = lands;
      });

      return lands;
    } catch (error) {
      runInAction(() => {
        this.error = "Failed to search lands.";
      });

      throw error;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }
}

const landStore = new LandStore();

export default landStore;
