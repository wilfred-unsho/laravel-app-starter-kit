import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import {
    Plus, Edit, Trash2, Eye, Clock, Calendar, MessageCircle,
    BarChart2, Star, Filter, Search, Download
} from 'lucide-react';
import { format } from 'date-fns';

export default function Index({ posts }) {
    const [selectedPosts, setSelectedPosts] = useState([]);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const statusColors = {
        draft: 'bg-gray-100 text-gray-800',
        published: 'bg-green-100 text-green-800',
        scheduled: 'bg-blue-100 text-blue-800'
    };

    return (
        <AdminLayout>
            <Head title="Blog Posts" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-semibold">Blog Posts</h1>
                            <Link
                                href={route('admin.blog.posts.create')}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                New Post
                            </Link>
                        </div>

                        {/* Filters & Search */}
                        <div className="mt-4 flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    placeholder="Search posts..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                                />
                                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            </div>

                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="border rounded-lg px-4 py-2"
                            >
                                <option value="all">All Status</option>
                                <option value="published">Published</option>
                                <option value="draft">Draft</option>
                                <option value="scheduled">Scheduled</option>
                            </select>

                            {selectedPosts.length > 0 && (
                                <div className="flex gap-2">
                                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                                        Delete Selected
                                    </button>
                                    <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                                        Export Selected
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Posts Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <input
                                        type="checkbox"
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedPosts(posts.data.map(post => post.id));
                                            } else {
                                                setSelectedPosts([]);
                                            }
                                        }}
                                        className="rounded border-gray-300"
                                    />
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Title
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Author
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Stats
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {posts.data.map((post) => (
                                <tr key={post.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <input
                                            type="checkbox"
                                            checked={selectedPosts.includes(post.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedPosts([...selectedPosts, post.id]);
                                                } else {
                                                    setSelectedPosts(selectedPosts.filter(id => id !== post.id));
                                                }
                                            }}
                                            className="rounded border-gray-300"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            {post.featured_image && (
                                                <img
                                                    src={post.featured_image}
                                                    alt=""
                                                    className="h-10 w-10 rounded-lg object-cover mr-3"
                                                />
                                            )}
                                            <div>
                                                <div className="font-medium text-gray-900">
                                                    {post.title}
                                                </div>
                                                {post.is_featured && (
                                                    <span className="inline-flex items-center text-xs text-yellow-600">
                                                            <Star className="w-3 h-3 mr-1" />
                                                            Featured
                                                        </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {post.author.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[post.status]}`}>
                                                {post.status}
                                            </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {format(new Date(post.published_at || post.created_at), 'MMM d, yyyy')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3 text-sm text-gray-500">
                                                <span className="flex items-center">
                                                    <Eye className="w-4 h-4 mr-1" />
                                                    {post.views_count}
                                                </span>
                                            <span className="flex items-center">
                                                    <MessageCircle className="w-4 h-4 mr-1" />
                                                {post.comments_count}
                                                </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end items-center space-x-2">
                                            <Link
                                                href={route('admin.blog.posts.edit', post.id)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    if (confirm('Are you sure you want to delete this post?')) {
                                                        // Delete action
                                                    }
                                                }}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {posts.meta && (
                        <div className="px-6 py-4 border-t border-gray-200">
                            {/* Add pagination component here */}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
