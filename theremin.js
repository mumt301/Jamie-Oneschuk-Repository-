function thereminOn(oscillator, oscillator2) {
    oscillator.play();
    oscillator2.play();
}

function thereminControl(e, oscillator, oscillator2, theremin, urlParameters) {
    let x = e.offsetX;
    let y = e.offsetY;
    console.log(x, y);

    let minFrequency = 220.0;
    let maxFrequency = 880.0;
    let notename = document.getElementById('notename')
    let freqRange = maxFrequency - minFrequency;
    let thereminFreq = minFrequency + (x / theremin.clientWidth) * freqRange;
    let thereminVolume = 1.0 - (y / theremin.clientHeight);

    console.log("Frequency: ", thereminFreq);
    oscillator.frequency = thereminFreq;
    notename.innerHTML = noteFromFrequency(thereminFreq);
    frequency.innerHTML = thereminFreq;

    if (urlParameters.has('semitones')) {
        let semitones = parseInt(urlParameters.get('semitones'));
        oscillator2.frequency = interval(thereminFreq, semitones);
    } else {
        oscillator2.frequency = 0;
    }
    
    console.log("Volume: ", thereminVolume);
    oscillator.volume = thereminVolume;
    oscillator2.volume = thereminVolume;
}

function thereminOff(oscillator, oscillator2) {
    oscillator.stop();
    oscillator2.stop();
}


function runAfterLoadingPage() {
    let urlParameters = (new URL(document.location)).searchParams;

    if (urlParameters.has('sat')){
        var sound = new Pizzicato.Sound();
        var distortion = new Pizzicato.Effects.Distortion();
        sound.addEffect(distortion); 

    }
    if (urlParameters.has('oscillatorType')) {
    oscillatorType = urlParameters.get('oscillatorType');
}
    if (urlParameters.has('minhz')) {
    minhz = parseInt(urlParameters.get('minhz'));
}
    if (urlParameters.has('maxhz')) {
    maxhz = parseInt(urlParameters.get('maxhz'));
}
    const oscillator = new Pizzicato.Sound({
        source: 'wave',
        options: {
            type: oscillatorType,
            frequency: 220
        }
    });
    const oscillator2 = new Pizzicato.Sound({
        source: 'wave',
        options: {
            type: oscillatorType,
            frequency: 220
        }

        
    });
    const theremin = document.getElementById("thereminZone");

    theremin.addEventListener("mouseenter", function (e) {
        thereminOn(oscillator, oscillator2);
    });
    theremin.addEventListener("mousemove", function (e) {
        thereminControl(e, oscillator, oscillator2, theremin, urlParameters);
    });
    theremin.addEventListener("mouseleave", function () {
        thereminOff(oscillator, oscillator2);
    });
}
"use strict";


let notenames = {
    0: "C",
    1: "C#",
    2: "D",
    3: "Eb",
    4: "E",
    5: "F",
    6: "F#",
    7: "G",
    8: "Ab",
    9: "A",
    10: "Bb",
    11: "B"
}

function interval(frequency, semitones) {

    return frequency * Math.pow(2, semitones / 12);
}

function midiToFrequency(midinumber, concertA = 440) {
    const A4 = 69
    if (midinumber === A4) {
        return concertA;
    }
    let semitones = midinumber - A4;
    return interval(440, semitones);
}

function midiFromFrequency(frequency) {
    let minDiff = Number.MAX_VALUE;
    let midinumber = -1;
    for (let midi = 0; midi < 128; midi++) {
        let midiFreq = midiToFrequency(midi);
        let freqDiff = Math.abs(midiFreq - frequency);
        if (freqDiff < minDiff) {
            minDiff = freqDiff;
            midinumber = midi;
        }
    }
    return midinumber
}

function noteFromFrequency(frequency, withOctave=false) {
    const midinumber = midiFromFrequency(frequency);
    const pitchclass = midinumber % 12;
    let octave = (midinumber - pitchclass) / 12;
    let notename = notenames[pitchclass];
    if (withOctave) {
        octave--;
        notename += octave;
    }
    return notename;
}
window.onload = runAfterLoadingPage;