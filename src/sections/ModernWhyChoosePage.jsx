import { useEffect, useState, useCallback } from 'react';

import {  Edit2 } from 'lucide-react';

import  EditWhyChooseModal  from './modals/EditWhyChooseModal';

import {  getWhyChooseData } from '../services/api'; 

import SkeletonLoader from '../loader/SkeletonLoader';






export default  function ModernWhyChoosePage() {

  const [items, setItems] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

//  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [loading, setLoading] = useState(false); 

//  const [deletingId, setDeletingId] = useState(null);



  const loadWhyChooseData = useCallback(async () => {

    setLoading(true);

    try {

      const data = await getWhyChooseData();
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

      await loadWhyChooseData();

    };

    fetchAsyncData();

  }, [loadWhyChooseData]);



  const handleEdit = (id) => {

    setEditingId(id);

    setIsEditModalOpen(true);

  };

 {/* 

const handleDelete = async (id) => {

  setDeletingId(id);



  try {

    await deleteWhyChooseData(id); 

    setItems(prevItems => prevItems.filter(item => item.id !== id));

  } catch (error) {

    console.error("Failed to delete:", error);

  } finally {

    setDeletingId(null)

  }

};



   
  const handleAddItem = () => {

    loadWhyChooseData(); 

  };

    
 */}
  



  const editingItem = items.find(item => item.id === editingId);



  return (

    <div className="space-y-8">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="page-title text-4xl">Who We Are</h1>

          <p className="page-subtitle">Manage your key selling points and value propositions</p>

        </div>

       {/*  
       
        <button

          onClick={() => setIsAddModalOpen(true)}

          className="btn-primary flex items-center gap-2"

        >

          <Plus size={18} />

          Add Who We 

        </button>
       
       */}

      </div>



      {/* Loading & Empty State */}

      {loading && items.length === 0 ? (

        <SkeletonLoader />

      ) : items.length === 0 ? (

        <div className="text-center py-12 text-muted-foreground">No items found. Add some data!</div>

      ) : (

        <div className="hidden md:block rounded-xl border border-accent/10 bg-card shadow-sm overflow-hidden">

            <table className="w-full table-fixed text-left border-collapse">

              <thead className="bg-muted/60 backdrop-blur-sm border-b border-accent/10">

                <tr>
                   <th className="w-[120px]  px-3 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Technology</th>
                   <th className="w-[28%] px-3 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground w-20">Video</th>

                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground w-32">

                    Created

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
                    className={`transition-colors duration-150 hover:bg-muted/30 ${index % 2 === 1 ? "bg-muted/10" : ""}`}
                  >
                  
                   <td className="w-[120px] px-2 py-3 align-top">
                          <span className="block text-xs whitespace-normal break-words line-clamp-3">
                          {item.items || "—"}
                     </span>
                    </td>

                  

                     <td className="px-3 py-3">
                         <div
                         className="text-xs text-muted-foreground line-clamp-3 leading-relaxed"
                         dangerouslySetInnerHTML={{
                        __html: item.description || "",
                           }}
                           />
                        </td>
                     
                      {/* Image Column */}
                    <td className="px-3 py-3 align-top">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted flex items-center justify-center border border-accent/10">
                      {item.image ? (
                       <video
                      src={item.image}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                     />
                     ) : (
                      <span className="text-xs text-muted-foreground/60">No Video</span>
                       )}
                      </div>
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

                      <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(item.id)}
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


      )}



      {/* Add Modal 

      <AddWhyChooseModal

        isOpen={isAddModalOpen}

        onClose={() => setIsAddModalOpen(false)}

        onAdd={handleAddItem}

      />
      */}



      {/* Edit Modal */}

      {isEditModalOpen && editingItem && (

        <EditWhyChooseModal

          item={editingItem}

          onClose={() => {

            setIsEditModalOpen(false);

            setEditingId(null);

          }}

          onRefresh={loadWhyChooseData} 

        />

      )}

    </div>

  );

}

