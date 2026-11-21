import { useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import useAuth from "../hooks/useAuth"
import { fetchAllOrders, updateOrderStatus } from "../../features/orderSlice"
import { DataTable } from "@/components/DataTable"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const STATUS_OPTIONS = ['Processing', 'Delivered', 'Cancelled']

const STATUS_VARIANTS = {
    Processing: 'secondary',
    Delivered: 'default',
    Cancelled: 'destructive',
}

const DashboardOrders = () => {
    const dispatch = useDispatch()
    const { allOrders, status } = useSelector((state) => state.order)
    const { canEdit } = useAuth()

    useEffect(() => {
        dispatch(fetchAllOrders())
    }, [dispatch])

    const handleStatusChange = (documentId, newStat) => {
        dispatch(updateOrderStatus({ documentId, stat: newStat }))
    }

    const columns = useMemo(() => [
        {
            accessorKey: 'id',
            header: 'Order ID',
            cell: ({ row }) => <span className="font-medium">#{row.original.id}</span>,
        },
        {
            id: 'user',
            header: 'User',
            accessorFn: (row) => row.username || '-',
        },
        {
            id: 'items',
            header: 'Items',
            accessorFn: (row) => row.items?.length || 0,
        },
        {
            accessorKey: 'total',
            header: 'Total',
            cell: ({ row }) => `$${row.original.total}`,
        },
        {
            accessorKey: 'createdAt',
            header: 'Date',
            cell: ({ row }) => (
                <span className="text-sm text-muted-foreground">
                    {new Date(row.original.createdAt).toLocaleDateString()}
                </span>
            ),
        },
        {
            accessorKey: 'stat',
            header: 'Status',
            cell: ({ row }) => {
                const order = row.original
                return canEdit ? (
                    <Select value={order.stat} onValueChange={(value) => handleStatusChange(order.documentId, value)}>
                        <SelectTrigger className="w-35 mx-auto">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {STATUS_OPTIONS.map((opt) => (
                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                ) : (
                    <Badge variant={STATUS_VARIANTS[order.stat] || 'secondary'}>
                        {order.stat}
                    </Badge>
                )
            },
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
    ], [canEdit])

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Orders</h1>
            <DataTable columns={columns} data={allOrders} loading={status === 'loading'} emptyText="No orders yet." />
        </div>
    )
}

export default DashboardOrders
