import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { Editor } from '@tinymce/tinymce-react';
import {
    Save, Eye, Clock, Calendar, Image as ImageIcon,
    Settings, Tag, BookOpen, MessageCircle
} from 'lucide-react';
import { format } from 'date-fns';

export default function PostEditor({ post = null, categories = [], tags = [] }) {
    const [activeTab, setActiveTab] = useState('content');
    const { data, setData, post: submit, put, processing, errors } = useForm({
        title: post?.title || '',
        content: post?.content || '',
        excerpt: post?.excerpt || '',
        featured_image: post?.featured_image || '',
        status: post?.status || 'draft',
        published_at: post?.published_at ? format(new Date(post.published_at), "yyyy-MM-dd'T'HH:mm") : '',
        categories: post?.categories?.map(c => c.id) || [],
        tags: post?.tags?.map(t => t.id) || [],
        meta: post?.meta || {},
        is_featured: post?.is_featured || false,
        allow_comments: post?.allow_comments ?? true
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (post) {
            put(route('admin.blog.posts.update', post.id));
        } else {
            submit(route('admin.blog.posts.store'));
        }
    };

    const handleEditorChange = (content) => {
        setData('content', content);
    };

    const renderSettingsTab = () => (
        <div className="space-y-6">
            {/* SEO Settings */}
            <div>
                <h3 className="text-lg font-medium mb-4">SEO Settings</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Meta Title</label>
                        <input
                            type="text"
                            value={data.meta.title || ''}
                            onChange={e => setData('meta', { ...data.meta, title: e.target.value })}
                            className="w-full rounded-md border-gray-300"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Meta Description</label>
                        <textarea
                            value={data.meta.description || ''}
                            onChange={e => setData('meta', { ...data.meta, description: e.target.value })}
                            rows={3}
                            className="w-full rounded-md border-gray-300"
                        />
                    </div>
                </div>
            </div>

            {/* Categories & Tags */}
            <div>
                <h3 className="text-lg font-medium mb-4">Categories & Tags</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Categories</label>
                        <div className="space-y-2">
                            {categories.map(category => (
                                <label key={category.id} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={data.categories.includes(category.id)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setData('categories', [...data.categories, category.id]);
                                            } else {
                                                setData('categories', data.categories.filter(id => id !== category.id));
                                            }
                                        }}
                                        className="rounded border-gray-300"
                                    />
                                    <span className="ml-2">{category.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Tags</label>
                        <select
                            multiple
                            value={data.tags}
                            onChange={(e) => {
                                const values = Array.from(e.target.selectedOptions, option => parseInt(option.value));
                                setData('tags', values);
                            }}
                            className="w-full rounded-md border-gray-300"
                        >
                            {tags.map(tag => (
                                <option key={tag.id} value={tag.id}>{tag.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Additional Settings */}
            <div>
                <h3 className="text-lg font-medium mb-4">Additional Settings</h3>
                <div className="space-y-4">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={data.is_featured}
                            onChange={e => setData('is_featured', e.target.checked)}
                            className="rounded border-gray-300"
                        />
                        <span className="ml-2">Featured Post</span>
                    </label>

                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={data.allow_comments}
                            onChange={e => setData('allow_comments', e.target.checked)}
                            className="rounded border-gray-300"
                        />
                        <span className="ml-2">Allow Comments</span>
                    </label>
                </div>
            </div>
        </div>
    );

    return (
        <AdminLayout>
            <Head title={post ? 'Edit Post' : 'New Post'} />

            <form onSubmit={handleSubmit}>
                {/* Header */}
                <div className="border-b border-gray-200 bg-white">
                    <div className="px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex justify-between items-center">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    placeholder="Enter post title..."
                                    className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 text-xl font-bold"
                                />
                            </div>
                            <div className="flex items-center space-x-4">
                                <div>
                                    <select
                                        value={data.status}
                                        onChange={e => setData('status', e.target.value)}
                                        className="rounded-md border-gray-300"
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="published">Published</option>
                                        <option value="scheduled">Scheduled</option>
                                    </select>
                                </div>

                                {data.status === 'scheduled' && (
                                    <div>
                                        <input
                                            type="datetime-local"
                                            value={data.published_at}
                                            onChange={e => setData('published_at', e.target.value)}
                                            className="rounded-md border-gray-300"
                                        />
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    {processing ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex gap-8">
                        {/* Editor Area */}
                        <div className="flex-1">
                            <Editor
                                value={data.content}
                                onEditorChange={handleEditorChange}
                                init={{
                                    height: 500,
                                    menubar: false,
                                    plugins: [
                                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                                        'preview', 'anchor', 'searchreplace', 'visualblocks', 'code',
                                        'fullscreen', 'insertdatetime', 'media', 'table', 'code',
                                        'help', 'wordcount'
                                    ],
                                    toolbar: 'undo redo | blocks | ' +
                                        'bold italic forecolor | alignleft aligncenter ' +
                                        'alignright alignjustify | bullist numlist outdent indent | ' +
                                        'removeformat | help',
                                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                }}
                            />

                            <div className="mt-6">
                                <label className="block text-sm font-medium mb-2">Excerpt</label>
                                <textarea
                                    value={data.excerpt}
                                    onChange={e => setData('excerpt', e.target.value)}
                                    rows={3}
                                    className="w-full rounded-md border-gray-300"
                                    placeholder="Write a brief excerpt..."
                                />
                            </div>
                        </div>

                        {/* Settings Sidebar */}
                        <div className="w-80">
                            <div className="bg-white rounded-lg shadow">
                                {renderSettingsTab()}
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
