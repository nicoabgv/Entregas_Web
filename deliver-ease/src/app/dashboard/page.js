"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/navigation";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { confirmDeleteClient, confirmDeleteProject, showErrorAlert, showSuccessAlert } from "@/utils/alerts";

// Función genérica para realizar solicitudes a la API
const fetchData = async (url, method = "GET", body = null) => {
  const token = localStorage.getItem("jwt");
  try {
    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : null,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al realizar la solicitud.");
    }

    return response.json();
  } catch (err) {
    console.error("Error en la solicitud:", err);
    showErrorAlert("Hubo un problema al realizar la solicitud.");
    throw err;
  }
};

// Componente principal del dashboard
export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("Resumen");

  // Estados para almacenar datos de clientes, proyectos y albaranes
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [deliveryNotes, setDeliveryNotes] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [newMaterial, setNewMaterial] = useState(""); 

  // Estados relacionados con búsquedas y selección
  const [searchClient, setSearchClient] = useState("");
  const [searchProject, setSearchProject] = useState("");
  const [searchDeliveryNote, setSearchDeliveryNote] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Estado para las estadísticas generales
  const [stats, setStats] = useState({
    totalClients: 0,
    totalProjects: 0,
    totalDeliveryNotes: 0,
  });

  const router = useRouter();

  // Cargar datos iniciales (clientes, proyectos y albaranes)
  useEffect(() => {
    const loadData = async () => {
      const token = localStorage.getItem("jwt");
      if (!token) {
        showErrorAlert("Por favor, inicia sesión.");
        router.push("/login");
        return;
      }

      try {
        const headers = { Authorization: `Bearer ${token}` };

        const materialsResponse = await fetch("https://bildy-rpmaya.koyeb.app/api/material", {
          method: "GET",
          headers,
        });
        const materialsData = await materialsResponse.json();
        setMaterials(materialsData);

        // Obtener clientes
        const clientsResponse = await fetch("https://bildy-rpmaya.koyeb.app/api/client", {
          method: "GET",
          headers,
        });
        const clientsData = await clientsResponse.json();
        setClients(clientsData);

        // Obtener proyectos
        const projectsResponse = await fetch("https://bildy-rpmaya.koyeb.app/api/project", {
          method: "GET",
          headers,
        });
        const projectsData = await projectsResponse.json();
        setProjects(projectsData);

        // Obtener albaranes
        const deliveryNotesResponse = await fetch("https://bildy-rpmaya.koyeb.app/api/deliverynote", {
          method: "GET",
          headers,
        });
        const deliveryNotesData = await deliveryNotesResponse.json();
        setDeliveryNotes(deliveryNotesData);

        // Actualizar estadísticas
        setStats({
          totalClients: clientsData.length,
          totalProjects: projectsData.length,
          totalDeliveryNotes: deliveryNotesData.length,
        });
      } catch (error) {
        console.error("Error al cargar los datos:", error);
        showErrorAlert("Hubo un problema al cargar los datos.");
      }
    };

    loadData();
  }, [router]);

  const goToSection = (section) => setActiveSection(section);

  const handleAddMaterial = async () => {
    if (!newMaterial.trim()) {
      showErrorAlert("Por favor, ingresa un nombre para el material.");
      return;
    }

    try {
      const response = await fetch("https://bildy-rpmaya.koyeb.app/api/material", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({ name: newMaterial }),
      });

      if (response.ok) {
        const newMaterialData = await response.json();
        setMaterials([...materials, newMaterialData]);
        setNewMaterial("");
        showSuccessAlert("Material agregado con éxito.");
      } else {
        const errorData = await response.json();
        showErrorAlert(errorData.message || "Error al agregar el material.");
      }
    } catch (err) {
      console.error("Error al agregar el material:", err);
      showErrorAlert("Hubo un problema al agregar el material.");
    }
  };

  // Seleccionar un cliente y abrir el modal
  const handleSelectClient = async (id) => {
    try {
      const clientData = await fetchData(`https://bildy-rpmaya.koyeb.app/api/client/${id}`);
      setSelectedClient(clientData);
      setDrawerOpen(true);
    } catch (err) {
      showErrorAlert(err.message || "Error al seleccionar el cliente.");
    }
  };

  // Eliminar un cliente
  const handleDeleteClient = async (id) => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/client/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        showSuccessAlert("Cliente eliminado", "El cliente ha sido eliminado correctamente.");
        setClients((prev) => prev.filter((client) => client._id !== id));
      } else {
        const errorData = await response.json();
        showErrorAlert("Error al eliminar cliente", errorData.message);
      }
    } catch (err) {
      showErrorAlert("Error al eliminar cliente", "Ocurrió un problema al eliminar el cliente.");
    }
  };

  // Eliminar un proyecto
  const handleDeleteProject = async (id) => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/project/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        showSuccessAlert("Proyecto eliminado", "El proyecto ha sido eliminado correctamente.");
        setProjects((prev) => prev.filter((project) => project._id !== id));
      } else {
        const errorData = await response.json();
        showErrorAlert("Error al eliminar proyecto", errorData.message);
      }
    } catch (err) {
      showErrorAlert("Error al eliminar proyecto", "Ocurrió un problema al eliminar el proyecto.");
    }
  };

  // Crear un nuevo albarán asociado a un proyecto
  const handleCreateDeliveryNote = (projectId, clientId) => {
    if (!clientId) {
      showErrorAlert("Este proyecto no tiene un cliente asociado.");
      return;
    }
    router.push(`/deliverynotes/create/${projectId}?clientId=${clientId}`);
  };

  // Navegar a la página para crear un cliente
  const handleCreateClient = () => router.push("/create-client");

  // Navegar a la página para editar un cliente
  const handleEditClient = (id) => router.push(`/edit-client/${id}`);

  // Filtrar clientes según búsqueda
  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchClient.toLowerCase())
  );

  // Filtrar proyectos según búsqueda
  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchProject.toLowerCase())
  );

  // Filtrar albaranes según búsqueda
  const filteredDeliveryNotes = deliveryNotes.filter((note) => {
    const projectName = note.projectId?.name?.toLowerCase() || "";
    const clientId = note.clientId?.toLowerCase() || "";
    const searchTerm = searchDeliveryNote.toLowerCase();

    return (
      projectName.includes(searchTerm) ||
      clientId.includes(searchTerm) ||
      note.description.toLowerCase().includes(searchTerm)
    );
  });

  // Cerrar el modal
  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedClient(null);
  };

  // Descargar un PDF del albarán
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
      const link = document.createElement("a");
      link.href = url;
      link.download = `deliverynote-${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Error al descargar el PDF:", err);
      showErrorAlert("Hubo un problema al descargar el PDF.");
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar onSectionChange={(section) => setActiveSection(section)} />
  
      <main className="flex-1 p-8 bg-gray-100 dark:bg-gray-900">
        {activeSection === "Resumen" && (
          <div>
            <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-6">Resumen</h1>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Clientes</h2>
                <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{stats.totalClients}</p>
                <p className="text-gray-500 dark:text-gray-400">Total de clientes registrados</p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Proyectos</h2>
                <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{stats.totalProjects}</p>
                <p className="text-gray-500 dark:text-gray-400">Proyectos activos</p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Albaranes</h2>
                <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{stats.totalDeliveryNotes}</p>
                <p className="text-gray-500 dark:text-gray-400">Albaranes generados</p>
              </div>
            </div>

            {/* Listas Resumidas */}
            <div className="mt-8 grid grid-cols-3 gap-6">
              {/* Clientes */}
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Clientes Recientes</h2>
                <ul className="space-y-2">
                  {clients.slice(0, 5).map((client) => (
                    <li key={client._id} className="text-gray-600 dark:text-gray-300">
                      {client.name} - {client.cif}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => goToSection("Clientes")}
                  className="mt-4 text-blue-600 dark:text-blue-400 underline"
                >
                  Ver todos los clientes
                </button>
              </div>

              {/* Proyectos */}
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Proyectos Recientes</h2>
                <ul className="space-y-2">
                  {projects.slice(0, 5).map((project) => (
                    <li key={project._id} className="text-gray-600 dark:text-gray-300">
                      {project.name} - {project.projectCode}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => goToSection("Proyectos")}
                  className="mt-4 text-blue-600 dark:text-blue-400 underline"
                >
                  Ver todos los proyectos
                </button>
              </div>

              {/* Albaranes */}
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Últimos Albaranes</h2>
                <ul className="space-y-2">
                  {deliveryNotes.slice(0, 5).map((note) => (
                    <li key={note._id} className="text-gray-600 dark:text-gray-300">
                      {note.description} - {note.workdate || "Sin fecha"}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => goToSection("Albaranes")}
                  className="mt-4 text-blue-600 dark:text-blue-400 underline"
                >
                  Ver todos los albaranes
                </button>
              </div>
            </div>
          </div>
        )}
        {activeSection === "Clientes" && (
          <div>
            <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">Clientes</h1>
            <button
              onClick={handleCreateClient}
              className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800"
            >
              Crear Cliente
            </button>
            <input
              type="text"
              placeholder="Buscar cliente por nombre..."
              value={searchClient}
              onChange={(e) => setSearchClient(e.target.value)}
              className="mb-4 p-2 border rounded w-full dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
            />
            {filteredClients.length > 0 ? (
              <ul className="space-y-4">
                {filteredClients.map((client) => (
                  <li
                    key={client._id}
                    className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md flex items-center space-x-4 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    {/* Logo del cliente */}
                    {client.logo && (
                      <img
                        src={client.logo}
                        alt={`Logo de ${client.name}`}
                        className="w-16 h-16 object-cover rounded-full"
                      />
                    )}

                    {/* Información del cliente */}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400">{client.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">CIF: {client.cif}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Dirección: {client.address.street}, {client.address.city}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Proyectos Activos:{" "}
                        <span className="text-blue-500 dark:text-blue-300">{client.activeProjects}</span>
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Albaranes Pendientes:{" "}
                        <span className="text-red-500 dark:text-red-300">{client.pendingDeliveryNotes}</span>
                      </p>
                    </div>
                   {/* Botones de acciones */}
                   <div className="flex space-x-2">
                    <button
                      onClick={() => handleSelectClient(client._id)}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
                    >
                      Ver
                    </button>
                    <button
                      onClick={() => handleEditClient(client._id)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => confirmDeleteClient(client._id, client.name, handleDeleteClient)}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
                    >
                      Eliminar
                    </button>
                  </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-700 dark:text-gray-300">No se encontraron clientes.</p>
            )}
          </div>
        )}
        {drawerOpen && selectedClient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
            <div className="relative h-full w-1/2 bg-white dark:bg-gray-800 shadow-2xl p-6 overflow-y-auto">
              <button
                onClick={handleCloseDrawer}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 text-xl"
              >
                ✕
              </button>
              <h2 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-6 border-b pb-2">
                Proyectos del cliente
              </h2>
              <div className="grid grid-cols-1 gap-8">
                {/* Botón para crear un nuevo proyecto */}
                <div className="mb-4">
                  <button
                    onClick={() => router.push(`/projects/create/${selectedClient._id}`)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                  >
                    Crear Proyecto
                  </button>
                </div>

                {/* Proyectos Asociados */}
                <div>
                  {projects.filter((project) => project.clientId === selectedClient._id).length > 0 ? (
                    <table className="w-full bg-white dark:bg-gray-800 shadow-md rounded-lg">
                      <thead className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                        <tr>
                          <th className="p-4 text-left whitespace-nowrap">Nombre</th>
                          <th className="p-4 text-left whitespace-nowrap">Código</th>
                          <th className="p-4 text-left whitespace-nowrap">Dirección</th>
                          <th className="p-4 text-left w-1/4">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projects
                          .filter((project) => project.clientId === selectedClient._id)
                          .map((project, idx) => (
                            <tr
                              key={project._id}
                              className={`border-t ${
                                idx % 2 === 0 ? "bg-gray-50 dark:bg-gray-700" : "bg-gray-100 dark:bg-gray-800"
                              }`}
                            >
                              <td className="p-4 text-gray-700 dark:text-gray-200 whitespace-nowrap">
                                {project.name}
                              </td>
                              <td className="p-4 text-gray-700 dark:text-gray-200 whitespace-nowrap">
                                {project.projectCode}
                              </td>
                              <td className="p-4 text-gray-700 dark:text-gray-200 whitespace-nowrap">
                                {project.address?.street}, {project.address?.city}
                              </td>
                              <td className="p-4 w-1/4">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => router.push(`/projects/project/${project._id}`)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
                                  >
                                    Ver
                                  </button>
                                  <button
                                    onClick={() =>
                                      router.push(`/projects/edit/${selectedClient._id}/${project._id}`)
                                    }
                                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700"
                                  >
                                    Editar
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProject(project._id)}
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
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
                    <p className="text-gray-700 dark:text-gray-300">No hay proyectos disponibles para este cliente.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        {activeSection === "Proyectos" && (
          <div>
            <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">Proyectos</h1>
            <input
              type="text"
              placeholder="Buscar proyecto por nombre..."
              value={searchProject}
              onChange={(e) => setSearchProject(e.target.value)}
              className="mb-4 p-2 border rounded w-full dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
            />
            {filteredProjects.length > 0 ? (
              <ul className="space-y-4">
                {filteredProjects.map((project) => (
                  <li
                    key={project._id}
                    className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400">{project.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Código: {project.projectCode}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Dirección: {project.address.street}, {project.address.city}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => router.push(`/projects/project/${project._id}`)}
                          className="bg-blue-500 px-4 py-2 rounded text-white hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
                        >
                          Ver
                        </button>
                        <button
                          onClick={() => router.push(`/projects/edit/${project.clientId}/${project._id}`)}
                          className="bg-yellow-500 px-4 py-2 rounded text-white hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => confirmDeleteProject(project._id, project.name, handleDeleteProject)}
                          className="bg-red-600 px-4 py-2 rounded text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
                        >
                          Eliminar
                        </button>
                        <button
                          onClick={() => handleCreateDeliveryNote(project._id, project.clientId)}
                          className="bg-green-500 px-4 py-2 rounded text-white hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800"
                        >
                          Crear Albarán
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-700 dark:text-gray-300">No se encontraron proyectos.</p>
            )}
          </div>
        )}
        {activeSection === "Albaranes" && (
          <div>
            <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">Albaranes</h1>
            <input
              type="text"
              placeholder="Buscar albarán por nombre del proyecto, cliente o descripción..."
              value={searchDeliveryNote}
              onChange={(e) => setSearchDeliveryNote(e.target.value)}
              className="mb-4 p-2 border rounded w-full dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
            />
            {filteredDeliveryNotes.length > 0 ? (
              <table className="w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  <tr>
                    <th className="p-4 text-left">ID</th>
                    <th className="p-4 text-left">Nombre del Proyecto</th>
                    <th className="p-4 text-left">Cliente ID</th>
                    <th className="p-4 text-left">Descripción</th>
                    <th className="p-4 text-left">Fecha de Trabajo</th>
                    <th className="p-4 text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDeliveryNotes.map((note) => (
                    <tr key={note._id} className="border-t dark:border-gray-600">
                      <td className="p-4 text-gray-700 dark:text-gray-200">{note._id}</td>
                      <td className="p-4 text-gray-700 dark:text-gray-200">{note.projectId?.name || "Sin nombre"}</td>
                      <td className="p-4 text-gray-700 dark:text-gray-200">{note.clientId}</td>
                      <td className="p-4 text-gray-700 dark:text-gray-200">{note.description}</td>
                      <td className="p-4 text-gray-700 dark:text-gray-200">{note.workdate || "Sin fecha"}</td>
                      <td className="p-4 flex space-x-2">
                        <button
                          onClick={() => router.push(`/deliverynotes/${note._id}`)}
                          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
                        >
                          Ver
                        </button>
                        <button
                          onClick={() => handleDownloadDeliveryNotePDF(note._id)}
                          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-800"
                        >
                          Descargar PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-700 dark:text-gray-300">No se encontraron albaranes.</p>
            )}
          </div>
        )}
        {activeSection === "Ajustes" && (
          <div>
            <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-6">Ajustes</h1>
            <p className="text-gray-500 dark:text-gray-300 mb-4">Personaliza tu experiencia en DeliverEase.</p>

            <div className="grid grid-cols-2 gap-4">
              {/* Configuración del tema */}
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Tema</h2>
                <p className="text-gray-500 dark:text-gray-300">Elige el tema de la aplicación:</p>
                <ThemeSwitcher />
              </div>

              {/* Configuración de notificaciones */}
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Notificaciones</h2>
                <p className="text-gray-500 dark:text-gray-300">Activa o desactiva las notificaciones:</p>
                <div className="mt-4 flex items-center">
                  <label htmlFor="notifications" className="mr-4 text-gray-700 dark:text-gray-300">
                    Notificaciones:
                  </label>
                  <input
                    id="notifications"
                    type="checkbox"
                    className="h-6 w-6 text-blue-600 dark:text-blue-400 focus:ring-blue-500 rounded"
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      alert(
                        isChecked
                          ? "Notificaciones activadas"
                          : "Notificaciones desactivadas"
                      );
                    }}
                  />
                </div>
              </div>

              {/* Sección para agregar un nuevo material */}
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Añadir Material</h2>
                <input
                  type="text"
                  value={newMaterial}
                  onChange={(e) => setNewMaterial(e.target.value)}
                  placeholder="Nombre del material"
                  className="p-2 border rounded w-full mb-4 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                />
                <button
                  onClick={handleAddMaterial}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 transition duration-200"
                >
                  Agregar Material
                </button>
              </div>

              {/* Listado de materiales */}
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Materiales Disponibles</h2>

                {/* Contenedor de los materiales con un max-height y scroll */}
                <div className="max-h-60 overflow-y-auto mt-5">
                  {materials.length > 0 ? (
                    materials.map((material) => (
                      <div key={material._id} className="text-gray-600 dark:text-gray-300 py-2">
                        {material.name}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600 dark:text-gray-300">No hay materiales disponibles.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}