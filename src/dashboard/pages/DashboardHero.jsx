import { useDispatch, useSelector } from "react-redux";
import useAuth from "../hooks/useAuth";
import { useEffect, useMemo, useState } from "react";

import DashboardHeroForm from "../components/DashboardHeroForm";
import { deleteHero, heroFetch } from "../../features/heroSlice";
import { DataTable } from "@/components/DataTable"
import { Button } from "@/components/ui/button"

function DashboardHero() {
    const dispatch = useDispatch();
    const { heroData, status } = useSelector((state) => state.hero);
    const { canEdit } = useAuth();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingHero, setEditingHero] = useState(null);

    useEffect(() => {
        dispatch(heroFetch())
    }, [dispatch])

    const handleAdd = () => {
        setEditingHero(null);
        setIsModalOpen(true);
    };

    const handleEdit = (hero) => {
        setEditingHero(hero);
        setIsModalOpen(true);
    };

    const handleDelete = (documentId) => {
        if (window.confirm('Are u shore u want to delete this data')) {
            dispatch(deleteHero(documentId));
        }
    };

    const columns = useMemo(() => [
        {
            id: 'image',
            header: 'Image',
            cell: ({ row }) => {
                const hero = row.original
                const imageUrl = hero.image?.url ? `${import.meta.env.VITE_API_URL}${hero.image.url}` : ''
                return (
                    <div className="flex justify-center">
                        <img src={imageUrl} alt={hero.name} className="w-12 h-12 object-cover rounded-lg" />
                    </div>
                )
            },
        },
        {
            accessorKey: 'name',
            header: 'Name',
        },
        {
            id: 'bg',
            header: 'Background',
            cell: ({ row }) => {
                const hero = row.original
                const bgUrl = hero.bg?.url ? `${import.meta.env.VITE_API_URL}${hero.bg.url}` : ''
                return (
                    <div className="flex justify-center">
                        <img src={bgUrl} alt="" className="w-16 h-10 object-cover rounded-lg" />
                    </div>
                )
            },
        },
        {
            id: 'category',
            header: 'Category',
            accessorFn: (row) => row.category?.name || '-',
        },
        {
            id: 'actions',
            header: 'Procedures',
            cell: ({ row }) => {
                const hero = row.original
                return (
                    <div className="flex gap-2 justify-center">
                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleEdit(hero)}
                            disabled={!canEdit}
                            className='bg-gray-300 pt-1'
                        >
                            Edit
                        </Button>
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(hero.documentId)}
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
        <div className=" ">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Hero</h1>
                <Button onClick={handleAdd} disabled={!canEdit}>
                    Create New Entry
                </Button>
            </div>

            <DataTable
                columns={columns}
                data={heroData}
                loading={status === 'loading'}
                emptyText="No Fetch"
            />

            <DashboardHeroForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                editingHero={editingHero}
            />
        </div>
    )
}

export default DashboardHero
