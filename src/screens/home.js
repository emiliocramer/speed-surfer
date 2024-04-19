import { useState, useEffect } from 'react';
import './home.css';
import { Slider } from "../components/slider";
import Pizzicato from "pizzicato/distr/Pizzicato";

export const HomeScreen = () => {
    const [currentSection, setCurrentSection] = useState(-1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [loadedSound, setLoadedSound] = useState(null);

    useEffect(() => {
        const sound = new Pizzicato.Sound( require('../assets/blinding-lights.mp3'), () => {
            console.log('Sound file loaded!');
        });

        setLoadedSound(sound);

        return () => {
            sound.stop();
            sound.disconnect();
        };
    }, []);

    const handlePlay = () => {
        if (loadedSound) {
            if (!isPlaying) {
                loadedSound.play();
            } else {
                loadedSound.pause();
            }
            setIsPlaying(!isPlaying);
        } else {
            console.error('Sound not loaded');
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
        if (loadedSound) {
            loadedSound.playbackRate = 0.5 + ((currentSection - 1) / (20 - 1)) * (2 - 0.5);
            console.log(loadedSound.playbackRate)
        }
    }, [currentSection, loadedSound])

    return (
        <div className="home-container">
            <h2>SPEED SURFER</h2>
            <h1>MOVE YOUR MOUSE AROUND THE SLIDER</h1>
            <div className={`${isPlaying ? 'pause-button' : 'play-button'}`} onClick={handlePlay}>
                <p>{!isPlaying ? '►' : '⏸'}</p>
            </div>
            <Slider />
        </div>
    );
};
