document.addEventListener("DOMContentLoaded", () => {
    // Hide the loading spinner by adding the 'loaded' class to the body
    document.body.classList.add("loaded");

    const userNameElement = document.getElementById("userName");
    const employeeIdElement = document.getElementById("employeeId");
    const currentDate = document.getElementById("currentDate");
    const currentTime = document.getElementById("currentTime");
    const timerDisplay = document.getElementById("timerDisplay");
    const breakTimerDisplay = document.getElementById("breakTimerDisplay");
    const actionMessage = document.getElementById("actionMessage");

    const punchInButton = document.getElementById("punchIn");
    const punchOutButton = document.getElementById("punchOut");
    const longBreakButton = document.getElementById("longBreak");
    const smallBreakButton = document.getElementById("smallBreak");
    const restroomBreakButton = document.getElementById("restroomBreak");
    const stopBreakButton = document.getElementById("stopBreak");
    const logoutButton = document.getElementById("logout");

    let timerInterval = null;
    let breakTimerInterval = null;
    let breakStartTime = null;

    // Retrieve user data from local storage
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (loggedInUser) {
        userNameElement.textContent = loggedInUser.name;
        employeeIdElement.textContent = loggedInUser.employeeId;
    } else {
        alert('No user is logged in. Redirecting to login page.');
        window.location.href = 'login.html';
    }

    // Update the current date
    const formattedDate = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    currentDate.textContent = formattedDate;

    // Update the current time every second
    const updateTime = () => {
        const formattedTime = new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
        currentTime.textContent = formattedTime;
    };
    updateTime(); // Initial call
    setInterval(updateTime, 1000); // Update every second

    // Timer functionality
    const startTimer = (displayElement, initialSeconds = 0) => {
        let seconds = initialSeconds;
        return setInterval(() => {
            seconds++;
            const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
            const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
            const secs = String(seconds % 60).padStart(2, "0");
            if (displayElement) {
                displayElement.textContent = `${hrs}:${mins}:${secs}`;
            }
        }, 1000);
    };

    const displayMessage = (message, color = "#28a745") => {
        if (actionMessage) {
            actionMessage.textContent = message;
            actionMessage.style.color = color;
        }
    };

    // Ensure the breakTimerDisplay element exists
    if (breakTimerDisplay) {
        breakTimerDisplay.textContent = "Break Timer: 00:00:00";
    }

    // Retrieve existing attendance data from localStorage
    let attendanceData = JSON.parse(localStorage.getItem("attendanceData")) || [];
    let currentSession = JSON.parse(localStorage.getItem("currentSession")) || null;

    // Restore Timer on Page Load
    if (currentSession && currentSession.punchIn && !currentSession.punchOut) {
        // Convert punchIn time to a valid Date object
        const punchInTimeString = `${currentSession.date} ${currentSession.punchIn}`;
        const punchInTime = new Date(punchInTimeString);

        if (!isNaN(punchInTime)) { // Ensure the date is valid
            const now = new Date();
            const elapsedSeconds = Math.floor((now - punchInTime) / 1000);

            // Start the timer with the elapsed time
            timerInterval = startTimer(timerDisplay, elapsedSeconds);
        } else {
            console.error("Invalid punchIn time:", currentSession.punchIn);
            timerDisplay.textContent = "00:00:00"; // Reset timer display
        }
    }

    // Punch In
    punchInButton.addEventListener("click", () => {
        const now = new Date();
        const today = now.toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
        const punchInTime = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

        // Check if there's already a record for today
        const existingRecord = attendanceData.find((entry) => entry.date === today);
        if (existingRecord) {
            displayMessage("You have already punched in for today!", "#dc3545");
            return;
        }

        // Create a new session
        currentSession = {
            date: today,
            punchIn: punchInTime,
            punchOut: null,
            totalHours: null,
            breakDuration: 0,
        };

        // Save the session to localStorage
        localStorage.setItem("currentSession", JSON.stringify(currentSession));

        // Start the timer
        if (!timerInterval) {
            timerInterval = startTimer(timerDisplay);
        }

        displayMessage("Punched in successfully!", "#28a745");
    });

    // Punch Out
    punchOutButton.addEventListener("click", () => {
        if (!currentSession || !currentSession.punchIn) {
            displayMessage("You need to punch in first!", "#dc3545");
            return;
        }

        const now = new Date();
        const punchOutTime = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

        // Calculate Total Hours Worked
        const punchInTime = new Date(`${currentSession.date}T${currentSession.punchIn}`);
        const totalHours = (now - punchInTime) / (1000 * 60 * 60); // Total hours in decimal

        currentSession.punchOut = punchOutTime;
        currentSession.totalHours = `${Math.floor(totalHours)}h ${Math.round((totalHours % 1) * 60)}m`;

        // Save the session to attendance data
        attendanceData.push(currentSession);
        localStorage.setItem("attendanceData", JSON.stringify(attendanceData));

        // Clear the current session from localStorage
        localStorage.removeItem("currentSession");

        // Stop the timer
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
            timerDisplay.textContent = "00:00:00";
        }

        // Reset current session
        currentSession = null;

        displayMessage("Punched out successfully!", "#28a745");
    });

    // Handle Breaks
    const handleBreak = (breakDuration) => {
        if (!currentSession || !currentSession.punchIn) {
            alert("You need to punch in first!");
            return;
        }

        currentSession.breakDuration += breakDuration;
        alert(`Break of ${breakDuration} minutes added!`);
    };

    // Event Listeners for Break Buttons
    longBreakButton.addEventListener("click", () => handleBreak(60)); // 60 minutes
    smallBreakButton.addEventListener("click", () => handleBreak(15)); // 15 minutes
    restroomBreakButton.addEventListener("click", () => handleBreak(5)); // 5 minutes

    // Break functionality
    const startBreak = (breakType) => {
        if (!breakTimerDisplay) {
            displayMessage("Break Timer Display element is missing!", "#dc3545");
            return;
        }
        if (breakTimerInterval) {
            displayMessage("You are already on a break!", "#dc3545");
            return;
        }

        // Start the break timer
        let breakSeconds = 0;
        breakTimerInterval = setInterval(() => {
            breakSeconds++;
            const hrs = String(Math.floor(breakSeconds / 3600)).padStart(2, "0");
            const mins = String(Math.floor((breakSeconds % 3600) / 60)).padStart(2, "0");
            const secs = String(breakSeconds % 60).padStart(2, "0");
            breakTimerDisplay.textContent = `${hrs}:${mins}:${secs}`;
        }, 1000);

        displayMessage(`Started ${breakType} break!`, "#ffc107");
    };

    const stopBreak = () => {
        if (!breakTimerDisplay) {
            displayMessage("Break Timer Display element is missing!", "#dc3545");
            return;
        }
        if (!breakTimerInterval) {
            displayMessage("You are not on a break!", "#dc3545");
            return;
        }

        // Stop the break timer
        clearInterval(breakTimerInterval);
        breakTimerInterval = null;
        breakTimerDisplay.textContent = "Break Timer: 00:00:00";
        displayMessage("Break stopped!", "#28a745");
    };

    // Event Listeners for Break Buttons
    longBreakButton.addEventListener("click", () => startBreak("Long"));
    smallBreakButton.addEventListener("click", () => startBreak("Small"));
    restroomBreakButton.addEventListener("click", () => startBreak("Restroom"));
    stopBreakButton.addEventListener("click", stopBreak);

    longBreakButton.addEventListener("click", () => {
        if (!currentSession || !currentSession.punchIn) {
            displayMessage("You need to punch in first!", "#dc3545");
            return;
        }

        breakStartTime = new Date();
        displayMessage("Long break started!", "#28a745");
    });

    stopBreakButton.addEventListener("click", () => {
        if (!breakStartTime) {
            displayMessage("No break in progress!", "#dc3545");
            return;
        }

        const breakEndTime = new Date();
        const breakDuration = (breakEndTime - breakStartTime) / (1000 * 60); // Break duration in minutes

        currentSession.breakDuration = (currentSession.breakDuration || 0) + Math.round(breakDuration);
        breakStartTime = null;

        displayMessage("Break ended!", "#28a745");
    });

    // Logout functionality
    logoutButton.addEventListener("click", () => {
        if (timerInterval || breakTimerInterval) {
            displayMessage("Please punch out and stop your break before logging out!", "#dc3545");
            return;
        }
        // Clear user data from local storage
        const confirmLogout = confirm('Are you sure you want to logout?');
        if (confirmLogout) {
            localStorage.removeItem('loggedInUser');
            window.location.href = 'login.html';
        }
    });

    // Sidebar toggle functionality
    const sidebar = document.getElementById("sidebar");
    const toggleSidebarButton = document.getElementById("toggleSidebar");

    // Toggle sidebar visibility
    toggleSidebarButton.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");
    });

    const mainContent = document.querySelector('.main-content');
    toggleSidebarButton.addEventListener("click", () => {
        mainContent.classList.toggle('collapsed');
    });

    // Set current year in the footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();
});