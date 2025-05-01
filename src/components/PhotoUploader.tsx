'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Loader2, Camera, Upload } from 'lucide-react';
import { PhotoUploaderProps } from '@/types/components';
import { cn } from '@/lib/utils';

export function PhotoUploader({
  onPhotoSelect,
  isProcessing = false,
}: PhotoUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = (file: File) => {
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Send file to parent
    onPhotoSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    }
  };

  return (
    <div className="space-y-6">
      <div
        className={cn(
          'relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-all duration-200',
          isDragging
            ? 'border-primary bg-primary/5 scale-102'
            : 'border-gray-300',
          !preview && 'hover:border-primary/50 hover:bg-gray-50/50'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {preview ? (
          <div className="group relative mb-4 h-72 w-72">
            {isProcessing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl bg-black/50 backdrop-blur-sm">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
                <p className="font-medium text-white">Finding your match...</p>
              </div>
            )}
            <Image
              src={preview}
              alt="Preview"
              fill
              className="rounded-xl object-cover shadow-lg transition-transform duration-200 group-hover:scale-[1.02]"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="bg-primary/10 mb-4 rounded-full p-4">
              <Camera className="text-primary h-8 w-8" />
            </div>
            <p className="mb-2 text-lg font-medium">Drop your photo here</p>
            <p className="mb-4 text-sm text-gray-500">or click to upload</p>
          </div>
        )}

        <input
          type="file"
          id="photo"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={isProcessing}
        />

        <Button
          asChild
          className={cn(
            'w-full max-w-xs transition-all duration-200',
            preview && 'hover:scale-105'
          )}
          disabled={isProcessing}
          variant={preview ? 'secondary' : 'default'}
          size="lg"
        >
          <label htmlFor="photo" className="cursor-pointer">
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Finding your match...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                {preview ? 'Choose Different Photo' : 'Upload Photo'}
              </>
            )}
          </label>
        </Button>

        <p className="mt-3 text-sm text-gray-500">Supports JPG, PNG files</p>
      </div>
    </div>
  );
}
