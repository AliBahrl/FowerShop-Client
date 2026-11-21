import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { createProducts, updateProducts } from "../../features/productSlice"
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
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function DashboardProductsForm({ isOpen, onClose, editingProduct }) {
  const dispatch = useDispatch()
  const { categoryData } = useSelector((state) => state.category)

  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [color, setColor] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [topSell, setTopSell] = useState(false)
  const [stock, setStock] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [submit, setSubmit] = useState(false)

  useEffect(() => {
    if (categoryData.length === 0) dispatch(CategoryFetch())
  }, [dispatch, categoryData.length])

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name)
      setPrice(editingProduct.price)
      setColor(editingProduct.color || '')
      setDescription(editingProduct.description || '')
      setCategoryId(editingProduct.category?.documentId || '')
      setTopSell(editingProduct.topSell || false)
      setStock(editingProduct.stock ?? '')
      setPreview(editingProduct.image?.url ? `${import.meta.env.VITE_API_URL}${editingProduct.image.url}` : null)
    } else {
      setName('')
      setPrice('')
      setColor('')
      setDescription('')
      setCategoryId('')
      setTopSell(false)
      setStock('')
      setPreview(null)
    }
    setImageFile(null)
  }, [editingProduct, isOpen])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim() || !price || !categoryId) {
      alert('Please fill name, price and category')
      return
    }
    if (!editingProduct && !imageFile) {
      alert('Chose a Image')
      return
    }

    setSubmit(true)
    try {
      const payload = {
        name,
        price: Number(price),
        color,
        description,
        categoryId,
        topSell,
        stock: stock === '' ? 0 : Number(stock),
        imageFile,
      }
      if (editingProduct) {
        await dispatch(updateProducts({ documentId: editingProduct.documentId, ...payload })).unwrap()
      } else {
        await dispatch(createProducts(payload)).unwrap()
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
          <DialogTitle>{editingProduct ? 'Edit' : 'Add New Entry'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="prod-name">Name</Label>
            <Input
              id="prod-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="prod-price">Price</Label>
            <Input
              id="prod-price"
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="prod-stock">Stock</Label>
            <Input
              id="prod-stock"
              type="number"
              min="0"
              step="1"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="0"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="prod-color">Color</Label>
            <Input
              id="prod-color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="prod-description">Description</Label>
            <Textarea
              id="prod-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
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

          <div className="flex items-center gap-2">
            <Checkbox
              id="topSell"
              checked={topSell}
              onCheckedChange={(checked) => setTopSell(checked === true)}
            />
            <Label htmlFor="topSell">Top Sell</Label>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="prod-image">Image</Label>
            <Input id="prod-image" type="file" accept="image/*" onChange={handleFileChange} />
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

export default DashboardProductsForm