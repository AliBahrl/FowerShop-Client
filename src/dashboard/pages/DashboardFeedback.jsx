import { useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import useAuth from "../hooks/useAuth"
import { approveFeedback, fetchPendingFeedback, rejectFeedback } from "../../features/feadbackSlice"
import { DataTable } from "@/components/DataTable"
import { Button } from "@/components/ui/button"

const DashboardFeedback = () => {
    const dispatch = useDispatch()
    const { pendingFeedback } = useSelector((state) => state.feedback)
    const { canEdit } = useAuth()

    useEffect(() => {
        dispatch(fetchPendingFeedback())
    }, [dispatch])

    const handleApprove = (documentId) => {
        dispatch(approveFeedback(documentId))
    }

    const handleReject = (documentId) => {
        if (window.confirm('Are u shore u want to reject this feedback')) {
            dispatch(rejectFeedback(documentId))
        }
    }

    const columns = useMemo(() => [
        {
            accessorKey: 'name',
            header: 'Name',
            cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
        },
        {
            accessorKey: 'rating',
            header: 'Rating',
            cell: ({ row }) => (
                <span className="text-yellow-500">
                    {'★'.repeat(row.original.rating)}{'☆'.repeat(5 - row.original.rating)}
                </span>
            ),
        },
        {
            accessorKey: 'message',
            header: 'Message',
            cell: ({ row }) => (
                <span className="text-sm text-muted-foreground text-left block max-w-md">
                    {row.original.message}
                </span>
            ),
        },
        {
            id: 'actions',
            header: 'Procedures',
            cell: ({ row }) => {
                const fb = row.original
                return (
                    <div className="flex gap-2 justify-center">
                        <Button
                            size="sm"
                            variant="secondary"
                            className="text-green-600 hover:text-green-700"
                            onClick={() => handleApprove(fb.documentId)}
                            disabled={!canEdit}
                        >
                            Approve
                        </Button>
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(fb.documentId)}
                            disabled={!canEdit}
                        >
                            Reject
                        </Button>
                    </div>
                )
            },
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
    ], [canEdit])

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Feedback Approval</h1>
            <DataTable
                columns={columns}
                data={pendingFeedback}
                loading={false}
                emptyText="No pending feedback."
            />
        </div>
    )
}

export default DashboardFeedback
