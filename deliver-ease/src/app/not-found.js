export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <h1 className="text-6xl font-bold text-red-600 dark:text-red-500 mb-4">404</h1>
      <p className="text-xl text-gray-700 dark:text-gray-300">
        Lo sentimos, la página que buscas no existe.
      </p>
      <a
        href="/"
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
      >
        Volver al inicio
      </a>
    </div>
  );
}