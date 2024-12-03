import { useEffect, useRef, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Shield } from 'lucide-react';

export default function TwoFactorChallenge() {
    const { data, setData, post, processing, errors } = useForm({
        code: '',
        recovery_code: ''
    });

    const [usingRecoveryCode, setUsingRecoveryCode] = useState(false);
    const codeInput = useRef();

    useEffect(() => {
        if (codeInput.current) {
            codeInput.current.focus();
        }
    }, [usingRecoveryCode]);

    const submitForm = (e) => {
        e.preventDefault();

        post(route('two-factor.login'));
    };

    return (
        <>
            <Head title="Two Factor Authentication" />

            <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100 dark:bg-gray-900">
                <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white dark:bg-gray-800 shadow-md overflow-hidden rounded-lg">
                    <div className="mb-6 text-center">
                        <Shield className="mx-auto h-12 w-12 text-blue-500" />
                        <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
                            Two-Factor Authentication
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            {usingRecoveryCode
                                ? 'Please enter your recovery code to continue.'
                                : 'Please enter your authentication code to continue.'}
                        </p>
                    </div>

                    <form onSubmit={submitForm}>
                        {usingRecoveryCode ? (
                            <div>
                                <label htmlFor="recovery_code" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Recovery Code
                                </label>
                                <input
                                    id="recovery_code"
                                    type="text"
                                    ref={codeInput}
                                    value={data.recovery_code}
                                    onChange={e => setData('recovery_code', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    autoComplete="off"
                                />
                            </div>
                        ) : (
                            <div>
                                <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Authentication Code
                                </label>
                                <input
                                    id="code"
                                    type="text"
                                    ref={codeInput}
                                    value={data.code}
                                    onChange={e => setData('code', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    autoComplete="off"
                                />
                            </div>
                        )}

                        {errors.code && (
                            <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                                {errors.code}
                            </div>
                        )}

                        <div className="mt-6 flex items-center justify-between">
                            <button
                                type="button"
                                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500"
                                onClick={() => setUsingRecoveryCode(!usingRecoveryCode)}
                            >
                                {usingRecoveryCode
                                    ? 'Use authentication code'
                                    : 'Use recovery code'}
                            </button>

                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                            >
                                {processing ? 'Verifying...' : 'Verify'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
