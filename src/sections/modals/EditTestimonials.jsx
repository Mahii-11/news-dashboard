import { useState } from 'react';
import { X, Save} from 'lucide-react';
import { updateTestimonialsData } from '../../services/api';

export default function EditTestimonials ({ item, onClose, onRefresh }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  
  
  const [formData, setFormData] = useState({
    quote: item?.quote || '',
    name: item?.name || '',
    role: item?.role || '',
    country: item?.country || ""

  });

 

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
      dataToSend.append("quote", formData.quote);
      dataToSend.append("name", formData.name);
      dataToSend.append("role", formData.role);
      dataToSend.append("country",formData.country);
      dataToSend.append("_method", "POST");
      
      const response = await updateTestimonialsData(item.id, dataToSend);
      
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
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="glass-input w-full text-sm"
                required
                disabled={loading}
              />
                      </div>
                      
                        <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Quote *
            </label>
            <textarea
              name="quote"
              value={formData.quote}
              onChange={handleChange}
              rows={3}
              className="glass-input w-full text-sm resize-none"
              required
              disabled={loading}
            />
          </div>
           <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Role *
            </label>
            <textarea
              name="role"
              value={formData.role}
              onChange={handleChange}
              rows={3}
              className="glass-input w-full text-sm resize-none"
              required
              disabled={loading}
            />
             </div>              
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Country *
            </label>
            <textarea
              name="country"
              value={formData.country}
              onChange={handleChange}
              rows={3}
              className="glass-input w-full text-sm resize-none"
              required
              disabled={loading}
            />
          </div>
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