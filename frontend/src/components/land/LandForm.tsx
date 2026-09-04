import { useState } from "react";

import type { PolygonGeometry } from "../../types/geometry";
import type { LandRequest } from "../../types/landRequest";

import landStore from "../../stores/landStore";
import Toast, { ToastType } from "../commons/Toast";

type LandFormProps = {
  geometry: PolygonGeometry | null;
  onClose: () => void;
};

function LandForm({ geometry, onClose }: LandFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    contact: "",
  });

  const [toast, setToast] = useState<{
    type: ToastType;
    message: string;
  } | null>(null);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!geometry) {
      return;
    }

    const price = Number(formData.price);

    if (!Number.isFinite(price) || price <= 0) {
      setToast({
        type: "warning",
        message: "Please enter a valid price.",
      });
      return;
    }

    const land: LandRequest = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price,
      contact: formData.contact.trim(),
      geometry,
    };

    try {
      await landStore.createLand(land);

      setToast({
        type: "success",
        message: "Land registered successfully!",
      });

      setFormData({
        name: "",
        description: "",
        price: "",
        contact: "",
      });

      onClose();
    } catch (error) {
      console.error("Failed to register land:", error);

      setToast({
        type: "error",
        message: "The selected area overlaps an existing property.",
      });
    }
  }

  if (!geometry) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Register Land</h2>
            <p className="mt-1 text-sm text-slate-500">
              Fill in the information about the land.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={landStore.loading}
            className="text-xl text-slate-400 transition hover:text-slate-700"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              minLength={2}
              placeholder="Land name"
              disabled={landStore.loading}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              minLength={5}
              rows={3}
              placeholder="Describe the land"
              disabled={landStore.loading}
              className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="price"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Price
            </label>

            <input
              id="price"
              name="price"
              type="number"
              min="0.01"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              required
              placeholder="0.00"
              disabled={landStore.loading}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="contact"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Contact
            </label>

            <input
              id="contact"
              name="contact"
              type="text"
              value={formData.contact}
              onChange={handleChange}
              required
              placeholder="Email or phone"
              disabled={landStore.loading}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={landStore.loading}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={landStore.loading}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              {landStore.loading ? "Registering..." : "Register Land"}
            </button>
          </div>
        </form>
      </div>
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default LandForm;
