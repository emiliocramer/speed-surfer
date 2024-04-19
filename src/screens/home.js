import { useState, useEffect } from 'react';
import './home.css';
import { Slider } from "../components/slider";
import { useGlobalAudioPlayer } from 'react-use-audio-player';
import {useNavigate} from "react-router-dom";

export const HomeScreen = () => {
    const [currentSection, setCurrentSection] = useState(-1);
    const [isPlaying, setIsPlaying] = useState(false);
    const { load, setRate, play, pause } = useGlobalAudioPlayer();
    const [hasPlayed, setHasPlayed] = useState(false);
    const navigate = useNavigate()

    const handleNavigate = () => {
        if (isPlaying) {
            pause();
            navigate('/filterpad')
        } else {
            navigate('/filterpad')
        }
    }

    const handlePlay = () => {
        if (!isPlaying && !hasPlayed) {
            load(require('../assets/blinding-lights.mp3'), {
                autoplay: true,
                html5: true,
                rate: 1,
                format: 'mp3'
            });
            setIsPlaying(true);
            setHasPlayed(true)
        } else if (!isPlaying && hasPlayed) {
            play();
            setIsPlaying(true);
        } else {
            pause();
            setIsPlaying(false);
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
            <h2>
                SPEED SURFER <a onClick={handleNavigate} style={{ textDecoration: 'none' }}>OR TRY OUT <span style={{ textDecoration: 'underline' }}>FILTER SURFER</span>
                </a>
            </h2>
            <h1>MOVE YOUR MOUSE AROUND THE SLIDER</h1>
            <div className={`${isPlaying ? 'pause-button' : 'play-button'}`} onClick={handlePlay}>
                <p>{!isPlaying ? '►' : '⏸'}</p>
            </div>
            <Slider />
        </div>
    );
};
