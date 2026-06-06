import * as Tone from "tone"

let initialized = false

export async function initAudio() {
    if (initialized) return
    await Tone.start()
    startMusic()
    initialized = true
}

export function playPing(step: number) {
    if (sfxMuted) return
    const scale = ["C4", "E4", "G4", "A4", "C5", "E5", "G5", "A5", "C6", "E6", "G6", "A6", "C7", "E7", "G7", "A7"]
    const note = scale[Math.min(step, scale.length - 1)]
    const synth = new Tone.Synth({
        oscillator: { type: "sine" },
        envelope: { attack: 0.05, decay: 0.8, sustain: 0.6, release: 2 },
        volume: -12
    }).toDestination()
    synth.triggerAttackRelease(note, "2n")
}

export function playWin() {
    if (sfxMuted) return
    const synth = new Tone.Synth({
        oscillator: { type: "sine" },
        envelope: { attack: 0.01, decay: 0.4, sustain: 0.3, release: 1.2 },
        volume: -12
    }).toDestination()
    const now = Tone.now()
    synth.triggerAttackRelease("G5", "8n", now)
    synth.triggerAttackRelease("G5", "8n", now + 0.15)
    synth.triggerAttackRelease("D6", "4n", now + 0.3)
}

export function playLose() {
    if (sfxMuted) return
    const synth = new Tone.Synth({
        oscillator: { type: "sine" },
        envelope: { attack: 0.01, decay: 0.1, sustain: 0.3, release: 0.1 },
        volume: -6
    }).toDestination()
    const now = Tone.now()
    synth.triggerAttackRelease("C3", "10n", now)
    synth.triggerAttackRelease("B2", "10n", now + 0.08)
}

export function playButton() {
    if (sfxMuted) return
    const synth = new Tone.Synth({
        oscillator: { type: "sine" },
        envelope: { attack: 0.01, decay: 0.1, sustain: 0, release: 0.1 },
        volume: -6
    }).toDestination()
    synth.triggerAttackRelease("A4", "32n")
}

export function playReset() {
    if (sfxMuted) return
    const synth = new Tone.Synth({
        oscillator: { type: "sine" },
        envelope: { attack: 0.01, decay: 0.15, sustain: 0, release: 0.1 },
        volume: -6
    }).toDestination()
    const now = Tone.now()
    synth.triggerAttackRelease("A4", "32n", now)
    synth.triggerAttackRelease("E4", "32n", now + 0.08)
}

let bgMusic: Tone.Player | null = null

export function startMusic() {
    if (musicMuted) return
    if (bgMusic) return
    bgMusic = new Tone.Player({
        url: "/music/kelsey.mp3",
        loop: true,
        volume: -25
    }).toDestination()
    bgMusic.autostart = true
}

export function stopMusic() {
    if (!bgMusic) return
    bgMusic.stop()
    bgMusic.dispose()
    bgMusic = null
}

let sfxMuted = false
let musicMuted = false

export function toggleSfx() {
    sfxMuted = !sfxMuted
    return sfxMuted
}

export function toggleMusic() {
    musicMuted = !musicMuted
    if (bgMusic) bgMusic.volume.value = musicMuted ? -Infinity : -20
    return musicMuted
}

export function isSfxMuted() { return sfxMuted }
export function isMusicMuted() { return musicMuted }