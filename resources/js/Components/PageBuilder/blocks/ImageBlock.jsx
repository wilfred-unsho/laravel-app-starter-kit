import { Image, Upload } from 'lucide-react';

export default function ImageBlock({ data, onChange }) {
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/admin/media/upload', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                }
            });
            const result = await response.json();
            onChange({
                src: `/storage/${result.path}`,
                alt: data?.alt || file.name
            });
        } catch (error) {
            console.error('Upload failed:', error);
        }
    };

    return (
        <div className="w-full">
            {data?.src ? (
                <div className="relative group">
                    <img
                        src={data.src}
                        alt={data.alt}
                        className="max-w-full rounded"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
                        <label className="cursor-pointer p-2 bg-white rounded-full">
                            <Upload className="w-4 h-4" />
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </label>
                    </div>
                </div>
            ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                    <Image className="w-8 h-8 mb-2 text-gray-400" />
                    <span className="text-sm text-gray-500">Upload an image</span>
                    <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </label>
            )}
            <input
                type="text"
                value={data?.alt || ''}
                onChange={(e) => onChange({ ...data, alt: e.target.value })}
                placeholder="Alt text"
                className="mt-2 w-full p-2 border rounded"
            />
        </div>
    );
}
