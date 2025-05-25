'use client';

import React, { useState, useRef, useEffect } from 'react';
import { HistoryProps } from '@/lib/types';
import {
    Volume2
} from 'lucide-react';
import HistoryItem from './HistoryItem';

type Props = {
    history: HistoryProps[];
};

const HistoryDisplay: React.FC<Props> = ({
    history
}) => {
    const [currentPlaying, setCurrentPlaying] = useState<number | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showDropdown, setShowDropdown] = useState<number | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    console.log(showDropdown)
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

    const listEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (listEndRef.current) {
            listEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [history]);
    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            <div className="mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Volume2 className="w-6 h-6 text-primary" />
                    Historique des enregistrements
                </h2>
                <p className="mt-1">{history.length} enregistrement{history.length > 1 ? 's' : ''}</p>
            </div>

            <div className="space-y-4">
                {history.map((item, index) => (
                    <HistoryItem
                        item={item}
                        key={index}
                        index={index}
                        currentPlaying={currentPlaying}
                        setCurrentPlaying={setCurrentPlaying}
                        isPlaying={isPlaying}
                        setIsPlaying={setIsPlaying}
                    />
                ))}
            </div>
            <div ref={listEndRef} />
        </div>
    );
};

export default HistoryDisplay;