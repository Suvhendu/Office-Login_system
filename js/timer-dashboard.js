document.addEventListener('DOMContentLoaded', function () {
    let timerInterval;
    let breakTimerInterval;
    let startTime;
    let breakStartTime;

    const timerDisplay = document.getElementById('timerDisplay');
    const breakTimerDisplay = document.createElement('div');
    breakTimerDisplay.id = 'breakTimerDisplay';
    breakTimerDisplay.style.fontSize = '1.2rem';
    breakTimerDisplay.style.fontWeight = 'bold';
    breakTimerDisplay.style.marginTop = '10px';
    breakTimerDisplay.textContent = 'Break Timer: 00:00:00';
    timerDisplay.parentNode.insertBefore(breakTimerDisplay, timerDisplay.nextSibling);

    const breakButtons = [
        document.getElementById('longBreak'),
        document.getElementById('smallBreak'),
        document.getElementById('restroomBreak'),
        document.getElementById('stopBreak')
    ];

    // Disable break buttons initially
    breakButtons.forEach(button => button.disabled = true);

    const formatTime = (elapsedTime) => {
        const hours = String(Math.floor(elapsedTime / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((elapsedTime % 3600) / 60)).padStart(2, '0');
        const seconds = String(elapsedTime % 60).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };

    const startTimer = () => {
        startTime = Date.now();
        timerInterval = setInterval(() => {
            const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
            timerDisplay.textContent = formatTime(elapsedTime);
        }, 1000);
    };

    const stopTimer = () => {
        clearInterval(timerInterval);
        timerInterval = null;
    };

    const startBreakTimer = (breakType) => {
        if (breakTimerInterval) {
            alert('You are already on a break.');
            return;
        }
        breakStartTime = Date.now();
        breakTimerDisplay.textContent = `${breakType} Timer: 00:00:00`;
        breakTimerInterval = setInterval(() => {
            const elapsedTime = Math.floor((Date.now() - breakStartTime) / 1000);
            breakTimerDisplay.textContent = `${breakType} Timer: ${formatTime(elapsedTime)}`;
        }, 1000);
    };

    const stopBreakTimer = () => {
        if (breakTimerInterval) {
            clearInterval(breakTimerInterval);
            breakTimerInterval = null;
            breakTimerDisplay.textContent = 'Break Timer: 00:00:00';
        }
    };

    const punchInButton = document.getElementById('punchIn');
    const punchOutButton = document.getElementById('punchOut');
    const longBreakButton = document.getElementById('longBreak');
    const smallBreakButton = document.getElementById('smallBreak');
    const restroomBreakButton = document.getElementById('restroomBreak');
    const stopBreakButton = document.getElementById('stopBreak');

    // Add event listeners only if the elements exist
    if (punchInButton) {
        punchInButton.addEventListener('click', () => {
            console.log('Punch In clicked');
            if (!timerInterval) {
                stopBreakTimer(); // Ensure no break is active
                startTimer();
                // Enable break buttons after punching in
                breakButtons.forEach(button => button.disabled = false);
            }
        });
    } else {
        console.warn('Punch In button not found in the DOM');
    }

    if (punchOutButton) {
        punchOutButton.addEventListener('click', () => {
            console.log('Punch Out clicked');
            if (timerInterval) {
                stopTimer();
                // Disable break buttons after punching out
                breakButtons.forEach(button => button.disabled = true);
            }
        });
    } else {
        console.warn('Punch Out button not found in the DOM');
    }

    if (longBreakButton) {
        longBreakButton.addEventListener('click', () => {
            console.log('Long Break clicked');
            stopTimer(); // Pause work timer
            startBreakTimer('Long Break');
        });
    } else {
        console.warn('Long Break button not found in the DOM');
    }

    if (smallBreakButton) {
        smallBreakButton.addEventListener('click', () => {
            console.log('Small Break clicked');
            stopTimer(); // Pause work timer
            startBreakTimer('Small Break');
        });
    } else {
        console.warn('Small Break button not found in the DOM');
    }

    if (restroomBreakButton) {
        restroomBreakButton.addEventListener('click', () => {
            console.log('Restroom Break clicked');
            stopTimer(); // Pause work timer
            startBreakTimer('Restroom Break');
        });
    } else {
        console.warn('Restroom Break button not found in the DOM');
    }

    if (stopBreakButton) {
        stopBreakButton.addEventListener('click', () => {
            console.log('Stop Break clicked');
            stopBreakTimer();
        });
    } else {
        console.warn('Stop Break button not found in the DOM');
    }

    document.addEventListener('click', (event) => {
        if (event.target.id === 'punchIn' || event.target.id === 'punchOut') {
            stopBreakTimer(); // Stop break timer when punching in or out
        }
    });

    document.getElementById('logout').addEventListener('click', () => {
        // Clear all timers
        stopTimer();
        stopBreakTimer();

        // Clear user session data (if stored in localStorage)
        localStorage.clear();

        // Redirect to the login page
        window.location.href = '/office-punch-system/login.html';
    });

    // Retrieve user details from localStorage
    const userName = localStorage.getItem('userName') || 'User';
    const employeeId = localStorage.getItem('employeeId') || 'N/A';
    const currentDate = new Date().toLocaleDateString();

    // Populate the welcome panel
    document.getElementById('userName').textContent = userName;
    document.getElementById('employeeId').textContent = employeeId;
    document.getElementById('currentDate').textContent = currentDate;
});
