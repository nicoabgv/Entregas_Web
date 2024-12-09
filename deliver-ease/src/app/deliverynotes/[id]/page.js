"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { showErrorAlert } from "@/utils/alerts";

export default function DeliveryNoteDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [deliveryNote, setDeliveryNote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      showErrorAlert("Por favor, inicia sesión.");
      router.push("/login");
      return;
    }

    fetch(`https://bildy-rpmaya.koyeb.app/api/deliverynote/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setDeliveryNote(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al obtener el albarán:", err);
        showErrorAlert("Hubo un problema al cargar los datos del albarán.");
        setLoading(false);
      });
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!deliveryNote) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-800">
        <p className="text-lg text-gray-700 dark:text-gray-200">
          No se encontraron datos para este albarán.
        </p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-6">
          Detalles del Albarán {deliveryNote.projectName || "No especificado"}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">ID</p>
            <p className="text-gray-800 dark:text-gray-200">{deliveryNote._id}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Descripción</p>
            <p className="text-gray-800 dark:text-gray-200">{deliveryNote.description || "No especificada"}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Formato</p>
            <p className="text-gray-800 dark:text-gray-200">{deliveryNote.format}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Material</p>
            <p className="text-gray-800 dark:text-gray-200">{deliveryNote.material || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Horas</p>
            <p className="text-gray-800 dark:text-gray-200">{deliveryNote.hours || "0"}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Fecha</p>
            <p className="text-gray-800 dark:text-gray-200">{deliveryNote.date || "No especificada"}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Email del proyecto</p>
            <p className="text-gray-800 dark:text-gray-200">{deliveryNote.projectEmail || "No disponible"}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Cliente</p>
            <p className="text-gray-800 dark:text-gray-200">{deliveryNote.client.name || "Desconocido"}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Dirección del Cliente</p>
            <p className="text-gray-800 dark:text-gray-200">
              {deliveryNote.client.address.street}, {deliveryNote.client.address.city},{" "}
              {deliveryNote.client.address.province}
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Proyecto</p>
            <p className="text-gray-800 dark:text-gray-200">{deliveryNote.project || "Sin proyecto asociado"}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-blue-600 dark:bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-700 dark:hover:bg-blue-800 transition duration-200"
          >
            Volver a la lista
          </button>
        </div>
      </div>
    </div>
  );
}