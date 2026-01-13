// Simple Pomodoro 25/5
// Constants for work time and break time in seconds
const WORK_SECONDS = 0.25 * 60;        // 1 minute work time
const BREAK_SECONDS = 0.1 * 60;    // 6 seconds break

// Global variables to keep track of timer state
let remaining = WORK_SECONDS;      // Remaining time in seconds
let isWork = true;                 // true = work period, false = break
let intervalId = null;             // Reference to setInterval timer
let sessionCount = 0;              // Number of completed work sessions
let breakCount = 0;                // Number of completed breaks

// Get references to all needed HTML elements
const timeEl = document.getElementById('time');           // Element to display time
const modeEl = document.getElementById('mode');           // Element to display work/break
const startBtn = document.getElementById('startBtn');     // Start button
const pauseBtn = document.getElementById('pauseBtn');     // Pause button
const resetBtn = document.getElementById('resetBtn');     // Reset button
const sessionCountEl = document.getElementById('sessionCount'); // Element for session counter
const breakCountEl = document.getElementById('breakCount'); // Element for break counter
const notificationSound = document.getElementById('notificationSound'); // Sound element

// Function to play click sound
function playClickSound() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();// Create AudioContext to play sound
  const oscillator = audioContext.createOscillator();// Create oscillator to generate sound
  const gainNode = audioContext.createGain();// Create gain-node for volume control
  
  oscillator.connect(gainNode);// Connect oscillator to gain-node to control volume so sound is heard
  gainNode.connect(audioContext.destination);// Connect gain-node to audio context's destination (speakers)
  
  oscillator.frequency.value = 800;// Set frequency for sound (800 Hz)
  oscillator.type = 'sine';// Set type of oscillator "sine = sine wave"
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);// Set starting volume to 0.3
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);// Decrease volume quickly to create a short click sound
  
  oscillator.start(audioContext.currentTime);// Start oscillator
  oscillator.stop(audioContext.currentTime + 0.1);// Stop oscillator after 0.1 seconds
}

// Function to format seconds to MM:SS format
function formatTime(sec){
  const m = Math.floor(sec / 60).toString().padStart(2,'0'); // Calculate minutes and add leading zero
  const s = (sec % 60).toString().padStart(2,'0');           // Calculate seconds and add leading zero
  return `${m}:${s}`;
}

// Function to update user interface
function updateUI(){
  timeEl.textContent = formatTime(remaining);               // Update time display
  modeEl.textContent = isWork ? 'Work' : 'Break';          // Show current mode
  sessionCountEl.textContent = sessionCount;                // Show number of sessions
  breakCountEl.textContent = breakCount;                    // Show number of breaks
  // Handle button status - start inactive when timer is running, pause active when timer is running
  startBtn.disabled = !!intervalId;                         // Disable start if timer is running
  pauseBtn.disabled = !intervalId;                          // Disable pause if timer is not running
}

// Main function that runs every second when timer is active
function tick(){
  if (remaining > 0){
    remaining -= 1;
    updateUI();
    return;
  }

  // Play sound when timer is complete
  notificationSound.play().catch(error => {
    console.log('Could not play sound:', error);
  });
  
  // Switch between work and break
  if (isWork){
    // Completed work session - increase session counter and switch to break
    sessionCount += 1;
    isWork = false;
    remaining = BREAK_SECONDS;
  } else {
    // Completed break - increase break counter and switch back to work period
    breakCount += 1;
    isWork = true;
    remaining = WORK_SECONDS;
  }
  updateUI();
}

// Function to start timer
function startTimer(){
  if (intervalId) return;                    // Prevent multiple timers simultaneously
  playClickSound();                          // Play click sound
  intervalId = setInterval(tick, 1000);      // Start timer that calls tick every second
  updateUI();                                // Update button status
}

// Function to pause timer
function pauseTimer(){
  if (!intervalId) return;                   // Nothing to pause if timer is not running
  playClickSound();                          // Play click sound
  clearInterval(intervalId);                 // Stop timer
  intervalId = null;                         // Clear reference
  updateUI();                                // Update button status
}

// Function to reset timer to initial state
function resetTimer(){
  playClickSound();                          // Play click sound
  pauseTimer();                              // Stop timer first
  isWork = true;                             // Reset to work mode
  remaining = WORK_SECONDS;                  // Reset time
  sessionCount = 0;                          // Reset session counter
  breakCount = 0;                            // Reset break counter
  updateUI();                                // Update interface
}

// Attach event listeners to buttons
startBtn.addEventListener('click', startTimer);   // Start button starts timer
pauseBtn.addEventListener('click', pauseTimer);   // Pause button pauses timer
resetBtn.addEventListener('click', resetTimer);   // Reset button resets timer

// Initialize user interface when page loads
updateUI();