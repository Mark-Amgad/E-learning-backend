const player = document.getElementById('player');
const stopbtn = document.querySelector('#stopbtn');
const toggleRecordingBtn = document.querySelector('#toggleRecordingBtn');
const pauseBtn = document.querySelector('#pauseBtn');
const submitBtn = document.querySelector('#submitBtn');
const newSentence = document.querySelector('#newSentence')
const sentence = document.querySelector('#sentence')
const matched = document.querySelector('#matched')
class MediaRecordHandler {
    mediaRecorder;
    chunks = [];
    stream;
    mimeType;
    canSend = false;
    audioBlob;
    encoder;
    audioContext;
    recording = false;
    encodingConfig = {
        flacData: {
            bps: 16,
            channels: 1,
            compression: 5,
        },
        sampleRate: 48000
    }

    setStream(stream) {
        this.stream = stream;
        this.audioContext = new AudioContext()
        this.input = this.audioContext.createMediaStreamSource(stream)
        if(this.input.context.createJavaScriptNode) {
            this.node = this.input.context.createJavaScriptNode(4096, 1, 1)
        } else if (this.input.context.createScriptProcessor) {
            this.node = this.input.context.createScriptProcessor(4096, 1, 1)
        } else {
            console.log('Could not create')
        }
        console.log('node', this.node)
        console.log(`Sample Rate: ${this.audioContext.sampleRate}`)
        console.log('config', this.encodingConfig)
        this.encoder.postMessage({
            cmd: 'init',
            config: {
                samplerate: this.encodingConfig.sampleRate,
                bps: this.encodingConfig.flacData.bps,
                channels: this.encodingConfig.flacData.channels,
                compression: this.encodingConfig.flacData.compression
            }
        })

        this.node.onaudioprocess = (e) => {
            if (!this.recording) 
                return;
            this.encoder.postMessage({
                cmd: 'encode',
                buf: e.inputBuffer.getChannelData(0)
            })
        }        

        this.input.connect(this.node)
        this.node.connect(this.audioContext.destination)
    }

    onDataAvailable(e) {
        this.chunks.push(e.data)
    }

    async start() {
        this.encoder = new Worker('static/encoder.js')
        this.encoder.onmessage = onMessageEncoder
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            console.log("getUserMedia supported.");
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: true
                });
                console.log('Got user persmission! :D');
                this.recording = true
                this.setStream(stream)
            } catch (err) {
                console.log('Something went wrong', err)
            }
        }
    }
    async record(e) {
        await this.start()
    }

    toggle(cb) {
        if (this.audioContext.state == 'running') {
            this.audioContext.suspend().then(() => cb('resume'));
        } else if (this.audioContext.state == 'suspended') {
            this.audioContext.resume().then(() => cb('pause'));
        }
        console.log(`Toggle statue: ${this.audioContext.state}`)
        return this.audioContext.state
    }
    
    stop() {
        this.recording = false;
        this.stopStream()
        this.encoder.postMessage({ cmd: 'finish' })
        this.input.disconnect()
        this.node.disconnect()
        this.node = this.input = null;
    }
    stopStream() {
        this.stream.getTracks().forEach( track => track.stop() );
    }
}

const mediaRecorderHandler = new MediaRecordHandler();

recordbtn.addEventListener('click', mediaRecorderHandler.record.bind(mediaRecorderHandler));
stopbtn.addEventListener('click', mediaRecorderHandler.stop.bind(mediaRecorderHandler));
toggleRecordingBtn.addEventListener('click', toggleRecording)
submitBtn.addEventListener('click', sendAudioToServer);


function toggleRecording(e) {
    const state = mediaRecorderHandler.toggle((text) => {
        e.target.textContent = text
        console.log('here')
    })
}

function setAudioSrc (audioBlob) {
    const audioUrl = window.URL.createObjectURL(audioBlob)
    const download = document.querySelector('#download')
    download.href = audioUrl
    download.download = "output.flac"
    player.src = audioUrl
}

async function sendAudioToServer(blob) {
    if(!CurrentSentence) return;

    const base64 = await blobToBase64(mediaRecorderHandler.blob)
    fetch('speech2text', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            audioBase64: base64,
            id: CurrentSentence.id
        })
    })
    .then((res) => res.json())
    .then((data) => {
        console.log(data)
        showMatching(data.data.matchedWords)
    })
    .catch((err) => {
        console.log(err)
    })
}  

function sendData(blob) {
    sendAudioToServer(blob)
}

const blobToBase64 = blob => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    return new Promise(resolve => {
        reader.onloadend = () => {
        resolve(reader.result.split(',')[1]);
        };
    });
};
  
function onMessageEncoder(e) {
    if (e.data.cmd == 'end') { 
        mediaRecorderHandler.blob = e.data.buf
        setAudioSrc(e.data.buf)
    } else if (e.data.cmd == 'debug') {
        console.log(e.data)
    } else {
        console.log('Unkown event', e.data.cmd)
    }
} 

let CurrentSentence;

async function getSentence() {
    const res = await fetch('speech2text');
    const data = await res.json()
    CurrentSentence = data
    sentence.textContent = data.sentence
    console.log(data)
}

function showMatching(matchedWords) {
    matched.innerHTML = matchedWords.map((word) => {

        return `<span style="color:${(word.matched) ? 'green' : 'red'}">${word.word}</span>`
    }).join(' ')
}
newSentence.addEventListener('click', getSentence)

getSentence()