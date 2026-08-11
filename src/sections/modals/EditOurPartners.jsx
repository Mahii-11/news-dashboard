import { Check, Upload, X } from "lucide-react";
import { useState } from "react";
import { updatePartnerData } from "../../services/api"; 

export default function EditOurPartners({ isOpen, onClose, onRefresh, item }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(item?.image || null);
  
  const [formData, setFormData] = useState({
    name: item?.name || "",
    image: item?.image || "",
    status: item?.status ?? 1
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    if (type === "file") {
      const file = files[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        setPreview(imageUrl);
        setFormData((prev) => ({ ...prev, [name]: file }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const dataToSend = new FormData();
      dataToSend.append("name", formData.name);
      dataToSend.append("status", formData.status);
      dataToSend.append("_method", "POST"); 

      if (formData.image) {
        dataToSend.append("image", formData.image);
      }

      const response = await updatePartnerData(item?.id, dataToSend);
      if (response) {
        setPreview(null);
        if (onRefresh) onRefresh();
        onClose();
      }
    } catch (err) {
      console.error("Update error:", err);
      setError(err.message || "Failed to update highlight card.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setPreview(null);
    onClose();
  };

  return (
    <div className="modal-overlay no-scrollbar">
      <div className="modal-panel max-w-xl">
        <div className="modal-header">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Edit Partner University Card</h2>
            <p className="text-muted-foreground text-sm mt-1">Modify the existing highlight card information</p>
          </div>
          <button onClick={handleCloseModal} className="icon-btn" disabled={loading}>
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">leading companies Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="glass-input"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">leading companies image</label>
            <label className="upload-zone group block cursor-pointer border-2 border-dashed border-accent/20 rounded-xl p-6 text-center hover:bg-accent/5 transition-all">
              {preview ? (
                <div className="relative">
                  <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
                    <p className="text-white text-sm font-medium">Change image</p>
                  </div>
                </div>
              ) : (
                <>
                  <Upload size={32} className="mx-auto mb-2 text-muted-foreground group-hover:text-accent transition-colors" />
                  <p className="text-foreground font-medium">Drag and drop your image</p>
                  <p className="text-muted-foreground text-sm">or click to select</p>
                </>
              )}

              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
                disabled={loading}
              />
            </label>
          </div>

          <div className="flex gap-3 pt-4 border-t section-divider">
            <button type="button" onClick={handleCloseModal} className="flex-1 btn-ghost" disabled={loading}>Cancel</button>
            <button type="submit" className="flex-1 btn-primary flex items-center justify-center gap-2" disabled={loading}>
              <Check size={18} /> {loading ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}