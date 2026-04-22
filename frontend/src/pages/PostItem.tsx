import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { createItem } from "../services/itemService";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

const CATEGORIES = [
  "Electronics",
  "Documents",
  "Keys",
  "Wallet",
  "Clothing",
  "Bag",
  "Jewellery",
  "Other",
];

const PostItem = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    status: "lost",
    location: "",
    image_url: "",
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await createItem({
        ...form,
        status: form.status as "lost" | "found",
        image_url: form.image_url || null,
      });
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to post item.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-h1 text-h1 text-on-surface mb-2">Report an Item</h1>
      <p className="text-body-lg text-on-surface-variant mb-8">
        Fill in the details to report a lost or found item.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-outline-variant shadow-sm p-8 flex flex-col gap-5"
      >
        {/* Status Toggle */}
        <div className="flex flex-col gap-1">
          <label className="text-label-md font-label-md text-on-surface">
            Type
          </label>
          <div className="flex p-1 bg-surface-container rounded-xl w-fit">
            {["lost", "found"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => update("status", s)}
                className={`px-6 py-2 rounded-lg font-label-md capitalize transition-all cursor-pointer ${
                  form.status === s
                    ? "bg-white shadow-sm text-primary"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <Input
          id="post-title"
          label="Title"
          placeholder="e.g. Blue Backpack"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          required
        />

        <div className="flex flex-col gap-1">
          <label
            htmlFor="post-description"
            className="text-label-md font-label-md text-on-surface"
          >
            Description
          </label>
          <textarea
            id="post-description"
            rows={3}
            placeholder="Describe the item in detail..."
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg text-body-sm px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent resize-none"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="post-category"
            className="text-label-md font-label-md text-on-surface"
          >
            Category
          </label>
          <select
            id="post-category"
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg text-body-sm px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent"
            required
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <Input
          id="post-location"
          label="Location"
          placeholder="Where was it lost / found?"
          icon="location_on"
          value={form.location}
          onChange={(e) => update("location", e.target.value)}
          required
        />

        <Input
          id="post-image"
          label="Image URL (optional)"
          placeholder="https://..."
          icon="image"
          value={form.image_url}
          onChange={(e) => update("image_url", e.target.value)}
        />

        {error && (
          <div className="bg-error-container text-on-error-container text-label-sm p-3 rounded-lg">
            {error}
          </div>
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full mt-2">
          {isSubmitting ? "Posting..." : "Post Item"}
        </Button>
      </form>
    </div>
  );
};

export default PostItem;
