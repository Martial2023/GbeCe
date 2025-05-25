'use client';

import React, { useState, useEffect } from 'react';
import { useVoiceVisualizer, VoiceVisualizer } from 'react-voice-visualizer';
import {
    Credenza,
    CredenzaBody,
    CredenzaClose,
    CredenzaContent,
    CredenzaDescription,
    CredenzaFooter,
    CredenzaHeader,
    CredenzaTitle,
    CredenzaTrigger,
} from '@/components/external/CredenzaModal';
import { Button } from './ui/button';
import { Languages, Loader } from 'lucide-react';
import { FaMicrophoneAlt } from 'react-icons/fa';
import { HistoryProps } from '@/lib/types';

type Props = {
    history: HistoryProps[];
    setHistory: React.Dispatch<React.SetStateAction<HistoryProps[]>>;
    isTranscribing: boolean;
    setIsTranscribing: React.Dispatch<React.SetStateAction<boolean>>;
};

const Recorder = ({ setHistory, isTranscribing, setIsTranscribing }: Props) => {
    const recorderControls = useVoiceVisualizer();
    const {        
        recordedBlob,
    } = recorderControls;

    const [currentBlob, setCurrentBlob] = useState<Blob | null>(null);

    // Mettre à jour currentBlob quand un nouvel enregistrement est terminé
    useEffect(() => {
        if (recordedBlob && recordedBlob !== currentBlob) {
            setCurrentBlob(recordedBlob);
        }
    }, [recordedBlob]);

   // Envoyer l'audio pour transcription
    const handleTranscription = async () => {
        if (!currentBlob) return;

        try {
            setIsTranscribing(true);

            const currentRequest: HistoryProps = {
                audio: currentBlob,
                transcription: '',
                translation: ''
            };

            const formData = new FormData();
            formData.append('audio', currentBlob, `audio-${Date.now()}.webm`);
            
            const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/transcribe', {
                method: 'POST',
                body: formData,
            });

            if (!response) {
                throw new Error('Erreur lors de la transcription');
            }

            const data = await response.json();
            if (data.transcription) {
                currentRequest.transcription = data.transcription;
                currentRequest.translation = data.translation
                setHistory((prevHistory) => [...prevHistory, currentRequest]);
                setCurrentBlob(null)
                // Fermer la modale
                const closer = document.getElementById('recorder-close');
                if (closer) {
                    closer.click();
                }
            } else {
                throw new Error('Aucune transcription reçue');
            }
        } catch (error) {
            alert(error || 'Erreur inconnue');
        } finally {
            setIsTranscribing(false);
        }
    };

    return (
        <Credenza>
            <CredenzaTrigger asChild>
                <Button id="recorder" className="rounded-md p-1.5">
                    {isTranscribing ? <Loader className="w-6 h-6 animate-spin" /> : <FaMicrophoneAlt className="w-6 h-6" />}
                </Button>
            </CredenzaTrigger>
            <CredenzaContent>
                <CredenzaHeader>
                    <CredenzaTitle asChild>
                        <h2 className="text-xl sm:text-2xl font-bold flex items-center">
                            <Languages className="w-6 h-6 text-primary transition-transform duration-300 group-hover:scale-110" />
                            <span className="group-hover: transition-colors duration-300">Gbe</span>
                            <span className="text-primary">Ce</span>
                        </h2>
                    </CredenzaTitle>
                    <CredenzaDescription>Enregistrez votre voix pour transcription</CredenzaDescription>
                </CredenzaHeader>
                <CredenzaBody>
                    <div>
                        <VoiceVisualizer
                            height={100}
                            width="100%"
                            backgroundColor="transparent"
                            mainBarColor="#FB923C"
                            secondaryBarColor="#6EE7B7"
                            controlButtonsClassName="text-primary bg-primary/10"
                            speed={3}
                            barWidth={4}
                            gap={1}
                            rounded={5}
                            controls={recorderControls}
                        />
                    </div>
                </CredenzaBody>
                <CredenzaFooter>
                    <div className="flex gap-2 w-full justify-end">
                        <CredenzaClose asChild>
                            <Button id="recorder-close" variant="outline">
                                Annuler
                            </Button>
                        </CredenzaClose>
                        <Button
                            onClick={handleTranscription}
                            disabled={!currentBlob || isTranscribing}
                            className={`${!currentBlob || isTranscribing ? 'bg-gray-400' : ''} text-white`}
                        >
                            {isTranscribing ? <Loader className="w-6 h-6 animate-spin" /> : 'Transcrire'}
                        </Button>
                    </div>
                </CredenzaFooter>
            </CredenzaContent>
        </Credenza>
    );
};

export default Recorder;