import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { createCategory, updateCategory } from "../../features/categorySlice"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

function DashboardCategoriesForm({ isOpen, onClose, editingCategory }) {

  const dispatch = useDispatch()
  const [name, setName] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [submit, setSubmit] = useState(false)

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name)
      setPreview(editingCategory.image?.url ? `${import.meta.env.VITE_API_URL}${editingCategory.image.url}` : null)
    } else {
      setName('')
      setPreview(null)
    }
    setImageFile(null)
  }, [editingCategory, isOpen])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    if (!editingCategory && !imageFile) {
      alert('Chose a Image')
      return
    }

    setSubmit(true)
    try {
      if (editingCategory) {
        await dispatch(
          updateCategory({ documentId: editingCategory.documentId, name, imageFile })
        ).unwrap()
      } else {
        await dispatch(createCategory({ name, imageFile })).unwrap()
      }
      onClose()
    } catch (err) {
      alert(err)
    } finally {
      setSubmit(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingCategory ? 'Edit' : 'Add New Entry'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="cat-name">Name</Label>
            <Input
              id="cat-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="cat-image">Image</Label>
            <Input id="cat-image" type="file" accept="image/*" onChange={handleFileChange} />
            {preview && (
              <img
                src={preview}
                alt="preview"
                className="mt-2 w-24 h-24 object-cover rounded-lg"
              />
            )}
          </div>

          <DialogFooter className="mt-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Close
            </Button>
            <Button type="submit" disabled={submit}>
              {submit ? 'saveing....' : 'save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default DashboardCategoriesForm
