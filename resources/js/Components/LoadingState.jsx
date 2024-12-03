import { Loader } from 'lucide-react';

export function LoadingState({ message = 'Loading...', className = '' }) {
    return (
        <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
            <Loader className="h-8 w-8 text-blue-500 animate-spin" />
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                {message}
            </p>
        </div>
    );
}

export function LoadingOverlay({ visible, message }) {
    if (!visible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl max-w-sm w-full mx-4">
                <LoadingState message={message} />
            </div>
        </div>
    );
}

export function LoadingButton({ children, loading, ...props }) {
    return (
        <button
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            {...props}
        >
            {loading ? (
                <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                </>
            ) : (
                children
            )}
        </button>
    );
}
