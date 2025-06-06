'use client';

import React, { useState, useRef } from 'react';
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
import { Paperclip, Loader, Languages } from 'lucide-react';
import { HistoryProps } from '@/lib/types';

type Props = {
    history: HistoryProps[];
    setHistory: React.Dispatch<React.SetStateAction<HistoryProps[]>>;
    isTranscribing: boolean;
    setIsTranscribing: React.Dispatch<React.SetStateAction<boolean>>;
};

const AudioFileImport: React.FC<Props> = ({ history, setHistory, isTranscribing, setIsTranscribing }) => {
    console.log(history)
    const recorderControls = useVoiceVisualizer();
    const { setPreloadedAudioBlob } = recorderControls;
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [currentPlaying, setCurrentPlaying] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Gérer la sélection de fichier via input
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('audio/')) {
            setSelectedFile(file);
        } else {
            alert('Veuillez sélectionner un fichier audio valide.');
        }
    };

    // Gérer le glisser-déposer
    const handleDrag = (event: React.DragEvent) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.type === 'dragenter' || event.type === 'dragover') {
            setDragActive(true);
        } else if (event.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (event: React.DragEvent) => {
        event.preventDefault();
        event.stopPropagation();
        setDragActive(false);
        const file = event.dataTransfer.files?.[0];
        if (file && file.type.startsWith('audio/')) {
            setSelectedFile(file);
        } else {
            alert('Veuillez déposer un fichier audio valide.');
        }
    };

    // Jouer le fichier audio
    const handlePlay = (file: File) => {
        setPreloadedAudioBlob(file);
        setCurrentPlaying(file);
        const audio = new Audio(URL.createObjectURL(file));
        audio.play();
    };

    // Envoyer le fichier pour transcription
    const handleTranscription = async () => {
        if (!selectedFile) return;

        try {
            setIsTranscribing(true);

            const currentRequest: HistoryProps = {
                audio: selectedFile,
                transcription: '',
                translation: '',
                hmm: '',
            };

            const formData = new FormData();
            formData.append('audio', selectedFile, `imported-audio-${Date.now()}.webm`);

            const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/transcribe', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la transcription');
            }

            const data = await response.json();
            if (data.transcription) {
                currentRequest.transcription = data.transcription;
                currentRequest.translation = data.translation;
                // setHistory((prevHistory) => [...prevHistory, currentRequest]);
                // setSelectedFile(null); // Réinitialiser après transcription
                // const closer = document.getElementById('audio-import-close');
                // if (closer) {
                //     closer.click();
                // }
            } else {
                throw new Error('Aucune transcription reçue');
            }

            // Envoi à l'API HMM
            const responseHMM = await fetch(process.env.NEXT_PUBLIC_API_HMM_URL + '/api/transcribe', {
                method: 'POST',
                body: formData,
            });

            if (!responseHMM.ok) {
                throw new Error('Erreur lors de la transcription');
            }

            const dataHMM = await responseHMM.json();
            if (dataHMM.transcription) {
                currentRequest.hmm = dataHMM.transcription.split('\n')[0];
                setHistory((prevHistory) => [...prevHistory, currentRequest]);
                setSelectedFile(null); // Réinitialiser après transcription
                const closer = document.getElementById('audio-import-close');
                if (closer) {
                    closer.click();
                }
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
                <Button
                    id='audiofileimport'
                    className="rounded-md p-1.5 hover:bg-gray-100"
                    variant="ghost"
                    size="icon"
                >
                    <Paperclip className="w-5 h-5 text-gray-500" />
                </Button>
            </CredenzaTrigger>
            <CredenzaContent>
                <CredenzaHeader>
                    <CredenzaTitle asChild>
                        <h2 className="text-xl sm:text-2xl font-bold flex items-center">
                            <Languages className="w-6 h-6 text-primary transition-transform duration-300 group-hover:scale-110" />
                            <span className="group-hover: transition-colors duration-300">Gbe</span>
                            <span className="text-primary">Cé</span>
                        </h2>
                    </CredenzaTitle>
                    <CredenzaDescription>Glissez-déposez ou sélectionnez un fichier audio pour transcription</CredenzaDescription>
                </CredenzaHeader>
                <CredenzaBody>
                    {
                        !selectedFile && (
                            <div
                                className={`border-2 border-dashed rounded-lg p-4 text-center ${dragActive ? 'border-primary bg-primary/10' : 'border-gray-300'
                                    }`}
                                onDragEnter={handleDrag}
                                onDragOver={handleDrag}
                                onDragLeave={handleDrag}
                                onDrop={handleDrop}
                            >
                                <p className="text-gray-500">Glissez un fichier audio ici ou cliquez pour sélectionner</p>
                                <input
                                    type="file"
                                    accept="audio/*"
                                    onChange={handleFileChange}
                                    ref={fileInputRef}
                                    className="hidden"
                                />
                                <Button
                                    variant={"outline"}
                                    onClick={() => fileInputRef.current?.click()}
                                    className="mt-2 text-primary/40 hover:text-primary"
                                >
                                    Choisir un fichier
                                </Button>
                            </div>
                        )
                    }

                    {selectedFile && (
                        <div className="mt-4">
                            <p className="text-gray-700">Fichier sélectionné : {selectedFile.name}</p>
                            <VoiceVisualizer
                                height={80}
                                width="100%"
                                backgroundColor="transparent"
                                mainBarColor="#FB923C"
                                secondaryBarColor="#6EE7B7"
                                speed={3}
                                barWidth={4}
                                gap={1}
                                rounded={5}
                                controls={recorderControls}
                                isControlPanelShown={false}
                            />
                        </div>
                    )}
                </CredenzaBody>
                <CredenzaFooter className='w-full flex items-center justify-between'>
                    <CredenzaClose asChild>
                        <Button id="audio-import-close" variant="outline">
                            Annuler
                        </Button>
                    </CredenzaClose>

                    <div
                        className='flex items-center gap-2'
                    >
                        <Button
                            onClick={() => selectedFile && handlePlay(selectedFile)}
                            disabled={!selectedFile || currentPlaying === selectedFile}
                        >
                            {currentPlaying === selectedFile ? 'En lecture...' : 'Écouter'}
                        </Button>
                        <Button
                            onClick={handleTranscription}
                            disabled={!selectedFile || isTranscribing}
                            className="text-white"
                        >
                            {isTranscribing ? <Loader className="w-6 h-6 animate-spin" /> : 'Transcrire'}
                        </Button>


                    </div>
                </CredenzaFooter>
            </CredenzaContent>
        </Credenza>
    );
};

export default AudioFileImport;