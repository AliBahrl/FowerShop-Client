import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import useAuth from "../hooks/useAuth"
import { deleteProduct, productFetch } from "../../features/productSlice"
import DashboardProductsForm from '../components/DashboardProductsForm'
import { DataTable } from "@/components/DataTable"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

function DashboardProducts() {

    const dispatch = useDispatch()
    const { productData, status } = useSelector((state) => state.product)
    const { canEdit } = useAuth()

    const [isModalOpen, SetIsModalOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState(null)

    useEffect(() => {
        dispatch(productFetch())
    }, [dispatch])

    const handleAdd = () => {
        setEditingProduct(null)
        SetIsModalOpen(true)
    }

    const handleEdit = (product) => {
        setEditingProduct(product)
        SetIsModalOpen(true)
    }
    const handleDelete = (documentId) => {
        if (window.confirm('Are u shoure u want to delete this products?'))
            dispatch(deleteProduct(documentId))
    }

    const columns = useMemo(() => [
        {
            accessorKey: 'id',
            header: 'id',
        },
        {
            id: 'image',
            header: 'Image',
            cell: ({ row }) => {
                const product = row.original
                const imageUrl = product.image?.url ? `${import.meta.env.VITE_API_URL}${product.image.url}` : ''
                return (
                    <div className="flex justify-center">
                        <img src={imageUrl} alt={product.name} className="w-12 h-12 object-cover rounded-lg" />
                    </div>
                )
            },
        },
        {
            accessorKey: 'name',
            header: 'Name',
        },
        {
            accessorKey: 'price',
            header: 'Price',
            cell: ({ row }) => `$${row.original.price}`,
        },
        {
            id: 'category',
            header: 'Category',
            accessorFn: (row) => row.category?.name || '-',
        },
        {
            accessorKey: 'stock',
            header: 'stock',
        },
        {
            accessorKey: 'topSell',
            header: 'Top Sell',
            cell: ({ row }) => (
                <Badge variant={row.original.topSell ? "default" : "secondary"}>
                    {row.original.topSell ? 'Yes' : 'No'}
                </Badge>
            ),
        },
        {
            id: 'actions',
            header: 'Procedures',
            cell: ({ row }) => {
                const product = row.original
                return (
                    <div className="flex gap-2 justify-center">
                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleEdit(product)}
                            disabled={!canEdit}
                        >
                            Edit
                        </Button>
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(product.documentId)}
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
                <h1 className="text-2xl font-bold">Products</h1>
                <Button onClick={handleAdd} disabled={!canEdit}>
                    Create New Entry
                </Button>
            </div>

            <DataTable
                columns={columns}
                data={productData}
                loading={status === 'loading'}
                emptyText="No Fetch"
            />

            <DashboardProductsForm
                isOpen={isModalOpen}
                onClose={() => SetIsModalOpen(false)}
                editingProduct={editingProduct}
            />
        </div>
    )
}

export default DashboardProducts
