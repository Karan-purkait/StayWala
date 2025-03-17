document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("darkModeToggle");
    const themeIcon = document.getElementById("themeIcon"); // Select the icon
    const isDarkMode = localStorage.getItem("darkMode") === "enabled";

    if (isDarkMode) {
        document.body.classList.add("dark-mode");
        toggle.checked = true;
        themeIcon.classList.replace("fa-moon", "fa-sun"); // Show sun icon in dark mode
    }

    toggle.addEventListener("change", () => {
        if (toggle.checked) {
            document.body.classList.add("dark-mode");
            localStorage.setItem("darkMode", "enabled");
            themeIcon.classList.replace("fa-moon", "fa-sun");
        } else {
            document.body.classList.remove("dark-mode");
            localStorage.setItem("darkMode", "disabled");
            themeIcon.classList.replace("fa-sun", "fa-moon");
        }
    });
});
