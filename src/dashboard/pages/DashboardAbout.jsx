import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import useAuth from "../hooks/useAuth"
import { aboutFetch, updateAbout } from "../../features/AboutSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

const DashboardAbout = () => {
    const dispatch = useDispatch()
    const { aboutData, status } = useSelector((state) => state.about)
    const { canEdit } = useAuth()

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [stat, setStat] = useState([
        { number: '', label: '', iconFile: null, iconPreview: null },
        { number: '', label: '', iconFile: null, iconPreview: null },
        { number: '', label: '', iconFile: null, iconPreview: null },
        { number: '', label: '', iconFile: null, iconPreview: null },
    ])
    const [submit, setSubmit] = useState(false)

    useEffect(() => {
        dispatch(aboutFetch())
    }, [dispatch])

    useEffect(() => {
        if (aboutData) {
            setTitle(aboutData.title || '')
            setDescription(aboutData.description || '')
            setStat([1, 2, 3, 4].map((num) => ({
                number: aboutData[`stat${num}number`] || '',
                label: aboutData[`stat${num}label`] || '',
                iconFile: null,
                iconPreview: aboutData[`stat${num}Icon`]?.url ? `${import.meta.env.VITE_API_URL}${aboutData[`stat${num}Icon`].url}` : null,
            })))
        }
    }, [aboutData])

    const handleStatChange = (index, field, value) => {
        const newStats = [...stat]
        newStats[index][field] = value
        setStat(newStats)
    }

    const handleStatIconChange = (index, file) => {
        const newStats = [...stat]
        newStats[index].iconFile = file
        newStats[index].iconPreview = URL.createObjectURL(file)
        setStat(newStats)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmit(true)
        try {
            await dispatch(updateAbout({ title, description, stat })).unwrap()
            alert('Saved successfully')
        } catch (err) {
            alert(err)
        } finally {
            setSubmit(false)
        }
    }

    if (status === 'loading') return <p className="text-muted-foreground">Loading.....</p>

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">About Page</h1>

            <Card className="max-w-full">
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="grid gap-1.5">
                            <Label htmlFor="about-title">Title</Label>
                            <Input
                                id="about-title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                disabled={!canEdit}
                                required
                            />
                        </div>

                        <div className="grid gap-1.5">
                            <Label htmlFor="about-description">Description</Label>
                            <Textarea
                                id="about-description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                disabled={!canEdit}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {stat.map((s, index) => (
                                <Card key={index}>
                                    <CardHeader>
                                        <CardTitle className="text-sm font-semibold">Stat {index + 1}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex flex-col gap-2">
                                        <Input
                                            placeholder="Number (e.g. 2,500+)"
                                            value={s.number}
                                            onChange={(e) => handleStatChange(index, 'number', e.target.value)}
                                            disabled={!canEdit}
                                        />
                                        <Input
                                            placeholder="Label (e.g. Happy Customers)"
                                            value={s.label}
                                            onChange={(e) => handleStatChange(index, 'label', e.target.value)}
                                            disabled={!canEdit}
                                        />
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => e.target.files[0] && handleStatIconChange(index, e.target.files[0])}
                                            disabled={!canEdit}
                                        />
                                        {s.iconPreview && (
                                            <img src={s.iconPreview} alt="" className="w-10 h-10 object-cover rounded" />
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {canEdit && (
                            <Button type="submit" disabled={submit}  className="self-start">
                                {submit ? 'Saving...' : 'Save Changes'}
                            </Button>
                        )}
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default DashboardAbout
