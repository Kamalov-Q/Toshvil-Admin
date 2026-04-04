import { apiClient } from '@/api/axios';
import { Input } from '@/components/ui/input';
import React, { useCallback, useState } from 'react';
import { useController, type Control, type FieldValues, type Path } from 'react-hook-form';
import { Upload, X } from 'lucide-react';

interface FileUploaderProps<T extends FieldValues> {
    control: Control<T>,
    name: Path<T>,
    folder: string;
    accept?: string;
    multiple?: boolean;
    label?: string;
}

export const FileUploader = React.forwardRef<
    HTMLDivElement,
    FileUploaderProps<any>
>(({ control, name, folder, accept = "image/*", multiple = false, label }, ref) => {
    const { field } = useController({
        control,
        name
    });

    const [uploading, setUploading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileUpload = useCallback(
        async (files: FileList | null) => {
            if (!files || files.length === 0) return;

            setUploading(true);
            setError(null);

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
                    endpoint,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        },
                    }
                );

                if (multiple && response.data.urls) {
                    field.onChange(response.data.urls);
                } else if (!multiple && response.data.url) {
                    field.onChange(response.data.url);
                }
            } catch (error) {
                setError('File upload failed. Please try again.');
                console.error('Upload error: ', error);
            }
            finally {
                setUploading(false);
            }
        },
        [field, folder, multiple]
    );

    const handleRemoveFile = (index?: number) => {
        if (multiple && Array.isArray(field.value)) {
            const updated = field.value.filter((_: string, i: number) => i !== index);
            field.onChange(updated);
        } else {
            field.onChange(multiple ? [] : "");
        }
    };

    return (
        <div ref={ref} className='space-y-2'>
            {label && <label className='text-sm font-medium'>{label}</label>}

            <div className='relative'>
                <Input
                    type='file'
                    accept={accept}
                    multiple={multiple}
                    onChange={(e) => handleFileUpload(e.target.files)}
                    disabled={uploading}
                    className='hidden'
                    id={name}
                />
                <label htmlFor={name}
                    className='flex items-center justify-center gap-2 p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors'
                >
                    <Upload
                        className='w-5 h-5'
                    />
                    <span className='text-sm text-gray-600'>
                        {uploading ? 'Uploading' : 'Click to upload or drag and drop'}
                    </span>
                </label>
            </div>

            {error && <p className='text-sm text-red-500'>{error}</p>}

            {/* Displaying uploaded files */}
            {multiple && Array.isArray(field.value) && field.value.length > 0 && (
                <div className='space-y-2'>
                    {field.value.map((url: string, index: number) => (
                        <div key={index} className='flex items-center justify-between p-3 bg-gray-50 rounded'>
                            <span className='text-sm text-gray-600 truncate'>{url}</span>
                            <button
                                type='button'
                                onClick={() => handleRemoveFile(index)}
                                className='text-red-500 hover:text-red-700'
                            >
                                <X className='w-4 h-4' />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {!multiple && field.value && (
                <div className='flex items-center justify-between p-3 bg-gray-50 rounded'>
                    <span className='text-sm text-gray-600 truncate'>{field.value}</span>
                    <button
                        type='button'
                        onClick={() => handleRemoveFile()}
                        className='text-red-500 hover:text-red-700'
                    >
                        <X className='w-4 h-4' />
                    </button>
                </div>
            )}

        </div>
    );
});

FileUploader.displayName = 'FileUploader';