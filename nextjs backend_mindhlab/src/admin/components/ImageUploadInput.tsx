import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Link as LinkIcon,
  Image as ImageIcon,
  Check,
  X,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface ImageUploadInputProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  helperText?: string;
  recommendedSize?: string;
}

export const ImageUploadInput: React.FC<ImageUploadInputProps> = ({
  label,
  value,
  onChange,
  helperText,
  recommendedSize,
}) => {
  const [activeMode, setActiveMode] = useState<'upload' | 'url'>('upload');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getHeaders = () => {
    const token = localStorage.getItem('mindh_admin_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const handleFileProcess = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WEBP, SVG, GIF).');
      return;
    }

    // 10MB limit
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image size exceeds the 10MB limit. Please choose a smaller image.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setFileName(file.name);

    // Read as Base64 Data URL
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result as string;

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({
            filename: file.name,
            base64Data,
            mimeType: file.type,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.url) {
            onChange(data.url);
          } else {
            // Fallback to data URL
            onChange(base64Data);
          }
        } else {
          // If server upload endpoint fails, fallback to using base64 directly
          onChange(base64Data);
        }
      } catch (err: any) {
        console.warn('Direct upload failed, using local Data URL fallback:', err);
        onChange(base64Data);
      } finally {
        setIsUploading(false);
      }
    };

    reader.onerror = () => {
      setUploadError('Failed to read image from computer.');
      setIsUploading(false);
    };

    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  return (
    <div className="space-y-2">
      {/* Header with Mode Tabs */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-300">
          {label}
          {recommendedSize && (
            <span className="text-[10px] text-slate-400 font-normal ml-1.5">
              ({recommendedSize})
            </span>
          )}
        </label>

        {/* Upload Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveMode('upload')}
            className={`px-2 py-0.5 rounded-md text-[10px] font-semibold flex items-center gap-1 transition-colors ${
              activeMode === 'upload'
                ? 'bg-maroon-800 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UploadCloud className="w-3 h-3" />
            <span>Upload from PC</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('url')}
            className={`px-2 py-0.5 rounded-md text-[10px] font-semibold flex items-center gap-1 transition-colors ${
              activeMode === 'url'
                ? 'bg-maroon-800 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LinkIcon className="w-3 h-3" />
            <span>Image URL</span>
          </button>
        </div>
      </div>

      {/* Main Upload / Input Container */}
      {activeMode === 'upload' ? (
        <div className="space-y-2">
          {/* Drag & Drop Upload Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[110px] ${
              dragOver
                ? 'border-maroon-500 bg-maroon-950/20'
                : 'border-slate-800 hover:border-slate-700 bg-slate-950/60'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/webp, image/gif, image/svg+xml"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileProcess(e.target.files[0]);
                }
              }}
            />

            {isUploading ? (
              <div className="flex flex-col items-center justify-center space-y-2 py-2">
                <Loader2 className="w-6 h-6 text-maroon-400 animate-spin" />
                <span className="text-xs font-semibold text-white">
                  Uploading image from computer...
                </span>
                <span className="text-[10px] text-slate-400">{fileName}</span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-1.5 py-1">
                <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-maroon-400">
                  <UploadCloud className="w-4 h-4" />
                </div>
                <div className="text-xs font-medium text-slate-200">
                  <span className="text-maroon-400 font-bold hover:underline">Click to browse</span> or drag and drop image here
                </div>
                <div className="text-[10px] text-slate-400">
                  Supports PNG, JPG, WEBP, SVG, GIF (Max 10MB)
                </div>
              </div>
            )}
          </div>

          {/* Upload Error Message */}
          {uploadError && (
            <div className="text-[11px] text-rose-400 flex items-center gap-1.5 bg-rose-950/40 p-2 rounded-lg border border-rose-900/60">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}
        </div>
      ) : (
        /* Image URL Input */
        <div>
          <div className="relative">
            <LinkIcon className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="url"
              value={value}
              onChange={(e) => {
                setUploadError(null);
                onChange(e.target.value);
              }}
              placeholder="https://example.com/images/photo.jpg"
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-maroon-600"
            />
          </div>
        </div>
      )}

      {/* Live Preview Box if image exists */}
      {value && (
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 gap-3 animate-in fade-in">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-950 border border-slate-800 shrink-0 flex items-center justify-center">
              <img
                src={value}
                alt="Uploaded preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-white truncate flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">
                  {fileName || (value.startsWith('data:') ? 'Local Image Attached' : value.split('/').pop() || 'Selected Image')}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 truncate max-w-[280px] sm:max-w-md font-mono">
                {value.startsWith('data:') ? 'Base64 image data' : value}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                onChange('');
                setFileName('');
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
              title="Remove image"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {helperText && (
        <p className="text-[10px] text-slate-400 leading-normal">{helperText}</p>
      )}
    </div>
  );
};
