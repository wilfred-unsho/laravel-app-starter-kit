import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Shield, Copy, RefreshCw } from 'lucide-react';

export default function TwoFactor({ enabled, qrCode, recoveryCodes }) {
    const [showRecoveryCodes, setShowRecoveryCodes] = useState(false);
    const [copied, setCopied] = useState(false);
    const [confirmingPassword, setConfirmingPassword] = useState(false);

    const { data, setData, post, processing, reset } = useForm({
        password: '',
    });

    const toggleTwoFactor = () => {
        setConfirmingPassword(true);
    };

    const confirmPassword = (e) => {
        e.preventDefault();

        post(enabled ? route('admin.security.2fa.disable') : route('admin.security.2fa.enable'), {
            preserveScroll: true,
            onSuccess: () => {
                setConfirmingPassword(false);
                reset();
            },
        });
    };

    const regenerateRecoveryCodes = (e) => {
        e.preventDefault();

        post(route('admin.security.2fa.regenerate'), {
            preserveScroll: true,
            onSuccess: () => {
                setConfirmingPassword(false);
                reset();
            },
        });
    };

    const copyRecoveryCodes = () => {
        navigator.clipboard.writeText(recoveryCodes.join('\n'));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <AdminLayout>
            <Head title="Two-Factor Authentication" />

            <div className="p-6">
                <div className="max-w-3xl">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                        Two-Factor Authentication
                    </h1>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow divide-y divide-gray-200 dark:divide-gray-700">
                        {/* Status Section */}
                        <div className="p-6">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <Shield className={`h-6 w-6 ${enabled ? 'text-green-500' : 'text-gray-400'}`} />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                        {enabled ? 'Two-factor authentication is enabled.' : 'Two-factor authentication is not enabled yet.'}
                                    </h3>
                                    <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                        Add additional security to your account using two-factor authentication.
                                    </div>
                                    <div className="mt-4">
                                        <button
                                            type="button"
                                            onClick={toggleTwoFactor}
                                            className={`px-4 py-2 text-sm font-medium rounded-md ${
                                                enabled
                                                    ? 'bg-red-600 text-white hover:bg-red-700'
                                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                            }`}
                                        >
                                            {enabled ? 'Disable 2FA' : 'Enable 2FA'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* QR Code Section */}
                        {enabled && qrCode && (
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                    Scan this QR code with your authenticator application
                                </h3>
                                <div className="mt-4 p-4 bg-white dark:bg-gray-900 rounded-lg inline-block">
                                    <div dangerouslySetInnerHTML={{ __html: qrCode }} />
                                </div>
                            </div>
                        )}

                        {/* Recovery Codes Section */}
                        {enabled && recoveryCodes.length > 0 && (
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                        Recovery Codes
                                    </h3>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={copyRecoveryCodes}
                                            className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                                        >
                                            <Copy className="h-4 w-4 mr-2" />
                                            {copied ? 'Copied!' : 'Copy'}
                                        </button>
                                        <button
                                            onClick={regenerateRecoveryCodes}
                                            className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                                        >
                                            <RefreshCw className="h-4 w-4 mr-2" />
                                            Regenerate
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 font-mono text-sm">
                                    {recoveryCodes.map((code, index) => (
                                        <div
                                            key={index}
                                            className="p-2 bg-gray-100 dark:bg-gray-900 rounded"
                                        >
                                            {code}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Password Confirmation Modal */}
                        {confirmingPassword && (
                            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
                                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                        Confirm Password
                                    </h3>
                                    <form onSubmit={confirmPassword}>
                                        <input
                                            type="password"
                                            value={data.password}
                                            onChange={e => setData('password', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="Enter your password"
                                        />
                                        <div className="mt-4 flex justify-end space-x-3">
                                            <button
                                                type="button"
                                                onClick={() => setConfirmingPassword(false)}
                                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                            >
                                                {processing ? 'Confirming...' : 'Confirm'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
