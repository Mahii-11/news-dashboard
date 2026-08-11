import { useState } from 'react';
import { X, Save, Upload } from 'lucide-react';
import { updateMediaData } from '../../services/api'; 

export default function EditMedia({ item, onClose, onRefresh }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(item.thumbnail);
  const [selectedFile, setSelectedFile] = useState(null);
   

  

  const [formData, setFormData] = useState({
    title: item?.title || '',
    category: item?.category || '',
    date: item?.date || '',
    thumbnail: item?.thumbnail || '',
    featured: item?.featured || '',
    image: item?.image || '',
    video: item?.video || "",
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
      dataToSend.append("category", formData.category);
      dataToSend.append("date", formData.date);
      dataToSend.append("featured", formData.featured);
      dataToSend.append("video", formData.video);
      dataToSend.append("_method", "POST");
      if (selectedFile) {
        dataToSend.append("thumbnail", selectedFile);
     }
        
    
    
      const response = await updateMediaData(item.id, dataToSend);
      
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
            <h2 className="text-2xl font-bold text-foreground">Edit  Media</h2>
            <p className="text-muted-foreground text-sm mt-1">Modify  Media </p>
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
              Video Title 
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="glass-input"
              placeholder='Enter video title'
              required
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder='Enter video category'
                className="glass-input"
                required
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Featured
              </label>
              <input
                type="text"
                name="featured"
                value={formData.featured}
                onChange={handleChange}
                placeholder='0'
                className="glass-input"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
               Date
              </label>
              <input
                type="text"
                name="date"
                value={formData.date}
                onChange={handleChange}
                placeholder='Enter Date'
                className="glass-input"
                required
                disabled={loading}
              />
            </div>
           
                  </div>
                  
                   
      

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Video URL
            </label>
            <input
              type="text"
              name="video"
              value={formData.video}
              onChange={handleChange}
              className="glass-input"
              placeholder='Enter video title'
              required
              disabled={loading}
            />
          </div>
      

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Thumbnail
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