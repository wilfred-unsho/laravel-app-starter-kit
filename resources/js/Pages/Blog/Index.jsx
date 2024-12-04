import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    Search, Clock, MessageCircle, ChevronRight,
    Calendar, Tag as TagIcon
} from 'lucide-react';
import { format } from 'date-fns';

const BlogCard = ({ post }) => (
    <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
        {post.featured_image && (
            <Link href={route('blog.show', post.slug)}>
                <img
                    src={post.featured_image}
                    alt={post.title}
                    className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
                />
            </Link>
        )}
        <div className="p-6">
            {/* Categories */}
            <div className="flex gap-2 mb-3">
                {post.categories.map(category => (
                    <Link
                        key={category.slug}
                        href={route('blog.index', { category: category.slug })}
                        className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        {category.name}
                    </Link>
                ))}
            </div>

            {/* Title */}
            <h2 className="text-xl font-semibold mb-2">
                <Link
                    href={route('blog.show', post.slug)}
                    className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                >
                    {post.title}
                </Link>
            </h2>

            {/* Excerpt */}
            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                {post.excerpt}
            </p>

            {/* Meta Info */}
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(post.published_at), 'MMM d, yyyy')}
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {post.reading_time} min read
                    </div>
                    <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        {post.comments_count}
                    </div>
                </div>

                {/* Author */}
                <div className="flex items-center gap-2">
                    <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-6 h-6 rounded-full"
                    />
                    <span>{post.author.name}</span>
                </div>
            </div>
        </div>
    </article>
);

const Sidebar = ({ categories, tags, featuredPosts }) => (
    <aside className="space-y-8">
        {/* Search */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Search</h3>
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search posts..."
                    className="w-full pl-10 pr-4 py-2 border dark:border-gray-700 rounded-lg dark:bg-gray-700"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
        </div>

        {/* Categories */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
                {categories.map(category => (
                    <li key={category.id}>
                        <Link
                            href={route('blog.index', { category: category.slug })}
                            className="flex items-center justify-between text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                        >
                            <span>{category.name}</span>
                            <span className="text-sm text-gray-400">
                                ({category.posts_count})
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>

        {/* Tags */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Popular Tags</h3>
            <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                    <Link
                        key={tag.id}
                        href={route('blog.index', { tag: tag.slug })}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900"
                    >
                        <TagIcon className="w-4 h-4 mr-1" />
                        {tag.name}
                    </Link>
                ))}
            </div>
        </div>

        {/* Featured Posts */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Featured Posts</h3>
            <div className="space-y-4">
                {featuredPosts.map(post => (
                    <Link
                        key={post.id}
                        href={route('blog.show', post.slug)}
                        className="flex items-start gap-3 group"
                    >
                        {post.featured_image && (
                            <img
                                src={post.featured_image}
                                alt={post.title}
                                className="w-20 h-20 object-cover rounded"
                            />
                        )}
                        <h4 className="flex-1 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {post.title}
                        </h4>
                    </Link>
                ))}
            </div>
        </div>
    </aside>
);

export default function Index({ posts, categories, tags, featuredPosts, filters }) {
    return (
        <>
            <Head title="Blog" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className="space-y-8">
                            {posts.data.map(post => (
                                <BlogCard key={post.id} post={post} />
                            ))}
                        </div>

                        {/* Pagination will go here */}
                    </div>

                    {/* Sidebar */}
                    <Sidebar
                        categories={categories}
                        tags={tags}
                        featuredPosts={featuredPosts}
                    />
                </div>
            </div>
        </>
    );
}
