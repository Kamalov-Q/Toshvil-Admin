import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '../components/ui/card';
import { useLots } from '../features/lots/api/hooks';
import { useNews } from '../features/news/api/hooks';
import { useDistricts } from '../features/districts/api/hooks';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';
import { Activity, FileText, MapPin, Newspaper } from 'lucide-react';

export default function DashboardPage() {
    const { data: lots } = useLots({ limit: 100 });
    const { data: news } = useNews({ limit: 100 });
    const { data: districts } = useDistricts({ limit: 100 });

    const chartData = [
        { name: 'Jan', lots: 40, news: 24, districts: 24 },
        { name: 'Feb', lots: 30, news: 13, districts: 22 },
        { name: 'Mar', lots: 20, news: 98, districts: 29 },
        { name: 'Apr', lots: 27, news: 39, districts: 20 },
        { name: 'May', lots: 35, news: 48, districts: 21 },
        { name: 'Jun', lots: 45, news: 38, districts: 25 },
    ];

    const statusData = [
        { name: 'Active', value: lots?.data.filter((l) => l.status === 'active').length || 0 },
        { name: 'Upcoming', value: lots?.data.filter((l) => l.status === 'upcoming').length || 0 },
        { name: 'Completed', value: lots?.data.filter((l) => l.status === 'completed').length || 0 },
        { name: 'Cancelled', value: lots?.data.filter((l) => l.status === 'cancelled').length || 0 },
    ];

    const COLORS = ['#10b981', '#3b82f6', '#gray', '#ef4444'];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome back! Here's your system overview.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-blue-600" />
                            Total Lots
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{lots?.total || 0}</div>
                        <p className="text-xs text-gray-500 mt-1">Land lots listed</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                            <Newspaper className="w-5 h-5 text-purple-600" />
                            News Posts
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{news?.total || 0}</div>
                        <p className="text-xs text-gray-500 mt-1">Articles published</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-green-600" />
                            Districts
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{districts?.total || 0}</div>
                        <p className="text-xs text-gray-500 mt-1">Administrative areas</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-amber-600" />
                            Published News
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            {news?.data.filter((n) => n.isPublished).length || 0}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Live articles</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Monthly Activity</CardTitle>
                        <CardDescription>Trends across all modules</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="lots" fill="#3b82f6" />
                                <Bar dataKey="news" fill="#8b5cf6" />
                                <Bar dataKey="districts" fill="#10b981" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Lot Status Distribution</CardTitle>
                        <CardDescription>Current status breakdown</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, value }) => `${name} (${value})`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {statusData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Items */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Lots</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {lots?.data.slice(0, 5).map((lot) => (
                                <div key={lot.id} className="flex justify-between items-center pb-4 border-b last:border-b-0">
                                    <div>
                                        <p className="font-medium text-gray-900">{lot.titleUz}</p>
                                        <p className="text-xs text-gray-500">Lot #{lot.lotNumber}</p>
                                    </div>
                                    <span className="text-sm font-semibold text-blue-600">#{lot.lotNumber}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent News</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {news?.data.slice(0, 5).map((item) => (
                                <div key={item.id} className="flex justify-between items-center pb-4 border-b last:border-b-0">
                                    <div>
                                        <p className="font-medium text-gray-900">{item.titleUz}</p>
                                        <p className="text-xs text-gray-500">{item.category}</p>
                                    </div>
                                    {item.isPublished ? (
                                        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                                            Published
                                        </span>
                                    ) : (
                                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full">
                                            Draft
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}