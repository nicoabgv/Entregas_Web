"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { showErrorAlert, showSuccessAlert } from "@/utils/alerts";

export default function CreateDeliveryNote() {
  const { projectId } = useParams();
  const router = useRouter();

  const [clientId, setClientId] = useState("");
  const [loading, setLoading] = useState(true);
  const [format, setFormat] = useState("material");
  const [material, setMaterial] = useState("");
  const [materialsList, setMaterialsList] = useState([]);
  const [hours, setHours] = useState(8);
  const [description, setDescription] = useState("");
  const [workDate, setWorkDate] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const clientIdFromQuery = searchParams.get("clientId");

    if (!projectId || !clientIdFromQuery) {
      showErrorAlert("Faltan datos necesarios para crear el albarán.");
      router.push("/dashboard");
      return;
    }

    setClientId(clientIdFromQuery);
    setLoading(false);
  }, [projectId, router]);

  // Obtener la lista de materiales
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const token = localStorage.getItem("jwt");
        if (!token) {
          throw new Error("Token de autenticación no encontrado.");
        }

        const response = await fetch("https://bildy-rpmaya.koyeb.app/api/material", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setMaterialsList(data);
        } else {
          throw new Error("No se pudieron cargar los materiales.");
        }
      } catch (error) {
        console.error("Error al cargar los materiales:", error);
        showErrorAlert("Error al cargar los materiales.");
      }
    };

    fetchMaterials();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!clientId) newErrors.clientId = "El cliente es obligatorio.";
    if (!projectId) newErrors.projectId = "El proyecto es obligatorio.";
    if (!description.trim()) newErrors.description = "La descripción es obligatoria.";
    if (!workDate) newErrors.workDate = "La fecha es obligatoria.";
    if (format === "material" && !material.trim()) {
      newErrors.material = "El material es obligatorio para el formato 'material'.";
    }
    if (format === "hours" && (!hours || hours <= 0)) {
      newErrors.hours = "Las horas son obligatorias y deben ser mayores a 0 para el formato 'hours'.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const token = localStorage.getItem("jwt");
    if (!token) {
      showErrorAlert("Por favor, inicia sesión.");
      router.push("/login");
      return;
    }

    const newDeliveryNote = {
      clientId,
      projectId,
      format,
      material: format === "material" ? material : "N/A",
      hours: format === "hours" ? hours : 0,
      description,
      workdate: workDate.split("-").reverse().join("/"),
    };

    try {
      const response = await fetch("https://bildy-rpmaya.koyeb.app/api/deliverynote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newDeliveryNote),
      });

      if (response.ok) {
        showSuccessAlert("Albarán creado con éxito.");
        router.push(`/projects/project/${projectId}`);
      } else {
        const error = await response.json();
        showErrorAlert(`Error: ${error.message || "No se pudo crear el albarán."}`);
      }
    } catch (err) {
      console.error("Error al crear albarán:", err);
      showErrorAlert("Hubo un problema al crear el albarán.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-gray-600">Cargando datos...</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-md shadow-md max-w-xl mx-auto"
    >
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 text-center">
        Crear Albarán
      </h1>
  
      <div>
        <label htmlFor="description" className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
          Descripción
        </label>
        <textarea
          id="description"
          className="w-full border-gray-300 dark:border-gray-700 rounded-md p-2 focus:ring focus:ring-blue-300 dark:focus:ring-blue-700 text-gray-700 dark:text-gray-200 dark:bg-gray-900"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          aria-invalid={!!errors.description}
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>
  
      <div>
        <label htmlFor="workDate" className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
          Fecha
        </label>
        <input
          id="workDate"
          type="date"
          className="w-full border-gray-300 dark:border-gray-700 rounded-md p-2 focus:ring focus:ring-blue-300 dark:focus:ring-blue-700 text-gray-700 dark:text-gray-200 dark:bg-gray-900"
          value={workDate}
          onChange={(e) => setWorkDate(e.target.value)}
          aria-invalid={!!errors.workDate}
        />
        {errors.workDate && <p className="text-red-500 text-sm mt-1">{errors.workDate}</p>}
      </div>
  
      <div>
        <label htmlFor="format" className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
          Formato
        </label>
        <select
          id="format"
          className="w-full border-gray-300 dark:border-gray-700 rounded-md p-2 focus:ring focus:ring-blue-300 dark:focus:ring-blue-700 text-gray-700 dark:text-gray-200 dark:bg-gray-900"
          value={format}
          onChange={(e) => setFormat(e.target.value)}
        >
          <option value="material">Material</option>
          <option value="hours">Horas</option>
        </select>
      </div>
  
      {format === "material" && (
        <div>
          <label htmlFor="material" className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
            Material
          </label>
          <select
            id="material"
            className="w-full border-gray-300 dark:border-gray-700 rounded-md p-2 focus:ring focus:ring-blue-300 dark:focus:ring-blue-700 text-gray-700 dark:text-gray-200 dark:bg-gray-900"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            aria-invalid={!!errors.material}
          >
            <option value="">Selecciona un material</option>
            {materialsList.map((mat) => (
              <option key={mat._id} value={mat._id}>
                {mat.name}
              </option>
            ))}
          </select>
          {errors.material && <p className="text-red-500 text-sm mt-1">{errors.material}</p>}
        </div>
      )}
  
      {format === "hours" && (
        <div>
          <label htmlFor="hours" className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
            Horas
          </label>
          <input
            id="hours"
            type="number"
            className="w-full border-gray-300 dark:border-gray-700 rounded-md p-2 focus:ring focus:ring-blue-300 dark:focus:ring-blue-700 text-gray-700 dark:text-gray-200 dark:bg-gray-900"
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            aria-invalid={!!errors.hours}
          />
          {errors.hours && <p className="text-red-500 text-sm mt-1">{errors.hours}</p>}
        </div>
      )}
  
      <button
        type="submit"
        className="w-full bg-blue-600 dark:bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring focus:ring-blue-300 dark:focus:ring-blue-700"
      >
        Crear Albarán
      </button>
    </form>
  );
}