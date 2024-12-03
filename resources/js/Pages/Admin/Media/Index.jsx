import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { useDropzone } from 'react-dropzone';
import SearchFilters from '@/Components/Admin/Media/SearchFilters';
import FilePreviewModal from '@/Components/Admin/Media/FilePreviewModal';
import { Trash2, Image, FileText, Music, Video, Download, Eye, Upload } from 'lucide-react';
import GalleryView from '@/Components/Admin/Media/GalleryView';

export default function Index({ files, filters }) {
    const [viewMode, setViewMode] = useState('grid');
    const [previewFile, setPreviewFile] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(null);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: async acceptedFiles => {
            setIsUploading(true);
            setError(null);

            try {
                for (const file of acceptedFiles) {
                    const formData = new FormData();
                    formData.append('file', file);

                    await fetch(route('media.upload'), {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                        }
                    }).then(response => response.json())
                        .then(data => {
                            window.location.reload();
                        })
                        .catch(err => {
                            setError('Failed to upload file: ' + file.name);
                            console.error(err);
                        });
                }
            } catch (err) {
                setError('Upload failed');
                console.error(err);
            } finally {
                setIsUploading(false);
            }
        }
    });

    const handleBulkDelete = async () => {
        if (!selectedFiles.length || isDeleting) return;
        setIsDeleting(true);
        setError(null);

        fetch(route('media.bulk-delete'), {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
            },
            body: JSON.stringify({ ids: selectedFiles })
        }).then(() => {
            setSelectedFiles([]);
            window.location.reload();
        })
            .catch(err => {
                setError('Failed to delete selected files');
                console.error(err);
            })
            .finally(() => {
                setIsDeleting(false);
            });
    };

    const handleFileSelect = (fileId) => {
        setSelectedFiles(prev =>
            prev.includes(fileId)
                ? prev.filter(id => id !== fileId)
                : [...prev, fileId]
        );
    };

    const getFileIcon = (mimeType) => {
        if (mimeType.startsWith('image/')) return <Image className="w-8 h-8" />;
        if (mimeType.startsWith('video/')) return <Video className="w-8 h-8" />;
        if (mimeType.startsWith('audio/')) return <Music className="w-8 h-8" />;
        return <FileText className="w-8 h-8" />;
    };

    return (
        <AdminLayout>
            <Head title="Media Manager" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Media Library</h2>
                            {selectedFiles.length > 0 && (
                                <button
                                    onClick={handleBulkDelete}
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-colors duration-150"
                                    disabled={isDeleting}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    {isDeleting ? 'Deleting...' : `Delete Selected (${selectedFiles.length})`}
                                </button>
                            )}
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg mb-8">
                            <SearchFilters filters={filters} />
                        </div>

                        <div
                            {...getRootProps()}
                            className={`border-2 border-dashed rounded-lg p-12 text-center mb-8 transition-colors duration-150
                                ${isDragActive
                                ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
                                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                            }`}
                        >
                            <input {...getInputProps()} />
                            <div className="flex flex-col items-center">
                                <Upload className={`w-12 h-12 mb-4 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} />
                                {isDragActive ? (
                                    <p className="text-lg font-medium text-blue-500">Drop files here...</p>
                                ) : (
                                    <>
                                        <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                            Drag & drop files here
                                        </p>
                                        <p className="mt-1 text-sm text-gray-500">
                                            or click to browse your computer
                                        </p>
                                    </>
                                )}
                            </div>
                            {isUploading && (
                                <div className="mt-4">
                                    <div className="w-full h-1 bg-blue-100 rounded-full overflow-hidden">
                                        <div className="h-1 bg-blue-500 w-1/2 animate-progress"></div>
                                    </div>
                                    <p className="text-sm text-blue-500 mt-2">Uploading files...</p>
                                </div>
                            )}
                            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
                        </div>

                        <GalleryView viewMode={viewMode} onViewModeChange={setViewMode}>
                            {files.data.map(file =>
                                viewMode === 'grid' ? (
                                    <div
                                        key={file.id}
                                        className={`relative group bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden transition-all duration-150
                                            ${selectedFiles.includes(file.id)
                                            ? 'ring-2 ring-blue-500 dark:ring-blue-400'
                                            : 'hover:shadow-md'
                                        }`}
                                        onClick={() => handleFileSelect(file.id)}
                                    >
                                        <div className="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-gray-900">
                                            {file.mime_type.startsWith('image/') ? (
                                                <img
                                                    src={`/storage/${file.path}`}
                                                    alt={file.original_name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    {getFileIcon(file.mime_type)}
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-4">
                                            <p className="font-medium text-gray-900 dark:text-white truncate">
                                                {file.original_name}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {(file.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>

                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                            <button
                                                className="p-1.5 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-sm hover:bg-white dark:hover:bg-gray-700 transition-colors duration-150"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setPreviewFile(file);
                                                }}
                                            >
                                                <Eye className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                                            </button>
                                            <a
                                                href={`/storage/${file.path}`}
                                                download
                                                className="p-1.5 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-sm hover:bg-white dark:hover:bg-gray-700 transition-colors duration-150"
                                                onClick={e => e.stopPropagation()}
                                            >
                                                <Download className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                                            </a>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        key={file.id}
                                        className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-colors duration-150
                                            ${selectedFiles.includes(file.id)
                                            ? 'bg-blue-50 dark:bg-blue-900/20'
                                            : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                                        }`}
                                        onClick={() => handleFileSelect(file.id)}
                                    >
                                        <div className="flex-shrink-0 w-16 h-16 bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden">
                                            {file.mime_type.startsWith('image/') ? (
                                                <img
                                                    src={`/storage/${file.path}`}
                                                    alt={file.original_name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    {getFileIcon(file.mime_type)}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-grow min-w-0">
                                            <p className="font-medium text-gray-900 dark:text-white truncate">
                                                {file.original_name}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {(file.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>

                                        <div className="flex-shrink-0 flex items-center gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setPreviewFile(file);
                                                }}
                                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-150"
                                            >
                                                <Eye className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                            </button>
                                            <a
                                                href={`/storage/${file.path}`}
                                                download
                                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-150"
                                                onClick={e => e.stopPropagation()}
                                            >
                                                <Download className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                            </a>
                                        </div>
                                    </div>
                                )
                            )}
                        </GalleryView>
                    </div>
                </div>
            </div>

            <FilePreviewModal
                file={previewFile}
                isOpen={!!previewFile}
                onClose={() => setPreviewFile(null)}
            />

            <style jsx global>{`
                @keyframes progress {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .animate-progress {
                    animation: progress 1s linear infinite;
                }
            `}</style>
        </AdminLayout>
    );
}
