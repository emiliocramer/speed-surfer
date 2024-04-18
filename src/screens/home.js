import { useState, useEffect } from 'react';
import './home.css';
import { Slider } from "../components/slider";
import { useGlobalAudioPlayer } from 'react-use-audio-player';

export const HomeScreen = () => {
    const [currentSection, setCurrentSection] = useState(-1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasPlayed, setHasPlayed] = useState(false);
    const { load, setRate, play, pause } = useGlobalAudioPlayer();

    const handlePlay = () => {
        if (!isPlaying && !hasPlayed) {
            load(require('../assets/blinding-lights.mp3'), {
                autoplay: false,
                html5: true,
                rate: 1,
                format: 'mp3'
            });
            setIsPlaying(true);
        } else if (!isPlaying && hasPlayed) {
            play();
        } else {
            pause();
        }
    }

    useEffect(() => {
        const handleMouseMove = (event) => {
            const width = window.innerWidth;
            const x = event.clientX;

            const numSections = 20;
            const sectionIndex = Math.floor((x / width) * numSections);

            if (sectionIndex !== currentSection) {
                setCurrentSection(sectionIndex);
                console.log(`Mouse is over section ${sectionIndex} (${sectionIndex * 5}% - ${(sectionIndex + 1) * 5}%)`);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [currentSection]);

    useEffect(() => {
        setRate(0.5 + ((currentSection - 1) / (20 - 1)) * (2 - 0.5))
    }, [setRate, currentSection])

    return (
        <div className="home-container">
            <h2>SPEED SURFER</h2>
            <h1>MOVE YOUR MOUSE AROUND THE SLIDER</h1>
            <div className={"play-button"} onClick={handlePlay}>
                <p>►</p>
            </div>
            <Slider />
        </div>
    );
};
