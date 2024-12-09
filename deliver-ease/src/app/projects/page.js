"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { showErrorAlert } from "@/utils/alerts";

export default function ProjectDetails() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      showErrorAlert("Por favor, inicia sesión.");
      router.push("/login");
      return;
    }

    fetch(`https://bildy-rpmaya.koyeb.app/api/project/one/${projectId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setProject(data))
      .catch((err) => {
        console.error("Error al obtener proyecto:", err);
        showErrorAlert("Hubo un problema al obtener los datos del proyecto.");
      });
  }, [projectId, router]);

  if (!project) {
    return <p className="text-center mt-10">Cargando proyecto...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-8 rounded shadow-lg w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">
          {project.name}
        </h1>
        <p className="text-gray-700 dark:text-gray-300">
          <strong>Código del Proyecto:</strong> {project.projectCode}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <strong>Código Interno:</strong> {project.code}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <strong>Dirección:</strong> {project.address.street}, {project.address.city}, {project.address.province}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <strong>Notas:</strong> {project.notes || "Sin notas"}
        </p>
        <button
          onClick={() => router.back()}
          className="mt-6 px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-700"
        >
          Volver
        </button>
      </div>
    </div>
  );
}