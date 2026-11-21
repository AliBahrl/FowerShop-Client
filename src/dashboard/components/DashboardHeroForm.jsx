import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { createHero, updateHero } from "../../features/heroSlice"
import { CategoryFetch } from "../../features/categorySlice"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function DashboardHeroForm({ isOpen, onClose, editingHero }) {
    const dispatch = useDispatch()
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [textColor, setTextColor] = useState('')
    const [btnColor, setBtnColor] = useState('')
    const [imageFile, setImageFile] = useState(null)
    const [bgFile, setBgFile] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [bgPreview, setBgPreview] = useState(null)
    const [submit, setSubmit] = useState(false)

    const { categoryData } = useSelector((state) => state.category)
    const [categoryId, setCategoryId] = useState('')

    useEffect(() => {
        if (categoryData.length === 0) dispatch(CategoryFetch())
    }, [dispatch, categoryData.length])

    useEffect(() => {
        if (editingHero) {
            setName(editingHero.name)
            setDescription(editingHero.description || '')
            setTextColor(editingHero.textColor || '')
            setBtnColor(editingHero.btnColor || '')
            setCategoryId(editingHero.category?.documentId || '')
            setImagePreview(editingHero.image?.url ? `${import.meta.env.VITE_API_URL}${editingHero.image.url}` : null)
            setBgPreview(editingHero.bg?.url ? `${import.meta.env.VITE_API_URL}${editingHero.bg.url}` : null)
        } else {
            setName('')
            setDescription('')
            setTextColor('')
            setBtnColor('')
            setCategoryId('')
            setImagePreview(null)
            setBgPreview(null)
        }
        setImageFile(null)
        setBgFile(null)
    }, [editingHero, isOpen])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!name.trim()) return
        if (!editingHero && (!imageFile || !bgFile)) {
            alert('Chose both images (image + background)')
            return
        }

        setSubmit(true)
        try {
            const payload = { name, description, textColor, btnColor, categoryId, imageFile, bgFile }
            if (editingHero) {
                await dispatch(updateHero({ documentId: editingHero.documentId, ...payload })).unwrap()
            } else {
                await dispatch(createHero(payload)).unwrap()
            }
            onClose()
        } catch (err) {
            alert(err)
        } finally {
            setSubmit(false)
        }
    }

    return (
        <Dialog  open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-h-[90vh] overflow-y-auto ">
                <DialogHeader>
                    <DialogTitle>{editingHero ? 'Edit' : 'Add New Entry'}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="grid gap-1.5">
                        <Label htmlFor="hero-name">Name</Label>
                        <Input
                            id="hero-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="grid gap-1.5">
                        <Label htmlFor="hero-description">Description</Label>
                        <Textarea
                            id="hero-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={2}
                        />
                    </div>

                    <div className="grid gap-1.5">
                        <Label htmlFor="hero-text-color">Text Color (Tailwind class, e.g. text-white)</Label>
                        <Input
                            id="hero-text-color"
                            value={textColor}
                            onChange={(e) => setTextColor(e.target.value)}
                            placeholder="text-white"
                        />
                    </div>

                    <div className="grid gap-1.5">
                        <Label htmlFor="hero-btn-color">Button Color (Tailwind class, e.g. bg-pink-600)</Label>
                        <Input
                            id="hero-btn-color"
                            value={btnColor}
                            onChange={(e) => setBtnColor(e.target.value)}
                            placeholder="bg-pink-600"
                        />
                    </div>

                    <div className="grid gap-1.5">
                        <Label>Category</Label>
                        <Select value={categoryId} onValueChange={setCategoryId} required>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Choose category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categoryData.map((cat) => (
                                    <SelectItem key={cat.documentId} value={cat.documentId}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-1.5">
                        <Label htmlFor="hero-image">Product Image</Label>
                        <Input
                            id="hero-image"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0]
                                if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)) }
                            }}
                        />
                        {imagePreview && <img src={imagePreview} alt="" className="mt-2 w-20 h-20 object-cover rounded-lg" />}
                    </div>

                    <div className="grid gap-1.5">
                        <Label htmlFor="hero-bg">Background Image</Label>
                        <Input
                            id="hero-bg"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0]
                                if (file) { setBgFile(file); setBgPreview(URL.createObjectURL(file)) }
                            }}
                        />
                        {bgPreview && <img src={bgPreview} alt="" className="mt-2 w-20 h-20 object-cover rounded-lg" />}
                    </div>

                    <DialogFooter className="mt-2 ">
                        <Button type="button" variant="ghost" onClick={onClose} className='bg-gray-300'> 
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

export default DashboardHeroForm
 