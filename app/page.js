"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Upload, Video, Sparkles, Github, HelpCircle, Globe2, Captions, PauseIcon, PlayIcon } from 'lucide-react'
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import UploadForm from "@/components/Upload"

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(true)
  const originalVideoRef = useRef(null);
  const captionsVideoRef = useRef(null);

  // Sync playback times
  useEffect(() => {
    const handleTimeUpdate = () => {
      if (
        Math.abs(originalVideoRef.current.currentTime - captionsVideoRef.current.currentTime) > 0.1
      ) {
        captionsVideoRef.current.currentTime = originalVideoRef.current.currentTime;
      }
    };

    const originalVideo = originalVideoRef.current;
    originalVideo.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      originalVideo.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);


  // Toggle play/pause
  const togglePlayback = () => {
    if (isPlaying) {
      originalVideoRef.current.pause();
      captionsVideoRef.current.pause();
    } else {
      originalVideoRef.current.play();
      captionsVideoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };


  return (
    <div className="min-h-screen mt-20 rounded-3xl p-8 max-w-7xl mx-auto bg-white dark:from-gray-700 dark:via-gray-900 dark:to-black">
      <main className="container mx-auto">
        <div className="grid gap-16 md:grid-cols-2 md:gap-8">
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                <Captions className="h-6 w-6 text-blue-500" />
              </div>
              <h1 className="text-4xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
                Add captions to your videos
                <span className="bg-blue-500 bg-clip-text text-transparent"> automatically</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Just upload your video and we will do the magic. No time limits, easy interface, and awesome features.
              </p>
            </div>

            {/* <Card className="border-2 border-dashed border-gray-200 bg-white/50 p-8 dark:border-gray-800 dark:bg-gray-900/50">
              <div className="flex flex-col items-center space-y-4">
                <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                  <Upload className="h-6 w-6 text-blue-500" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">Drag and drop your video here</p>
                  <p className="text-xs text-gray-500">or</p>
                </div>
                <Button  className="bg-blue-500">
                  Choose File
                </Button>
              </div>
            </Card> */}

            <UploadForm/>

            <div className="flex items-center justify-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full border-2 border-white bg-gray-200 dark:border-gray-800"
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-semibold">4.8/5</span> from 200K+ happy users
              </p>
            </div>
          </div>

          <div className="w-full max-w-4xl flex mx-auto gap-3 overflow-hidden rounded-xl shadow-2xl bg-blue-500 p-3">
            {/* Original Video */}
            <div className="relative group overflow-hidden rounded-lg shadow-inner">
              <video
                ref={originalVideoRef}
                src="https://dawid-epic-captions.s3.us-east-1.amazonaws.com/without-captions.mp4"
                muted
                autoPlay={isPlaying}
                loop
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 rounded-full bg-blue-500/70 backdrop-blur-sm px-3 py-1 text-sm text-white">
                Original
              </div>
              <button
                onClick={togglePlayback}
                className="absolute top-2 right-2 hidden group-hover:block bg-blue-500 text-white px-2 py-2 rounded-full">
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
              </button>
            </div>

            {/* Captions Video */}
            <div className="relative group overflow-hidden rounded-lg shadow-inner">
              <video
                ref={captionsVideoRef}
                src="https://dawid-epic-captions.s3.us-east-1.amazonaws.com/with-captions.mp4"
                muted
                autoPlay={isPlaying}
                loop
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 right-2 rounded-full bg-blue-500/70 backdrop-blur-sm px-3 py-1 text-sm text-white">
                With Captions
              </div>
              <button
                onClick={togglePlayback}
                className="absolute top-2 right-2 hidden group-hover:block bg-blue-500 text-white px-2 py-2 rounded-full">
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-24 flex justify-center gap-8 grayscale">
          {['Fast Company', 'Product Hunt', 'Make Use Of', 'TechCrunch', 'Hacker News'].map((name) => (
            <div key={name} className="text-sm font-semibold text-gray-400">
              {name}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}