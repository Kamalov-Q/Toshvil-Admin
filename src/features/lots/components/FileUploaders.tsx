import { apiClient } from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader, Upload, X } from "lucide-react";
import React, { useCallback, useState } from "react";
import { useController, type Control, type FieldValues, type Path } from "react-hook-form";


interface FileUploaderProps<T extends FieldValues> {
    control: Control<T>,
    name: Path<T>,
    folder: string;
    accept?: string;
    multiple?: boolean;
    label?: string;
    description?: string;
}

export const FileUploader = React.forwardRef<
    HTMLDivElement,
    FileUploaderProps<any>
>(
    (
        {
            control,
            name,
            folder,
            accept = 'image/*',
            multiple = false,
            label,
            description
        },
        ref
    ) => {
        const { field } = useController({
            control,
            name
        });

        const [uploading, setUploading] = useState<boolean>(false);
        const [error, setError] = useState<string | null>(null);
        const [uploadProgress, setUploadProgress] = useState(0);
        const inputRef = React.useRef<HTMLInputElement>(null);

        const handleFileUpload = useCallback(async (files: FileList | null) => {

            if (!files || files.length === 0) return;

            setUploading(true);
            setError(null);
            setUploadProgress(0);

            try {

                const formData = new FormData();

                if (multiple) {
                    Array.from(files).forEach((file) => {
                        formData.append('files', file);
                    });
                } else {
                    formData.append('file', files[0]);
                }

                formData.append('folder', folder);

                const endpoint = multiple ? '/upload/multiple' : '/upload/single';
                const response = await apiClient.post<{ urls?: string[], url?: string }>(
                    endpoint, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    onUploadProgress(progressEvent) {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
                        setUploadProgress(percentCompleted);
                    },
                });

                if (multiple && response.data.urls) {
                    const currentUrls = Array.isArray(field.value) ? field.value : [];
                    field.onChange([...currentUrls, ...response.data.urls]);
                } else if (!multiple && response.data.url) {
                    field.onChange(response.data.url);
                }

                setUploadProgress(100);
                setTimeout(() => setUploadProgress(0), 1000);

                if (inputRef.current) {
                    inputRef.current.value = '';
                }

            } catch (error: any) {
                const errorMessage = error.response.data?.message || error.message || 'File upload failed. Please try again.';
                setError(errorMessage);
                console.error('Upload error: ', error);
            } finally {
                setUploading(false);
            }


        }, [field, folder, multiple]
        );

        const handleRemoveFile = (index?: number) => {
            if (multiple && Array.isArray(field.value)) {
                const updated = field.value.filter((_: string, i: number) => i !== index);
                field.onChange(updated);
            } else {
                field.onChange(multiple ? [] : '');
            }
        };

        const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
            e?.preventDefault();
            e?.stopPropagation();
        }

        const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
            e?.preventDefault();
            e?.stopPropagation();
            handleFileUpload(e?.dataTransfer.files);
        }


        return (
            <div className="space-y-2" ref={ref}>
                {label && (
                    <label className="block text-sm font-medium text-gray-700">{label}</label>
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
                        className="flex flex-col items-center justify-center gap-2 p-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                    >
                        {uploading ? (
                            <>
                                <Loader className="w-6 h-6 text-blue-600 animate-spin" />
                                <span className="text-sm text-gray-600">
                                    Uploading... {uploadProgress}%
                                </span>
                            </>
                        ) : (
                            <>
                                <Upload className="w-6 h-6 text-gray-400" />
                                <span className="text-sm text-gray-600 font-medium">
                                    Click to upload or drag and drop
                                </span>
                                <span className="text-xs text-gray-500">
                                    {multiple
                                        ? 'PNG, JPG, GIF up to 10MB each'
                                        : 'PNG, JPG, GIF up to 10MB'}
                                </span>
                            </>
                        )}
                    </label>

                    {/* Upload Progress Bar */}
                    {uploading && uploadProgress > 0 && (
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                    )}
                </div>

                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                {/* Display uploaded files */}
                {multiple && Array.isArray(field.value) && field.value.length > 0 && (
                    <div className="space-y-2 mt-4">
                        <p className="text-sm font-medium text-gray-700">Uploaded Files ({field.value.length})</p>
                        {field.value.map((url: string, index: number) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex-1 min-w-0">
                                    <img
                                        src={url}
                                        alt={`Uploaded ${index}`}
                                        className="w-12 h-12 object-cover rounded border border-gray-300"
                                    />
                                </div>
                                <div className="flex-1 mx-3 min-w-0">
                                    <p className="text-xs text-gray-600 truncate font-mono">
                                        {url.split('/').pop()}
                                    </p>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveFile(index)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}

                {!multiple && field.value && (
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <img
                                    src={field.value}
                                    alt="Uploaded"
                                    className="w-12 h-12 object-cover rounded border border-gray-300"
                                />
                                <p className="text-xs text-gray-600 truncate font-mono">
                                    {field.value.split('/').pop()}
                                </p>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveFile()}
                                className="text-red-600 hover:text-red-700"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div >
        )
    }
)