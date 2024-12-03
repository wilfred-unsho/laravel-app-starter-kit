import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

export function Notification({
                                 message,
                                 type = 'success',
                                 show = false,
                                 onClose
                             }) {
    const [isVisible, setIsVisible] = useState(show);

    useEffect(() => {
        setIsVisible(show);
        if (show) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                onClose?.();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <div className={`rounded-lg shadow-lg p-4 ${
                type === 'success'
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                    : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
            }`}>
                <div className="flex items-center">
                    {type === 'success' ? (
                        <CheckCircle className="h-5 w-5 mr-3" />
                    ) : (
                        <XCircle className="h-5 w-5 mr-3" />
                    )}
                    <p className="text-sm font-medium">{message}</p>
                    <button
                        onClick={() => {
                            setIsVisible(false);
                            onClose?.();
                        }}
                        className="ml-4 inline-flex"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
