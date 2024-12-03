export function ListViewItem({ file, selected, onSelect, onPreview }) {
    const fileIcon = getFileIcon(file.mime_type);

    return (
        <div
            className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer ${
                selected ? 'bg-blue-50 border-blue-500' : 'hover:bg-gray-50'
            }`}
            onClick={onSelect}
        >
            <div className="flex-shrink-0">
                {file.mime_type.startsWith('image/') ? (
                    <img
                        src={`/storage/${file.path}`}
                        alt={file.original_name}
                        className="w-12 h-12 object-cover rounded"
                    />
                ) : (
                    <div className="w-12 h-12 flex items-center justify-center">
                        {fileIcon}
                    </div>
                )}
            </div>

            <div className="flex-grow min-w-0">
                <p className="text-sm font-medium truncate">{file.original_name}</p>
                <p className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
            </div>

            <div className="flex-shrink-0 flex items-center gap-2">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onPreview();
                    }}
                    className="p-1 hover:bg-gray-100 rounded"
                >
                    <Eye className="w-4 h-4" />
                </button>
                <a
                    href={`/storage/${file.path}`}
                    download
                    className="p-1 hover:bg-gray-100 rounded"
                    onClick={e => e.stopPropagation()}
                >
                    <Download className="w-4 h-4" />
                </a>
            </div>
        </div>
    );
}
