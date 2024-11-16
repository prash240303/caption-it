'use client';
import { clearTranscriptionItems } from "../libs/awsTranscriptionHelpers";
import axios from "axios";
import { useEffect, useState } from "react";
import VidOutput from "../../components/VidOutput";
import { useParams } from "next/navigation";
import { Loader2, FileVideo } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "../../components/ui/progress";

export default function FilePage() {
  const filename = useParams().filename;
  const [isFetchingInfo, setIsFetchingInfo] = useState(false);
  const [awsTranscriptionItems, setAwsTranscriptionItems] = useState([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    getTranscription();
  }, [filename]);

  function getTranscription() {
    // Skip loading state if transcription items are already fetched

    setIsFetchingInfo(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 500);

    axios
      .get(`/api/transcribe?filename=${filename}`)
      .then((response) => {
        setIsFetchingInfo(false);
        clearInterval(interval);
        setProgress(100);
        const status = response.data?.status;
        const transcription = response.data?.transcription;

        if (status !== "IN_PROGRESS") {
          setAwsTranscriptionItems(
            clearTranscriptionItems(transcription.results.items)
          );
        }
      })
      .catch((error) => {
        console.error("Error fetching transcription:", error);
        setIsFetchingInfo(false);
        clearInterval(interval);
      });
  }

  if (isFetchingInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Processing Your Video</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-24 h-24">
                <FileVideo className="w-24 h-24 text-blue-500 animate-pulse" />
              </div>
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Fetching and processing transcription...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <VidOutput
        filename={filename}
        transcriptionItems={awsTranscriptionItems}
        setAwsTranscriptionItems={setAwsTranscriptionItems}
      />
    </div>
  );
}