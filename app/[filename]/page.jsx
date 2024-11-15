'use client';

import { clearTranscriptionItems } from "../libs/awsTranscriptionHelpers";
import axios from "axios";
import { useEffect, useState } from "react";
import VidOutput from "../../components/VidOutput";
import { useParams } from "next/navigation";


export default function FilePage() {
  const filename = useParams().filename;
  const [isFetchingInfo, setIsFetchingInfo] = useState(false);
  const [awsTranscriptionItems, setAwsTranscriptionItems] = useState([]);

  useEffect(() => {
    getTranscription();
  }, [filename]);

  function getTranscription() {
    setIsFetchingInfo(true);
    axios
      .get(`/api/transcribe?filename=${filename}`)
      .then((response) => {
        setIsFetchingInfo(false);
        const status = response.data?.status;
        const transcription = response.data?.transcription;
        if (status !== "IN_PROGRESS") {
          setAwsTranscriptionItems(
            clearTranscriptionItems(transcription.results.items)
          );
        }
      });
  }

  if (isFetchingInfo) {
    return <div>Fetching information...</div>;
  }

  return (
    <div className="">
      <VidOutput
        filename={filename}
        transcriptionItems={awsTranscriptionItems}
        setAwsTranscriptionItems={setAwsTranscriptionItems}
      />
    </div>
  );
}
