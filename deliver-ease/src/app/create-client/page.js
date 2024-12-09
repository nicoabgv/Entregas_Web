"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { showSuccessAlert, showErrorAlert, showWarningAlert } from "@/utils/alerts";

export default function CreateClient() {
  const [name, setName] = useState("");
  const [cif, setCif] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [postal, setPostal] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const data = {
      name,
      cif,
      address: { street, number, postal, city, province },
    };
  
    const token = localStorage.getItem("jwt");
    if (!token) {
      showWarningAlert(
        "Inicio de sesión requerido",
        "Por favor, inicia sesión para continuar."
      ).then(() => {
        router.push("/login");
      });
      return;
    }
  
    try {
      const response = await fetch("https://bildy-rpmaya.koyeb.app/api/client", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        showSuccessAlert("Cliente creado", "El cliente se ha creado con éxito.").then(() => {
          router.push("/dashboard");
        });
      } else {
        const error = await response.json();
        showErrorAlert(
          "Error al crear cliente",
          error.message || "No se pudo crear el cliente. Por favor, inténtalo de nuevo.",
          `Código de error: ${response.status}`
        );
      }
    } catch (err) {
      console.error("Error al crear cliente:", err);
      showErrorAlert(
        "Error del servidor",
        "Hubo un problema al crear el cliente. Por favor, inténtalo más tarde.",
        "Consulta la consola para más detalles."
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600">
      <form className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md" onSubmit={handleSubmit}>
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-700 dark:text-gray-200">
          Crear Cliente
        </h2>
  
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-semibold text-gray-600 dark:text-gray-300">
            Nombre
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ingresa el nombre del cliente"
            className="mt-2 w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
  
        <div className="mb-4">
          <label htmlFor="cif" className="block text-sm font-semibold text-gray-600 dark:text-gray-300">
            CIF
          </label>
          <input
            id="cif"
            type="text"
            value={cif}
            onChange={(e) => setCif(e.target.value)}
            placeholder="Ingresa el CIF"
            className="mt-2 w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
  
        <div className="mb-4">
          <label htmlFor="street" className="block text-sm font-semibold text-gray-600 dark:text-gray-300">
            Calle
          </label>
          <input
            id="street"
            type="text"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            placeholder="Ingresa la calle"
            className="mt-2 w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
  
        <div className="mb-4">
          <label htmlFor="number" className="block text-sm font-semibold text-gray-600 dark:text-gray-300">
            Número
          </label>
          <input
            id="number"
            type="text"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="Número de la dirección"
            className="mt-2 w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
  
        <div className="mb-4">
          <label htmlFor="postal" className="block text-sm font-semibold text-gray-600 dark:text-gray-300">
            Código Postal
          </label>
          <input
            id="postal"
            type="text"
            value={postal}
            onChange={(e) => setPostal(e.target.value)}
            placeholder="Código postal"
            className="mt-2 w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
  
        <div className="mb-4">
          <label htmlFor="city" className="block text-sm font-semibold text-gray-600 dark:text-gray-300">
            Ciudad
          </label>
          <input
            id="city"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Ciudad"
            className="mt-2 w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
  
        <div className="mb-6">
          <label htmlFor="province" className="block text-sm font-semibold text-gray-600 dark:text-gray-300">
            Provincia
          </label>
          <input
            id="province"
            type="text"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            placeholder="Provincia"
            className="mt-2 w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
  
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg shadow-md hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-all"
        >
          Crear Cliente
        </button>
      </form>
    </div>
  );
}