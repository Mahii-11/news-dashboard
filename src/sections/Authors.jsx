import { useCallback, useEffect, useState } from 'react';
import { Plus, Trash2, Edit2,  Loader2 } from 'lucide-react';
import { teamMembers } from '../data/cms-data';
import EditAuthors from './modals/EditAuthors';
import AddAuthors from './modals/AddAuthors';
import { deleteAuthorsData, getAuthorsData } from '../services/api';
import SkeletonLoader from '../loader/SkeletonLoader';

export function Authors() {
  const [members, setMembers] = useState(teamMembers);
  const [editingId, setEditingId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const loadTeamData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAuthorsData();
      const actualData = response?.data?.data || response?.data || response;
      setMembers(Array.isArray(actualData) ? actualData : []);
    } catch (error) {
      console.error("Error loading team data:", error);
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    const fetchAsyncData = async () => {
      await loadTeamData();
    };
    fetchAsyncData();
  }, [loadTeamData]);

  const handleEdit = (id) => {
    setEditingId(id);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteAuthorsData(id); 
      setMembers(prevItems => prevItems.filter(item => item.id !== id));
    } catch (error) {
      console.error("Failed to delete:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const editingMember = members.find(item => item.id === editingId);

  return (
    <div className="space-y-8">
      {/* Top Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Authors</h1>
          <p className="page-subtitle">Manage your team and their roles</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          Add Author
        </button>
      </div>

      {/* Loading State */}
       {loading && <SkeletonLoader />}

      {/* Team Table */}
      {!loading && (
        members.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-accent/10 rounded-2xl bg-card/30">
            <p className="text-muted-foreground text-sm">No team members found. Click 'Add Member' to create one.</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-accent/10 bg-card shadow-sm overflow-hidden">
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full table-fixed">
                <thead className="sticky top-0 z-10 bg-muted/60 backdrop-blur-sm border-b border-accent/10">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground w-20">
                      Avatar
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground w-40">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground w-36">
                      Designation
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground w-28">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-accent/5">
                  {members.map((member, index) => (
                    <tr
                      key={member.id}
                      className={`transition-colors duration-150 hover:bg-muted/50 ${index % 2 === 1 ? "bg-muted/20" : ""}`}
                    >
                      <td className="px-4 py-3">
                        <div className="relative w-12 h-12">
                          <div className="w-full h-full rounded-lg overflow-hidden ring-2 ring-accent/20 bg-muted">
                            <img
                              src={member.avatar_url}
                              alt={member.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {member.status === 1 && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-success border-2 border-card rounded-full" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-sm text-foreground">{member.name}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-accent">{member.designation}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(member.id)}
                            className="inline-flex items-center justify-center p-1.5 text-muted-foreground hover:text-foreground bg-card hover:bg-muted border border-accent/10 rounded-lg shadow-sm transition-all duration-150"
                            title="Edit Member"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            disabled={deletingId === member.id}
                            onClick={() => handleDelete(member.id)}
                            className="inline-flex items-center justify-center p-1.5 text-destructive hover:text-white bg-destructive/5 hover:bg-destructive border border-destructive/10 hover:border-transparent rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete Member"
                          >
                            {deletingId === member.id ? (
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

      {/* Add Modal */}
      <AddAuthors
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={loadTeamData}
      />

      {/* Edit Modal */}
      {isEditModalOpen && editingMember && (
        <EditAuthors
          member={editingMember}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingId(null);
          }}
          onRefresh={loadTeamData}
        />
      )}
    </div>
  );
}
