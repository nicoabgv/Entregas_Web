"use client";

import { useRouter } from "next/navigation";
import { showWarningAlert } from "@/utils/alerts";

export default function Sidebar({ onSectionChange }) {
  const router = useRouter();

  const handleLogout = () => {
    showWarningAlert(
      "¿Estás seguro?",
      "¡Vas a cerrar sesión!"
    ).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("jwt");
        router.push("/login");
      }
    });
  };

  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col dark:bg-gray-900">
      <div className="p-6 text-2xl font-bold text-center border-b border-gray-700 dark:border-gray-800">
        Dashboard
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-4">
          <li>
            <button
              onClick={() => onSectionChange("Resumen")}
              className="w-full text-left px-4 py-2 rounded hover:bg-gray-700 dark:hover:bg-gray-800 transition"
            >
              Resumen
            </button>
          </li>
          <li>
            <button
              onClick={() => onSectionChange("Clientes")}
              className="w-full text-left px-4 py-2 rounded hover:bg-gray-700 dark:hover:bg-gray-800 transition"
            >
              Clientes
            </button>
          </li>
          <li>
            <button
              onClick={() => onSectionChange("Proyectos")}
              className="w-full text-left px-4 py-2 rounded hover:bg-gray-700 dark:hover:bg-gray-800 transition"
            >
              Proyectos
            </button>
          </li>
          <li>
            <button
              onClick={() => onSectionChange("Albaranes")}
              className="w-full text-left px-4 py-2 rounded hover:bg-gray-700 dark:hover:bg-gray-800 transition"
            >
              Albaranes
            </button>
          </li>
          <li>
            <button
              onClick={() => onSectionChange("Ajustes")}
              className="w-full text-left px-4 py-2 rounded hover:bg-gray-700 dark:hover:bg-gray-800 transition"
            >
              Ajustes
            </button>
          </li>
        </ul>
      </nav>
      <div className="mt-6 p-4 dark:border-gray-800">
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white dark:bg-red-600 dark:hover:bg-red-700"
        >
          Cerrar sesión
        </button>
      </div>
      <footer className="p-4 text-center border-t border-gray-700 dark:border-gray-800">
        <p className="text-sm text-gray-400 dark:text-gray-500">© 2024 DeliverEase</p>
      </footer>
    </aside>
  );
}