import { Plus, Upload, X } from "lucide-react";
import { useState } from "react"
import { storeAuthorsData } from "../../services/api";


export default function AddAuthors({isOpen, onClose, onAdd}) {
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);
    const [form, setForm] = useState({

        name: "",
        designation: "",
        avatar_url: null
    })

    if (!isOpen) return null


    const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    if (type === "file") {
      const file = files[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        setPreview(imageUrl); 
        setForm((prev) => ({
          ...prev,
          [name]: file, 
        }));
      }
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };


      
    const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
    
      const dataToSend = new FormData();
        dataToSend.append("name", form.name);
        dataToSend.append("designation", form.designation);
        dataToSend.append("linkedin_url", form. linkedin_url);
         dataToSend.append("whatsapp_url", form.whatsapp_url);
      
      if (form.avatar_url) {
        dataToSend.append("avatar_url", form.avatar_url);
      }

      const response = await storeAuthorsData(dataToSend);
      if (response) {
        setForm({ title: "", avatar_url: null, status: 1 });
        setPreview(null);
        if (onAdd) onAdd(); 
        onClose();
      }
    } catch (err) {
      console.error("Store error:", err);
      setError(err.message || "Failed to add new Team card.");
    } finally {
      setLoading(false);
    }
  };






  return (
     <div className="modal-overlay no-scrollbar">
      <div className="modal-panel">
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Add  Authors</h2>
            <p className="text-muted-foreground text-sm mt-1">Create a new Authors</p>
          </div>
          <button
            onClick={onClose}
            className="icon-btn"
            aria-label="Close"
            disabled={loading}
          >
            <X size={24} />
          </button>
        </div>

            {error && (
          <div className="mx-6 mt-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-sm">
            {error}
          </div>
        )}


          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Image Upload */}
            <div>
           <label className="upload-zone group block">

  {preview ? (
    <img
      src={preview}
      alt="Preview"
      className="w-full h-48 object-cover rounded-lg"
    />
  ) : (
    <>
      <Upload
        size={32}
        className="mx-auto mb-2 text-muted-foreground group-hover:text-accent transition-colors"
      />

      <p className="text-foreground font-medium">
        Drag and drop your image
      </p>

      <p className="text-muted-foreground text-sm">
        or click to select
      </p>
    </>
  )}

  <input
    type="file"
    name="avatar_url"
    accept="image/*"
    onChange={handleChange}
    className="hidden"
    disabled={loading}
  />
</label>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="glass-input"
                placeholder="Enter member name"
                disabled={loading}
              />
            </div>

              <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Designation</label>
              <input
                type="text"
                name="designation"
                value={form.designation}
                onChange={handleChange}
                className="glass-input"
                placeholder="Enter role"
                disabled={loading}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-6 border-t section-divider">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 btn-ghost"
              >
                Cancel
              </button>
               <button type="submit" className="flex-1 btn-primary flex items-center justify-center gap-2" disabled={loading}>
              <Plus size={18} />
              {loading ? "Adding..." : "Add Card"}
            </button>
            </div>
          </form>

      </div>
    </div>
  )
}
