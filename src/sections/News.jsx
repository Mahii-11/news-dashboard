import { useEffect, useState, useCallback } from 'react';
import { Plus, Edit2, Trash2, Loader2, Eye, Video, Radio, Newspaper, User, Folder, LayoutList } from 'lucide-react';
import { deleteNewsData, getNewsData, getCategory, getAuthor } from '../services/api'; 
import SkeletonLoader from '../loader/SkeletonLoader';
import AddNews from './modals/AddNews';
import EditNews from './modals/EditNews';

export default function News() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]); 
  const [authors, setAuthors] = useState([]); 
  const [editingId, setEditingId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false); 
  const [deletingId, setDeletingId] = useState(null);

  // Load Categories API
  const loadCategories = useCallback(async () => {
    try {
      const data = await getCategory();
      setCategories(Array.isArray(data) ? data : data?.data?.data || data?.data || []);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  }, []);

  // Load Authors API
  const loadAuthors = useCallback(async () => {
    try {
      const response = await getAuthor();
      const authorList = Array.isArray(response) 
        ? response 
        : response?.data?.data || response?.data || [];
      setAuthors(authorList);
    } catch (error) {
      console.error("Error loading Authors:", error);
    }
  }, []);

  // Load News Data API
  const loadNewsData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getNewsData();
      const newsList = Array.isArray(response) 
        ? response 
        : response?.data?.data || response?.data || [];
      setItems(newsList);
    } catch (error) {
      console.error("Error loading news data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchAsyncData = async () => {
      await Promise.all([loadNewsData(), loadCategories(), loadAuthors()]);
    };
    fetchAsyncData();
  }, [loadNewsData, loadCategories, loadAuthors]);

  // Category Name Matcher
  const getCategoryName = (item) => {
    if (item.category?.name) return item.category.name;
    if (item.category_name) return item.category_name;

    if (item.category_id && categories.length > 0) {
      const matchedCat = categories.find((c) => Number(c.id) === Number(item.category_id));
      if (matchedCat) return matchedCat.name;
    }

    return item.category_id ? `Cat ID: ${item.category_id}` : null;
  };

  // Author Name Matcher
  const getAuthorName = (authorId) => {
    if (!authorId) return "N/A";
    if (authors.length > 0) {
      const matchedAuthor = authors.find((a) => Number(a.id) === Number(authorId));
      if (matchedAuthor) return matchedAuthor.name;
    }
    return `Auth ID: ${authorId}`;
  };

  const handleEdit = (id) => {
    setEditingId(id);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    setDeletingId(id);

    try {
      await deleteNewsData(id); 
      setItems(prevItems => prevItems.filter(item => item.id !== id));
    } catch (error) {
      console.error("Failed to delete:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleAddItem = () => {
    loadNewsData(); 
  };

  const editingItem = items.find(item => item.id === editingId);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title text-4xl flex items-center gap-3">
            <Newspaper className="w-8 h-8 text-primary" />
            News List
          </h1>
          <p className="page-subtitle">Manage news articles, updates, media, and live broadcasts</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          Add News
        </button>
      </div>

      {/* Loading & Empty State */}
      {loading && items.length === 0 ? (
        <SkeletonLoader />
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No news found. Add some news articles!</div>
      ) : (
        <div className="rounded-2xl border border-accent/10 bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="sticky top-0 z-10 bg-muted/60 backdrop-blur-sm border-b border-accent/10">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground w-80">
                    Title & Image
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Description Info
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground w-32">
                    Section Name
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground w-36">
                    Meta Info
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground w-24">
                    Views
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground w-28">
                    Media / Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground w-36">
                    Published At
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground w-40">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-accent/5">
                {items.map((item, index) => {
                  const categoryName = getCategoryName(item);

                  return (
                    <tr
                      key={item.id}
                      className={`transition-colors duration-150 hover:bg-muted/50 ${index % 2 === 1 ? "bg-muted/20" : ""}`}
                    >
                      {/* Title & Image Only (Prefix & Suffix Removed) */}
                      <td className="px-4 py-3">
                        <div className="flex items-start gap-3">
                          {item.image_url ? (
                            <div className="shrink-0">
                              <img 
                                src={item.image_url} 
                                alt={item.caption || item.title} 
                                className="w-14 h-14 object-cover rounded-lg border border-accent/10"
                              />
                              {item.caption && (
                                <span className="text-[10px] text-muted-foreground block line-clamp-1 max-w-[56px] text-center mt-0.5" title={item.caption}>
                                  {item.caption}
                                </span>
                              )}
                            </div>
                          ) : (
                            <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground border border-accent/10 shrink-0">
                              No Img
                            </div>
                          )}
                          <div className="flex flex-col justify-center">
                            {/* Main Title */}
                            <span className="font-semibold text-sm text-foreground line-clamp-2" title={item.title}>
                              {item.title}
                            </span>
                          </div>
                        </div>
                      </td>

                   {/* Description Info Column */}
<td className="px-4 py-3 min-w-[220px]">
  <div className="space-y-1.5">
    {/* short Description */}
    <div className="text-xs text-foreground/90">
      <span className="font-semibold text-muted-foreground block text-[11px] uppercase tracking-wider">
        short Description:
      </span>
      <p className="line-clamp-2 text-xs leading-tight" title={item.summary || "No short description"}>
        {item.summary ? item.summary : <span className="italic text-muted-foreground/60">No summary provided</span>}
      </p>
    </div>

    {/* full Description */}
    <div className="text-xs text-muted-foreground">
      <span className="font-semibold text-muted-foreground/80 block text-[11px] uppercase tracking-wider">
        full Description:
      </span>
      <p className="line-clamp-2 text-xs leading-tight" title={item.description}>
        {item.description && item.description !== "<p></p>" 
          ? item.description.replace(/<[^>]*>/g, '') 
          : <span className="italic text-muted-foreground/60">No full description provided</span>}
      </p>
    </div>
  </div>
</td>

                      {/* New Column: section_name */}
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[9px] font-medium bg-primary/10 text-primary border border-primary/20">
                          <LayoutList size={12} />
                          {item.sections_name || "N/A"}
                        </span>
                      </td>

                      {/* Category Name & Author Name */}
                      <td className="px-4 py-3 text-center">
                        <div className="flex flex-col items-center gap-1">
                          {categoryName && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-accent/10 text-foreground border border-accent/20">
                              <Folder size={10} /> {categoryName}
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-muted text-muted-foreground">
                            <User size={10} /> {getAuthorName(item.author_id)}
                          </span>
                        </div>
                      </td>

                      {/* Views */}
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-medium">
                          <Eye size={12} />
                          {item.views ?? 0}
                        </span>
                      </td>

                    

                      {/* Video / Live Badges */}
                      <td className="px-4 py-3 text-center">
                        <div className="flex flex-col items-center gap-1">
                          {item.is_video === 1 ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20" title="Video Post">
                              <Video size={10} /> Video
                            </span>
                          ) : null}

                          {item.is_live === 1 ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-500/10 text-red-500 border border-red-500/20 animate-pulse" title="Live Broadcast">
                              <Radio size={10} /> Live
                            </span>
                          ) : null}

                          {item.is_video !== 1 && item.is_live !== 1 && (
                            <span className="text-[10px] text-muted-foreground">Standard</span>
                          )}
                        </div>
                      </td>

                      {/* Published At Date */}
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-foreground whitespace-nowrap">
                            {item.published_at ? new Date(item.published_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            }) : 'N/A'}
                          </span>
                          {item.created_at && (
                            <span className="text-[10px] text-muted-foreground">
                              Created: {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(item.id)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground bg-card hover:bg-muted border border-accent/10 rounded-lg shadow-sm transition-all duration-150"
                          >
                            <Edit2 size={14} />
                            <span>Edit</span>
                          </button>
                          <button
                            disabled={deletingId === item.id}
                            onClick={() => handleDelete(item.id)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-destructive hover:text-white bg-destructive/5 hover:bg-destructive border border-destructive/10 hover:border-transparent rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {deletingId === item.id ? (
                              <>
                                <Loader2 size={14} className="animate-spin" />
                                <span>Deleting...</span>
                              </>
                            ) : (
                              <>
                                <Trash2 size={14} />
                                <span>Delete</span>
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Modal */}
      <AddNews
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddItem}
      />

      {/* Edit Modal */}
      {isEditModalOpen && editingItem && (
        <EditNews
          key={editingItem.id}
          item={editingItem}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingId(null);
          }}
          onRefresh={loadNewsData} 
        />
      )}
    </div>
  );
}