import { useEffect, useState, useCallback } from "react"; 
import { Trash2, Loader2,  Edit2, Plus } from "lucide-react";
import { getTestimonialsData , deleteTestimonialsData } from "../services/api";
import SkeletonLoader from "../loader/SkeletonLoader";
import AddTestimonials from "./modals/AddTestimonials";
import EditTestimonials from "./modals/EditTestimonials";


export default function Testimonials() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null); 


  const loadHighlightCardsData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTestimonialsData ();
      console.log("Fetched OurStories Data:", data);
      setItems(Array.isArray(data) ? data : data?.data || []);
      setError(null);
    } catch (error) {
      console.error("Error loading OurStories data:", error);
      setError("Failed to load OurStories.");
    } finally {
      setLoading(false);
    }
  }, []);

  
  useEffect(() => {
    const fetchAsyncData = async () => {
      await loadHighlightCardsData();
    };
    fetchAsyncData();
  }, [loadHighlightCardsData]);

  const handleEdit = (id) => {
    setEditingId(id);
    setIsEditModalOpen(true);
  };


  const handleDelete = async (id) => {
    setDeletingId(id); 
    try {
      await deleteTestimonialsData(id);
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Delete Error:", err);
      alert(err.message || "Failed to delete item.");
    } finally {
      setDeletingId(null); 
    }
  };

  const editingItem = items.find((item) => item.id === editingId);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Testimonials</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage the visual feature highlight elements</p>
        </div>
          <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center justify-center gap-2 self-start sm:self-auto w-full sm:w-auto px-4 py-2.5 text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Add Testimonials
        </button>
      </div>

      <hr className="section-divider" />

      {/* Loading & Error States */}
     {loading && <SkeletonLoader />}

      {error && !loading && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-center">
          {error}
        </div>
      )}

      {/* Table List View */}
      {!loading && !error && (
        items.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-accent/10 rounded-2xl bg-card/30">
            <p className="text-muted-foreground">No OurStories available. Click 'Add New Card' to create one.</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-accent/10 bg-card shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead className="sticky top-0 z-10 bg-muted/60 backdrop-blur-sm border-b border-accent/10">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground w-26">
                      Name
                    </th>
                     <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                     Role
                      </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Quote
                     </th>
                                          
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Country
                      </th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground w-40">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-accent/5">
                  {items.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`transition-colors duration-150 hover:bg-muted/50 ${index % 2 === 1 ? "bg-muted/20" : ""}`}
                    >
                     <td className="px-4 py-3">
                        <span className="text-xs text-foreground line-clamp-3">{item.name}</span>
                      </td>
                         <td className="px-4 py-3">
                        <span className="text-xs text-foreground line-clamp-3">{item.role}</span>
                      </td>

                       <td className="px-4 py-3">

                        <span className="text-sm text-muted-foreground line-clamp-2">{item.quote}</span>

                          </td>
                           <td className="px-4 py-3">

                        <span className="text-sm text-muted-foreground line-clamp-2">{item.country}</span>

                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(item.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground bg-card hover:bg-muted border border-accent/10 rounded-lg shadow-sm transition-all duration-150"
                          >
                            <Edit2 size={14} />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            disabled={deletingId === item.id}
                            className="inline-flex items-center justify-center p-1.5 text-destructive hover:text-white bg-destructive/5 hover:bg-destructive border border-destructive/10 hover:border-transparent rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete Card"
                          >
                            {deletingId === item.id ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Trash2 size={14} />
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
        )
      )}

    
      <AddTestimonials
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={loadHighlightCardsData} 
      />

       

      {/* Edit Entry Modal Overlay */}
      {isEditModalOpen && editingItem && (
        <EditTestimonials
          item={editingItem}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingId(null);
          }}
          onRefresh={loadHighlightCardsData}
        />
      )}
    </div>
  );
}
