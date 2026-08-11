import { useEffect, useState, useCallback } from 'react';
import { Plus, Edit2, Trash2, Award, Loader2 } from 'lucide-react';
import { deleteMediaData, getMediaData } from '../services/api'; 
import SkeletonLoader from '../loader/SkeletonLoader';
import AddMedia from './modals/AddMedia';
import EditMedia from './modals/EditMedia';


export default function Media() {
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
   const [deletingId, setDeletingId] = useState(null);

  const loadProgramsData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getMediaData();
      console.log(response);
      setItems(response?.data?.data || response?.data || Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Error loading programs data:", error);
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    const fetchAsyncData = async () => {
      await loadProgramsData();
    };
    fetchAsyncData();
  }, [loadProgramsData]);

  const handleEdit = (id) => {
    setEditingId(id);
    setIsEditModalOpen(true);
  };

 const handleDelete = async (id) => {
   setDeletingId(id);
 
   try {
     await deleteMediaData(id); 
     setItems(prevItems => prevItems.filter(item => item.id !== id));
   } catch (error) {
     console.error("Failed to delete:", error);
   } finally {
     setDeletingId(null)
   }
 };

   const handleAddItem = () => {
    loadProgramsData(); 
  };
  

  const editingItem = items.find(item => item.id === editingId);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title text-4xl font-bold text-foreground">Our Media</h1>
          <p className="page-subtitle text-muted-foreground">Manage Media  paths</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          Add Media
        </button>
      </div>

      {/* Conditional Rendering UI */}
      {loading && items.length === 0 ? (
        <SkeletonLoader />
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No programs found. Add some programs!</div>
      ) : (
        <div className="rounded-2xl border border-accent/10 bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full table-fixed">
              <thead className="sticky top-0 z-10 bg-muted/60 backdrop-blur-sm border-b border-accent/10">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground ">
                    video
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground w-28">
                    Thumbnail
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground w-28">
                    Featured
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground w-24">
                    Date
                  </th>
                 
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground w-44">
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
                       <span className="font-medium text-sm text-foreground line-clamp-3">{item.video}</span>
                    </td>
                    
                    <td className="px-4 py-3">
                      <span className="font-medium text-sm text-foreground">{item.title}</span>
                    </td>

                    <td className="px-4 py-3">
                      <span className="text-sm text-accent ">
                        {item.category}
                      </span>
                    </td>
                     <td className="px-4 py-3">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted border border-accent/10">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=No+Image'; }}
                        />
                        {item.trending === 1 && (
                          <span className="absolute top-0.5 left-0.5 bg-amber-500 text-white font-bold uppercase tracking-wider rounded px-1 py-0.5 text-[8px] flex items-center gap-0.5">
                            <Award size={8} />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-md bg-accent/5 border border-accent/10 text-xs font-medium text-accent uppercase">
                        {item.featured}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-muted/60 border border-muted/20 text-xs font-medium text-muted-foreground uppercase">
                        {item.date}
                      </span>
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
                          disabled={deletingId === item.id}
                          onClick={() => handleDelete(item.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-destructive hover:text-white bg-destructive/5 hover:bg-destructive border border-destructive/10 hover:border-transparent rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Modal Component */}
      <AddMedia
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddItem}
      />

    

      {/* Edit Modal Component */}
      {isEditModalOpen && editingItem && (
        <EditMedia
          item={editingItem}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingId(null);
          }}
          onRefresh={loadProgramsData}
        />
      )}
    </div>
  );
}





{/*  
  
   <div className="w-16 h-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center border border-accent/10">
                      {item.video ? (
                       <video
                       src={item.video}
                       className="w-full h-full object-cover"
                       muted
                       playsInline
                          />
                          ) : (
                      <span className="text-xs text-muted-foreground/60">No Video</span>
                       )}
                        </div>
  
  
  
  
  
*/}