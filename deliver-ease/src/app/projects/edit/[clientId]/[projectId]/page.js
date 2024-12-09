"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { showErrorAlert, showSuccessAlert } from "@/utils/alerts";

export default function EditProject() {
  const router = useRouter();
  const { clientId, projectId } = useParams();

  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProject = async () => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        throw new Error("No se encontró el token de autenticación.");
      }

      const response = await fetch(
        `https://bildy-rpmaya.koyeb.app/api/project/${clientId}/${projectId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setProject(data);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      console.error("Error al cargar el proyecto:", err);
      showErrorAlert("Error al cargar el proyecto", err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        throw new Error("No se encontró el token de autenticación.");
      }

      const response = await fetch(
        `https://bildy-rpmaya.koyeb.app/api/project/${projectId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(project),
        }
      );

      if (response.ok) {
        await showSuccessAlert(
          "¡Cambios guardados!",
          "El proyecto se ha actualizado correctamente."
        );
        router.push("/dashboard");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      console.error("Error al guardar el proyecto:", err);
      showErrorAlert("Error al guardar el proyecto", err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setProject((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value },
    }));
  };

  useEffect(() => {
    if (clientId && projectId) {
      fetchProject();
    }
  }, [clientId, projectId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-xl text-gray-500 dark:text-gray-400">
          Cargando datos del proyecto...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-xl text-red-500 dark:text-red-400">Error: {error}</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-xl text-gray-500 dark:text-gray-400">
          No se encontró el proyecto.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">
        Editar Proyecto
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Nombre del Proyecto
          </label>
          <input
            type="text"
            name="name"
            value={project.name || ""}
            onChange={handleInputChange}
            className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Código del Proyecto
          </label>
          <input
            type="text"
            name="projectCode"
            value={project.projectCode || ""}
            onChange={handleInputChange}
            className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-300"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Correo Electrónico
          </label>
          <input
            type="email"
            name="email"
            value={project.email || ""}
            onChange={handleInputChange}
            className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-300"
          />
        </div>
      </div>
      <div className="mt-8">
        <button
          onClick={handleSave}
          className="w-full bg-blue-600 text-white font-medium py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Guardar Cambios
        </button>
      </div>
    </div>
  );
}