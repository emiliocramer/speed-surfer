document.addEventListener('DOMContentLoaded', function() {
    const playButton = document.getElementById('play-button');
    const fileInput = document.getElementById('file-input');
    const speedSlider = document.getElementById('speed-slider');
    const reverbSlider = document.getElementById('reverb-slider');

    // Initialize Wavesurfer
    var wavesurfer = WaveSurfer.create({
        container: '#waveform',
        waveColor: 'violet',
        progressColor: 'purple'
    });

    // Load audio file
    fileInput.addEventListener('change', function(e) {
        if (e.target.files.length) {
            const fileUrl = URL.createObjectURL(e.target.files[0]);
            wavesurfer.load(fileUrl);
        }
    });

    // Play or pause on button click
    playButton.addEventListener('click', function() {
        wavesurfer.playPause();
        if(wavesurfer.isPlaying()) {
            playButton.textContent = 'Pause';
        } else {
            playButton.textContent = 'Play';
        }
    });

    // Update Wavesurfer playback speed when slider value changes
    speedSlider.addEventListener('input', function() {
        wavesurfer.setPlaybackRate(parseFloat(this.value));
    });

    // Reverb effect functionality will be added here later

    // Wavesurfer event listeners
    wavesurfer.on('ready', function() {
        playButton.disabled = false;
    });
});


// Assume we have an 'impulse-response.wav' file in the same directory as our script
const reverbImpulseUrl = 'impulse-response.wav';

// We'll use an AudioContext to create our audio graph for the reverb effect
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let convolver = audioContext.createConvolver();
let reverbGain = audioContext.createGain();
let dryGain = audioContext.createGain();

// Function to load the impulse response
function loadImpulseResponse(url) {
    fetch(url)
        .then(response => response.arrayBuffer())
        .then(undecodedAudio => audioContext.decodeAudioData(undecodedAudio))
        .then(audioBuffer => {
            convolver.buffer = audioBuffer;
            convolver.normalize = true;
        })
        .catch(console.error);
}

// Call this function to set up the convolver node with the impulse response
loadImpulseResponse(reverbImpulseUrl);

wavesurfer.on('ready', function() {
    const wavesurferNode = wavesurfer.backend.getAudioNode();
    wavesurferNode.disconnect(); // Disconnect from destination

    wavesurferNode.connect(dryGain); // Connect the source to the dry mix
    dryGain.connect(audioContext.destination); // Connect the dry mix to the destination

    wavesurferNode.connect(convolver); // Connect the source to the convolver
    convolver.connect(reverbGain); // Connect the convolver to the reverb gain
    reverbGain.connect(audioContext.destination); // Connect the reverb gain to the destination

    reverbGain.gain.value = 0; // Start with no reverb
    dryGain.gain.value = 1; // Full volume to dry mix
});

reverbSlider.addEventListener('input', function() {
    const value = this.value / 100; // Convert percentage to a 0-1 range
    reverbGain.gain.value = value;
    dryGain.gain.value = 1 - value; // Reduce the dry mix proportionally
});
