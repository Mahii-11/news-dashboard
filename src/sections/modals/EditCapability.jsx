import { useState } from 'react';
import { X, Save, Upload, ImageIcon } from 'lucide-react';
import { updateCapabilityData } from '../../services/api';

export default function EditCapability({item, onClose, onRefresh}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(item?.image || null);
  const [selectedFile, setSelectedFile] = useState(null);
  
  

  const [formData, setFormData] = useState({
    title: item?.title || '',
    image: item?.image || '',
    short_description: item?.short_description || "",
  });

 const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file)); 
      setSelectedFile(file); 
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
    const dataToSend = new FormData();
    dataToSend.append("title", formData.title);
    dataToSend.append("short_description", formData.short_description);
    dataToSend.append("_method", "POST");
      
      if (selectedFile) {
        dataToSend.append("image", selectedFile);
      }


    const response = await updateCapabilityData(item.id, dataToSend);
    
    if (response) {
      if (onRefresh) onRefresh(); 
      onClose(); 
    }
  } catch (err) {
    console.error("Update error:", err);
    setError(err.message || "Something went wrong while updating.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="modal-overlay p-4">
      <div className="modal-panel max-w-2xl">
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Edit Capability</h2>
            <p className="text-muted-foreground text-sm mt-1">Modify course information details</p>
          </div>
          <button
            onClick={onClose}
            className="icon-btn"
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="glass-input"
              required
              disabled={loading}
            />
          </div>

       

        <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
               Image
            </label>
            <label className="group relative flex flex-col items-center justify-center border-2 border-dashed border-accent/20 rounded-xl p-4 text-center hover:bg-muted/30 hover:border-accent/40 transition-all cursor-pointer min-h-[140px]">
              {preview ? (
                <div className="relative w-full max-h-40 overflow-hidden rounded-lg">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-40 object-contain bg-muted/40 rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
                    <p className="text-white text-xs font-medium flex items-center gap-1">
                      <Upload size={14} /> Change Image
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center py-2">
                  <div className="p-3 bg-muted rounded-full text-muted-foreground group-hover:text-foreground transition-colors mb-2">
                    <ImageIcon size={22} />
                  </div>
                  <p className="text-sm font-medium text-foreground">Click to upload image</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Supports JPG, PNG or WEBP</p>
                </div>
              )}

              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={loading}
              />
            </label>
          </div>

           <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Description *</label>
            <textarea
              name="short_description"
              placeholder="Enter description"
              value={formData.short_description}
              onChange={handleChange}
              className="glass-input resize-none h-32"
              required
              disabled={loading}
            />
          </div>

        

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t section-divider">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-ghost"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary flex items-center justify-center gap-2"
              disabled={loading}
            >
              <Save size={18} />
              {loading ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

 
}
