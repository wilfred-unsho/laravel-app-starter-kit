import { router } from '@inertiajs/react';

class SessionManager {
    constructor() {
        this.timeoutWarningTimer = null;
        this.timeoutTimer = null;
        this.warningShown = false;
        this.events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];

        // Set default timeout values (in minutes)
        this.timeoutMinutes = 30; // Default to 30 minutes if not set
        this.warningMinutes = 1;  // Show warning 1 minute before timeout

        this.init();
    }

    init() {
        // Only initialize if user is authenticated
        if (document.cookie.includes('XSRF-TOKEN')) {
            // Add activity listeners
            this.events.forEach(event => {
                document.addEventListener(event, () => this.resetTimers());
            });

            // Convert minutes to milliseconds
            this.timeoutMs = this.timeoutMinutes * 60 * 1000;
            this.warningMs = this.timeoutMs - (this.warningMinutes * 60 * 1000);

            // Start timers
            this.resetTimers();
        }
    }

    resetTimers() {
        if (this.timeoutWarningTimer) clearTimeout(this.timeoutWarningTimer);
        if (this.timeoutTimer) clearTimeout(this.timeoutTimer);

        this.warningShown = false;

        this.timeoutWarningTimer = setTimeout(() => this.showWarning(), this.warningMs);
        this.timeoutTimer = setTimeout(() => this.handleTimeout(), this.timeoutMs);
    }

    showWarning() {
        if (this.warningShown) return;
        this.warningShown = true;

        // Remove any existing warning modals first
        const existingModal = document.querySelector('.session-timeout-warning');
        if (existingModal) existingModal.remove();

        const modal = document.createElement('div');
        modal.className = 'session-timeout-warning fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
        modal.innerHTML = `
            <div class="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
                <h2 class="text-lg font-medium text-white mb-4">
                    Session Timeout Warning
                </h2>
                <p class="text-gray-300 mb-4">
                    Your session will expire in ${this.warningMinutes} minute(s) due to inactivity.
                    Click anywhere or press any key to remain logged in.
                </p>
                <div class="flex justify-end">
                    <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Keep Session Active
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Remove warning and reset timers on any interaction with the warning
        const resetAndRemove = () => {
            this.resetTimers();
            modal.remove();
        };

        modal.addEventListener('click', resetAndRemove);
        document.addEventListener('keydown', resetAndRemove);
    }

    handleTimeout() {
        router.post('/logout', {}, {
            preserveScroll: true,
            onSuccess: () => window.location.href = '/login?timeout=1'
        });
    }
}

export default new SessionManager();
