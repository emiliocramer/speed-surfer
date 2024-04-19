import { useState, useEffect } from 'react';
import './filterpad.css';
import Pizzicato from "pizzicato/distr/Pizzicato";
import {useNavigate} from "react-router-dom";

export const FilterPadScreen = () => {
    const [currentSection, setCurrentSection] = useState({});
    const [isPlaying, setIsPlaying] = useState(false);
    const [loadedSound, setLoadedSound] = useState(null);
    const [reverbLevel, setReverbLevel] = useState(0);
    const [filterFrequency, setFilterFrequency] = useState(200);
    const navigate = useNavigate();


    const handleNavigate = () => {
        if (loadedSound && loadedSound.playing) {
            loadedSound.stop();
            navigate('/')
        } else {
            navigate('/')
        }
    }

    useEffect(() => {
        const sound = new Pizzicato.Sound( require('../../assets/blinding-lights.mp3'), () => {
            console.log('Sound file loaded!');
        });

        setLoadedSound(sound);

        return () => {
            sound.stop();
            sound.disconnect();
        };
    }, []);

    useEffect(() => {
        const handleMouseMove = (event) => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const numSections = 20;

            const x = event.clientX;
            const y = event.clientY;

            const xQuadrant = Math.floor((x / width) * numSections);
            const yQuadrant = 19 - Math.floor((y / height) * numSections);

            if (xQuadrant !== currentSection.xQuadrant || yQuadrant !== currentSection.yQuadrant) {
                setCurrentSection({
                    xQuadrant,
                    yQuadrant
                });

                console.log("xQuadrant: ", xQuadrant, "yQuadrant: ", yQuadrant);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [currentSection, setCurrentSection]);

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
        let reverbEffect;
        if (loadedSound) {
            reverbEffect = loadedSound.effects.find(effect => effect instanceof Pizzicato.Effects.Reverb);
            if (!reverbEffect) {
                reverbEffect = new Pizzicato.Effects.Reverb();
                loadedSound.addEffect(reverbEffect);
            }
        }

        return () => {
            if (loadedSound && reverbEffect) {
                loadedSound.removeEffect(reverbEffect);
            }
        };
    }, [loadedSound]);

    useEffect(() => {
        if (loadedSound) {
            const reverbEffect = loadedSound.effects.find(effect => effect instanceof Pizzicato.Effects.Reverb);

            if (reverbEffect && currentSection?.yQuadrant !== undefined) {
                const newReverbLevel = currentSection.yQuadrant / 19;
                reverbEffect.time = 0.5 + newReverbLevel * 2;
                reverbEffect.decay = 0.5 + newReverbLevel * 2;
                reverbEffect.mix = newReverbLevel;
                setReverbLevel(newReverbLevel);
            }
        }
    }, [loadedSound, currentSection?.yQuadrant]);

    useEffect(() => {
        let lowPassEffect;

        if (loadedSound) {
            lowPassEffect = loadedSound.effects.find(effect => effect instanceof Pizzicato.Effects.LowPassFilter);

            if (!lowPassEffect) {
                lowPassEffect = new Pizzicato.Effects.LowPassFilter();
                loadedSound.addEffect(lowPassEffect);
            }
        }

        return () => {
            if (loadedSound && lowPassEffect) {
                loadedSound.removeEffect(lowPassEffect);
            }
        };
    }, [loadedSound]);

    useEffect(() => {
        if (loadedSound) {
            const lowPassEffect = loadedSound.effects.find(effect => effect instanceof Pizzicato.Effects.LowPassFilter);

            if (lowPassEffect && currentSection?.xQuadrant !== undefined) {
                const newFrequency = 200 + (currentSection.xQuadrant / 19) * 4800;
                lowPassEffect.frequency = newFrequency;
                lowPassEffect.peak = 10;
                setFilterFrequency(newFrequency);
            }
        }
    }, [loadedSound, currentSection?.xQuadrant]);


    return (
        <div className="home-container">
            <h2>FILTER SURFER <a onClick={handleNavigate} style={{ textDecoration: 'none' }}>OR TRY OUT <span style={{ textDecoration: 'underline' }}>SPEED SURFER</span>
            </a>
            </h2>
            <h1>MOVE YOUR MOUSE AROUND THE SCREEN</h1>
            <p>Reverb lvl: {reverbLevel} Filter lvl: {filterFrequency}</p>
            <div className={`${isPlaying ? 'pause-button' : 'play-button'}`} onClick={handlePlay}>
                <p>{!isPlaying ? '►' : '⏸'}</p>
            </div>
        </div>
    );
};
