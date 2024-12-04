import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    Calendar, Clock, MessageCircle, Share2,
    Facebook, Twitter, LinkedIn, Link as LinkIcon,
    ChevronRight, ThumbsUp
} from 'lucide-react';
import { format } from 'date-fns';

const ShareButtons = ({ url, title }) => {
    const shareUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
        linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`
    };

    const handleShare = (platform) => {
        window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(url);
        // Show notification
    };

    return (
        <div className="flex items-center gap-3">
            <button
                onClick={() => handleShare('facebook')}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
            >
                <Facebook className="w-5 h-5" />
            </button>
            <button
                onClick={() => handleShare('twitter')}
                className="p-2 text-blue-400 hover:bg-blue-50 rounded-full"
            >
                <Twitter className="w-5 h-5" />
            </button>
            <button
                onClick={() => handleShare('linkedin')}
                className="p-2 text-blue-700 hover:bg-blue-50 rounded-full"
            >
                <LinkedIn className="w-5 h-5" />
            </button>
            <button
                onClick={handleCopyLink}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
            >
                <LinkIcon className="w-5 h-5" />
            </button>
        </div>
    );
};

const RelatedPosts = ({ posts }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map(post => (
            <Link
                key={post.id}
                href={route('blog.show', post.slug)}
                className="group"
            >
                <div className="aspect-w-16 aspect-h-9 mb-3">
                    <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-full object-cover rounded-lg group-hover:opacity-90 transition-opacity"
                    />
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {post.title}
                </h3>
            </Link>
        ))}
    </div>
);

const AuthorCard = ({ author }) => (
    <div className="flex items-start gap-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <img
            src={author.avatar}
            alt={author.name}
            className="w-16 h-16 rounded-full"
        />
        <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                {author.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
                {author.bio}
            </p>
            {/* Add social links if available */}
        </div>
    </div>
);

export default function Show({ post, comments, relatedPosts, canComment }) {
    const [showCommentForm, setShowCommentForm] = useState(false);

    return (
        <>
            <Head title={post.title} />

            <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <header className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-4">
                        {post.categories.map(category => (
                            <Link
                                key={category.id}
                                href={route('blog.index', { category: category.slug })}
                                className="hover:text-blue-600 dark:hover:text-blue-400"
                            >
                                {category.name}
                            </Link>
                        ))}
                    </div>

                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                        {post.title}
                    </h1>

                    <div className="flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
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
                            {post.comments_count} comments
                        </div>
                    </div>
                </header>

                {/* Featured Image */}
                {post.featured_image && (
                    <div className="mb-12">
                        <img
                            src={post.featured_image}
                            alt={post.title}
                            className="w-full h-96 object-cover rounded-lg"
                        />
                    </div>
                )}

                {/* Content */}
                <div
                    className="prose dark:prose-invert max-w-none mb-12"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Tags */}
                {post.tags.length > 0 && (
                    <div className="flex items-center gap-3 mb-12">
                        <span className="text-gray-500 dark:text-gray-400">Tags:</span>
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map(tag => (
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
                )}

                {/* Share Section */}
                <div className="flex items-center justify-between border-t border-b border-gray-200 dark:border-gray-700 py-6 mb-12">
                    <div className="flex items-center gap-3">
                        <span className="text-gray-500 dark:text-gray-400">Share this post:</span>
                        <ShareButtons
                            url={window.location.href}
                            title={post.title}
                        />
                    </div>
                </div>

                {/* Author Bio */}
                <div className="mb-12">
                    <AuthorCard author={post.author} />
                </div>

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
                        <RelatedPosts posts={relatedPosts} />
                    </div>
                )}

                {/* Comments Section */}
                <div id="comments">
                    <h2 className="text-2xl font-bold mb-6">Comments ({post.comments_count})</h2>

                    {/* Comment Form */}
                    {canComment ? (
                        showCommentForm ? (
                            <CommentForm
                                postId={post.id}
                                onCancel={() => setShowCommentForm(false)}
                            />
                        ) : (
                            <button
                                onClick={() => setShowCommentForm(true)}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Leave a Comment
                            </button>
                        )
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400">
                            Please <Link href={route('login')} className="text-blue-600">login</Link> to comment.
                        </p>
                    )}

                    {/* Comments List */}
                    <div className="mt-8 space-y-8">
                        {comments.map(comment => (
                            <CommentThread key={comment.id} comment={comment} />
                        ))}
                    </div>
                </div>
            </article>
        </>
    );
}
