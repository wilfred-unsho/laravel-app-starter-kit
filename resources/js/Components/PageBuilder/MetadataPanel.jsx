import { useForm } from '@inertiajs/react';
import { Share2 } from 'lucide-react';

export default function MetadataPanel({ page, onSave }) {
    const { data, setData } = useForm({
        meta_title: page?.meta_title || '',
        meta_description: page?.meta_description || '',
        meta_keywords: page?.meta_keywords || '',
        indexable: page?.indexable ?? true,
        og_title: page?.og_title || '',
        og_description: page?.og_description || '',
        og_image: page?.og_image || ''
    });

    const inputClasses = "w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400";
    const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1";

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    SEO Settings
                </h3>

                <div>
                    <label className={labelClasses}>Meta Title</label>
                    <input
                        type="text"
                        value={data.meta_title}
                        onChange={e => setData('meta_title', e.target.value)}
                        className={inputClasses}
                        placeholder="Enter meta title"
                    />
                </div>

                <div>
                    <label className={labelClasses}>Meta Description</label>
                    <textarea
                        value={data.meta_description}
                        onChange={e => setData('meta_description', e.target.value)}
                        rows={3}
                        className={inputClasses}
                        placeholder="Enter meta description"
                    />
                </div>

                <div>
                    <label className={labelClasses}>Keywords</label>
                    <input
                        type="text"
                        value={data.meta_keywords}
                        onChange={e => setData('meta_keywords', e.target.value)}
                        className={inputClasses}
                        placeholder="Enter keywords, separated by commas"
                    />
                </div>

                <label className="relative flex items-center">
                    <input
                        type="checkbox"
                        checked={data.indexable}
                        onChange={e => setData('indexable', e.target.checked)}
                        className="rounded border-gray-300 dark:border-gray-600 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                    />
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                        Allow search engines to index this page
                    </span>
                </label>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-gray-400" />
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Social Media Preview
                    </h3>
                </div>

                <div>
                    <label className={labelClasses}>OG Title</label>
                    <input
                        type="text"
                        value={data.og_title}
                        onChange={e => setData('og_title', e.target.value)}
                        className={inputClasses}
                        placeholder="Enter social media title"
                    />
                </div>

                <div>
                    <label className={labelClasses}>OG Description</label>
                    <textarea
                        value={data.og_description}
                        onChange={e => setData('og_description', e.target.value)}
                        rows={3}
                        className={inputClasses}
                        placeholder="Enter social media description"
                    />
                </div>

                <div>
                    <label className={labelClasses}>OG Image URL</label>
                    <input
                        type="text"
                        value={data.og_image}
                        onChange={e => setData('og_image', e.target.value)}
                        className={inputClasses}
                        placeholder="Enter image URL"
                    />
                </div>
            </div>

            <button
                onClick={() => onSave(data)}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
            >
                Save Settings
            </button>
        </div>
    );
}
