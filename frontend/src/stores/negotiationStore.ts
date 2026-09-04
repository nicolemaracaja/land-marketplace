import { makeAutoObservable, runInAction } from "mobx";

import negotiationService from "../services/negotiationService";
import type { Negotiation } from "../types/negotiation";

class NegotiationStore {
  negotiations: Negotiation[] = [];
  loading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async getAll() {
    this.loading = true;
    this.error = null;

    try {
      const negotiations = await negotiationService.getAll();

      runInAction(() => {
        this.negotiations = negotiations;
      });

      return negotiations;
    } catch (error) {
      runInAction(() => {
        this.error = "Failed to load negotiations.";
      });

      throw error;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async getById(id: number) {
    try {
      return await negotiationService.getById(id);
    } catch (error) {
      runInAction(() => {
        this.error = "Failed to load negotiation details.";
      });

      throw error;
    }
  }

  async create(landId: number, offer: number) {
    this.loading = true;
    this.error = null;

    try {
      const negotiation = await negotiationService.create({
        landId,
        offer,
      });

      runInAction(() => {
        this.negotiations = [negotiation, ...this.negotiations];
      });

      return negotiation;
    } catch (error) {
      runInAction(() => {
        this.error = "Failed to create negotiation.";
      });

      throw error;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async accept(id: number) {
    this.loading = true;
    this.error = null;

    try {
      const negotiation = await negotiationService.accept(id);

      this.updateNegotiation(negotiation);

      return negotiation;
    } catch (error) {
      runInAction(() => {
        this.error = "Failed to accept negotiation.";
      });

      throw error;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async reject(id: number) {
    this.loading = true;
    this.error = null;

    try {
      const negotiation = await negotiationService.reject(id);

      this.updateNegotiation(negotiation);

      return negotiation;
    } catch (error) {
      runInAction(() => {
        this.error = "Failed to reject negotiation.";
      });

      throw error;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async cancel(id: number) {
    this.loading = true;
    this.error = null;

    try {
      const negotiation = await negotiationService.cancel(id);

      this.updateNegotiation(negotiation);

      return negotiation;
    } catch (error) {
      runInAction(() => {
        this.error = "Failed to cancel negotiation.";
      });

      throw error;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  private updateNegotiation(updated: Negotiation) {
    runInAction(() => {
      const index = this.negotiations.findIndex(
        (negotiation) => negotiation.id === updated.id,
      );

      if (index !== -1) {
        this.negotiations[index] = updated;
      }
    });
  }
}

const negotiationStore = new NegotiationStore();

export default negotiationStore;
