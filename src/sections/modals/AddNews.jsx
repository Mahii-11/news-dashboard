import { Plus, X, Loader2, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { getAuthor, getCategory, getSection, storeNewsData } from "../../services/api";

export default function AddNews({ isOpen, onClose, onAdd }) {
  const [category, setCategory] = useState([]);
  const [author, setAuthor] = useState([]);
  const [section, setSection] = useState([]);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);

  const initialFormData = {
    category_id: 1,
    author_id: 1,
    type: "bn",
    title: "",
    summary: "",
    description: "",
    image: null,
    caption: "",
    is_video: 0,
    is_live: 0,
    published_at: new Date().toISOString().split("T")[0],
    sections: [],
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    const loadSection = async () => {
      try {
        setLoading(true);
        const data = await getSection();
        setSection(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching Sections data", error);
        setSection([]);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      loadSection();
    }
  }, [isOpen]);

  // Load Categories
  useEffect(() => {
    const loadCategory = async () => {
      try {
        setLoading(true);
        const data = await getCategory();
        setCategory(Array.isArray(data) ? data : data?.data || []);
      } catch (error) {
        console.error("Error fetching Category data", error);
        setCategory([]);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      loadCategory();
    }
  }, [isOpen]);

  // Load Authors
  useEffect(() => {
    const loadAuthors = async () => {
      try {
        setLoading(true);
        const data = await getAuthor();
        setAuthor(Array.isArray(data) ? data : data?.data || []);
      } catch (error) {
        console.error("Error fetching Authors data", error);
        setAuthor([]);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      loadAuthors();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      const file = files[0];
      if (file) {
        setFormData((prev) => ({
          ...prev,
          [name]: file,
        }));
        setPreview(URL.createObjectURL(file));
      }
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    }));
  };

  const handleSectionToggle = (sectionId) => {
    setFormData((prev) => {
      const currentSections = prev.sections || [];
      const exists = currentSections.some((item) => item.section_id === sectionId);

      let updatedSections;
      if (exists) {
        updatedSections = currentSections.filter((item) => item.section_id !== sectionId);
      } else {
        updatedSections = [...currentSections, { section_id: sectionId }];
      }

      return {
        ...prev,
        sections: updatedSections,
      };
    });
  };

  const handleModalClose = () => {
    setFormData(initialFormData);
    setPreview(null);
    setError(null);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const submitData = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key === "sections") {
          formData.sections.forEach((item, index) => {
            submitData.append(`sections[${index}][section_id]`, item.section_id);
          });
        } else if (formData[key] !== null && formData[key] !== undefined) {
          submitData.append(key, formData[key]);
        }
      });

      const response = await storeNewsData(submitData);

      if (response) {
        if (onAdd) onAdd();
        handleModalClose();
      }
    } catch (err) {
      console.error("Store error:", err);
      setError(err.message || "Failed to add new item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay p-4 no-scrollbar">
      <div className="modal-panel max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="modal-header sticky top-0 bg-card z-10 py-4 border-b flex items-center justify-between px-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Add News Article</h2>
            <p className="text-muted-foreground text-sm mt-0.5">
              Create a new news or media post
            </p>
          </div>
          <button
            onClick={handleModalClose}
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
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
        
       {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1">
             Title <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              name="title"
              placeholder="Enter main news title"
              value={formData.title}
              onChange={handleChange}
              className="glass-input"
              disabled={loading}
            />
          </div>

          {/* Image Upload Zone */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
             Image <span className="text-destructive">*</span>
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
                    <p className="text-white text-sm font-medium">Change image</p>
                  </div>
                </div>
              ) : (
                <>
                  <Upload
                    size={32}
                    className="mx-auto mb-2 text-muted-foreground group-hover:text-accent transition-colors"
                  />
                  <p className="text-foreground font-medium">
                    Drag and drop your image
                  </p>
                  <p className="text-muted-foreground text-sm">
                    or click to select
                  </p>
                </>
              )}

              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
                disabled={loading}
              />
            </label>
          </div>

          {/* Caption */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1">
              Caption
            </label>
            <input
              type="text"
              name="caption"
              placeholder="Enter image caption"
              value={formData.caption}
              onChange={handleChange}
              className="glass-input"
              disabled={loading}
            />
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1">
              Short Description
            </label>
            <textarea
              name="summary"
              placeholder="Enter brief summary"
              value={formData.summary}
              onChange={handleChange}
              rows="2"
              className="glass-input resize-none"
              disabled={loading}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1">
              Full Description <span className="text-destructive">*</span>
            </label>
            <textarea
              name="description"
              placeholder="Enter full news description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="glass-input resize-none"
              disabled={loading}
            />
          </div>

          {/* Language, Category, Author & Published At Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Language Select */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Language <span className="text-destructive">*</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="glass-input"
                disabled={loading}
              >
                <option value="bn">Bangla</option>
                <option value="en">English</option>
              </select>
            </div>

            {/* Category Select */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Category <span className="text-destructive">*</span>
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="glass-input"
                disabled={loading}
              >
                <option value="">Select a category</option>
                {Array.isArray(category) &&
                  category.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Author Select */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Author <span className="text-destructive">*</span>
              </label>
              <select
                name="author_id"
                value={formData.author_id}
                onChange={handleChange}
                className="glass-input"
                disabled={loading}
              >
                <option value="">Select an Author</option>
                {Array.isArray(author) &&
                  author.map((aut) => (
                    <option key={aut.id} value={aut.id}>
                      {aut.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Published Date */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1">
                Published Date
              </label>
              <input
                type="date"
                name="published_at"
                value={formData.published_at}
                onChange={handleChange}
                className="glass-input"
                disabled={loading}
              />
            </div>
          </div>

          {/* Options: Is Video / Is Live */}
          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-foreground">
              <input
                type="checkbox"
                name="is_video"
                checked={formData.is_video === 1}
                onChange={handleChange}
                className="rounded border-accent/20 text-primary focus:ring-primary h-4 w-4"
                disabled={loading}
              />
              Is Video News
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-foreground">
              <input
                type="checkbox"
                name="is_live"
                checked={formData.is_live === 1}
                onChange={handleChange}
                className="rounded border-accent/20 text-primary focus:ring-primary h-4 w-4"
                disabled={loading}
              />
              Is Live News
            </label>
          </div>

          {/* Sections Grid Selection */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">
              Sections
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 max-h-52 overflow-y-auto p-1 no-scrollbar border border-border/40 rounded-xl">
              {Array.isArray(section) && section.length > 0 ? (
                section.map((s) => {
                  const isChecked = formData.sections?.some(
                    (item) => item.section_id === s.id
                  );

                  return (
                    <label
                      key={s.id}
                      className={`flex items-center gap-2 p-2 rounded-lg border transition-all cursor-pointer bg-card/50 ${
                        isChecked
                          ? "border-primary bg-primary/10 text-primary font-semibold"
                          : "border-border/60 hover:border-primary/50 hover:bg-accent/10 text-foreground"
                      }`}
                    >
                      <input
                        type="checkbox"
                        value={s.id}
                        checked={isChecked}
                        onChange={() => handleSectionToggle(s.id)}
                        className="rounded border-accent/20 text-primary focus:ring-primary h-4 w-4 shrink-0 cursor-pointer"
                        disabled={loading}
                      />
                      <span className="text-xs truncate select-none" title={s.name}>
                        {s.name}
                      </span>
                    </label>
                  );
                })
              ) : (
                <p className="text-xs text-muted-foreground col-span-full py-2 text-center">
                  No sections available
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t section-divider">
            <button
              type="button"
              onClick={handleModalClose}
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
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <Plus size={18} />
                  <span>Add Article</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}