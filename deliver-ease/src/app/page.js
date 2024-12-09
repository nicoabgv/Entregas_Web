"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { showErrorAlert, showSuccessAlert } from "@/utils/alerts";

export default function LandingPage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const toggleLogin = () => {
    setIsLoginOpen(!isLoginOpen);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://bildy-rpmaya.koyeb.app/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        showErrorAlert("Error al iniciar sesión", errorData.message || "Credenciales incorrectas.");
        return;
      }

      const data = await response.json();
      localStorage.setItem("jwt", data.token);

      await showSuccessAlert("¡Inicio de sesión exitoso!", "Redirigiendo al dashboard...");
      router.push("/dashboard");
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      showErrorAlert("Error inesperado", "Hubo un problema al iniciar sesión. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <header className="w-full p-4 bg-blue-600 text-white flex justify-between items-center">
        <h1 className="text-2xl font-bold">DeliverEase</h1>
        <button
          onClick={toggleLogin}
          className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-200"
        >
          {isLoginOpen ? "Cerrar" : "Iniciar Sesión"}
        </button>
      </header>

      <main className="flex-1 w-full flex flex-col items-center justify-center p-6">
        {!isLoginOpen && (
          <>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Simplifica tu gestión con DeliverEase
            </h2>
            <p className="text-gray-600 mb-6 text-center max-w-md">
              Desde albaranes hasta proyectos, DeliverEase está diseñado para ayudarte a organizarlo
              todo en un solo lugar. ¡Comienza ahora!
            </p>
            <button
              onClick={toggleLogin}
              className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => router.push("/register")}
              className="mt-4 bg-gray-200 text-blue-600 px-6 py-3 rounded hover:bg-gray-300"
            >
              Registrarse
            </button>
          </>
        )}

        {isLoginOpen && (
          <div className="w-full max-w-md bg-white shadow-lg rounded p-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Inicia Sesión</h2>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-600 mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border rounded p-2"
                  placeholder="tucorreo@ejemplo.com"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-600 mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border rounded p-2 text-gray-800"
                  placeholder="Tu contraseña"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Iniciar Sesión
              </button>
            </form>
          </div>
        )}
      </main>

      <footer className="w-full bg-gray-800 text-white p-4 text-center">
        © 2024 DeliverEase. Gestiona más, preocúpate menos.
      </footer>
    </div>
  );
}