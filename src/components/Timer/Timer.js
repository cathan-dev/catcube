const HOLD_TIME = 500

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

function keydownHandler(e) {
    if (e?.repeat) return

    switch (e.code) {
        case "Space":
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
            break
        default:
            timerStop(e)
            render()
    }
}

function keyupHandler(e) {
    switch (e.code) {
        case "Space":
            if (!timerData.spaceHeld) return
            timerData.spaceHeld = false
            if (e.timeStamp - timerData.spacePressedAt >= HOLD_TIME) {
                timerStart(e)
            }
            render()
            break
        default:
            return
    }
}

function tick() {
    render()
    if (timerData.running || timerData.spaceHeld) {
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
    })
}

main()