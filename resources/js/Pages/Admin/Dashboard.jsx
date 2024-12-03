import {React, useState} from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Users, ArrowUp, ArrowDown, Activity, DollarSign, Shield, UserPlus,
    Settings, AlertTriangle, CheckCircle, Clock, Globe, Cpu, HardDrive,
    MemoryStick, Network
} from 'lucide-react';
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import dayjs from 'dayjs';

const StatsCard = ({ title, value, icon: Icon, trend, trendValue, description }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">{value}</p>
                {description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>
                )}
            </div>
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
        </div>
        {trend && trendValue && (
            <div className="mt-4">
                <span className={`inline-flex items-center text-sm ${
                    trend === 'up'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                }`}>
                    {trend === 'up' ? (
                        <ArrowUp className="w-4 h-4 mr-1" />
                    ) : (
                        <ArrowDown className="w-4 h-4 mr-1" />
                    )}
                    {trendValue}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">vs last month</span>
            </div>
        )}
    </div>
);

const ActivityItem = ({ icon: Icon, title, time, description, status }) => (
    <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
        <div className={`p-2 rounded-full ${
            status === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                status === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' :
                    status === 'error' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                        'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
        }`}>
            <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white">{title}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
            {time}
        </div>
    </div>
);

const QuickAction = ({ icon: Icon, title, description, onClick, variant = 'primary' }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center space-x-3 p-4 rounded-lg transition-colors ${
            variant === 'primary'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
        }`}
    >
        <Icon className="w-5 h-5" />
        <div className="text-left">
            <p className="font-medium">{title}</p>
            <p className={`text-xs ${variant === 'primary' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                {description}
            </p>
        </div>
    </button>
);

const SecurityOverview = ({ activeUsers, failedLogins, blockedIPs }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Security Overview</h3>
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Active Sessions</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{activeUsers}</span>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Failed Login Attempts</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{failedLogins}</span>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-red-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Blocked IPs</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{blockedIPs}</span>
            </div>
        </div>
    </div>
);

const ChartCard = ({ title, children, className }) => (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 ${className}`}>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{title}</h3>
        {children}
    </div>
);

const SystemMetrics = () => {
    // Simulated real-time metrics
    const [metrics, setMetrics] = useState({
        cpu: 45,
        memory: 68,
        disk: 52,
        network: 78
    });

    // Update metrics every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setMetrics({
                cpu: Math.floor(Math.random() * 30) + 40,
                memory: Math.floor(Math.random() * 20) + 60,
                disk: Math.floor(Math.random() * 10) + 50,
                network: Math.floor(Math.random() * 40) + 50,
            });
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const MetricItem = ({ icon: Icon, title, value, color }) => (
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${color}`}>
                    <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</span>
            </div>
            <div className="text-right">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    {value}%
                </span>
            </div>
        </div>
    );

    return (
        <div className="space-y-3">
            <MetricItem icon={Cpu} title="CPU Usage" value={metrics.cpu} color="bg-blue-500" />
            <MetricItem icon={MemoryStick} title="Memory Usage" value={metrics.memory} color="bg-green-500" />
            <MetricItem icon={HardDrive} title="Disk Usage" value={metrics.disk} color="bg-purple-500" />
            <MetricItem icon={Network} title="Network" value={metrics.network} color="bg-orange-500" />
        </div>
    );
};

export default function Dashboard() {
    const { auth } = usePage().props;

    const [timeRange, setTimeRange] = useState('week'); // week, month, year

    // Sample data for charts
    const userActivityData = [
        { name: 'Mon', active: 120, total: 150 },
        { name: 'Tue', active: 140, total: 160 },
        { name: 'Wed', active: 130, total: 170 },
        { name: 'Thu', active: 150, total: 180 },
        { name: 'Fri', active: 160, total: 190 },
        { name: 'Sat', active: 140, total: 175 },
        { name: 'Sun', active: 130, total: 165 }
    ];

    const securityData = [
        { name: 'Successful', value: 850, color: '#10B981' },
        { name: 'Failed', value: 120, color: '#EF4444' },
        { name: 'Blocked', value: 30, color: '#F59E0B' }
    ];

    const recentActivities = [
        {
            icon: UserPlus,
            title: 'New user registered',
            description: 'John Doe completed registration',
            time: '5 minutes ago',
            status: 'success'
        },
        {
            icon: Shield,
            title: 'Failed login attempt',
            description: 'Multiple attempts from IP 192.168.1.1',
            time: '10 minutes ago',
            status: 'warning'
        },
        {
            icon: Settings,
            title: 'System update',
            description: 'Security patches installed successfully',
            time: '1 hour ago',
            status: 'success'
        },
        {
            icon: AlertTriangle,
            title: 'IP Blocked',
            description: 'IP 192.168.1.1 has been blocked',
            time: '2 hours ago',
            status: 'error'
        }
    ];

    return (
        <AdminLayout>
            <Head title="Dashboard" />

            <div className="p-6 space-y-6">
                {/* Welcome Message */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                            Welcome back, {auth?.user?.name}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Here's what's happening with your admin panel today.
                        </p>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4 inline-block mr-1" />
                        {dayjs().format('dddd, MMMM D, YYYY')}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard
                        title="Total Users"
                        value="1,234"
                        icon={Users}
                        trend="up"
                        trendValue="12%"
                        description="Active users across all roles"
                    />
                    <StatsCard
                        title="Active Users"
                        value="892"
                        icon={Activity}
                        trend="up"
                        trendValue="8%"
                        description="Users active in last 24 hours"
                    />
                    <StatsCard
                        title="System Health"
                        value="98.5%"
                        icon={CheckCircle}
                        description="Overall system uptime"
                    />
                    <StatsCard
                        title="Active Sessions"
                        value="156"
                        icon={Globe}
                        description="Current active sessions"
                    />
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <ChartCard title="User Activity">
                        <div className="mb-4">
                            <select
                                value={timeRange}
                                onChange={(e) => setTimeRange(e.target.value)}
                                className="text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-900 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="week">Last Week</option>
                                <option value="month">Last Month</option>
                                <option value="year">Last Year</option>
                            </select>
                        </div>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={userActivityData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis dataKey="name" stroke="#9CA3AF" />
                                    <YAxis stroke="#9CA3AF" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1F2937',
                                            border: 'none',
                                            borderRadius: '0.5rem',
                                            color: '#F9FAFB'
                                        }}
                                    />
                                    <Legend />
                                    <Area
                                        type="monotone"
                                        dataKey="total"
                                        stackId="1"
                                        stroke="#3B82F6"
                                        fill="#3B82F6"
                                        fillOpacity={0.3}
                                        name="Total Users"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="active"
                                        stackId="2"
                                        stroke="#10B981"
                                        fill="#10B981"
                                        fillOpacity={0.3}
                                        name="Active Users"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </ChartCard>

                    <ChartCard title="Login Statistics">
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={securityData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        dataKey="value"
                                        nameKey="name"
                                    >
                                        {securityData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1F2937',
                                            border: 'none',
                                            borderRadius: '0.5rem',
                                            color: '#F9FAFB'
                                        }}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </ChartCard>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Activity */}
                    <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                    Recent Activity
                                </h3>
                                <Link
                                    href={route('admin.security.activity')}
                                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    View all
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {recentActivities.map((activity, index) => (
                                    <ActivityItem key={index} {...activity} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Security Overview */}
                        <SecurityOverview
                            activeUsers={156}
                            failedLogins={23}
                            blockedIPs={5}
                        />

                        {/* Quick Actions */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                Quick Actions
                            </h3>
                            <div className="space-y-3">
                                <QuickAction
                                    icon={UserPlus}
                                    title="Add New User"
                                    description="Create a new user account"
                                    onClick={() => window.location.href = route('admin.users.create')}
                                    variant="primary"
                                />
                                <QuickAction
                                    icon={Shield}
                                    title="Security Settings"
                                    description="Review security configuration"
                                    onClick={() => window.location.href = route('admin.security.settings')}
                                />
                                <QuickAction
                                    icon={Settings}
                                    title="System Settings"
                                    description="Manage system preferences"
                                    onClick={() => window.location.href = route('admin.settings')}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
