import { makeAutoObservable, runInAction } from "mobx";

import api from "../services/api";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  createdAt: string;
};

class AuthStore {
  user: AuthUser | null = null;
  loading = true;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get isAuthenticated() {
    return this.user !== null;
  }

  async loadUser() {
    this.loading = true;
    this.error = null;

    try {
      const response = await api.get<AuthUser>("/auth/me");

      runInAction(() => {
        this.user = response.data;
      });
    } catch (error) {
      runInAction(() => {
        this.user = null;
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async logout() {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      runInAction(() => {
        this.user = null;
      });
    }
  }

  setUser(user: AuthUser) {
    this.user = user;
  }

  clearUser() {
    this.user = null;
  }
}

const authStore = new AuthStore();

export default authStore;