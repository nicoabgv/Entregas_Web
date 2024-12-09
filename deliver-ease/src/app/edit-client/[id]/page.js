"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { showErrorAlert, showSuccessAlert } from "@/utils/alerts";

export default function EditClient() {
  const params = useParams();
  const router = useRouter();

  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    cif: "",
    street: "",
    number: "",
    postal: "",
    city: "",
    province: "",
    email: "",
    phone: "",
    notes: "",
  });

  // Obtener datos del cliente al cargar la página
  useEffect(() => {
    if (!params?.id) return;

    const token = localStorage.getItem("jwt");
    if (!token) {
      showErrorAlert("Por favor, inicia sesión.");
      router.push("/login");
      return;
    }

    fetch(`https://bildy-rpmaya.koyeb.app/api/client/${params.id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setClient(data);
        setFormData({
          name: data.name || "",
          cif: data.cif || "",
          street: data.address?.street || "",
          number: data.address?.number || "",
          postal: data.address?.postal || "",
          city: data.address?.city || "",
          province: data.address?.province || "",
          email: data.email || "",
          phone: data.phone || "",
          notes: data.notes || "",
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al obtener cliente:", err);
        showErrorAlert("Hubo un problema al cargar los datos del cliente.");
        setLoading(false);
      });
  }, [params?.id, router]);

  // Manejo de cambios en los campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem("jwt");
    if (!token) {
      showErrorAlert("Por favor, inicia sesión.");
      router.push("/login");
      return;
    }
  
    const data = {
      name: formData.name,
      cif: formData.cif,
      address: {
        street: formData.street,
        number: formData.number,
        postal: formData.postal,
        city: formData.city,
        province: formData.province,
      },
      email: formData.email,
      phone: formData.phone,
      notes: formData.notes,
    };
  
    try {
      const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/client/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        showSuccessAlert("¡Cliente actualizado con éxito!");
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        const error = await response.json();
        showErrorAlert(`Error: ${error.message || "No se pudo actualizar el cliente."}`);
      }
    } catch (err) {
      console.error("Error al actualizar cliente:", err);
      showErrorAlert("Hubo un problema al actualizar el cliente.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
      <form
        className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-2xl"
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600 dark:text-blue-400">
          Editar Cliente
        </h2>
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
          </div>
        ) : (
          client && (
            <>
              {successMessage && (
                <div className="mb-4 text-green-600 dark:text-green-400 font-semibold bg-green-100 dark:bg-green-800 p-2 rounded">
                  {successMessage}
                </div>
              )}
  
              <div className="grid grid-cols-2 gap-4">
                {/* Nombre */}
                <div className="mb-5">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Nombre
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-2 block w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900"
                  />
                </div>
  
                {/* CIF */}
                <div className="mb-5">
                  <label
                    htmlFor="cif"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    CIF
                  </label>
                  <input
                    id="cif"
                    name="cif"
                    type="text"
                    value={formData.cif}
                    onChange={handleChange}
                    className="mt-2 block w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900"
                  />
                </div>
  
                {/* Calle */}
                <div className="mb-5">
                  <label
                    htmlFor="street"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Calle
                  </label>
                  <input
                    id="street"
                    name="street"
                    type="text"
                    value={formData.street}
                    onChange={handleChange}
                    className="mt-2 block w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900"
                  />
                </div>
  
                {/* Número */}
                <div className="mb-5">
                  <label
                    htmlFor="number"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Número
                  </label>
                  <input
                    id="number"
                    name="number"
                    type="text"
                    value={formData.number}
                    onChange={handleChange}
                    className="mt-2 block w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900"
                  />
                </div>
  
                {/* Código Postal */}
                <div className="mb-5">
                  <label
                    htmlFor="postal"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Código Postal
                  </label>
                  <input
                    id="postal"
                    name="postal"
                    type="text"
                    value={formData.postal}
                    onChange={handleChange}
                    className="mt-2 block w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900"
                  />
                </div>
  
                {/* Ciudad */}
                <div className="mb-5">
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Ciudad
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    className="mt-2 block w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900"
                  />
                </div>
  
                {/* Provincia */}
                <div className="mb-5">
                  <label
                    htmlFor="province"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Provincia
                  </label>
                  <input
                    id="province"
                    name="province"
                    type="text"
                    value={formData.province}
                    onChange={handleChange}
                    className="mt-2 block w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900"
                  />
                </div>
              </div>
  
              <button
                type="submit"
                className="w-full bg-blue-600 dark:bg-blue-700 text-white py-3 px-4 rounded-md hover:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50"
                disabled={loading}
              >
                Actualizar Cliente
              </button>
            </>
          )
        )}
      </form>
    </div>
  );
}