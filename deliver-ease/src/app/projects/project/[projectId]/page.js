"use client";

import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { showErrorAlert, showSuccessAlert } from "@/utils/alerts";

export default function ProjectDetails() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [deliveryNotes, setDeliveryNotes] = useState([]);
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

    fetch(`https://bildy-rpmaya.koyeb.app/api/deliverynote?projectId=${projectId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setDeliveryNotes(data))
      .catch((err) => {
        console.error("Error al obtener albaranes:", err);
        showErrorAlert("Hubo un problema al obtener los albaranes.");
      });
  }, [projectId, router]);

  const handleDeleteDeliveryNote = async (id) => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      showErrorAlert("Por favor, inicia sesión.");
      router.push("/login");
      return;
    }

    try {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción eliminará el albarán y no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        const response = await fetch(
          `https://bildy-rpmaya.koyeb.app/api/deliverynote/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          showSuccessAlert("Albarán eliminado", "El albarán ha sido eliminado correctamente.");
          setDeliveryNotes((prev) => prev.filter((note) => note._id !== id));
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || "No se pudo eliminar el albarán.");
        }
      }
    } catch (err) {
      console.error("Error al eliminar albarán:", err);
      showErrorAlert("Error al eliminar albarán", err.message);
    }
  };

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
          <strong>Dirección:</strong> {project.address.street}, {project.address.city},{" "}
          {project.address.province}
        </p>

        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4">
            Albaranes Asociados
          </h2>
          {deliveryNotes.length > 0 ? (
            <table className="w-full bg-white dark:bg-gray-700 shadow-md rounded-lg">
              <thead className="bg-gray-200 dark:bg-gray-600">
                <tr>
                  <th className="p-4 text-left text-gray-700 dark:text-gray-300">Descripción</th>
                  <th className="p-4 text-left text-gray-700 dark:text-gray-300">Fecha</th>
                  <th className="p-4 text-left text-gray-700 dark:text-gray-300">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {deliveryNotes.map((note) => (
                  <tr key={note._id} className="border-t dark:border-gray-600">
                    <td className="p-4 text-gray-700 dark:text-gray-300">{note.description}</td>
                    <td className="p-4 text-gray-700 dark:text-gray-300">
                      {note.workdate || "Sin fecha"}
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => router.push(`/deliverynotes/${note._id}`)}
                          className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-700"
                        >
                          Ver
                        </button>
                        <button
                          onClick={() => handleDeleteDeliveryNote(note._id)}
                          className="px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded hover:bg-red-700 dark:hover:bg-red-800"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-700 dark:text-gray-300">
              No hay albaranes asociados a este proyecto.
            </p>
          )}
        </div>

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