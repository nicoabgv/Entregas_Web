import Swal from "sweetalert2";

export const showSuccessAlert = (title, text) => {
  return Swal.fire({
    icon: "success",
    title,
    text,
    confirmButtonText: "Aceptar",
  });
};

export const showErrorAlert = (title, text, footer = null) => {
  return Swal.fire({
    icon: "error",
    title,
    text,
    footer,
    confirmButtonText: "Aceptar",
  });
};

export const showWarningAlert = (title, text) => {
  return Swal.fire({
    icon: "warning",
    title,
    text,
    confirmButtonText: "Aceptar",
  });
};

export const confirmDeleteClient = (id, name, deleteClientCallback) => {
  Swal.fire({
    title: "¿Estás seguro?",
    text: `Estás a punto de eliminar al cliente "${name}". Esta acción no se puede deshacer.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      deleteClientCallback(id);
    }
  });
};

export const confirmDeleteProject = (id, name, deleteProjectCallback) => {
  Swal.fire({
    title: "¿Estás seguro?",
    text: `Estás a punto de eliminar el proyecto "${name}". Esta acción no se puede deshacer.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      deleteProjectCallback(id);
    }
  });
};