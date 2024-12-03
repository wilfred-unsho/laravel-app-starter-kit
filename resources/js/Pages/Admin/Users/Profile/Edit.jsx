import { useState, useRef } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft, Upload, X, Camera } from 'lucide-react';

export default function EditProfile({ user, profile, timezones }) {
    const { data, setData, post, processing, errors } = useForm({
        avatar: null,
        phone: profile.phone || '',
        bio: profile.bio || '',
        job_title: profile.job_title || '',
        department: profile.department || '',
        location: profile.location || '',
        timezone: profile.timezone || 'UTC',
        notification_preferences: profile.notification_preferences || {
            email: true,
            browser: true,
        },
    });

    const [preview, setPreview] = useState(profile.avatar);
    const fileInput = useRef();

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.users.profile.update', user.id));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('avatar', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeAvatar = () => {
        setData('avatar', null);
        setPreview(null);
        if (fileInput.current) {
            fileInput.current.value = '';
        }
    };

    return (
        <AdminLayout>
            <Head title="Edit Profile" />

            <div className="p-6">
                {/* Header with Back Button */}
                <div className="flex items-center mb-6">
                    <Link
                        href={route('admin.users.index')}
                        className="inline-flex items-center mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        Edit Profile - {user.name}
                    </h1>
                </div>

                {/* Main Content */}
                <div className="max-w-2xl bg-gray-800 rounded-lg">
                    <form onSubmit={handleSubmit} className="space-y-6 p-6">
                        {/* Avatar Upload */}
                        <div className="flex flex-col items-center space-y-4">
                            <div className="relative">
                                {preview ? (
                                    <div className="relative inline-block">
                                        <img
                                            src={preview}
                                            alt="Avatar preview"
                                            className="h-24 w-24 rounded-full object-cover ring-2 ring-gray-700"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeAvatar}
                                            className="absolute -top-1 -right-1 p-1 bg-red-600 rounded-full text-white hover:bg-red-700"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="h-24 w-24 rounded-full bg-gray-700 flex items-center justify-center ring-2 ring-gray-600">
                                        <Camera className="h-8 w-8 text-gray-400" />
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                ref={fileInput}
                                onChange={handleAvatarChange}
                                accept="image/*"
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInput.current?.click()}
                                className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Change Photo
                            </button>
                            {errors.avatar && (
                                <p className="text-sm text-red-500">{errors.avatar}</p>
                            )}
                        </div>

                        {/* Profile Information */}
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-4">Profile Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300">
                                        Job Title
                                    </label>
                                    <input
                                        type="text"
                                        value={data.job_title}
                                        onChange={e => setData('job_title', e.target.value)}
                                        className="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300">
                                        Department
                                    </label>
                                    <input
                                        type="text"
                                        value={data.department}
                                        onChange={e => setData('department', e.target.value)}
                                        className="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        value={data.phone}
                                        onChange={e => setData('phone', e.target.value)}
                                        className="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300">
                                        Timezone
                                    </label>
                                    <select
                                        value={data.timezone}
                                        onChange={e => setData('timezone', e.target.value)}
                                        className="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
                                    >
                                        {timezones.map(timezone => (
                                            <option key={timezone} value={timezone}>
                                                {timezone}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-300">
                                    Bio
                                </label>
                                <textarea
                                    value={data.bio}
                                    onChange={e => setData('bio', e.target.value)}
                                    rows={4}
                                    className="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
                                />
                            </div>
                        </div>

                        {/* Notification Preferences */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-white">Notification Preferences</h2>

                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            type="checkbox"
                                            checked={data.notification_preferences.email}
                                            onChange={e => setData('notification_preferences', {
                                                ...data.notification_preferences,
                                                email: e.target.checked
                                            })}
                                            className="h-4 w-4 rounded border-gray-700 text-blue-600 focus:ring-blue-500 bg-gray-900"
                                        />
                                    </div>
                                    <div className="ml-3">
                                        <label className="text-sm font-medium text-gray-300">
                                            Email notifications
                                        </label>
                                        <p className="text-sm text-gray-400">
                                            Get notified via email for important updates.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            type="checkbox"
                                            checked={data.notification_preferences.browser}
                                            onChange={e => setData('notification_preferences', {
                                                ...data.notification_preferences,
                                                browser: e.target.checked
                                            })}
                                            className="h-4 w-4 rounded border-gray-700 text-blue-600 focus:ring-blue-500 bg-gray-900"
                                        />
                                    </div>
                                    <div className="ml-3">
                                        <label className="text-sm font-medium text-gray-300">
                                            Browser notifications
                                        </label>
                                        <p className="text-sm text-gray-400">
                                            Receive browser notifications when logged in.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end space-x-3">
                            <Link
                                href={route('admin.users.index')}
                                className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {processing ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
