"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { showErrorAlert, showSuccessAlert } from "@/utils/alerts";

export default function Validation() {
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (!storedEmail) {
      showErrorAlert("No se encontró un correo asociado. Regístrate nuevamente.");
      router.push("/register");
    } else {
      setEmail(storedEmail);
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("jwt");
    if (!token) {
      showErrorAlert("No se encontró un token de autenticación. Regístrate nuevamente.");
      router.push("/register");
      return;
    }

    const data = { email, code };

    try {
      const response = await fetch("https://bildy-rpmaya.koyeb.app/api/user/validation", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Validación exitosa:", result);

        showSuccessAlert("¡Cuenta validada exitosamente!");
        router.push("/login");
      } else {
        const error = await response.json();
        console.log("Error en respuesta:", error);
        showErrorAlert(`Error: ${error.message || "Código de validación incorrecto."}`);
      }
    } catch (err) {
      console.error("Error en la solicitud:", err);
      showErrorAlert("Hubo un problema al validar el código.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300">
      <form className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md" onSubmit={handleSubmit}>
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-700">Validar Código</h2>

        <p className="mb-6 text-sm text-gray-600 text-center">
          Valida tu cuenta asociada al correo: <strong className="text-blue-500">{email}</strong>
        </p>

        <div className="mb-6">
          <label htmlFor="code" className="block text-sm font-semibold text-gray-600">
            Código de Validación
          </label>
          <input
            id="code"
            type="text"
            placeholder="123456"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="mt-2 w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200"
        >
          Validar
        </button>
      </form>
    </div>
  );
}