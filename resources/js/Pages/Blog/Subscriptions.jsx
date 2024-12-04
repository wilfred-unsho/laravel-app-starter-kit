import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Bell, BellOff, Save } from 'lucide-react';

export default function Subscriptions({ subscriptions, generalSubscription }) {
    const { data, setData, post, processing } = useForm({
        subscriptions: subscriptions.map(sub => ({
            id: sub.id,
            notify_new_posts: sub.notify_new_posts,
            notify_comments: sub.notify_comments,
            notify_updates: sub.notify_updates
        }))
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('blog.preferences.update'));
    };

    const toggleNotification = (subscriptionIndex, field) => {
        const newSubscriptions = [...data.subscriptions];
        newSubscriptions[subscriptionIndex][field] = !newSubscriptions[subscriptionIndex][field];
        setData('subscriptions', newSubscriptions);
    };

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Head title="Blog Notification Preferences" />

            <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-2xl font-semibold">Blog Notification Preferences</h1>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-6">
                        {/* General Blog Subscriptions */}
                        {generalSubscription && (
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h2 className="text-lg font-medium mb-4">General Blog Updates</h2>
                                <div className="space-y-4">
                                    <label className="flex items-center justify-between">
                                        <span className="text-gray-700">New Post Notifications</span>
                                        <button
                                            type="button"
                                            onClick={() => toggleNotification(0, 'notify_new_posts')}
                                            className={`p-2 rounded-full ${
                                                data.subscriptions[0].notify_new_posts
                                                    ? 'bg-blue-100 text-blue-600'
                                                    : 'bg-gray-100 text-gray-400'
                                            }`}
                                        >
                                            {data.subscriptions[0].notify_new_posts ? (
                                                <Bell className="w-5 h-5" />
                                            ) : (
                                                <BellOff className="w-5 h-5" />
                                            )}
                                        </button>
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* Post-Specific Subscriptions */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-medium">Post Subscriptions</h2>
                            {subscriptions
                                .filter(sub => sub.post)
                                .map((subscription, index) => (
                                    <div key={subscription.id} className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="font-medium mb-3">{subscription.post.title}</h3>
                                        <div className="space-y-3">
                                            <label className="flex items-center justify-between">
                                                <span className="text-gray-700">Comment Notifications</span>
                                                <button
                                                    type="button"
                                                    onClick={() => toggleNotification(index, 'notify_comments')}
                                                    className={`p-2 rounded-full ${
                                                        data.subscriptions[index].notify_comments
                                                            ? 'bg-blue-100 text-blue-600'
                                                            : 'bg-gray-100 text-gray-400'
                                                    }`}
                                                >
                                                    {data.subscriptions[index].notify_comments ? (
                                                        <Bell className="w-5 h-5" />
                                                    ) : (
                                                        <BellOff className="w-5 h-5" />
                                                    )}
                                                </button>
                                            </label>
                                            <label className="flex items-center justify-between">
                                                <span className="text-gray-700">Update Notifications</span>
                                                <button
                                                    type="button"
                                                    onClick={() => toggleNotification(index, 'notify_updates')}
                                                    className={`p-2 rounded-full ${
                                                        data.subscriptions[index].notify_updates
                                                            ? 'bg-blue-100 text-blue-600'
                                                            : 'bg-gray-100 text-gray-400'
                                                    }`}
                                                >
                                                    {data.subscriptions[index].notify_updates ? (
                                                        <Bell className="w-5 h-5" />
                                                    ) : (
                                                        <BellOff className="w-5 h-5" />
                                                    )}
                                                </button>
                                            </label>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>

                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {processing ? 'Saving...' : 'Save Preferences'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
