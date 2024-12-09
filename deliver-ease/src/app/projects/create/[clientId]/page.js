"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { showErrorAlert, showSuccessAlert } from "@/utils/alerts";

export default function CreateProjectPage() {
  const { clientId } = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    projectCode: "",
    email: "",
    address: {
      street: "",
      number: "",
      postal: "",
      city: "",
      province: "",
    },
    code: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("address.")) {
      const addressField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwt");
    if (!token) {
      showErrorAlert("Por favor, inicia sesión.");
      router.push("/login");
      return;
    }

    const projectData = {
      ...formData,
      clientId,
    };

    try {
      const response = await fetch("https://bildy-rpmaya.koyeb.app/api/project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess("Proyecto creado con éxito.");
        showSuccessAlert("Proyecto creado con éxito.");
        setTimeout(() => router.push(`/dashboard`), 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Error al crear el proyecto.");
        showErrorAlert(errorData.message || "Error al crear el proyecto.");
      }
    } catch (err) {
      console.error("Error al crear proyecto:", err);
      setError("Hubo un problema al crear el proyecto.");
      showErrorAlert("Hubo un problema al crear el proyecto.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-6">Crear Proyecto</h1>
      {error && <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>}
      {success && <p className="text-green-500 dark:text-green-400 mb-4">{success}</p>}
      <form
        className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
        onSubmit={handleSubmit}
      >
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Nombre</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded p-2 text-gray-700 dark:text-gray-300 dark:bg-gray-700 focus:ring focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
            Código del Proyecto
          </label>
          <input
            type="text"
            name="projectCode"
            value={formData.projectCode}
            onChange={handleChange}
            className="w-full border rounded p-2 text-gray-700 dark:text-gray-300 dark:bg-gray-700 focus:ring focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
            Código Interno
          </label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            className="w-full border rounded p-2 text-gray-700 dark:text-gray-300 dark:bg-gray-700 focus:ring focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
            Correo Electrónico
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded p-2 text-gray-700 dark:text-gray-300 dark:bg-gray-700 focus:ring focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Dirección</label>
          <input
            type="text"
            name="address.street"
            value={formData.address.street}
            onChange={handleChange}
            placeholder="Calle"
            className="w-full border rounded p-2 mb-2 text-gray-700 dark:text-gray-300 dark:bg-gray-700 focus:ring focus:ring-blue-500"
          />
          <input
            type="text"
            name="address.number"
            value={formData.address.number}
            onChange={handleChange}
            placeholder="Número"
            className="w-full border rounded p-2 mb-2 text-gray-700 dark:text-gray-300 dark:bg-gray-700 focus:ring focus:ring-blue-500"
          />
          <input
            type="text"
            name="address.postal"
            value={formData.address.postal}
            onChange={handleChange}
            placeholder="Código Postal"
            className="w-full border rounded p-2 mb-2 text-gray-700 dark:text-gray-300 dark:bg-gray-700 focus:ring focus:ring-blue-500"
          />
          <input
            type="text"
            name="address.city"
            value={formData.address.city}
            onChange={handleChange}
            placeholder="Ciudad"
            className="w-full border rounded p-2 mb-2 text-gray-700 dark:text-gray-300 dark:bg-gray-700 focus:ring focus:ring-blue-500"
          />
          <input
            type="text"
            name="address.province"
            value={formData.address.province}
            onChange={handleChange}
            placeholder="Provincia"
            className="w-full border rounded p-2 text-gray-700 dark:text-gray-300 dark:bg-gray-700 focus:ring focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Crear Proyecto
        </button>
      </form>
    </div>
  );
}