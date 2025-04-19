document.addEventListener("DOMContentLoaded", () => {
  const calendarEl = document.getElementById("attendanceCalendar");

  // Days of the week
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  daysOfWeek.forEach(day => {
    const dayEl = document.createElement("div");
    dayEl.className = "day header";
    dayEl.textContent = day;
    calendarEl.appendChild(dayEl);
  });

  // Get current month and year
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  // Get the first day of the month
  const firstDay = new Date(year, month, 1).getDay();

  // Get the number of days in the month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Retrieve attendance data from localStorage
  const attendanceData = JSON.parse(localStorage.getItem("attendanceData")) || [];

  // Add empty days for the first week
  for (let i = 0; i < firstDay; i++) {
    const emptyDay = document.createElement("div");
    emptyDay.className = "day empty";
    calendarEl.appendChild(emptyDay);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const attendance = attendanceData.find(entry => entry.date === date);

    const dayEl = document.createElement("div");
    dayEl.className = "day";

    if (attendance) {
      dayEl.classList.add(attendance.punchIn && attendance.punchOut ? "present" : "absent");
      dayEl.textContent = day;

      // Add click event to redirect to attendance-details.html
      dayEl.addEventListener("click", () => {
        window.location.href = `attendance-details.html?date=${date}`;
      });
    } else {
      dayEl.textContent = day;

      // Add click event for dates with no attendance data
      dayEl.addEventListener("click", () => {
        window.location.href = `attendance-details.html?date=${date}`;
      });
    }

    calendarEl.appendChild(dayEl);
  }
});