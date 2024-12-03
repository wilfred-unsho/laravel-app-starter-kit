import { useState, useEffect } from 'react';

export default function PasswordStrengthMeter({ password }) {
    const [strength, setStrength] = useState(0);
    const [feedback, setFeedback] = useState([]);

    useEffect(() => {
        if (!password) {
            setStrength(0);
            setFeedback([]);
            return;
        }

        // Calculate strength based on criteria
        let currentStrength = 0;
        let currentFeedback = [];

        // Length check
        if (password.length >= 8) {
            currentStrength += 20;
        } else {
            currentFeedback.push('Use at least 8 characters');
        }

        // Uppercase check
        if (/[A-Z]/.test(password)) {
            currentStrength += 20;
        } else {
            currentFeedback.push('Add uppercase letters');
        }

        // Lowercase check
        if (/[a-z]/.test(password)) {
            currentStrength += 20;
        } else {
            currentFeedback.push('Add lowercase letters');
        }

        // Number check
        if (/\d/.test(password)) {
            currentStrength += 20;
        } else {
            currentFeedback.push('Add numbers');
        }

        // Special character check
        if (/[^A-Za-z0-9]/.test(password)) {
            currentStrength += 20;
        } else {
            currentFeedback.push('Add special characters');
        }

        setStrength(currentStrength);
        setFeedback(currentFeedback);
    }, [password]);

    const getStrengthColor = () => {
        if (strength >= 80) return 'bg-green-500';
        if (strength >= 60) return 'bg-blue-500';
        if (strength >= 40) return 'bg-yellow-500';
        if (strength >= 20) return 'bg-orange-500';
        return 'bg-red-500';
    };

    const getStrengthLabel = () => {
        if (strength >= 80) return 'Strong';
        if (strength >= 60) return 'Good';
        if (strength >= 40) return 'Fair';
        if (strength >= 20) return 'Weak';
        return 'Very Weak';
    };

    if (!password) return null;

    return (
        <div className="mt-1 space-y-2">
            <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div
                    className={`absolute h-full rounded-full transition-all duration-300 ${getStrengthColor()}`}
                    style={{ width: `${strength}%` }}
                />
            </div>

            <div className="flex items-center justify-between text-sm">
                <span className={`font-medium ${getStrengthColor().replace('bg-', 'text-')}`}>
                    {getStrengthLabel()}
                </span>
                {feedback.length > 0 && (
                    <span className="text-gray-500 dark:text-gray-400">
                        {feedback[0]}
                    </span>
                )}
            </div>
        </div>
    );
}
