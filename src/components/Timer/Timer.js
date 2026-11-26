const HOLD_TIME = 500
const BREAK_TIME = 200

const timerElements = {
    timer: document.querySelector(".timer-text")
}

const timerData = {
    running: false,
    spaceHeld: false,
    spacePressedAt: 0,
    timeStarted: 0,
    timeStopped: 0
}

function millisecondsToString(ms) {
    return (Math.floor(ms / 10) / 100).toFixed(2)
}

function timerStart(e) {
    timerData.running = true
    timerData.timeStarted = e.timeStamp
    requestAnimationFrame(tick)
}

function timerStop(e) {
    if (!timerData.running) return
    timerData.running = false
    timerData.timeStopped = e.timeStamp
}

function timerPress(e) {
    if (e.timeStamp - timerData.timeStopped < BREAK_TIME) return
    if (!timerData.running) { // TIMER HOLD
        timerData.spaceHeld = true
        timerData.spacePressedAt = e.timeStamp
        setTimeout(render, HOLD_TIME)
        render()
    }
    else {
        timerStop(e)
        render()
    }
}

function timerRelease(e) {
    if (!timerData.spaceHeld) return
    timerData.spaceHeld = false
    if (e.timeStamp - timerData.spacePressedAt >= HOLD_TIME) {
        timerStart(e)
    }
    render()
}

function keydownHandler(e) {
    if (e?.repeat) return

    switch (e.code) {
        case "Space":
            timerPress(e)
            break
        default:
            timerStop(e)
            render()
    }
}

function keyupHandler(e) {
    switch (e.code) {
        case "Space":
            timerRelease(e)
            break
        default:
            return
    }
}

function pressDownHandler(e) {

}

function tick() {
    render()
    if (timerData.running) {
        requestAnimationFrame(tick)
    }
}

function render() {
    const timeNow = performance.now()

    timerElements.timer.classList.toggle("timer-not-ready", timerData.spaceHeld && timeNow - timerData.spacePressedAt < HOLD_TIME)
    timerElements.timer.classList.toggle("timer-ready", timerData.spaceHeld && timeNow - timerData.spacePressedAt >= HOLD_TIME)

    if (timerData.running) {
        timerElements.timer.textContent = millisecondsToString(timeNow - timerData.timeStarted)
    }

    else {
        timerElements.timer.textContent = millisecondsToString(timerData.timeStopped - timerData.timeStarted)
    }
}

function main() {
    document.addEventListener("keydown", (e) => {
        keydownHandler(e)
    })
    document.addEventListener("keyup", (e) => {
        keyupHandler(e)
    })
    window.addEventListener("blur", () => {
        timerData.spaceHeld = false
        render()
    })

    document.addEventListener("touchstart", (e) => {
        e.preventDefault()
        timerPress(e)
    }, { passive: false })
    document.addEventListener("touchend", (e) => {
        e.preventDefault()
        timerRelease(e)
    })
    document.addEventListener("touchcancel", () => {
        timerData.spaceHeld = false
        render()
    })
}

main()