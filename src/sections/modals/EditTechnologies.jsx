import  { useState } from 'react';
import { X } from 'lucide-react';
import { updateTechnologiesData } from '../../services/api';

export default function EditTechnologies({ item, onClose, onRefresh }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: item?.name || '',
    icon: item?.icon || '',
  });
  
  const iconOptions = ['Code2', "Workflow", "Cpu", "Database", "Cloud", "BrainCircuit", "Smartphone", "WandSparkles"];


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
      const response = await updateTechnologiesData(item.id, formData);
      
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
          <h2 className="text-2xl font-bold text-foreground">Edit Technologies</h2>
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
              Title
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Loved by students"
              className="glass-input"
            />
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Icon
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

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description
            </label>
            <textarea
              name="text"
              value={formData.text}
              onChange={handleChange}
              placeholder="Enter the description"
              rows="4"
              required
              className="glass-input resize-none"
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
