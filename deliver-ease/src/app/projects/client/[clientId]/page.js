"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { showErrorAlert, showSuccessAlert } from "@/utils/alerts";

export default function ClientProjects() {
  const [projects, setProjects] = useState([]);
  const [clientId, setClientId] = useState("");
  const router = useRouter();

  const fetchProjects = async () => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      showErrorAlert("Por favor, inicia sesión.");
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/project/${clientId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProjects(data);
        showSuccessAlert("Proyectos cargados con éxito.");
      } else {
        showErrorAlert("No se pudieron obtener los proyectos.");
      }
    } catch (err) {
      console.error("Error al obtener proyectos:", err);
      showErrorAlert("Hubo un problema al obtener los proyectos.");
    }
  };

  useEffect(() => {
    if (clientId) {
      fetchProjects();
    }
  }, [clientId]);

  const handleCreateProject = () => {
    router.push(`/projects/create/${clientId}`);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        Proyectos del Cliente
      </h2>
  
      <button
        onClick={handleCreateProject}
        className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        Crear Proyecto
      </button>
  
      <div className="mt-4">
        {projects.length === 0 ? (
          <p className="text-gray-700 dark:text-gray-300">
            No hay proyectos disponibles para este cliente.
          </p>
        ) : (
          <ul>
            {projects.map((project) => (
              <li
                key={project._id}
                className="bg-gray-100 dark:bg-gray-800 p-4 rounded mb-4"
              >
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {project.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{project.projectCode}</p>
                <button
                  onClick={() => router.push(`/projects/${project._id}`)}
                  className="bg-green-500 text-white py-1 px-3 rounded-md hover:bg-green-600 dark:bg-green-400 dark:hover:bg-green-500 mt-2"
                >
                  Ver Proyecto
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}