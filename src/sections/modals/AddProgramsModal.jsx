import { Plus, Upload, X } from "lucide-react";
import { useState } from "react";
import { storeProgramsData } from "../../services/api"; 

export default function AddProgramsModal({ isOpen, onClose, onAdd }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    university: "",
    country: "",
    duration: "",
    mode: "ON CAMPUS",
    logo: null,
    trending: 0,
    status: 1
  });

  if (!isOpen) return null;
  

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;

    if (type === "file") {
      const file = files[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        setPreview(imageUrl); 
        setFormData((prev) => ({
          ...prev,
          [name]: file, 
        }));
      }
    } else if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked ? 1 : 0,
      }));
    } else {
      setFormData((prev) => ({
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
      dataToSend.append("title", formData.title);
      dataToSend.append("university", formData.university);
      dataToSend.append("country", formData.country);
      dataToSend.append("duration", formData.duration);
      dataToSend.append("mode", formData.mode);
      dataToSend.append("trending", formData.trending);
      dataToSend.append("status", formData.status);
      
      if (formData.logo) {
        dataToSend.append("logo", formData.logo);
      }

      const response = await storeProgramsData(dataToSend);
      if (response) {
        
        setFormData({ 
          title: "", 
          university: "",
          country: "",
          duration: "",
          mode: "",
          logo: null, 
          trending: 0,
          status: 1 
        });
        setPreview(null);
        if (onAdd) onAdd(); 
        onClose();
      }
    } catch (err) {
      console.error("Store error:", err);
      setError(err.message || "Failed to add new academic program.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setPreview(null);
    onClose();
  };

  return (
    <div className="modal-overlay no-scrollbar p-4">
      <div className="modal-panel max-w-2xl">
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Add New Program</h2>
            <p className="text-muted-foreground text-sm mt-1">Create a new academic degree or student path</p>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          
          {/* Program Title */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Program Title *</label>
            <input
              type="text"
              name="title"
              placeholder="e.g., B.Sc. in Computer Science"
              value={formData.title}
              onChange={handleChange}
              className="glass-input"
              required
              disabled={loading}
            />
          </div>

          {/* University & Country (Flex Group) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">University *</label>
              <input
                type="text"
                name="university"
                placeholder="e.g., Schmalkalden University"
                value={formData.university}
                onChange={handleChange}
                className="glass-input"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Country Code *</label>
              <input
                type="text"
                name="country"
                placeholder="e.g., Germany"
                value={formData.country}
                onChange={handleChange}
                className="glass-input"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Duration & Mode (Flex Group) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Duration *</label>
              <input
                type="text"
                name="duration"
                placeholder="e.g., 3.5 Years"
                value={formData.duration}
                onChange={handleChange}
                className="glass-input"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Study Mode *
              </label>
              <select
                name="mode"
                value={formData.mode}
                onChange={handleChange}
                className="glass-input"
                required
                disabled={loading}
              >
                <option value="ON CAMPUS">ON CAMPUS</option>
                <option value="ONLINE">ONLINE</option>
                <option value="HYBRID">HYBRID</option>
              </select>
            </div>
          </div>

          {/* Image Upload Zone */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Program Image *</label>
            <label className="upload-zone group block cursor-pointer border-2 border-dashed border-accent/20 rounded-xl p-6 text-center hover:bg-accent/5 transition-all">
              {preview ? (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
                    <p className="text-white text-sm font-medium">Change Image</p>
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
                name="logo"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
                disabled={loading}
                required
              />
            </label>
          </div>

          {/* Trending Option Checkbox */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="trending"
              name="trending"
              checked={formData.trending === 1}
              onChange={handleChange}
              className="w-4 h-4 rounded text-accent focus:ring-accent bg-muted border-accent/20"
              disabled={loading}
            />
            <label htmlFor="trending" className="text-sm font-medium text-foreground select-none cursor-pointer">
              Mark this program as <strong>Trending Item</strong>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t section-divider">
            <button type="button" onClick={handleCloseModal} className="flex-1 btn-ghost" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="flex-1 btn-primary flex items-center justify-center gap-2" disabled={loading}>
              <Plus size={18} />
              {loading ? "Adding..." : "Add Program"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}