class Stopwatch {
    constructor() {
        this.isRunning = false;
        this.startTime = 0;
        this.elapsedTime = 0;
        this.laps = [];
        this.interval = null;
        
        this.display = document.getElementById('display');
        this.startBtn = document.getElementById('start');
        this.pauseBtn = document.getElementById('pause');
        this.resetBtn = document.getElementById('reset');
        this.lapBtn = document.getElementById('lap');
        this.lapList = document.getElementById('lapList');
        this.themeToggle = document.getElementById('themeToggle');
        
        this.bindEvents();
        this.loadLaps();
        this.updateDisplay();
    }
    
    bindEvents() {
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.lapBtn.addEventListener('click', () => this.recordLap());
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                if (this.isRunning) {
                    this.pause();
                } else {
                    this.start();
                }
            }
        });
    }
    
    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.startTime = performance.now() - this.elapsedTime;
            this.interval = setInterval(() => this.updateDisplay(), 10);
            this.startBtn.disabled = true;
            this.pauseBtn.disabled = false;
            this.lapBtn.disabled = false;
            this.vibrate();
        }
    }
    
    pause() {
        if (this.isRunning) {
            this.isRunning = false;
            clearInterval(this.interval);
            this.elapsedTime = performance.now() - this.startTime;
            this.startBtn.disabled = false;
            this.pauseBtn.disabled = true;
            this.vibrate();
        }
    }
    
    reset() {
        this.isRunning = false;
        clearInterval(this.interval);
        this.elapsedTime = 0;
        this.laps = [];
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.lapBtn.disabled = true;
        this.updateDisplay();
        this.renderLaps();
        this.saveLaps();
        this.vibrate();
    }
    
    recordLap() {
        if (this.isRunning) {
            const lapTime = performance.now() - this.startTime;
            const lapNumber = this.laps.length + 1;
            this.laps.push({
                number: lapNumber,
                time: lapTime,
                display: this.formatTime(lapTime)
            });
            this.renderLaps();
            this.saveLaps();
            this.vibrate();
        }
    }
    
    updateDisplay() {
        if (this.isRunning) {
            this.elapsedTime = performance.now() - this.startTime;
        }
        this.display.textContent = this.formatTime(this.elapsedTime);
    }
    
    formatTime(time) {
        const milliseconds = Math.floor((time % 1000) / 10);
        const seconds = Math.floor((time / 1000) % 60);
        const minutes = Math.floor((time / (1000 * 60)) % 60);
        const hours = Math.floor(time / (1000 * 60 * 60));
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
    }
    
    renderLaps() {
        this.lapList.innerHTML = '';
        this.laps.forEach(lap => {
            const li = document.createElement('li');
            li.innerHTML = `<span>Lap ${lap.number}</span><span>${lap.display}</span>`;
            this.lapList.appendChild(li);
        });
    }
    
    saveLaps() {
        localStorage.setItem('stopwatchLaps', JSON.stringify(this.laps));
    }
    
    loadLaps() {
        const savedLaps = localStorage.getItem('stopwatchLaps');
        if (savedLaps) {
            this.laps = JSON.parse(savedLaps);
            this.renderLaps();
        }
    }
    
    toggleTheme() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDark);
        this.themeToggle.textContent = isDark ? 'Toggle Light Mode' : 'Toggle Dark Mode';
    }
    
    vibrate() {
        if ('vibrate' in navigator) {
            navigator.vibrate(100);
        }
    }
}

// Initialize the stopwatch when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const stopwatch = new Stopwatch();
    
    // Load theme preference
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.body.classList.add('dark-mode');
        stopwatch.themeToggle.textContent = 'Toggle Light Mode';
    }
});