import  { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { updateWhyChooseData } from '../../services/api';
import { RichTextEditor } from '../../components/rich-text-editor';

export default function EditWhyChooseModal({ item, onClose, onRefresh }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [image, setImage] = useState(item.image);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
     items: item?.items || '',
     description: item?.description || '', 
     image: item?.image || '',
   });
 

  
  const handleImageTwo = (e) => {
    const file = e.target.files[0];

    if (file) {
      setFile(file);
      setImage(URL.createObjectURL(file));
      
    }
    
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

 const handleSubmit = async (e) => {
       e.preventDefault();
       setLoading(true);
       setError(null);
   
       try {
         const dataToSend = new FormData();
         dataToSend.append("description", formData.description);
         dataToSend.append("items", formData.items);
         dataToSend.append("_method", "POST");
       
 
         if (file) {
             dataToSend.append("image", file);
         }
 
       
   
       
         const response = await updateWhyChooseData(item.id, dataToSend);
         
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
          <h2 className="text-2xl font-bold text-foreground">Edit Who We Are</h2>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Items */}

          <div>

            
             <label className="block text-sm font-medium text-foreground mb-2">
               Items *
            </label>
            
              <textarea
               name="items"
               value={
               Array.isArray(formData.items)
               ? formData.items.join("\n")
               : formData.items
               }
               onChange={handleChange}
               rows={6}
               className="glass-input resize-none"
             />

           <div>
          </div>
       
  <label className="block text-sm font-medium text-foreground mb-2">
    Video *
  </label>

  <label className="upload-zone min-h-[180px] flex flex-col items-center justify-center">
    {image ? (
      <video
        src={image}
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

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description *
            </label>
            <RichTextEditor
              value={formData.description}
              onChange={(html) =>
                setFormData((prev) => ({ ...prev, description: html }))
              }
              placeholder="Enter  description"
              disabled={loading}
            />
          </div>


          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t section-divider">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-ghost"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary"
            >
              {loading ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
