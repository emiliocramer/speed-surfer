import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Pizzicato from 'pizzicato/distr/Pizzicato';
import MouseParticles from 'react-mouse-particles';
import { filterDescriptions, reverbDescriptions } from '../../helpers/helpers';
import './filterpad.css';

export const FilterPadScreen = () => {
    const [currentSection, setCurrentSection] = useState({});
    const [isPlaying, setIsPlaying] = useState(false);
    const [loadedSound, setLoadedSound] = useState(null);
    const [reverbLevel, setReverbLevel] = useState(0);
    const [filterFrequency, setFilterFrequency] = useState(200);
    const [selectedFile, setSelectedFile] = useState(null);
    const navigate = useNavigate();

    const handleNavigate = () => {
        if (loadedSound && loadedSound.playing) {
            loadedSound.stop();
        }
        sessionStorage.removeItem('reloaded');
        navigate('/', { state: { doesReload: true } });
    };

    const getReverbDescription = (level) => {
        const index = Math.floor(level * (reverbDescriptions.length - 1));
        return reverbDescriptions[index];
    };

    const getFilterDescription = (frequency) => {
        const maxFrequency = 5000;
        const index = Math.floor((frequency / maxFrequency) * (filterDescriptions.length - 1));
        return filterDescriptions[index];
    };

    const loadSound = useCallback((audioSource) => {
        if (loadedSound) {
            loadedSound.stop();
            loadedSound.disconnect();
        }

        const sound = new Pizzicato.Sound(audioSource, () => {
            console.log('Sound file loaded!');
            setLoadedSound(sound);
        });

        return sound;
    }, [loadedSound]);

    useEffect(() => {
        const defaultSound = require('../../assets/blinding-lights.mp3');
        const sound = loadSound(defaultSound);

        return () => {
            sound.stop();
            sound.disconnect();
        };
    }, [loadSound]);

    const handlePlay = useCallback(() => {
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
    }, [loadedSound, isPlaying]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        const audioSource = URL.createObjectURL(file);
        loadSound(audioSource);
        setIsPlaying(false);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file && (file.type === 'audio/mp3' || file.type === 'audio/wav')) {
            setSelectedFile(file);
            const audioSource = URL.createObjectURL(file);
            loadSound(audioSource);
            setIsPlaying(false);
        } else {
            alert('Please drop an MP3 or WAV file.');
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
        }
    }, [loadedSound]);

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
        }
    }, [loadedSound]);

    return (
        <>
            <div className="home-container filter-pad-container">
                <h2>FILTER SURFER <a onClick={handleNavigate} style={{ textDecoration: 'none' }}>OR TRY OUT <span style={{ textDecoration: 'underline' }}>SPEED SURFER</span>
                </a>
                </h2>
                <h1>MOVE YOUR MOUSE AROUND THE SCREEN</h1>
                <p className={'filter-indicator'}>
                    <span style={{fontWeight: 'bold'}}>Reverb lvl:</span> {getReverbDescription(reverbLevel)}. <span style={{fontWeight: 'bold'}}>Filter lvl:</span> {getFilterDescription(filterFrequency)}
                </p>
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
                <div className={`${isPlaying ? 'pause-button' : 'play-button'}`} onClick={handlePlay}>
                    <p>{!isPlaying ? '►' : '⏸'}</p>
                </div>
            </div>
        </>
    );
};
