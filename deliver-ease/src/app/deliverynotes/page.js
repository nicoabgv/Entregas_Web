"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { showErrorAlert, showSuccessAlert } from "@/utils/alerts";

export default function DeliveryNotesPage() {
  const [deliveryNotes, setDeliveryNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      showErrorAlert("Por favor, inicia sesión.");
      router.push("/login");
      return;
    }

    fetch("https://bildy-rpmaya.koyeb.app/api/deliverynote", {
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
  }, [router]);

  const filteredDeliveryNotes = deliveryNotes.filter((note) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      note.code?.toLowerCase().includes(searchTerm) ||
      note.name?.toLowerCase().includes(searchTerm) ||
      note.client?.toLowerCase().includes(searchTerm) ||
      note.status?.toLowerCase().includes(searchTerm)
    );
  });

  const handleCreateDeliveryNote = () => {
    router.push("/deliverynotes/create");
  };

  const handleViewDeliveryNote = (id) => {
    router.push(`/deliverynotes/${id}`);
  };

  const handleDownloadDeliveryNotePDF = async (id) => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/deliverynote/pdf/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al descargar el PDF.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Crear enlace temporal para descargar
      const link = document.createElement("a");
      link.href = url;
      link.download = `deliverynote-${id}.pdf`;
      document.body.appendChild(link);
      link.click();

      // Limpiar recursos
      link.remove();
      window.URL.revokeObjectURL(url);

      // Mostrar alerta de éxito
      showSuccessAlert("El PDF se descargó correctamente.");
    } catch (err) {
      console.error("Error al descargar el PDF:", err);
      showErrorAlert("Hubo un problema al descargar el PDF.");
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-800 dark:to-gray-900 min-h-screen">
      <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-8 text-center">
        Gestión de Albaranes
      </h1>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <input
          type="text"
          placeholder="Buscar albarán por código, nombre, cliente o estado..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-3 border rounded-md w-full md:w-1/2 shadow-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
        />
        <button
          onClick={handleCreateDeliveryNote}
          className="px-6 py-3 bg-green-600 dark:bg-green-700 text-white rounded-md shadow-md hover:bg-green-700 dark:hover:bg-green-800 focus:ring-2 focus:ring-green-400 dark:focus:ring-green-600 transition duration-200"
        >
          Crear Albarán
        </button>
      </div>
      {filteredDeliveryNotes.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-md text-center text-gray-500 dark:text-gray-400">
          <p>No se encontraron albaranes. Intenta con otros términos de búsqueda.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white dark:bg-gray-800 shadow-md rounded-lg">
            <thead className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
              <tr>
                <th className="p-4 text-left">Código</th>
                <th className="p-4 text-left">Nombre</th>
                <th className="p-4 text-left">Cliente</th>
                <th className="p-4 text-left">Estado</th>
                <th className="p-4 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeliveryNotes.map((note, idx) => (
                <tr
                  key={note._id}
                  className={`border-t ${
                    idx % 2 === 0 ? "bg-gray-50 dark:bg-gray-700" : "bg-gray-100 dark:bg-gray-600"
                  }`}
                >
                  <td className="p-4 text-gray-700 dark:text-gray-300">{note.code || "Sin código"}</td>
                  <td className="p-4 text-gray-700 dark:text-gray-300">{note.name || "Sin nombre"}</td>
                  <td className="p-4 text-gray-700 dark:text-gray-300">{note.client || "Desconocido"}</td>
                  <td className="p-4 text-gray-700 dark:text-gray-300">{note.status || "Sin estado"}</td>
                  <td className="p-4 flex space-x-2">
                    <button
                      onClick={() => handleViewDeliveryNote(note._id)}
                      className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition duration-200"
                    >
                      Ver
                    </button>
                    <button
                      onClick={() => handleDownloadDeliveryNotePDF(note._id)}
                      className="px-4 py-2 bg-gray-500 dark:bg-gray-600 text-white rounded hover:bg-gray-600 dark:hover:bg-gray-700 focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 transition duration-200"
                    >
                      Descargar PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}