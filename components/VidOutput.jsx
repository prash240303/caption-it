'use client';

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL, fetchFile } from "@ffmpeg/util";
import { useEffect, useState, useRef } from "react";
import roboto from '../fonts/Roboto-Regular.ttf';
import robotoBold from '../fonts/Roboto-Bold.ttf';
import { transcriptionItemsToSrt } from "../app/libs/awsTranscriptionHelpers";
import TranscriptionEditor from "./TranscriptionEditor";
import { Button } from "./ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { CaptionsIcon, PaintbrushIcon, VideoIcon, Wand2Icon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"


export default function Component({
  filename = "video.mp4",
  transcriptionItems = [],
  setAwsTranscriptionItems = () => {},
}) {
  const videoUrl = `https://captionit.s3.us-east-1.amazonaws.com/${filename}`
  const [loaded, setLoaded] = useState(false)
  const [primaryColor, setPrimaryColor] = useState("#FFFFFF")
  const [outlineColor, setOutlineColor] = useState("#000000")
  const [progress, setProgress] = useState(1)
  const ffmpegRef = useRef(new FFmpeg())
  const videoRef = useRef(null)

  useEffect(() => {
    videoRef.current.src = videoUrl
    load()
  }, [])

  const load = async () => {
    const ffmpeg = ffmpegRef.current
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.2/dist/umd"
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
    })
    setLoaded(true)
  }

  const transcode = async () => {
    const ffmpeg = ffmpegRef.current
    await ffmpeg.writeFile(filename, await fetchFile(videoUrl))
    videoRef.current.src = videoUrl
    await new Promise((resolve) => (videoRef.current.onloadedmetadata = resolve))
    const duration = videoRef.current.duration

    ffmpeg.on("log", ({ message }) => {
      const match = /time=([0-9:.]+)/.exec(message)
      if (match) {
        const [hours, minutes, seconds] = match[1].split(":")
        const doneSeconds = hours * 3600 + minutes * 60 + seconds
        setProgress(doneSeconds / duration)
      }
    })

    setProgress(1)
  }

  return (
      <main className="container py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <Card className="border-2 border-purple-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <VideoIcon className="h-5 w-5 text-purple-500" />
                  Video Preview
                </CardTitle>
                <CardDescription>Preview your video with captions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-hidden rounded-lg border-2 border-purple-500/20 bg-black">
                  {progress > 0 && progress < 1 && (
                    <div className="absolute inset-0 flex items-center bg-black/80 backdrop-blur">
                      <div className="w-full space-y-4 px-4">
                        <div className="h-2 overflow-hidden rounded-full bg-purple-500/20">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-violet-500 transition-all duration-300"
                            style={{ width: `${progress * 100}%` }}
                          />
                        </div>
                        <p className="text-center text-sm text-purple-500">Processing: {Math.round(progress * 100)}%</p>
                      </div>
                    </div>
                  )}
                  <video ref={videoRef} controls className="aspect-video w-full" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Tabs defaultValue="controls" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="controls" className="flex items-center gap-2">
                  <CaptionsIcon className="h-4 w-4" />
                  Controls
                </TabsTrigger>
                <TabsTrigger value="styling" className="flex items-center gap-2">
                  <PaintbrushIcon className="h-4 w-4" />
                  Styling
                </TabsTrigger>
              </TabsList>
              <TabsContent value="controls" className="space-y-4 pt-4">
                <Card className="border-2 border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CaptionsIcon className="h-5 w-5 text-purple-500" />
                      Caption Controls
                    </CardTitle>
                    <CardDescription>Edit and apply captions to your video</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-gradient-to-r from-purple-500 to-violet-500 text-white hover:from-purple-600 hover:to-violet-600">
                          <CaptionsIcon className="mr-2 h-4 w-4" />
                          Edit Captions
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Edit Captions</DialogTitle>
                        </DialogHeader>
                        <div className="max-h-[60vh] overflow-y-auto">
                          <div className="space-y-4 p-4">
                            {/* TranscriptionEditor would go here */}
                            <p>Transcription editor content</p>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline">Cancel</Button>
                          <Button className="bg-gradient-to-r from-purple-500 to-violet-500 text-white hover:from-purple-600 hover:to-violet-600">
                            Save Changes
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Button
                      className="w-full bg-gradient-to-r from-purple-500 to-violet-500 text-white hover:from-purple-600 hover:to-violet-600"
                      onClick={transcode}
                      disabled={!loaded}
                    >
                      <Wand2Icon className="mr-2 h-4 w-4" />
                      Apply Captions
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="styling" className="space-y-4 pt-4">
                <Card className="border-2 border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PaintbrushIcon className="h-5 w-5 text-purple-500" />
                      Caption Styling
                    </CardTitle>
                    <CardDescription>Customize the appearance of your captions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="primaryColor">Primary Color</Label>
                      <div className="flex gap-2">
                        <div className="relative">
                          <Input
                            id="primaryColor"
                            type="color"
                            value={primaryColor}
                            onChange={(ev) => setPrimaryColor(ev.target.value)}
                            className="h-10 w-20 cursor-pointer border-2 border-purple-500/20 p-1"
                          />
                        </div>
                        <Input
                          type="text"
                          value={primaryColor}
                          onChange={(ev) => setPrimaryColor(ev.target.value)}
                          className="flex-1 border-2 border-purple-500/20"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="outlineColor">Outline Color</Label>
                      <div className="flex gap-2">
                        <div className="relative">
                          <Input
                            id="outlineColor"
                            type="color"
                            value={outlineColor}
                            onChange={(ev) => setOutlineColor(ev.target.value)}
                            className="h-10 w-20 cursor-pointer border-2 border-purple-500/20 p-1"
                          />
                        </div>
                        <Input
                          type="text"
                          value={outlineColor}
                          onChange={(ev) => setOutlineColor(ev.target.value)}
                          className="flex-1 border-2 border-purple-500/20"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
  )
}