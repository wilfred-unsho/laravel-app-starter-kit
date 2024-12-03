import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Sun, Moon, Search, ChevronDown, Menu } from 'lucide-react';
import Sidebar from '@/Components/Admin/Sidebar';
import ProfileDropdown from '@/Components/Admin/ProfileDropdown';

export default function AdminLayout({ children }) {
    const { auth } = usePage().props;
    const [darkMode, setDarkMode] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        // Check local storage for dark mode preference
        const isDark = localStorage.getItem('darkMode') === 'true';
        setDarkMode(isDark);
        if (isDark) {
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleDarkMode = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);
        localStorage.setItem('darkMode', newDarkMode.toString());
        document.documentElement.classList.toggle('dark');
    };

    return (
        <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
            <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
                {/* Sidebar */}
                <Sidebar open={sidebarOpen} />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <header className="bg-white dark:bg-gray-800 shadow-sm">
                        <div className="flex items-center justify-between p-4">
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => setSidebarOpen(!sidebarOpen)}
                                    className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                                >
                                    <Menu size={24} />
                                </button>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-64 px-4 py-2 text-sm text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={toggleDarkMode}
                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    {darkMode ? (
                                        <Sun className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                    ) : (
                                        <Moon className="h-5 w-5 text-gray-500" />
                                    )}
                                </button>
                                <ProfileDropdown user={auth.user} />
                            </div>
                        </div>
                    </header>

                    {/* Main Content Area */}
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
                        <div className="container mx-auto px-6 py-8">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
