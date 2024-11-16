'use client';

import axios from "axios";
import { UploadCloud, Loader2 } from 'lucide-react';
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function UploadForm() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const router = useRouter();

  async function upload(ev) {
    ev.preventDefault();
    const files = ev.target.files;
    if (files.length > 0) {
      const file = files[0];
      setIsUploading(true);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await axios.post('/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          },
        });

        setIsUploading(false);
        const newName = res.data.newName;
        router.push('/' + newName);
      } catch (error) {
        console.error("Upload failed:", error);
        setIsUploading(false);
      }
    }
  }

  return (
    <>
      <Dialog open={isUploading} onOpenChange={setIsUploading}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Uploading Video</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4 py-4">
            <div className="relative w-20 h-20">
              <UploadCloud className="w-20 h-20 text-blue-500 animate-pulse" />
             
            </div>
            <Progress value={uploadProgress} className="w-full" />
            <p className="text-sm text-muted-foreground">
              {uploadProgress < 100 ? 'Uploading...' : 'Processing...'}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Button
        asChild
        className="bg-blue-500  hover:to-blue-600 text-white border-none"
      >
        <label>
          <UploadCloud className="mr-2 h-4 w-4" />
          Choose file
          <input onChange={upload} type="file" className="hidden" accept="video/*" />
        </label>
      </Button>
    </>
  );
}