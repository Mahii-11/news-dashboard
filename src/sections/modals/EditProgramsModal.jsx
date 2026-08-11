import { useState } from 'react';
import { X, Save, Upload } from 'lucide-react';
import { updateProgramsData } from '../../services/api'; // আপনার এপিআই সার্ভিস পাথ অনুযায়ী

export default function EditProgramsModal({ item, onClose, onRefresh }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  

  
  const [formData, setFormData] = useState({
    title: item?.title || '',
    university: item?.university || '',
    country: item?.country || '',
    duration: item?.duration || '',
    mode: item?.mode || 'ON CAMPUS',
    image: item?.image || '',
    trending: item?.trending ?? 0,
    status: item?.status ?? 1
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file)); // লোকাল প্রিভিউ জেনারেট
      setSelectedFile(file); // সাবমিটের জন্য ফাইলটি স্টোর করা
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
      dataToSend.append("university", formData.university);
      dataToSend.append("country", formData.country);
      dataToSend.append("duration", formData.duration);
      dataToSend.append("mode", formData.mode);
      dataToSend.append("trending", formData.trending);
      dataToSend.append("status", formData.status);
      
      dataToSend.append("_method", "POST");
      if (selectedFile) {
        dataToSend.append("image", selectedFile);
      }

    
      const response = await updateProgramsData(item.id, dataToSend);
      
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
            <h2 className="text-2xl font-bold text-foreground">Edit Program</h2>
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
              Program Title *
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

          <div className="grid grid-cols-2 gap-4">
            {/* University */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                University Name *
              </label>
              <input
                type="text"
                name="university"
                value={formData.university}
                onChange={handleChange}
                className="glass-input"
                required
                disabled={loading}
              />
            </div>
            {/* Country */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Country Code *
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="glass-input"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Duration */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Duration *
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="glass-input"
                required
                disabled={loading}
              />
            </div>
            {/* Mode */}
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

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Program Image *
            </label>
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
                name="image"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={loading}
              />
            </label>
          </div>

          {/* Trending Checkbox */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="edit-trending"
              name="trending"
              checked={formData.trending === 1}
              onChange={handleChange}
              className="w-4 h-4 rounded text-accent focus:ring-accent bg-muted border-accent/20"
              disabled={loading}
            />
            <label htmlFor="edit-trending" className="text-sm font-medium text-foreground select-none">
              Mark this program as **Trending Item**
            </label>
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