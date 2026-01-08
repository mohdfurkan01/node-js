const toggle = document.getElementById("theme-toggle");
const icon = document.getElementById("theme-icon");

// On page load
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  icon.classList.remove("fa-moon");
  icon.classList.add("fa-sun");
}

toggle.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark");

  if (isDark) {
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
    localStorage.setItem("theme", "dark");
  } else {
    icon.classList.remove("fa-sun");
    icon.classList.add("fa-moon");
    localStorage.setItem("theme", "light");
  }
});
