import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { LineChart, Line, XAxis, PieChart, Pie, Cell } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { fetchOverview } from "../../features/overview"

const STATUS_COLORS = { Processing: '#eda100', Delivered: '#008300', Cancelled: '#e34948' }
const CAT_COLORS = ['#2a78d6', '#eb6834', '#1baf7a', '#c3c2b7', '#e87ba4']

const salesConfig = { total: { label: "Sales", color: "#993556" } }

const statusConfig = {
  Processing: { label: "Processing", color: STATUS_COLORS.Processing },
  Delivered: { label: "Delivered", color: STATUS_COLORS.Delivered },
  Cancelled: { label: "Cancelled", color: STATUS_COLORS.Cancelled },
}

function buildCategoryConfig(categories) {
  return categories.reduce((acc, c, i) => {
    acc[c.name] = { label: c.name, color: CAT_COLORS[i % CAT_COLORS.length] }
    return acc
  }, {})
}

function StatCard({ label, value, sub, positive }) {
  return (
    <Card >
      <CardContent className="p-4 ">
        <p className="text-xs text-muted-foreground mb-2">{label}</p>
        <p className="text-2xl font-semibold">{value}</p>
        {sub && (
          <Badge variant={positive ? "default" : "destructive"} className="mt-2 text-xs">
            {sub}
          </Badge>
        )}
      </CardContent>
    </Card>
  )
}

function ListCard({ title, items, renderRow, emptyText = "No data yet." }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-sm font-medium">{title}</CardTitle></CardHeader>
      <CardContent className="flex flex-col">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">{emptyText}</p>
        ) : (
          items.map((item, i) => (
            <div key={i} className="flex justify-between py-2 border-b last:border-0 text-sm">
              {renderRow(item)}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}

function DashboardOverview() {
  const dispatch = useDispatch()
  const { data, status } = useSelector((s) => s.overview)

  useEffect(() => { dispatch(fetchOverview()) }, [dispatch])

  if (status === 'loading' || !data) {
    return <p className="text-muted-foreground">Loading...</p>
  }

  if (status === 'failed') {
    return <p className="text-destructive">Something went wrong loading the overview.</p>
  }

  const statusData = Object.entries(data.statusCounts).map(([name, value]) => ({ name, value, fill: STATUS_COLORS[name] || '#ccc' }))
  const categoryData = data.topCategoriesBySales.map((c, i) => ({ ...c, fill: CAT_COLORS[i % CAT_COLORS.length] }))
  const categoryConfig = buildCategoryConfig(data.topCategoriesBySales)

  return (
    <div className="flex flex-col gap-6 mb-15">
      <h1 className="text-2xl font-bold ">Overview</h1>

      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Total sales"
          value={`$${data.totalSales}`}
          sub={`${data.salesChangePct >= 0 ? '+' : ''}${data.salesChangePct}% vs last week`}
          positive={data.salesChangePct >= 0}
        />
        <StatCard
          label="Visits"
          value={data.visits}
          sub={`${data.visitsChangePct >= 0 ? '+' : ''}${data.visitsChangePct}% vs last week`}
          positive={data.visitsChangePct >= 0}
        />
        <StatCard
          label="Products"
          value={data.totalProducts}
          sub={data.lowStockCount ? `${data.lowStockCount} low in stock` : null}
          positive={false}
        />
        <StatCard label="Users" value={data.totalUsers} />
      </div>

      <Card>
        <CardHeader><CardTitle className="text-sm font-medium">Sales, last 7 days</CardTitle></CardHeader>
        <CardContent>
          <ChartContainer config={salesConfig} className="h-40 w-full">
            <LineChart data={data.salesByDay}>
              <XAxis dataKey="day" fontSize={12} axisLine={false} tickLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="total" stroke="var(--color-total)" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">Order status</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={statusConfig} className="h-40 w-full">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={30} outerRadius={50}>
                  {statusData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Pie>
                <ChartLegend content={<ChartLegendContent nameKey="name" />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">Top category</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={categoryConfig} className="h-40 w-full">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                <Pie data={categoryData} dataKey="total" nameKey="name" innerRadius={30} outerRadius={50}>
                  {categoryData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Pie>
                <ChartLegend content={<ChartLegendContent nameKey="name" />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <ListCard
        title="Top category by sales"
        items={data.topCategoriesBySales}
        renderRow={(c) => (<><span>{c.name}</span><span className="text-muted-foreground">${c.total}</span></>)}
      />

      <ListCard
        title="Top ordered products"
        items={data.topProducts}
        renderRow={(p) => (<><span>{p.name}</span><span className="text-muted-foreground">{p.sold} sold</span></>)}
      />

      <ListCard
        title="Top favourited products"
        items={data.topFavourites}
        renderRow={(f) => (<><span>{f.name}</span><span className="text-muted-foreground">{f.count} favourites</span></>)}
      />

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Avg order value" value={`$${data.avgOrderValue}`} />
        <StatCard label="Rating and feedback" value={data.avgRating || '—'} sub={`${data.totalFeedback} feedback sent`} positive />
      </div>

      <ListCard
        title="Latest feedback"
        items={data.latestFeedback}
        renderRow={(f) => (
          <div className="flex flex-col w-full">
            <div className="flex justify-between">
              <span className="font-medium">{f.name}</span>
              <span>⭐ {f.rating}</span>
            </div>
            <p className="text-muted-foreground">{f.message}</p>
          </div>
        )}
      />

      <ListCard
        title="Recent orders"
        items={data.recentOrders}
        renderRow={(o) => (
          <>
            <div>
              <p className="font-medium">Order #{o.id}</p>
              <p className="text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">${o.total}</p>
              <p className="text-xs text-muted-foreground">{o.stat}</p>
            </div>
          </>
        )}
      />
    </div>
  )
}

export default DashboardOverview
