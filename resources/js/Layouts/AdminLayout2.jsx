import { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { Sun, Moon, Search, Menu, Bell } from 'lucide-react';
import Sidebar from '@/Components/Admin/Sidebar';
import ProfileDropdown from '@/Components/Admin/ProfileDropdown';
import Breadcrumbs from '@/Components/Admin/Breadcrumbs';

const useTheme = () => {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const isDark = localStorage.getItem('darkMode') === 'true' ||
            (!('darkMode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
        setDarkMode(isDark);
        if (isDark) {
            document.documentElement.classList.add('dark');
        }
    }, []);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e) => {
            if (!('darkMode' in localStorage)) {
                setDarkMode(e.matches);
                if (e.matches) {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const toggleDarkMode = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);
        localStorage.setItem('darkMode', newDarkMode.toString());

        if (newDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    return { darkMode, toggleDarkMode };
};

const SearchBar = ({ value, onChange }) => (
    <div className="relative">
        <input
            type="text"
            placeholder="Search..."
            value={value}
            onChange={onChange}
            className="w-64 px-4 py-2 text-sm text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
    </div>
);

export default function AdminLayout({ children, title }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const { darkMode, toggleDarkMode } = useTheme();

    // Close sidebar on mobile by default
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <Head title={title} />

            <div className="flex h-screen overflow-hidden">
                <Sidebar
                    open={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />

                {/* Main Content */}
                <div className={`flex-1 flex flex-col ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'} transition-all duration-300`}>
                    {/* Header */}
                    <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 shadow-sm">
                        <div className="flex items-center justify-between px-4 py-3">
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => setSidebarOpen(!sidebarOpen)}
                                    className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1"
                                    aria-label="Toggle sidebar"
                                >
                                    <Menu className="h-6 w-6" />
                                </button>
                                <SearchBar
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={toggleDarkMode}
                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
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
                        <Breadcrumbs items={usePage().props.breadcrumbs || []} />
                    </header>

                    {/* Main Content Area */}
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
                        <div className="container mx-auto px-4 py-6">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
