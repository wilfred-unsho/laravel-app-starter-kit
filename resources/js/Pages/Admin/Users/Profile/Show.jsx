import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft, Mail, Phone, MapPin, Building, Calendar, Clock } from 'lucide-react';
import dayjs from 'dayjs';

export default function ShowProfile({ user, profile }) {
    return (
        <AdminLayout>
            <Head title={`Profile - ${user.name}`} />

            <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center">
                        <Link
                            href={route('admin.users.index')}
                            className="inline-flex items-center mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                            User Profile
                        </h1>
                    </div>
                    <Link
                        href={route('admin.users.profile.edit', user.id)}
                        className="inline-flex justify-center rounded-md bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Edit Profile
                    </Link>
                </div>

                <div className="max-w-3xl bg-white dark:bg-gray-800 rounded-lg shadow">
                    {/* Profile Header */}
                    <div className="px-6 py-8 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-6">
                            {profile.avatar ? (
                                <img
                                    src={profile.avatar}
                                    alt={user.name}
                                    className="h-24 w-24 rounded-full object-cover"
                                />
                            ) : (
                                <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                    <span className="text-2xl font-medium text-gray-600 dark:text-gray-300">
                                        {user.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {user.name}
                                </h2>
                                <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    {profile.job_title && (
                                        <p className="font-medium">{profile.job_title}</p>
                                    )}
                                    {profile.department && (
                                        <p>{profile.department}</p>
                                    )}
                                </div>
                                <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                                    <Mail className="h-4 w-4 mr-1" />
                                    {user.email}
                                </div>
                            </div>
                        </div>
                        {profile.bio && (
                            <div className="mt-6 text-sm text-gray-600 dark:text-gray-300">
                                {profile.bio}
                            </div>
                        )}
                    </div>

                    {/* Profile Details */}
                    <div className="px-6 py-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {profile.phone && (
                                <div className="flex items-center text-sm">
                                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                                    <span className="text-gray-600 dark:text-gray-300">{profile.phone}</span>
                                </div>
                            )}
                            {profile.location && (
                                <div className="flex items-center text-sm">
                                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                                    <span className="text-gray-600 dark:text-gray-300">{profile.location}</span>
                                </div>
                            )}
                            {profile.department && (
                                <div className="flex items-center text-sm">
                                    <Building className="h-4 w-4 text-gray-400 mr-2" />
                                    <span className="text-gray-600 dark:text-gray-300">{profile.department}</span>
                                </div>
                            )}
                            <div className="flex items-center text-sm">
                                <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                                <span className="text-gray-600 dark:text-gray-300">
                                    Joined {dayjs(user.created_at).format('MMMM D, YYYY')}
                                </span>
                            </div>
                            <div className="flex items-center text-sm">
                                <Clock className="h-4 w-4 text-gray-400 mr-2" />
                                <span className="text-gray-600 dark:text-gray-300">{profile.timezone}</span>
                            </div>
                        </div>
                    </div>

                    {/* Notification Preferences */}
                    {profile.notification_preferences && (
                        <div className="px-6 py-6 border-t border-gray-200 dark:border-gray-700">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                                Notification Preferences
                            </h3>
                            <div className="mt-4 space-y-4">
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            type="checkbox"
                                            checked={profile.notification_preferences.email}
                                            readOnly
                                            className="h-4 w-4 rounded border-gray-300 dark:border-gray-700 text-blue-600"
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label className="font-medium text-gray-700 dark:text-gray-300">
                                            Email notifications
                                        </label>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            type="checkbox"
                                            checked={profile.notification_preferences.browser}
                                            readOnly
                                            className="h-4 w-4 rounded border-gray-300 dark:border-gray-700 text-blue-600"
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label className="font-medium text-gray-700 dark:text-gray-300">
                                            Browser notifications
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
