const audioContext = new AudioContext()

const NODE_DETAILS = [
    { node: 'C', key: 'Z', voice: 261.626, active: false },
    { node: 'Db', key: 'S', voice: 277.183, active: false },
    { node: 'D', key: 'X', voice: 293.665, active: false },
    { node: 'Eb', key: 'D', voice: 311.127, active: false },
    { node: 'E', key: 'C', voice: 329.628, active: false },
    { node: 'F', key: 'V', voice: 349.228, active: false },
    { node: 'Gb', key: 'G', voice: 369.994, active: false },
    { node: 'G', key: 'B', voice: 391.995, active: false },
    { node: 'Ab', key: 'H', voice: 415.305, active: false },
    { node: 'A', key: 'N', voice: 440, active: false },
    { node: 'Bb', key: 'J', voice: 466.164, active: false },
    { node: 'B', key: 'M', voice: 493.883, active: false },
]

document.addEventListener('keydown', (e) => {
    if (e.repeat) return
    const keyboardKey = e.code;
    const NODE_DETAIL = getNodeDetails(keyboardKey)

    if (NODE_DETAIL == null) return
    NODE_DETAIL.active = true

    playNotes()
})

document.addEventListener('keyup', (e) => {
    const keyboardKey = e.code;
    const NODE_DETAIL = getNodeDetails(keyboardKey)

    if (NODE_DETAIL == null) return
    NODE_DETAIL.active = false

    playNotes()
})

function getNodeDetails(keyboard) {
    return NODE_DETAILS.find(n => `Key${n.key}` === keyboard)
}

const playNotes = () => {
    NODE_DETAILS.forEach(n => {
        const keyElement = document.querySelector(`[data-note="${n.node}"]`);

        keyElement.innerHTML = n.node

        keyElement.classList.toggle('active', n.active)

        if (n.oscillator != null) {
            n.oscillator.stop()
            n.oscillator.disconnect()
        }
    })

    const activeNotes = NODE_DETAILS.filter(n => n.active)
    const gain = 1 / activeNotes.length
    activeNotes.forEach(n => {
        startNote(n, gain)
    })
}

function startNote (e, gain) {
    const gainNode = audioContext.createGain();
    gainNode.gain.value = gain
    const oscillator = audioContext.createOscillator();
    oscillator.frequency.value = e.voice
    oscillator.type = 'triangle'
    oscillator.connect(gainNode).connect(audioContext.destination)
    oscillator.start()
    e.oscillator = oscillator
}