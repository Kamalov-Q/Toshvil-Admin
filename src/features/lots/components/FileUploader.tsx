import React, { useCallback, useState } from 'react';
import { useController, type FieldValues, type Control, type Path } from 'react-hook-form';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Upload, X, Loader, Image as ImageIcon, FileText } from 'lucide-react';
import { toast } from '../../../utils/toast';
import { getFileUrl } from '../../../utils/formatters';

interface FileUploaderProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    folder: string;
    accept?: string;
    multiple?: boolean;
    label?: string;
    description?: string;
    maxSize?: number; // in MB
}

export const FileUploader = <T extends FieldValues>({
    control,
    name,
    folder,
    accept = 'image/*',
    multiple = false,
    label,
    description,
    maxSize = 50,
}: FileUploaderProps<T>) => {
    const { field } = useController({
        control,
        name,
    });

    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleFileUpload = useCallback(
        async (files: FileList | null) => {
            if (!files || files.length === 0) return;

            // Validate file sizes
            const maxSizeBytes = maxSize * 1024 * 1024;
            for (let i = 0; i < files.length; i++) {
                if (files[i].size > maxSizeBytes) {
                    setError(`File "${files[i].name}" exceeds ${maxSize}MB limit`);
                    toast.error(`File exceeds ${maxSize}MB limit`);
                    return;
                }
            }

            setUploading(true);
            setError(null);
            setUploadProgress(0);

            try {
                const formData = new FormData();
                formData.append('folder', folder);

                if (multiple) {
                    Array.from(files).forEach((file) => {
                        formData.append('files', file);
                    });
                } else {
                    formData.append('file', files[0]);
                }

                const endpoint = multiple ? '/upload/multiple' : '/upload/single';
                const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    },
                    body: formData
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'File upload failed');
                }

                // Handle both multiple and single response formats more robustly
                const currentUrls = Array.isArray(field.value) ? [...field.value] : [];
                let newUrls: string[] = [];

                if (multiple) {
                    if (Array.isArray(data)) {
                        newUrls = data.map((item: any) => item.url || item).filter(Boolean);
                    } else if (data.urls && Array.isArray(data.urls)) {
                        newUrls = data.urls;
                    } else if (data.url) {
                        newUrls = [data.url];
                    }

                    if (newUrls.length > 0) {
                        field.onChange([...currentUrls, ...newUrls]);
                        toast.success(`${newUrls.length} file(s) uploaded successfully`);
                    }
                } else {
                    const singleUrl = data.url || (Array.isArray(data) ? data[0]?.url : null);
                    if (singleUrl) {
                        field.onChange(singleUrl);
                        toast.success('File uploaded successfully');
                    }
                }

                setUploadProgress(100);
                setTimeout(() => setUploadProgress(0), 1000);

                if (inputRef.current) {
                    inputRef.current.value = '';
                }
            } catch (err: any) {
                const errorMessage = err.message || 'File upload failed. Please try again.';
                setError(errorMessage);
                toast.error(errorMessage);
                console.error('Upload error:', err);
            } finally {
                setUploading(false);
            }
        },
        [field, folder, multiple, maxSize]
    );

    const handleRemoveFile = (index?: number) => {
        if (multiple && Array.isArray(field.value)) {
            const updated = field.value.filter((_: string, i: number) => i !== index);
            field.onChange(updated);
            toast.success('Image removed');
        } else {
            field.onChange(multiple ? [] : '');
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        handleFileUpload(e.dataTransfer.files);
    };

    return (
        <div className="space-y-3">
            {label && (
                <label className="block text-sm font-semibold text-gray-700">{label}</label>
            )}

            {description && (
                <p className="text-xs text-gray-500">{description}</p>
            )}

            <div className="relative">
                <Input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    onChange={(e) => handleFileUpload(e.target.files)}
                    disabled={uploading}
                    className="hidden"
                    id={`file-input-${name}`}
                />

                <label
                    htmlFor={`file-input-${name}`}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className="flex flex-col items-center justify-center gap-3 p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
                >
                    {uploading ? (
                        <>
                            <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                            <div className="text-center">
                                <span className="text-sm font-medium text-blue-600">
                                    Uploading... {uploadProgress}%
                                </span>
                            </div>
                        </>
                    ) : (
                        <>
                            <Upload className="w-8 h-8 text-gray-400" />
                            <div className="text-center">
                                <span className="text-sm font-semibold text-gray-600">
                                    Click to upload or drag and drop
                                </span>
                                <span className="block text-xs text-gray-500 mt-1">
                                    {multiple
                                        ? `Accepted files up to ${maxSize}MB each`
                                        : `Accepted files up to ${maxSize}MB`}
                                </span>
                            </div>
                        </>
                    )}
                </label>

                {/* Upload Progress Bar */}
                {uploading && uploadProgress > 0 && (
                    <div className="mt-3 w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-blue-600 to-blue-400 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                        />
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
            )}

            {/* Display uploaded files */}
            {multiple && Array.isArray(field.value) && field.value.length > 0 && (
                <div className="space-y-2 mt-4">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-700">
                            <ImageIcon className="inline w-4 h-4 mr-1" />
                            Uploaded Images ({field.value.length})
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {field.value.map((url: string, index: number) => (
                            <div
                                key={index}
                                className="relative group overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
                            >
                                {url.match(/\.(jpeg|jpg|gif|png|webp|svg|avif)$/i) ? (
                                    <img
                                        src={getFileUrl(url)}
                                        alt={`Uploaded ${index}`}
                                        className="w-full h-32 object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-32 flex items-center justify-center bg-gray-100">
                                        <FileText className="w-12 h-12 text-gray-400" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRemoveFile(index)}
                                        className="text-white hover:text-red-300"
                                    >
                                        <X className="w-5 h-5" />
                                    </Button>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent p-2">
                                    <p className="text-xs text-white truncate font-mono">
                                        {url.split('?')[0].split('/').pop()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {!multiple && field.value && (
                <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-4">
                        {field.value.match(/\.(jpeg|jpg|gif|png|webp|svg|avif)$/i) ? (
                            <img
                                src={getFileUrl(field.value)}
                                alt="Uploaded"
                                className="w-16 h-16 object-cover rounded border border-blue-300"
                            />
                        ) : (
                            <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded border border-blue-300">
                                <FileText className="w-8 h-8 text-gray-500" />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-600 truncate font-mono">
                                {field.value.split('?')[0].split('/').pop()}
                            </p>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFile()}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};