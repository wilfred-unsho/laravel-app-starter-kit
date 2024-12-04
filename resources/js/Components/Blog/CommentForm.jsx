import { useState } from 'react';
import { useForm } from '@inertiajs/react';

export default function CommentForm({ postId, parentId = null, onCancel = null }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        content: '',
        post_id: postId,
        parent_id: parentId,
        author_name: '',
        author_email: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('blog.comments.store'), {
            onSuccess: () => {
                reset();
                if (onCancel) onCancel();
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Guest user fields */}
            {!route().current('login') && (
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Name *
                        </label>
                        <input
                            type="text"
                            value={data.author_name}
                            onChange={e => setData('author_name', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                            required
                        />
                        {errors.author_name && (
                            <p className="mt-1 text-sm text-red-600">{errors.author_name}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Email *
                        </label>
                        <input
                            type="email"
                            value={data.author_email}
                            onChange={e => setData('author_email', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                            required
                        />
                        {errors.author_email && (
                            <p className="mt-1 text-sm text-red-600">{errors.author_email}</p>
                        )}
                    </div>
                </div>
            )}

            {/* Comment content */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Comment *
                </label>
                <textarea
                    value={data.content}
                    onChange={e => setData('content', e.target.value)}
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    required
                />
                {errors.content && (
                    <p className="mt-1 text-sm text-red-600">{errors.content}</p>
                )}
            </div>

            <div className="flex justify-end gap-3">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    disabled={processing}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {processing ? 'Submitting...' : 'Submit'}
                </button>
            </div>
        </form>
    );
}

// resources/js/Components/Blog/CommentThread.jsx
import { useState } from 'react';
import { format } from 'date-fns';
import { Reply, ThumbsUp } from 'lucide-react';

export default function CommentThread({ comment }) {
    const [showReplyForm, setShowReplyForm] = useState(false);

    return (
        <div className="flex gap-4">
            <div className="flex-shrink-0">
                <img
                    src={comment.user?.avatar ?? '/default-avatar.png'}
                    alt={comment.author_name}
                    className="w-10 h-10 rounded-full"
                />
            </div>
            <div className="flex-grow">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <span className="font-medium text-gray-900 dark:text-white">
                                {comment.author_name}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                                {format(new Date(comment.created_at), 'MMM d, yyyy')}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowReplyForm(!showReplyForm)}
                                className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600"
                            >
                                <Reply className="w-4 h-4" />
                                Reply
                            </button>
                        </div>
                    </div>

                    <div className="prose dark:prose-invert max-w-none text-sm">
                        {comment.content}
                    </div>
                </div>

                {showReplyForm && (
                    <div className="mt-4">
                        <CommentForm
                            postId={comment.post_id}
                            parentId={comment.id}
                            onCancel={() => setShowReplyForm(false)}
                        />
                    </div>
                )}

                {/* Nested replies */}
                {comment.replies?.length > 0 && (
                    <div className="mt-4 space-y-4 pl-8">
                        {comment.replies.map(reply => (
                            <CommentThread key={reply.id} comment={reply} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
