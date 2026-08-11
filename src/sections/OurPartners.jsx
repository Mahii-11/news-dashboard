import { useEffect, useState, useCallback } from "react"; 
import { Plus, Trash2, Loader2, Image as ImageIcon, Edit2 } from "lucide-react";
import { deletePartnerData, getPartnerData } from "../services/api";
import SkeletonLoader from "../loader/SkeletonLoader";
import AddOurPartners from "./modals/AddOurPartners";
import EditOurPartners from "./modals/EditOurPartners";


const IMAGE_BASE_URL = "https://education.banglatechsolutionit.com"; 

export default function OurPartners() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null); 

  const loadPartnerUni = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getPartnerData();
      console.log("Fetched Partner Uni Cards Data:", response);
      
      // 🛠️ লারাভেল প্যাজিনেশন ডাটা স্ট্রাকচার ফিক্স (response.data.data)
      if (response && response.data && Array.isArray(response.data.data)) {
        setItems(response.data.data);
      } else if (Array.isArray(response)) {
        setItems(response);
      } else {
        setItems([]);
      }
      setError(null);
    } catch (error) {
      console.error("Error loading Partner Uni cards data:", error);
      setError("Failed to load Partner Uni cards.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchAsyncData = async () => {
      await loadPartnerUni();
    };
    fetchAsyncData();
  }, [loadPartnerUni]);

  const handleEdit = (id) => {
    setEditingId(id);
    setIsEditModalOpen(true);
  };

  const handleAddItem = () => {
    loadPartnerUni(); 
  };

  const handleDelete = async (id) => {
    setDeletingId(id); 
    try {
      await deletePartnerData(id);
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Delete Error:", err);
      alert(err.message || "Failed to delete item.");
    } finally {
      setDeletingId(null); 
    }
  };

  // 🛠️ loose equality (==) ব্যবহার করা হয়েছে যাতে স্ট্রিং বা নাম্বারের টাইপ মিসম্যাচ না হয়
  const editingItem = items.find((item) => item.id == editingId);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Partner Cards</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage the visual feature partner elements</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          Add New Partner leading companies 
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
            <p className="text-muted-foreground">No highlight cards available. Click 'Add New Card' to create one.</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-accent/10 bg-card shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead className="sticky top-0 z-10 bg-muted/60 backdrop-blur-sm border-b border-accent/10">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground ">
                      Image
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      leading companies
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground ">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
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
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex items-center justify-center border border-accent/10">
                          {item.image ? (
                            <img
                              src={
                                item.image.startsWith("http")
                                  ? item.image
                                  : item.image.startsWith("/")
                                  ? `${IMAGE_BASE_URL}${item.image}`
                                  : `${IMAGE_BASE_URL}/storage/${item.image}`
                              }
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://placehold.co/400x300?text=image+Not+Found";
                              }}
                            />
                          ) : (
                            <ImageIcon size={20} className="text-muted-foreground/60" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-sm text-foreground">{item.name}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-green-500/10 text-green-500 border border-green-500/20">
                          Active
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(item.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground bg-card hover:bg-muted border border-accent/10 rounded-lg shadow-sm transition-all duration-150"
                          >
                            <Edit2 size={14} />
                            <span>Edit Details</span>
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            disabled={deletingId === item.id}
                            className="inline-flex items-center justify-center p-1.5 text-destructive hover:text-white bg-destructive/5 hover:bg-destructive border border-destructive/10 hover:border-transparent rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete Partner"
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

      {/* Add Entry Modal Overlay */}
      <AddOurPartners
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddItem} 
      />

      {/* Edit Entry Modal Overlay */}
      {isEditModalOpen && editingItem && (
        <EditOurPartners
          isOpen={isEditModalOpen} 
          item={editingItem}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingId(null);
          }}
          onRefresh={loadPartnerUni}
        />
      )}
    </div>
  );
}
