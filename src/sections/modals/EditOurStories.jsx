import { useState } from 'react';
import { X, Save, Upload, ImageIcon } from 'lucide-react';
import { updateOurStoriesData } from '../../services/api';

export default function EditOurStories({ item, onClose, onRefresh }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(item?.image || null);
  const [selectedFile, setSelectedFile] = useState(null);
  
  const [formData, setFormData] = useState({
    title: item?.title || '',
    short_description: item?.short_description || '',
    long_description: item?.long_description || '',

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
      dataToSend.append("long_description", formData.long_description);
      dataToSend.append("_method", "POST");
      
      if (selectedFile) {
        dataToSend.append("image", selectedFile);
      }

      const response = await updateOurStoriesData(item.id, dataToSend);
      
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
      <div className="modal-panel">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-accent/5 bg-muted/20">
          <div>
            <h2 className="text-xl font-bold text-foreground">Edit Our Works </h2>
            <p className="text-muted-foreground text-xs mt-0.5">Modify  Our Works </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-xs font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[calc(100vh-12rem)] overflow-y-auto">
          
          {/* Row 1: Title & Subtitle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="glass-input w-full text-sm"
                required
                disabled={loading}
              />
                      </div>
                      
                        <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Short Description *
            </label>
            <textarea
              name="short_description"
              value={formData.short_description}
              onChange={handleChange}
              rows={3}
              className="glass-input w-full text-sm resize-none"
              required
              disabled={loading}
            />
          </div>
           <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Long Description *
            </label>
            <textarea
              name="long_description"
              value={formData.long_description}
              onChange={handleChange}
              rows={3}
              className="glass-input w-full text-sm resize-none"
              required
              disabled={loading}
            />
          </div>
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

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-accent/5 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground bg-transparent hover:bg-muted rounded-xl transition-colors min-w-[100px]"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors min-w-[140px] disabled:opacity-50"
              disabled={loading}
            >
              <Save size={16} />
              <span>{loading ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}