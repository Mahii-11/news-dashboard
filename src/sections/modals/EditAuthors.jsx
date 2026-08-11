import { useState } from "react";
import { X, Upload, Save } from "lucide-react";
import { updateAuthorsData } from "../../services/api";


export default function EditAuthors({onClose, onRefresh, member}) {
  
    const [imagePreview, setImagePreview] = useState(member.image);
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState(
        {
            name: member.name,
            designation: member.designation,
            avatar_url: member.avatar_url,
          
        }
    );


    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setImagePreview(URL.createObjectURL(file));
        setSelectedFile(file);
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
      dataToSend.append("name", formData.name);
      dataToSend.append("designation", formData.designation);
      dataToSend.append("_method", "POST");
      if (selectedFile) {
        dataToSend.append("avatar_url", selectedFile);
      }

    
      const response = await updateAuthorsData(member.id, dataToSend);
      
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
          <h2 className="text-2xl font-bold text-foreground">Edit Authors</h2>
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

        <form className="p-6 space-y-6" onSubmit={handleSubmit}>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Name
              </label>
              <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name..."
              className="glass-input"
              disabled={loading}

            />
            </div>

            <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Designation
            </label>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              placeholder="Enter the Role"
              className="glass-input"
              disabled={loading}
            />
          </div>


          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Avatar
            </label>

            <label className="upload-zone min-h-[180px] flex flex-col items-center justify-center">
              {imagePreview ? (
                <img
                  src={imagePreview}
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
                onChange={handleFileChange}
                className="hidden"
                disabled={loading}
              />
            </label>
          </div>

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
  )
}
