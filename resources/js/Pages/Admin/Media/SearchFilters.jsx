import { useForm } from '@inertiajs/react';
import { Search } from 'lucide-react';
import debounce from 'lodash/debounce';

export default function SearchFilters({ filters }) {
    const { data, setData, get } = useForm({
        search: filters.search || '',
        type: filters.type || '',
        collection: filters.collection || ''
    });

    const debouncedSearch = debounce(() => {
        get(route('admin.media.index'), {
            preserveState: true,
            preserveScroll: true,
        });
    }, 300);

    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
        debouncedSearch();
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
                <input
                    type="text"
                    name="search"
                    value={data.search}
                    onChange={handleChange}
                    placeholder="Search files..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>

            <select
                name="type"
                value={data.type}
                onChange={handleChange}
                className="border rounded-lg px-4 py-2"
            >
                <option value="">All Types</option>
                <option value="image/">Images</option>
                <option value="video/">Videos</option>
                <option value="audio/">Audio</option>
                <option value="application/">Documents</option>
            </select>

            <select
                name="collection"
                value={data.collection}
                onChange={handleChange}
                className="border rounded-lg px-4 py-2"
            >
                <option value="">All Collections</option>
                <option value="default">Default</option>
                {/* Dynamic collections will be added here */}
            </select>
        </div>
    );
}
