import  { useState } from 'react';
import { X } from 'lucide-react';
import { updateSupportData } from '../../services/api';

export default function EditSupportModal({ item, onClose, onRefresh }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: item?.title || '',
    icon: item?.icon || '',
    short_description: item?.short_description || "",
    
  });
  const iconOptions = [ 'Smartphone', 'Palette', 'Bot', 'Cloud', 'Database', "Monitor", "Code", "Globe", "Shield", "Server", "Cpu", "Network", "Workflow", "Laptop", "Rocket"];

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

      const response = await updateSupportData(item.id, formData);
      
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
          <h2 className="text-2xl font-bold text-foreground">Edit Services</h2>
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
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="enter title..."
              className="glass-input"
            />
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Icon *
            </label>
            <select
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              className="glass-input"
            >
              <option value="">Select an icon</option>
              {iconOptions.map(icon => (
                <option key={icon} value={icon}>{icon}</option>
              ))}
            </select>
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
