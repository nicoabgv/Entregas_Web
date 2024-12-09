"use client";

import { useEffect, useState } from "react";

export default function ThemeSwitcher() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const isDark = !darkMode;
    setDarkMode(isDark);

    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <div className="flex space-x-4 mt-4">
      <button
        onClick={toggleTheme}
        className={`px-4 py-2 rounded ${
          darkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-800"
        } hover:opacity-90`}
      >
        {darkMode ? "Modo Claro" : "Modo Oscuro"}
      </button>
    </div>
  );
}