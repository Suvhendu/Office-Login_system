document.addEventListener("DOMContentLoaded", () => {
  const attendanceDetailsEl = document.getElementById("attendanceDetails");

  // Get the date from the query parameter
  const urlParams = new URLSearchParams(window.location.search);
  const date = urlParams.get("date");

  // Retrieve attendance data from localStorage
  const attendanceData = JSON.parse(localStorage.getItem("attendanceData")) || [];
  
  // Find the specific day's data
  const attendance = attendanceData.find(entry => entry.date === date);

  if (attendance) {
    const status = attendance.punchIn && attendance.punchOut ? "Present" : "Absent";

    // Calculate total break duration
    let totalBreakDuration = 0;
    if (attendance.breaks && attendance.breaks.length > 0) {
      attendance.breaks.forEach(breakEntry => {
        const breakStart = new Date(breakEntry.start);
        const breakEnd = new Date(breakEntry.end);

        if (breakEnd > breakStart) {
          totalBreakDuration += Math.floor((breakEnd - breakStart) / (1000 * 60)); // Convert milliseconds to minutes
        } else {
          console.error("Invalid break times for one of the breaks.");
        }
      });
    } else {
      totalBreakDuration = "N/A";
    }

    // Calculate total hours worked
    let totalHoursWorked = "N/A";
    if (attendance.punchIn && attendance.punchOut) {
      const punchIn = new Date(attendance.punchIn);
      const punchOut = new Date(attendance.punchOut);

      console.log("Punch In:", punchIn);
      console.log("Punch Out:", punchOut);

      if (!isNaN(punchIn.getTime()) && !isNaN(punchOut.getTime()) && punchOut > punchIn) {
        const totalMinutesWorked = Math.floor((punchOut - punchIn) / (1000 * 60)) - totalBreakDuration;
        const hours = Math.floor(totalMinutesWorked / 60);
        const minutes = totalMinutesWorked % 60;
        totalHoursWorked = `${hours}h ${minutes}m`;
      } else {
        console.error("Invalid punch in/out times.");
        totalHoursWorked = "Invalid punch times";
      }
    }

    // Populate attendance details
    attendanceDetailsEl.innerHTML = `
      <h2>Date: ${date}</h2>
      <p><strong>Status:</strong> <span class="${status.toLowerCase()}">${status}</span></p>
      <p><strong>Punch In:</strong> ${attendance.punchIn || "N/A"}</p>
      <p><strong>Punch Out:</strong> ${attendance.punchOut || "N/A"}</p>
      <p><strong>Total Hours:</strong> ${totalHoursWorked}</p>
      <p><strong>Total Break Duration:</strong> ${totalBreakDuration} minutes</p>
    `;
  } else {
    // If no attendance data is available for the date
    attendanceDetailsEl.innerHTML = `
      <h2>Date: ${date}</h2>
      <p>No attendance data available for this date.</p>
    `;
  }
});