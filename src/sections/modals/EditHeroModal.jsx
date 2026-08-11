import  { useState } from 'react';
import { X, Upload, Save } from 'lucide-react';
import { updateHeroData } from '../../services/api';

export function EditHeroModal({ hero, onRefresh, onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [heroPreview, setHeroPreview] = useState(hero.image_one);
  const [heroFile, setHeroFile] = useState();
  const [imageTwo, setImageTwo] = useState(hero.image_two);
  const [fileTwo, setFileTwo] = useState(null);
  const [formData, setFormData] = useState({
    description: hero.description,
    title: hero.title,
    stat_one_text: hero.stat_one_text,
    stat_one_count: hero.stat_one_count,
    stat_two_text: hero.stat_two_text,
    stat_two_count: hero.stat_two_count,
    image_one: hero.image_one,
    image_two: hero.image_two,
  });

const handleHeroImageChange = (e) => {
  const file = e.target.files[0];

  if (file) {
    setHeroFile(file);
    setHeroPreview(URL.createObjectURL(file));
  }
  };


  const handleImageTwo = (e) => {
    const file = e.target.files[0];

    if (file) {
      setFileTwo(file);
      setImageTwo(URL.createObjectURL(file));
      
    }
    
  };
  
 
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => (
            {
                ...prev,
                [name]: value
            }
        ));
    };


    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
  
      try {
        const dataToSend = new FormData();
        dataToSend.append("description", formData. description);
        dataToSend.append("title", formData.title);
        dataToSend.append("stat_one_text", formData. stat_one_text);
        dataToSend.append("stat_one_count", formData.stat_one_count);
        dataToSend.append("stat_two_text", formData.stat_two_text);
        dataToSend.append("stat_two_count", formData.stat_two_count);
        dataToSend.append("_method", "POST");
        if (heroFile) {
         dataToSend.append("image_one", heroFile);
        }

        if (fileTwo) {
            dataToSend.append("image_two", fileTwo);
        }

      
  
      
        const response = await updateHeroData(hero.id, dataToSend);
        
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
        <div className="modal-header">
          <h2 className="text-2xl font-bold text-foreground">Edit Hero Section</h2>
          <button
            onClick={onClose}
            className="icon-btn"
          >
            <X size={24} />
          </button>
        </div>

           {error && (
          <div className="mx-6 mt-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Image *
            </label>

            <label className="upload-zone min-h-[180px] flex flex-col items-center justify-center">
              {heroPreview ? (
                <img
                  src={heroPreview}
                  alt="Preview"
                  className="w-32 h-32 rounded-full object-cover"
                />
              ) : (
                <>
                  <Upload size={40} className="mb-3 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Click to upload image
                  </span>
                </>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleHeroImageChange}
                className="hidden"
              />
            </label>
          </div>

          <div>
  <label className="block text-sm font-medium text-foreground mb-2">
    Video *
  </label>

  <label className="upload-zone min-h-[180px] flex flex-col items-center justify-center">
    {imageTwo ? (
      <video
        src={imageTwo}
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
      accept="video/*"
      onChange={handleImageTwo}
      className="hidden"
    />
  </label>
         </div>

            <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="glass-input"
              disabled={loading}
              placeholder="Enter title"
            />
          </div>

             <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={loading}
              className="glass-input resize-none h-24"
              placeholder="Enter description"
            />
          </div>

        
           <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Stat(1) *</label>
            <input
              type="text"
              name="stat_one_text"
              value={formData.stat_one_text}
              onChange={handleChange}
              className="glass-input"
              disabled={loading}
              placeholder="Enter stat"
            />
          </div>

             <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Stat(2) *</label>
            <input
              type="text"
              name="stat_two_text"
              value={formData.stat_two_text}
              onChange={handleChange}
              className="glass-input"
              disabled={loading}
              placeholder="Enter Stat "
            />
          </div>

            
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Count(1) *</label>
            <input
              type='text'
              name="stat_one_count"
              value={formData.stat_one_count}
              onChange={handleChange}
              disabled={loading}
              className="glass-input"
              placeholder="Enter count "
            />
          </div>

       


             <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Count(2) *</label>
            <input
              type='text'
              name="stat_two_count"
              value={formData.stat_two_count}
              onChange={handleChange}
              disabled={loading}
              className="glass-input"
              placeholder="Enter count "
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
            <button
              type="submit"
              className="flex-1 btn-primary flex justify-center items-center gap-2"
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
