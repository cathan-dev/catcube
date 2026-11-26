const HOLD_TIME = 500
const BREAK_TIME = 200

const timerElements = {
    timer: document.querySelector(".timer-text"),
    solveList: document.querySelector(".solve-list")
}

const timerData = {
    solves: [],
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
    timerData.solves.push({
        time: (timerData.timeStopped - timerData.timeStarted),
        date: Date.now()
    })
    render()
}

function timerPress(e) {
    if (e.timeStamp - timerData.timeStopped < BREAK_TIME) return
    if (!timerData.running) { // TIMER HOLD
        timerData.spaceHeld = true
        timerData.spacePressedAt = e.timeStamp
        setTimeout(renderTimer, HOLD_TIME)
        renderTimer()
    }
    else {
        timerStop(e)
    }
}

function timerRelease(e) {
    if (!timerData.spaceHeld) return
    timerData.spaceHeld = false
    if (e.timeStamp - timerData.spacePressedAt >= HOLD_TIME) {
        timerStart(e)
    }
    renderTimer()
}

function keydownHandler(e) {
    if (e?.repeat) return

    switch (e.code) {
        case "Space":
            timerPress(e)
            break
        default:
            timerStop(e)
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

function buildSolveElement(solve) {

    const li = document.createElement("li")
    li.className = "solve-item"

    const wrapper = document.createElement("div")
    wrapper.className = "solve-item-wrapper"

    const timeSpan = document.createElement("span")
    timeSpan.className = "solve-item-time"
    timeSpan.textContent = millisecondsToString(solve.time)

    wrapper.appendChild(timeSpan)
    li.appendChild(wrapper)

    return li
}

function tick() {
    renderTimer()
    if (timerData.running) {
        requestAnimationFrame(tick)
    }
}

function render() {
    renderTimer()
    renderSolved()
}

function renderTimer() {
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

function renderSolved() {
    const solves = timerData.solves.map((solve) => buildSolveElement(solve))
    timerElements.solveList.replaceChildren(...solves)
}

function main() {
    render()
    document.addEventListener("keydown", (e) => {
        keydownHandler(e)
    })
    document.addEventListener("keyup", (e) => {
        keyupHandler(e)
    })
    window.addEventListener("blur", () => {
        timerData.spaceHeld = false
        renderTimer()
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
        renderTimer()
    })
}

main()