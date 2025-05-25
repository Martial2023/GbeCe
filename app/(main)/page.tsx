'use client'

import AudioFileImport from "@/components/AudioFileImport";
import HistoryDisplay from "@/components/HistoryDisplay";
import { TextAnimate } from "@/components/magicui/text-animate";
import Recorder from "@/components/Recorder";
import { Textarea } from "@/components/ui/textarea";
import { HistoryProps } from "@/lib/types";
import { Languages } from "lucide-react";
import { useState } from "react";



export default function Home() {
  const [currentRequest, setCurrentRequest] = useState<string>('')
  const [history, setHistory] = useState<HistoryProps[]>([])
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false)

  return (
    <main className="h-[90vh] flex flex-col">
      <div className="flex-1 pt-12 overflow-y-auto h-96 mb-24">
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
          history.length > 0 && (
            <HistoryDisplay
              history={history}
            />
          )
        }
      </div>




      <div className="px-4 py-3 shadow-2xl absolute bottom-0 w-full">
        <div className="max-w-3xl mx-auto relative">
          <div className="relative flex items-center bg-primary-20 rounded-2xl border shadow-sm">
            <Textarea
              className="w-full py-3 pl-4 pr-24 resize-nodne min-h-18 max-h-100"
              placeholder="Votre script..."
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