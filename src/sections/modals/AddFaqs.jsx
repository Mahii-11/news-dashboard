import { Plus, X } from "lucide-react";
import { useState } from "react";
import { storeFaqsData } from "../../services/api";

export default function AddFaqs({ isOpen, onClose, onAdd }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  

  const [formData, setFormData] = useState({
    question: "",
    answer: "",
  });

  
 
  if (!isOpen) return null;

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
      const response = await storeFaqsData(formData);
      
      if (response) {
        if (onAdd) onAdd(); 
        
    
        setFormData({
          question: '',
          answer: ''
        });
        
        onClose(); 
      }
    } catch (err) {
      console.error("Store error:", err);
      setError(err.message || "Failed to add new item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay no-scrollbar">
      <div className="modal-panel">
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Add Faqs</h2>
            <p className="text-muted-foreground text-sm mt-1">Create a new Faqs item</p>
          </div>
          <button
            onClick={onClose}
            className="icon-btn"
            aria-label="Close"
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
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Label */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Question *</label>
            <input
              type="text"
              name="question"
              placeholder="Enter question"
              value={formData.question}
              onChange={handleChange}
              className="glass-input"
              required
              disabled={loading}
            />
          </div>

          {/* Value */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Answer *</label>
            <textarea
              name="answer"
              placeholder="Enter answer"
              value={formData.answer}
              onChange={handleChange}
              className="glass-input resize-none h-32"
              required
              disabled={loading}
            />
          </div>

         


          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t section-divider">
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
              <Plus size={18} />
              {loading ? "Adding..." : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}