'use client'
import { Calendar, Clock, Copy, Download, Languages, MoreVertical, Pause, Play, Share2, Trash2 } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
import { Button } from './ui/button';
import { HistoryProps } from '@/lib/types';
import { useVoiceVisualizer, VoiceVisualizer } from 'react-voice-visualizer';

type Props = {
    item: HistoryProps,
    index: number
    currentPlaying: number | null
    setCurrentPlaying: React.Dispatch<number | null>
    isPlaying: boolean
    setIsPlaying: React.Dispatch<boolean>
}

const HistoryItem = ({ item, index, currentPlaying, setCurrentPlaying, isPlaying, setIsPlaying }: Props) => {
    const recorderControls = useVoiceVisualizer();
    const { setPreloadedAudioBlob } = recorderControls;
    const [showDropdown, setShowDropdown] = useState<number | null>(null);
    const [expanded, setExpanded] = useState<boolean>(false)
    const [showTranslation, setShowTranslation] = useState<boolean>(false)
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Fermer le dropdown en cliquant ailleurs
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Vous pouvez ajouter une notification toast ici
    };

    const handlePlayPause = (blob: Blob) => {
        if (currentPlaying === index && isPlaying) {
            // Pause
            audioRef.current?.pause();
            setIsPlaying(false);
        } else {
            // Play
            if (audioRef.current) {
                audioRef.current.pause();
            }

            const audio = new Audio(URL.createObjectURL(blob));
            audioRef.current = audio;

            audio.onended = () => {
                setIsPlaying(false);
                setCurrentPlaying(null);
            };

            audio.play();
            setCurrentPlaying(index);
            setIsPlaying(true);
            setPreloadedAudioBlob(blob);
        }
    };

    return (
        <div
            className="group border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
        >
            <div className="p-6 p-bottom-2 min-h-48">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 text-sm ">
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {/* <span>{formatDate(item.timestamp)}</span> */}
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {/* <span>{formatTime(item.timestamp)}</span> */}
                        </div>
                    </div>

                    {/* Menu contextuel */}
                    <div className="relative" ref={dropdownRef}>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowDropdown(showDropdown === index ? null : index)}
                            className="transition-opacity"
                        >
                            <MoreVertical className="w-4 h-4" />
                        </Button>

                        {showDropdown === index && (
                            <div className="absolute border-gray-400 dark:bg-gray-900 right-0 top-full mt-1 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg z-10">
                                <div className="p-2">
                                    <button
                                        onClick={() => {
                                            copyToClipboard(item.transcription || '');
                                            setShowDropdown(null);
                                        }}
                                        className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-xl"
                                    >
                                        <Copy className="w-4 h-4" />
                                        Copier le texte
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowDropdown(null);
                                        }}
                                        className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-xl"
                                    >
                                        <Share2 className="w-4 h-4" />
                                        Partager
                                    </button>

                                    <button
                                        onClick={() => {
                                            // onDelete(index);
                                            setShowDropdown(null);
                                        }}
                                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 rounded-xl"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mb-4">
                    <p className={`leading-relaxed ${expanded ? '' : 'line-clamp-3'
                        }`}>
                        {showTranslation? item.translation || 'Aucune traduction disponible' : item.transcription || 'Aucune transcription disponible'}
                    </p>
                    {item.transcription && item.transcription.length > 150 && (
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="text-primary hover:text-primary/80 text-sm font-medium mt-2"
                        >
                            {expanded ? 'Voir moins' : 'Voir plus'}
                        </button>
                    )}
                </div>

                {/* Contrôles audio */}
                <div className="flex flex-wrap items-center gap-3">
                    <Button
                        onClick={() => handlePlayPause(item.audio)}
                        className={`${currentPlaying === index && isPlaying
                            ? 'bg-orange-500 hover:bg-orange-600'
                            : 'bg-primary hover:bg-primary/90'
                            } text-white transition-all duration-300`}
                        size="sm"
                    >
                        {currentPlaying === index && isPlaying ? (
                            <>
                                <Pause className="w-4 h-4 mr-2" />
                                Pause
                            </>
                        ) : (
                            <>
                                <Play className="w-4 h-4 mr-2" />
                                Écouter
                            </>
                        )}
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowTranslation(!showTranslation)}
                        className="hover:border-blue-300 transition-all duration-300"
                    >
                        <Languages className="w-4 h-4 mr-2" />
                        { showTranslation? 'Originale' : 'Traduction' }
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        className="hover:border-green-300 transition-all duration-300"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Télécharger
                    </Button>
                </div>
            </div>

            {/* Visualiseur audio */}
            {currentPlaying === index && (
                <div className="px-6 pb-6">
                    <div className="pt-4">
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
                            isControlPanelShown={false}
                            controls={recorderControls}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default HistoryItem