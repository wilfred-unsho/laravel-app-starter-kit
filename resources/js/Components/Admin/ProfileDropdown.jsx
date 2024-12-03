import { useState, useRef, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { LogOut, User, Shield, Activity, Settings } from 'lucide-react';

export default function ProfileDropdown({ user }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-3 focus:outline-none"
            >
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {user.name.charAt(0)}
                    </span>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user.name}
                </span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50">
                    <Link
                        href={route('admin.users.profile.show', user.id)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <User className="mr-3 h-4 w-4" />
                        Profile
                    </Link>

                    <Link
                        href={route('admin.security.2fa')}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <Shield className="mr-3 h-4 w-4" />
                        Two-Factor Auth
                    </Link>

                    <Link
                        href={route('admin.security.login-attempts')}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <Activity className="mr-3 h-4 w-4" />
                        Login Activity
                    </Link>

                    <Link
                        href={route('admin.settings')}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <Settings className="mr-3 h-4 w-4" />
                        Settings
                    </Link>

                    <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <LogOut className="mr-3 h-4 w-4" />
                        Logout
                    </Link>
                </div>
            )}
        </div>
    );
}
