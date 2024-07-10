import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGlobalAudioPlayer } from 'react-use-audio-player';
import { Slider } from '../components/slider';
import './home.css';

export const HomeScreen = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { load, setRate, play, pause } = useGlobalAudioPlayer();

    const [currentSection, setCurrentSection] = useState(-1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasPlayed, setHasPlayed] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const doesReload = location.state?.doesReload;

    const handleNavigate = () => {
        if (isPlaying) pause();
        navigate('/filterpad');
    };

    const handlePlay = useCallback(() => {
        if (!isPlaying) {
            if (!hasPlayed || selectedFile) {
                const audioSource = selectedFile
                    ? URL.createObjectURL(selectedFile)
                    : require('../assets/blinding-lights.mp3');
                load(audioSource, {
                    autoplay: true,
                    html5: true,
                    rate: 1,
                    format: selectedFile ? selectedFile.type.split('/')[1] : 'mp3'
                });
                setHasPlayed(true);
            } else {
                play();
            }
            setIsPlaying(true);
        } else {
            pause();
            setIsPlaying(false);
        }
    }, [isPlaying, hasPlayed, selectedFile, load, play, pause]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        setHasPlayed(false);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file && (file.type === 'audio/mp3' || file.type === 'audio/wav')) {
            setSelectedFile(file);
            setHasPlayed(false);
        } else {
            alert('Please drop an MP3 or WAV file.');
        }
    };

    useEffect(() => {
        const handleMouseMove = (event) => {
            const width = window.innerWidth;
            const x = event.clientX;
            const numSections = 20;
            const sectionIndex = Math.floor((x / width) * numSections);
            if (sectionIndex !== currentSection) {
                setCurrentSection(sectionIndex);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [currentSection]);

    useEffect(() => {
        setRate(0.5 + ((currentSection - 1) / (20 - 1)) * (2 - 0.5));
    }, [setRate, currentSection]);

    useEffect(() => {
        if (doesReload && !sessionStorage.getItem('reloaded')) {
            sessionStorage.setItem('reloaded', 'true');
            window.location.reload();
        }
    }, [doesReload]);

    return (
        <div className="home-container">
            <h2>
                SPEED SURFER
            </h2>
            <div
                className="file-drop-area"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <p>Drag & drop an MP3 or WAV file here, or</p>
                <label htmlFor="file-upload" className="custom-file-upload">
                    Choose File
                </label>
                <input
                    id="file-upload"
                    type="file"
                    accept=".mp3,.wav"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />
                {selectedFile && <p>Selected: {selectedFile.name}</p>}
            </div>
            {selectedFile && (
                <>
                    <h1>MOVE YOUR MOUSE AROUND THE SLIDER</h1>
                    <div className={`${isPlaying ? 'pause-button' : 'play-button'}`} onClick={handlePlay}>
                        <p>{!isPlaying ? '►' : '⏸'}</p>
                    </div>
                    <Slider />
                </>
            )}
        </div>
    );
};
