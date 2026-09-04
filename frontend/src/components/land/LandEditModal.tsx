import { useEffect, useState } from "react";
import { LandRequest } from "../../types/landRequest";
import { Land } from "../../types/land";

type EditLandModalProps = {
  land: Land;
  onSave: (data: LandRequest) => Promise<void>;
  onClose: () => void;
};

function EditLandModal({ land, onSave, onClose }: EditLandModalProps) {
  const [name, setName] = useState(land.name);
  const [description, setDescription] = useState(land.description);
  const [price, setPrice] = useState(String(land.price));
  const [contact, setContact] = useState(land.contact);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(land.name);
    setDescription(land.description);
    setPrice(String(land.price));
    setContact(land.contact);
  }, [land]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const numericPrice = Number(price);

    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      return;
    }

    setLoading(true);

    try {
      await onSave({
        name: name.trim(),
        description: description.trim(),
        price: numericPrice,
        contact: contact.trim(),
        geometry: land.geometry,
      });

      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[9997] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Edit Land</h2>

            <p className="mt-1 text-sm text-slate-500">
              Update your property's information.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="edit-name"
              className="block text-sm font-semibold text-slate-700"
            >
              Name
            </label>

            <input
              id="edit-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="edit-description"
              className="block text-sm font-semibold text-slate-700"
            >
              Description
            </label>

            <textarea
              id="edit-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
              rows={3}
              className="mt-2 w-full resize-none rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="edit-price"
              className="block text-sm font-semibold text-slate-700"
            >
              Price
            </label>

            <input
              id="edit-price"
              type="number"
              min="0.01"
              step="0.01"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              required
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="edit-contact"
              className="block text-sm font-semibold text-slate-700"
            >
              Contact
            </label>

            <input
              id="edit-contact"
              type="text"
              value={contact}
              onChange={(event) => setContact(event.target.value)}
              required
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditLandModal;
