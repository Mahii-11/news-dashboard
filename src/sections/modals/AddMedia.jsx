import { Plus, Upload, X } from "lucide-react";
import { useState } from "react";
import { storeMediaData } from "../../services/api"; 

export default function AddProgramsModal({ isOpen, onClose, onAdd }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);
  const [video, setVideo] = useState(null)  

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    thumbnail: null,
    featured: "",
    video: null,
    date: ""

  });

    if (!isOpen) return null;


  const handleVideoChange = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  setVideo(URL.createObjectURL(file));

  setFormData((prev) => ({
    ...prev,
    video: file,
  }));
};
    



    

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
      dataToSend.append("category", formData.category);
      dataToSend.append("date", formData.date);
      dataToSend.append("featured", formData.featured);
      
      if (formData.thumbnail) {
        dataToSend.append("thumbnail", formData.thumbnail);
    }
        
    if (formData.video) {
        dataToSend.append("video", formData.video);
      }

      const response = await storeMediaData(dataToSend);
      if (response) {
        
        setFormData({
              title: "",
              category: "",
              thumbnail: null,
              video: null,
              date: "",
              featured: "",
             });
          setPreview(null);
          setVideo(null);
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
  setVideo(null);
  onClose();
};
  return (
    <div className="modal-overlay no-scrollbar p-4">
      <div className="modal-panel max-w-2xl">
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Add Our Media</h2>
            <p className="text-muted-foreground text-sm mt-1">Create a new media path</p>
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
            <label className="block text-sm font-semibold text-foreground mb-2">Video Title *</label>
            <input
              type="text"
              name="title"
              placeholder="Enter video title"
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
              <label className="block text-sm font-semibold text-foreground mb-2">Category *</label>
              <input
                type="text"
                name="category"
                placeholder="enter category"
                value={formData.category}
                onChange={handleChange}
                className="glass-input"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Featured *</label>
              <input
                type="text"
                name="featured"
                placeholder="featured"
                value={formData.featured}
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
              <label className="block text-sm font-semibold text-foreground mb-2">Date *</label>
              <input
                type="text"
                name="date"
                placeholder="enter date"
                value={formData.date}
                onChange={handleChange}
                className="glass-input"
                required
                disabled={loading}
              />
            </div>
            
          </div>

          {/* Image Upload Zone */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Thumbnail *</label>
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
                name="thumbnail"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
                disabled={loading}
                required
               />
            </label>
        </div>
                  
                       
           <div>
  <label className="block text-sm font-medium text-foreground mb-2">
    Video
  </label>

  <label className="upload-zone min-h-[180px] flex flex-col items-center justify-center">
    {video ? (
      <video
        src={video}
        controls
        className="w-full max-h-40 rounded-lg object-cover"
      />
    ) : (
      <>
        <Upload size={40} className="mb-3 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Click to upload video
        </span>
      </>
    )}

   <input
  type="file"
  name="video"
  accept="video/*"
  onChange={handleVideoChange}
  className="hidden"
  disabled={loading}
/>
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