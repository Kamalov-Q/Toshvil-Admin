import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '../components/ui/card';
import { useLots } from '../features/lots/api/hooks';
import { useNews } from '../features/news/api/hooks';
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
import { useDistricts } from '@/features/lots/districts/api/hooks';

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

    const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Boshqaruv paneli</h1>
                <p className="text-gray-600 mt-1">Xush kelibsiz! Tizim umumiy ko'rinishi.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-blue-600" />
                            Jami lotlar
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{lots?.total || 0}</div>
                        <p className="text-xs text-gray-500 mt-1">Ro'yxatdagi yer lotlari</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                            <Newspaper className="w-5 h-5 text-purple-600" />
                            Yangiliklar soni
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{news?.total || 0}</div>
                        <p className="text-xs text-gray-500 mt-1">Nashr etilgan maqolalar</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-green-600" />
                            Tumanlar soni
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{districts?.total || 0}</div>
                        <p className="text-xs text-gray-500 mt-1">Ma'muriy hududlar</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-amber-600" />
                            Nashr etilgan yangiliklar
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            {news?.data.filter((n) => n.isPublished).length || 0}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Faol maqolalar</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Oylik faollik</CardTitle>
                        <CardDescription>Barcha modullar bo'yicha trendlar</CardDescription>
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

                <Card className="shadow-lg border-none bg-gradient-to-br from-white to-gray-50/50">
                    <CardHeader className="pb-0">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                                    Statuslar taqsimoti
                                </CardTitle>
                                <CardDescription>Lot statuslarining real vaqtdagi ko'rinishi</CardDescription>
                            </div>
                            <div className="bg-blue-100 p-2 rounded-lg">
                                <Activity className="w-5 h-5 text-blue-600" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <div className="h-[280px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={statusData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={70}
                                            outerRadius={100}
                                            paddingAngle={8}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {statusData.map((_, index) => (
                                                <Cell 
                                                    key={`cell-${index}`} 
                                                    fill={COLORS[index % COLORS.length]}
                                                    className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    return (
                                                        <div className="bg-white p-3 shadow-xl rounded-lg border border-gray-100">
                                                            <p className="text-sm font-bold text-gray-900">{payload[0].name}</p>
                                                            <p className="text-xs text-gray-600 mt-0.5">
                                                                {payload[0].value} Lots ({((payload[0].value as number / (lots?.total || 1)) * 100).toFixed(1)}%)
                                                            </p>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="space-y-4">
                                {statusData.map((status, index) => (
                                    <div key={status.name} className="flex items-center justify-between p-3 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 group">
                                        <div className="flex items-center gap-3">
                                            <div 
                                                className="w-3 h-3 rounded-full shadow-sm" 
                                                style={{ backgroundColor: COLORS[index] }}
                                            />
                                            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                                                {status.name}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-gray-900">{status.value}</span>
                                            <span className="text-[10px] text-gray-400 font-medium">lots</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Items */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Oxirgi lotlar</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {lots?.data.slice(0, 5).map((lot) => (
                                <div key={lot.id} className="flex justify-between items-center pb-4 border-b last:border-b-0">
                                    <div>
                                        <p className="font-medium text-gray-900">{lot.titleUz}</p>
                                        <p className="text-xs text-gray-500">{lot.titleUz}</p>
                                    </div>
                                    <span className="text-sm font-semibold text-blue-600 truncate max-w-[100px]">{lot.titleUz}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Oxirgi yangiliklar</CardTitle>
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
                                            Nashr etilgan
                                        </span>
                                    ) : (
                                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full">
                                            Qoralama
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