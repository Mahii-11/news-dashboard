import { Edit2, Loader2, Plus, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import * as Icons from 'react-icons/lu';
import { deleteSupportData, getSupportData } from '../services/api';
import EditSupportModal from './modals/EditSupportModal';
import AddSupportModal from './modals/AddSupportModal';
import SkeletonLoader from '../loader/SkeletonLoader';

const iconMap = {
  Smartphone: Icons.LuSmartphone,
  Palette: Icons.LuPalette,
  Bot: Icons.LuBot,
  Cloud: Icons.LuCloud,
  Database: Icons.LuDatabase,

  Monitor: Icons.LuMonitor,
  Code: Icons.LuCode,
  Globe: Icons.LuGlobe,
  Shield: Icons.LuShield,
  Server: Icons.LuServer,

  Cpu: Icons.LuCpu,
  Network: Icons.LuNetwork,
  Workflow: Icons.LuWorkflow,
  Laptop: Icons.LuLaptop,
  Rocket: Icons.LuRocket,
};

export default function OurSupportedCard() {
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false); 
  const [deletingId, setDeletingId] = useState(null);


  const loadSupportedData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSupportData();
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
    await deleteSupportData(id); 
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
     <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title text-4xl">Our Services</h1>
          <p className="page-subtitle">Manage your key selling points and value propositions</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          Add Services
        </button>
      </div>

      {/* Loading & Empty State */}
      {loading && items.length === 0 ? (
        <SkeletonLoader />
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No items found. Add some data!</div>
      ) : (
        <div className="rounded-2xl border border-accent/10 bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="sticky top-0 z-10 bg-muted/60 backdrop-blur-sm border-b border-accent/10">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground w-20">
                    Icon
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Title
                      </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Description
                      </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground w-32">
                    Created
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground w-44">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-accent/5">
                {items.map((item, index) => {
                  const IconComponent = iconMap[item.icon];

                  return (
                    <tr
                      key={item.id}
                      className={`transition-colors duration-150 hover:bg-muted/50 ${index % 2 === 1 ? "bg-muted/20" : ""}`}
                    >
                      <td className="px-4 py-3">
                        <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center border border-accent/20">
                          {IconComponent ? (
                            <IconComponent size={24} className="text-accent" />
                          ) : (
                            <Icons.LuCloud size={24} className="text-accent" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-sm text-foreground">{item.title}</span>
                      </td>

                       <td className="px-4 py-3">

                        <span className="text-sm text-muted-foreground line-clamp-2">{item.short_description}</span>

                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-muted-foreground">
                          {item.created_at ? new Date(item.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          }) : 'N/A'}
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
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Modal */}
      <AddSupportModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddItem}
      />

      {/* Edit Modal */}
      {isEditModalOpen && editingItem && (
        <EditSupportModal
          item={editingItem}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingId(null);
          }}
          onRefresh={loadSupportedData} 
        />
      )}
    </div>
  )
}
