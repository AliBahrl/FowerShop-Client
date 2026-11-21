import { useDispatch, useSelector } from "react-redux";
import useAuth from "../hooks/useAuth";
import { useEffect, useMemo, useState } from "react";
import { CategoryFetch, deleteCategory } from "../../features/categorySlice";
import DashboardCategoriesForm from "../components/DashboardCategoriesForm";
import { DataTable } from "@/components/DataTable"
import { Button } from "@/components/ui/button"

function DashboardCategory() {

    const dispatch = useDispatch();
    const { categoryData, status } = useSelector((state) => state.category);
    const { canEdit } = useAuth();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    useEffect(() => {
        dispatch(CategoryFetch())
    }, [dispatch])

    const handleAdd = () => {
        setEditingCategory(null);
        setIsModalOpen(true);
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const handleDelete = (documentId) => {
        if (window.confirm('Are u shore u want to delete this data')) {
            dispatch(deleteCategory(documentId));
        }
    };

    const columns = useMemo(() => [
        {
            id: 'image',
            header: 'Image',
            cell: ({ row }) => {
                const cat = row.original
                const imageUrl = cat.image?.url ? `${import.meta.env.VITE_API_URL}${cat.image.url}` : ''
                return (
                    <div className="flex justify-center">
                        <img src={imageUrl} alt={cat.name} className="w-12 h-12 object-cover rounded-lg" />
                    </div>
                )
            },
        },
        {
            accessorKey: 'name',
            header: 'Name',
        },
        {
            accessorKey: 'slug',
            header: 'Slug',
        },
        {
            id: 'actions',
            header: 'Procedures',
            cell: ({ row }) => {
                const cat = row.original
                return (
                    <div className="flex gap-2 justify-center">
                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleEdit(cat)}
                            disabled={!canEdit}
                            className='bg-gray-300 pt-1'
                        >
                            Edit
                        </Button>
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(cat.documentId)}
                            disabled={!canEdit}
                        >
                            delete
                        </Button>
                    </div>
                )
            },
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
    ], [canEdit])

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Categories</h1>
                <Button onClick={handleAdd} disabled={!canEdit}>
                    Create New Entry
                </Button>
            </div>

            <DataTable
                columns={columns}
                data={categoryData}
                loading={status === 'loading'}
                emptyText="No Fetch"
            />

            <DashboardCategoriesForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                editingCategory={editingCategory}
            />
        </div>
    )
}

export default DashboardCategory
