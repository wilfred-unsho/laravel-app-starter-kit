import React from 'react';
import { AlertOctagon, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-8 text-center">
                    <AlertOctagon className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">
                        Something went wrong
                    </h3>
                    <p className="text-sm text-red-600 dark:text-red-300 mb-4">
                        An error occurred while rendering this component.
                    </p>
                    {process.env.NODE_ENV === 'development' && this.state.error && (
                        <pre className="mt-4 p-4 bg-red-100 dark:bg-red-900/40 rounded text-left overflow-auto text-sm text-red-800 dark:text-red-200">
                            {this.state.error.toString()}
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </pre>
                    )}
                    <button
                        onClick={this.handleReset}
                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Try Again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
