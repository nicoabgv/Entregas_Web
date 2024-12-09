"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { showErrorAlert, showSuccessAlert } from "@/utils/alerts";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { email, password };

    try {
      const response = await fetch("https://bildy-rpmaya.koyeb.app/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Login exitoso:", result);

        localStorage.setItem("jwt", result.token);

        showSuccessAlert("¡Inicio de sesión exitoso!");
        router.push("/dashboard");
      } else {
        const error = await response.json();
        console.log("Error en respuesta:", error);
        showErrorAlert(`Error: ${error.message || "Credenciales incorrectas."}`);
      }
    } catch (err) {
      console.error("Error en la solicitud:", err);
      showErrorAlert("Hubo un problema al iniciar sesión.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form className="bg-white p-6 rounded shadow-md w-full max-w-sm" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-4 text-center">Iniciar Sesión</h2>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
          <input
            id="email"
            type="email"
            placeholder="tucorreo@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
          <input
            id="password"
            type="password"
            placeholder="Tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
        >
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
}