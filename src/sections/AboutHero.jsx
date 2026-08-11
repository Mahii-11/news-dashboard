import  { useCallback, useEffect, useState } from 'react';
import {  Edit2 } from 'lucide-react';
import { heroData } from '../data/cms-data';
import { EditAboutHero } from './modals/EditAboutHero';
import { getAboutHeroData } from '../services/api';
import SkeletonLoader from '../loader/SkeletonLoader';


export function AboutHero() {
  const [heroes, setHeroes] = useState(heroData);
  const [editingId, setEditingId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);


    const loadHeroData = useCallback(async () => {
      setLoading(true);
      try {
        const response = await getAboutHeroData();
        const actualData = response?.data?.data || response?.data || response;
        setHeroes(Array.isArray(actualData) ? actualData : []);
      } catch (error) {
        console.error("Error loading Hero section data:", error);
      } finally {
        setLoading(false);
      }
    }, []);
  
  
  
   useEffect(() => {
      const fetchAsyncData = async () => {
        await loadHeroData();
      };
      fetchAsyncData();
   }, [loadHeroData]);
  
  

  const handleEdit = (id) => {
    setEditingId(id);
    setIsEditModalOpen(true);
  };

  

const editingHero = heroes.find(item => item.id === editingId);


  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title text-4xl">About Hero Sections</h1>
          <p className="page-subtitle">Manage your website hero sections with premium editing experience</p>
        </div>
      </div>

       {loading && <SkeletonLoader />}
      {/* Hero Table */}

      {!loading && (
        heroes.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-accent/10 rounded-2xl bg-card/30">
          <p className="text-muted-foreground">No hero sections available. Click &apos;Add New Hero&apos; to create one.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-accent/10 bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="sticky top-0 z-10 bg-muted/60 backdrop-blur-sm border-b border-accent/10">
                <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground w-20">
                     Bg:image
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground ">
                    Title
                    </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Subtitle
                  </th>
               
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Description
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground w-52">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-accent/5">
                {heroes.map((hero, index) => (
                  <tr
                    key={hero.id}
                    className={`transition-colors duration-150 hover:bg-muted/50 ${index % 2 === 1 ? "bg-muted/20" : ""}`}
                  >
                     <td className="px-4 py-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex items-center justify-center border border-accent/10">
                        {hero.background_image ? (
                          <img
                            src={hero.background_image}
                            alt={hero.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xs text-muted-foreground/60">No Image</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-xs text-foreground">{hero.title}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-muted-foreground line-clamp-2">{hero.subtitle}</span>
                    </td>
                      <td className="px-4 py-3">

                        <span className="text-sm text-muted-foreground line-clamp-2">{hero.description}</span>

                      </td>
                   
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(hero.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground bg-card hover:bg-muted border border-accent/10 rounded-lg shadow-sm transition-all duration-150"
                        >
                          <Edit2 size={14} />
                          <span>Edit</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* Add Modal 
      <AddHeroModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={loadHeroData}
      />
      */}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <EditAboutHero
          hero={editingHero}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingId(null);
          }}
           onRefresh={loadHeroData}
        />
      )}
    </div>
  );
}
