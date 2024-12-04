import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { LineChart, BarChart, PieChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, Bar, Pie, ResponsiveContainer } from 'recharts';
import {
    FileText, MessageCircle, Folder, Tag, Eye, TrendingUp,
    Award, Users, BarChart2, Calendar
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend = null }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
            <div className="text-gray-500 dark:text-gray-400">{title}</div>
            <Icon className="w-5 h-5 text-blue-500" />
        </div>
        <div className="text-2xl font-semibold">{value}</div>
        {trend && (
            <div className={`mt-2 text-sm ${
                trend > 0 ? 'text-green-500' : 'text-red-500'
            }`}>
                {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last period
            </div>
        )}
    </div>
);

export default function Analytics({ stats, dateRange }) {
    const [selectedRange, setSelectedRange] = useState(dateRange);

    return (
        <AdminLayout>
            <Head title="Blog Analytics" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Date Range Selector */}
                <div className="mb-8 flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">Blog Analytics</h1>
                    <select
                        value={selectedRange}
                        onChange={(e) => setSelectedRange(e.target.value)}
                        className="border rounded-lg px-4 py-2"
                    >
                        <option value="7">Last 7 days</option>
                        <option value="30">Last 30 days</option>
                        <option value="90">Last 90 days</option>
                    </select>
                </div>

                {/* General Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Total Posts"
                        value={stats.general.total_posts}
                        icon={FileText}
                    />
                    <StatCard
                        title="Total Comments"
                        value={stats.general.total_comments}
                        icon={MessageCircle}
                    />
                    <StatCard
                        title="Categories"
                        value={stats.general.total_categories}
                        icon={Folder}
                    />
                    <StatCard
                        title="Tags"
                        value={stats.general.total_tags}
                        icon={Tag}
                    />
                </div>

                {/* Views Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
                    <h2 className="text-lg font-medium mb-6">Page Views</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stats.views}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="views" stroke="#3B82F6" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Popular Posts & Category Distribution */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Popular Posts */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h2 className="text-lg font-medium mb-6">Popular Posts</h2>
                        <div className="space-y-4">
                            {stats.popular_posts.map(post => (
                                <div key={post.id} className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-medium">{post.title}</h3>
                                        <div className="text-sm text-gray-500">
                                            by {post.author}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="flex items-center gap-1">
                                            <Eye className="w-4 h-4" />
                                            {post.views}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MessageCircle className="w-4 h-4" />
                                            {post.comments}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Category Distribution */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h2 className="text-lg font-medium mb-6">Category Distribution</h2>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={stats.category_distribution}
                                        dataKey="count"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        fill="#3B82F6"
                                        label
                                    />
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Author Stats */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
                    <h2 className="text-lg font-medium mb-6">Author Performance</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Author
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Posts
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total Views
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Avg. Comments
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            {stats.author_stats.map((author, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {author.author}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {author.posts}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {author.views}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {author.avg_comments}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Traffic Sources */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h2 className="text-lg font-medium mb-6">Traffic Sources</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.traffic_sources}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="source" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="visits" fill="#3B82F6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
