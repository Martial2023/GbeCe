'use client'

import AudioFileImport from "@/components/AudioFileImport";
import HistoryDisplay from "@/components/HistoryDisplay";
import { TextAnimate } from "@/components/magicui/text-animate";
import Recorder from "@/components/Recorder";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { HistoryProps } from "@/lib/types";
import { Languages, Music } from "lucide-react";
import { useEffect, useState } from "react";



export default function Home() {
  const [currentRequest, setCurrentRequest] = useState<string>('')
  const [history, setHistory] = useState<HistoryProps[]>([])
  const [examples, setExamples] = useState<HistoryProps[]>([])
  const [showExamples, setShowExamples] = useState<boolean>(false)
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false)

  const createAudioBlob = async (path: string): Promise<Blob> => {
    const response = await fetch(path);
    return await response.blob();
  };

  const loadHistoryData = async (): Promise<HistoryProps[]> => {
    return [
      {
        audio: await createAudioBlob("/audio1.wav"),
        transcription: "mεɖe ɖu nu bɔ mεɖe ɔ nu sin",
        hmm: "mεɖe ɖu nu bɔ mεɖe ɔ nu sin",
        translation: "l'un a mangé et l'autre a bu de l'eau",
      },
      {
        audio: await createAudioBlob("/audio2.wav"),
        transcription: "glelilε ma nyɔ ze",
        hmm: "glelilε ma nyɔ ze",
        translation: "L'agriculture n'est pas facile",
      },
      {
        audio: await createAudioBlob("/audio4.wav"),
        transcription: "nu ɖu gbe un ja bo wa",
        hmm: "nu ɖu gbe un ja bo wa",
        translation: "Je veux manger c'est pour cela que je suis venu",
      },
      {
        audio: await createAudioBlob("/audio3.wav"),
        transcription: "e jε gomε ni kaka bo ɖyɔ ε",
        hmm: "e jε gomε ni kaka bo ɖyɔ ε",
        translation: "il l'a persécuté jusqu'à ",
      },
    ];
  };

  useEffect(() => {
    loadHistoryData().then(setExamples);
  }, []);

  return (
    <main className="h-[90vh] flex flex-col">
      <div className="flex-1 pt-12 overflow-y-auto h-96 mb-[160px] md:mb-[130px]">
        {
          history.length == 0 && (
            <div className="px-4 h-full flex items-center justify-center">
              <div className="text-2xl font-bold flex flex-col items-center justify-center">
                <Languages className="w-6 h-6 text-primary" />

                <div className='flex flex-col justify-center items-center'>
                  <div className='flex'>
                    <span className="text-primary">Gbe</span>
                    <span className="text-slate-800 dark:text-white">Cé</span>
                  </div>
                  <TextAnimate className="text-center text-gray-400 font-normal dark:text-white text-xl" animation="blurIn" by="character" once>
                    Entrez du texte ou enregistrez votre voix et je vous traduirai!
                  </TextAnimate>
                </div>
              </div>
            </div>
          )
        }

        {
          showExamples && examples.length > 0 && (
            <HistoryDisplay
              history={examples}
            />
          )
        }
        {
          history.length > 0 && (
            <HistoryDisplay
              history={history}
            />
          )
        }
      </div>




      <div className="px-4 py-3 shadow-2xl absolute bottom-0 w-full mt-6">

        <div className="max-w-3xl mx-auto relative">
          <Button
            className="mb-2 mt-6"
            onClick={() => setShowExamples(!showExamples)}>
            <Music className="w-4 h-4 mr-2" />
            <span>Exemples</span>
          </Button>

          <div className="relative flex items-center bg-primary-20 rounded-2xl border shadow-sm">
            <Textarea
              className="w-full py-3 pl-4 pr-24 resize-nodne min-h-18 max-h-100"
              placeholder="Votre texte en fon..."
              onChange={(e) => setCurrentRequest(e.target.value)}
              value={currentRequest}
            />

            <div className="absolute right-2 bottom-1 flex items-center space-x-1 bg-transparent">
              <AudioFileImport
                history={history}
                setHistory={setHistory}
                isTranscribing={isTranscribing}
                setIsTranscribing={setIsTranscribing}
              />

              <Recorder
                history={history}
                setHistory={setHistory}
                isTranscribing={isTranscribing}
                setIsTranscribing={setIsTranscribing}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}