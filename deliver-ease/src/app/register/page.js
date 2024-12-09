"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { showErrorAlert, showSuccessAlert } from "@/utils/alerts";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { email, password };

    try {
      const response = await fetch("https://bildy-rpmaya.koyeb.app/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Registro exitoso:", result);

        localStorage.setItem("jwt", result.token);
        localStorage.setItem("email", email);

        showSuccessAlert("¡Registro exitoso! Ahora valida tu cuenta.");
        router.push("/validation");
      } else {
        const error = await response.json();
        console.log("Error en respuesta:", error);
        showErrorAlert(`Error: ${error.message || "Ocurrió un problema con el registro."}`);
      }
    } catch (err) {
      console.error("Error en la solicitud:", err);
      showErrorAlert("Hubo un problema con el registro.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
      <form className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">Crear Cuenta</h2>

        <div className="mb-6">
          <label htmlFor="email" className="block text-sm font-semibold text-gray-600">
            Correo Electrónico
          </label>
          <input
            id="email"
            type="email"
            placeholder="tucorreo@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-semibold text-gray-600">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            placeholder="Tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200"
        >
          Registrarse
        </button>

        <p className="mt-6 text-sm text-center text-gray-600">
          ¿Ya tienes cuenta?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-blue-500 cursor-pointer hover:underline"
          >
            Inicia sesión aquí
          </span>
        </p>
      </form>
    </div>
  );
}