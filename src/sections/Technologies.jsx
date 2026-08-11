import { useEffect, useState, useCallback } from 'react';
import { Plus, Edit2, Trash2, Loader2 } from 'lucide-react';
import * as Icons from 'lucide-react';
import { deleteTechnologiesData, getTechnologiesData } from '../services/api'; 
import SkeletonLoader from '../loader/SkeletonLoader';
import AddTechnologies from './modals/AddTechnologies';
import EditTechnologies from './modals/EditTechnologies';


const iconMap = {
  Code2: Icons.Code2,
  Workflow: Icons.Workflow,
  Cpu: Icons.Cpu,
  Database: Icons.Database,
  Cloud: Icons.Cloud,
  BrainCircuit: Icons.BrainCircuit,
  Smartphone: Icons.Smartphone,
  WandSparkles: Icons.WandSparkles,

};



export default  function Technologies() {
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false); 
  const [deletingId, setDeletingId] = useState(null);

  const loadStudyStepData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTechnologiesData();
      console.log("Fetched Why Choose Data:", data);
      setItems(Array.isArray(data) ? data : data?.data || []);
    } catch (error) {
      console.error("Error loading why choose data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

 useEffect(() => {
    const fetchAsyncData = async () => {
      await loadStudyStepData();
    };
    fetchAsyncData();
  }, [loadStudyStepData]);

  const handleEdit = (id) => {
    setEditingId(id);
    setIsEditModalOpen(true);
  };

const handleDelete = async (id) => {
  setDeletingId(id);

  try {
    await deleteTechnologiesData(id); 
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  } catch (error) {
    console.error("Failed to delete:", error);
  } finally {
    setDeletingId(null)
  }
};

  const handleAddItem = () => {
    loadStudyStepData(); 
  };
  

  const editingItem = items.find(item => item.id === editingId);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title text-4xl">Technologies</h1>
          <p className="page-subtitle">Manage your key selling points and value propositions</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          Add Technologies
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
            <table className="w-full min-w-[720px]">
              <thead className="sticky top-0 z-10 bg-muted/60 backdrop-blur-sm border-b border-accent/10">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground w-20">
                    Icon
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground w-48">
                    Technologies Name
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
                  const IconComponent = iconMap[item.icon] ;

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
                            <Icons.ShieldCheck size={24} className="text-accent" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-sm text-foreground">{item.name}</span>
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
      <AddTechnologies
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddItem}
      />

      {/* Edit Modal */}
      {isEditModalOpen && editingItem && (
        <EditTechnologies
          item={editingItem}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingId(null);
          }}
          onRefresh={loadStudyStepData} 
        />
      )}
    </div>
  );
}
