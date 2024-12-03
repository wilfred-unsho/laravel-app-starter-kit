import { Dialog } from '@headlessui/react';
import { X, Calendar, User, HardDrive } from 'lucide-react';
import dayjs from 'dayjs';

export default function FilePreviewModal({ file, isOpen, onClose }) {
    const isImage = file?.mime_type?.startsWith('image/');
    const isVideo = file?.mime_type?.startsWith('video/');
    const isAudio = file?.mime_type?.startsWith('audio/');

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="mx-auto max-w-4xl w-full bg-white rounded-xl shadow-lg">
                    <div className="flex justify-between items-center p-4 border-b">
                        <Dialog.Title className="text-lg font-medium">
                            {file?.original_name}
                        </Dialog.Title>
                        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                        <div className="space-y-4">
                            <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center min-h-[300px]">
                                {isImage && (
                                    <img
                                        src={`/storage/${file?.path}`}
                                        alt={file?.original_name}
                                        className="max-w-full max-h-[400px] object-contain"
                                    />
                                )}
                                {isVideo && (
                                    <video
                                        controls
                                        className="max-w-full max-h-[400px]"
                                        src={`/storage/${file?.path}`}
                                    />
                                )}
                                {isAudio && (
                                    <audio
                                        controls
                                        className="w-full"
                                        src={`/storage/${file?.path}`}
                                    />
                                )}
                            </div>

                            <div className="flex justify-center">
                                <a
                                    href={`/storage/${file?.path}`}
                                    download
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    Download File
                                </a>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-medium">File Information</h3>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-gray-500">Uploaded:</span>
                                    <span>{dayjs(file?.created_at).format('MMM D, YYYY h:mm A')}</span>
                                </div>

                                <div className="flex items-center gap-2 text-sm">
                                    <User className="w-4 h-4" />
                                    <span className="text-gray-500">Uploaded by:</span>
                                    <span>{file?.user?.name}</span>
                                </div>

                                <div className="flex items-center gap-2 text-sm">
                                    <HardDrive className="w-4 h-4" />
                                    <span className="text-gray-500">Size:</span>
                                    <span>{(file?.size / 1024 / 1024).toFixed(2)} MB</span>
                                </div>
                            </div>

                            {file?.meta?.dimensions && (
                                <div>
                                    <h3 className="font-medium mb-2">Image Details</h3>
                                    <p className="text-sm">
                                        Dimensions: {file.meta.dimensions[0]} x {file.meta.dimensions[1]} pixels
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}
