import { Edit2, ImageIcon, Loader2, Plus, Trash2, ExternalLink } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { deleteOurWorkData, getOurWorkData } from '../services/api';
import SkeletonLoader from '../loader/SkeletonLoader';
import EditOurWork from './modals/EditOurWork';
import AddOurWork from './modals/AddOurWork';

export default function OurWorks() {
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const loadSupportedData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getOurWorkData();
      console.log("Fetched Support Data Data:", data);
      setItems(Array.isArray(data) ? data : data?.data || []);
    } catch (error) {
      console.error("Error loading Support Data data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchAsyncData = async () => {
      await loadSupportedData();
    };
    fetchAsyncData();
  }, [loadSupportedData]);

  const handleEdit = (id) => {
    setEditingId(id);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteOurWorkData(id); 
      setItems(prevItems => prevItems.filter(item => item.id !== id));
    } catch (error) {
      console.error("Failed to delete:", error);
    } finally {
      setDeletingId(null)
    }
  };

  const handleAddItem = () => {
    loadSupportedData(); 
  };

  const editingItem = items.find(item => item.id === editingId);

  return (
    <div className="space-y-6 max-w-full px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Our Works</h1>
          <p className="page-subtitle text-sm text-muted-foreground mt-1">Manage your key selling points and value propositions</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary flex items-center justify-center gap-2 self-start sm:self-auto w-full sm:w-auto px-4 py-2.5 text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Add Works
        </button>
      </div>

      {/* Loading & Empty State */}
      {loading && items.length === 0 ? (
        <SkeletonLoader />
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-sm text-muted-foreground bg-card rounded-2xl border border-accent/10 shadow-sm">
          No items found. Add some data!
        </div>
      ) : (
        <div className="w-full">
          {/* Mobile Grid Layout: Shows on small screens, hides on desktop */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {items.map((item) => (
              <div key={item.id} className="bg-card border border-accent/10 rounded-xl p-4 shadow-sm flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex flex-shrink-0 items-center justify-center border border-accent/10">
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={18} className="text-muted-foreground/60" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-sm text-foreground break-words">{item.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5 break-words">{item.sub_title}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs border-t border-accent/5 pt-3">
                  <div>
                    <span className="text-muted-foreground block font-medium mb-0.5">Technology</span>
                    <span className="text-foreground break-words">{item.technology || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block font-medium mb-0.5">Created</span>
                    <span className="text-muted-foreground">
                      {item.created_at ? new Date(item.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      }) : 'N/A'}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground block font-medium mb-0.5">Description</span>
                    <p className="text-muted-foreground line-clamp-3 break-words whitespace-normal">{item.description}</p>
                  </div>
                  {item.link && (
                    <div className="col-span-2">
                      <span className="text-muted-foreground block font-medium mb-0.5">Link</span>
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline break-all">
                        <span>Visit Link</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-accent/5 pt-3 mt-1">
                  <button
                    onClick={() => handleEdit(item.id)}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground bg-card hover:bg-muted border border-accent/10 rounded-lg shadow-sm transition-all flex-1"
                  >
                    <Edit2 size={13} />
                    <span>Edit</span>
                  </button>
                  <button
                    disabled={deletingId === item.id}
                    onClick={() => handleDelete(item.id)}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-destructive hover:text-white bg-destructive/5 hover:bg-destructive border border-destructive/10 hover:border-transparent rounded-lg transition-all flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingId === item.id ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 size={13} />
                        <span>Delete</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table Layout: Hides on small screens, shows on desktop */}
          <div className="hidden md:block rounded-xl border border-accent/10 bg-card shadow-sm overflow-hidden">
            <table className="w-full table-fixed text-left border-collapse">
              <thead className="bg-muted/60 backdrop-blur-sm border-b border-accent/10">
                <tr>
                  <th className="w-[8%] px-3 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Image</th>
                  <th className="w-[15%] px-3 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Title / Subtitle</th>
                  <th className="w-[15%] px-3 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Technology</th>
                  <th className="w-[12%] px-3 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Link</th>
                  <th className="w-[28%] px-3 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description</th>
                  <th className="w-[10%] px-3 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Created</th>
                  <th className="w-[12%] px-3 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-accent/5">
                {items.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`transition-colors duration-150 hover:bg-muted/30 ${index % 2 === 1 ? "bg-muted/10" : ""}`}
                  >
                    {/* Image Column */}
                    <td className="px-3 py-3 align-top">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted flex items-center justify-center border border-accent/10">
                        {item.image ? (
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon size={16} className="text-muted-foreground/60" />
                        )}
                      </div>
                    </td>

                    {/* Merged Title & Subtitle Column */}
                    <td className="px-3 py-3 align-top whitespace-normal break-words">
                      <div className="font-semibold text-xs text-foreground line-clamp-1">{item.title}</div>
                      <div className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5 leading-relaxed">{item.sub_title}</div>
                    </td>

                    {/* Technology Column */}
                    <td className="px-3 py-3 align-top whitespace-normal break-words">
                      <span className="text-xs text-foreground bg-muted/60 px-1.5 py-0.5 rounded border border-accent/5 font-medium inline-block max-w-full truncate">
                        {item.technology || '—'}
                      </span>
                    </td>

                    {/* Link Column */}
                    <td className="px-3 py-3 align-top">
                      {item.link ? (
                        <a 
                          href={item.link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium max-w-full truncate"
                        >
                          <span>Visit link</span>
                          <ExternalLink size={12} className="flex-shrink-0" />
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground/50">—</span>
                      )}
                    </td>

                    {/* Description Column */}
                    <td className="px-3 py-3 align-top whitespace-normal break-words">
                      <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">{item.description}</p>
                    </td>

                    {/* Created Date Column */}
                    <td className="px-3 py-3 align-top">
                      <span className="text-[11px] text-muted-foreground font-medium whitespace-nowrap">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        }) : 'N/A'}
                      </span>
                    </td>

                    {/* Actions Column */}
                    <td className="px-3 py-3 align-top">
                      <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleEdit(item.id)}
                          className="inline-flex items-center justify-center gap-1 px-2 py-1 text-[11px] font-medium text-muted-foreground hover:text-foreground bg-card hover:bg-muted border border-accent/10 rounded-md shadow-sm transition-all"
                        >
                          <Edit2 size={12} />
                          <span>Edit</span>
                        </button>
                        <button
                          disabled={deletingId === item.id}
                          onClick={() => handleDelete(item.id)}
                          className="inline-flex items-center justify-center gap-1 px-2 py-1 text-[11px] font-medium text-destructive hover:text-white bg-destructive/5 hover:bg-destructive border border-destructive/10 hover:border-transparent rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deletingId === item.id ? (
                            <>
                              <Loader2 size={12} className="animate-spin" />
                              <span>Deleting</span>
                            </>
                          ) : (
                            <>
                              <Trash2 size={12} />
                              <span>Delete</span>
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Modal */}
      <AddOurWork
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddItem}
      />

      {/* Edit Modal */}
      {isEditModalOpen && editingItem && (
        <EditOurWork
          item={editingItem}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingId(null);
          }}
          onRefresh={loadSupportedData} 
        />
      )}
    </div>
  );
}