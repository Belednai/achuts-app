import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

const ImageUpload = ({ value, onChange, placeholder = "Enter image URL or upload from computer", label = "Image" }: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // Convert file to base64 for localStorage storage
      const base64 = await fileToBase64(file);
      onChange(base64);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const clearImage = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="image-upload">{label}</Label>
      
      {/* URL Input */}
      <div className="space-y-2">
        <Input
          type="url"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full"
        />
        <p className="text-xs text-muted-foreground">
          Enter an image URL or upload an image from your computer
        </p>
      </div>

      {/* Upload Area */}
      <Card className={`border-2 border-dashed transition-colors ${
        dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
      }`}>
        <CardContent className="p-6">
          <div
            className="flex flex-col items-center justify-center space-y-4"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center space-y-2">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
              <div className="text-center">
                <p className="text-sm font-medium">
                  {dragActive ? 'Drop image here' : 'Drag & drop an image here'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  or click to browse
                </p>
              </div>
            </div>
            
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full"
            >
              {isUploading ? (
                <>
                  <Upload className="h-4 w-4 mr-2 animate-pulse" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Image
                </>
              )}
            </Button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
              aria-label="Upload image file"
              title="Upload image file"
            />
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      {value && (
        <div className="relative">
          <div className="relative inline-block">
            <img
              src={value}
              alt="Preview"
              className="max-w-full h-32 object-cover rounded-lg border"
              onError={() => {
                // If image fails to load, clear the value
                onChange('');
              }}
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={clearImage}
              className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {/* File Requirements */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p>• Supported formats: JPG, PNG, GIF, WebP</p>
        <p>• Maximum file size: 5MB</p>
        <p>• Images are stored locally in your browser</p>
      </div>
    </div>
  );
};

export default ImageUpload;
