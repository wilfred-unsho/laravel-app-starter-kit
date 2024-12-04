import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import {
    Search, Filter, Check, X, AlertTriangle,
    MessageCircle, Flag, ThumbsUp, ThumbsDown
} from 'lucide-react';
import { format } from 'date-fns';
import Pagination from '@/Components/Common/Pagination';

export default function Index({ comments, filters, stats }) {
    const [selectedComments, setSelectedComments] = useState([]);
    const [expandedComments, setExpandedComments] = useState([]);

    const handleApprove = async (commentId) => {
        // Single comment approval
        await fetch(route('admin.blog.comments.approve', commentId), {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
            }
        });
        window.location.reload();
    };

    const handleReject = async (commentId) => {
        if (!confirm('Are you sure you want to reject this comment?')) return;

        await fetch(route('admin.blog.comments.reject', commentId), {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
            }
        });
        window.location.reload();
    };

    const handleBulkAction = async (action) => {
        if (!selectedComments.length) return;

        if (!confirm(`Are you sure you want to ${action} these comments?`)) return;

        await fetch(route(`admin.blog.comments.bulk-${action}`), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
            },
            body: JSON.stringify({ comments: selectedComments })
        });
        window.location.reload();
    };

    const toggleExpandComment = (commentId) => {
        setExpandedComments(prev =>
            prev.includes(commentId)
                ? prev.filter(id => id !== commentId)
                : [...prev, commentId]
        );
    };

    return (
        <AdminLayout>
            <Head title="Blog Comments" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-semibold">Comments</h1>
                            <div className="flex gap-4">
                                {selectedComments.length > 0 && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleBulkAction('approve')}
                                            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                        >
                                            <ThumbsUp className="w-4 h-4 mr-2" />
                                            Approve Selected
                                        </button>
                                        <button
                                            onClick={() => handleBulkAction('reject')}
                                            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                        >
                                            <ThumbsDown className="w-4 h-4 mr-2" />
                                            Reject Selected
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-sm text-gray-500">Pending</div>
                                <div className="text-2xl font-semibold">{stats.pending}</div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-sm text-gray-500">Approved</div>
                                <div className="text-2xl font-semibold">{stats.approved}</div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-sm text-gray-500">Total</div>
                                <div className="text-2xl font-semibold">{stats.total}</div>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    placeholder="Search comments..."
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                                />
                                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            </div>
                            <select className="border rounded-lg px-4 py-2">
                                <option value="">All Comments</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                            </select>
                        </div>
                    </div>

                    {/* Comments List */}
                    <div className="divide-y divide-gray-200">
                        {comments.data.map(comment => (
                            <div key={comment.id} className="p-6 hover:bg-gray-50">
                                <div className="flex items-start gap-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedComments.includes(comment.id)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedComments([...selectedComments, comment.id]);
                                            } else {
                                                setSelectedComments(selectedComments.filter(id => id !== comment.id));
                                            }
                                        }}
                                        className="mt-1 rounded border-gray-300"
                                    />
                                    <div className="flex-1">
                                        {/* Comment Header */}
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <div className="font-medium">{comment.author_name}</div>
                                                <div className="text-sm text-gray-500">{comment.author_email}</div>
                                                <div className="text-xs text-gray-400">
                                                    {format(new Date(comment.created_at), 'PPP p')}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {!comment.is_approved ? (
                                                    <button
                                                        onClick={() => handleApprove(comment.id)}
                                                        className="p-1 text-green-600 hover:text-green-700 hover:bg-green-50 rounded"
                                                        title="Approve"
                                                    >
                                                        <Check className="w-5 h-5" />
                                                    </button>
                                                ) : (
                                                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                                        Approved
                                                    </span>
                                                )}
                                                <button
                                                    onClick={() => handleReject(comment.id)}
                                                    className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                                                    title="Reject"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (confirm('Mark this comment as spam?')) {
                                                            // Handle spam marking
                                                        }
                                                    }}
                                                    className="p-1 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 rounded"
                                                    title="Mark as Spam"
                                                >
                                                    <Flag className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Parent Comment Reference */}
                                        {comment.parent && (
                                            <div className="mb-2 p-3 bg-gray-50 rounded-lg">
                                                <div className="text-xs text-gray-500 mb-1">
                                                    In reply to {comment.parent.author_name}:
                                                </div>
                                                <div className="text-sm text-gray-600 line-clamp-2">
                                                    {comment.parent.content}
                                                </div>
                                            </div>
                                        )}

                                        {/* Comment Content */}
                                        <div className={`prose-sm max-w-none ${
                                            expandedComments.includes(comment.id) ? '' : 'line-clamp-3'
                                        }`}>
                                            {comment.content}
                                        </div>

                                        {comment.content.length > 200 && (
                                            <button
                                                onClick={() => toggleExpandComment(comment.id)}
                                                className="text-sm text-blue-600 hover:text-blue-700 mt-1"
                                            >
                                                {expandedComments.includes(comment.id) ? 'Show less' : 'Show more'}
                                            </button>
                                        )}

                                        {/* Post Reference */}
                                        <div className="mt-2 text-sm">
                                            <span className="text-gray-500">On post: </span>
                                            <a
                                                href={route('admin.blog.posts.edit', comment.post.id)}
                                                className="text-blue-600 hover:text-blue-700"
                                            >
                                                {comment.post.title}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {comments.meta && (
                        <div className="px-6 py-4 border-t border-gray-200">
                            <Pagination links={comments.links} />
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
