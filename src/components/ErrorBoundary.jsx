import { useRouteError, useNavigate } from "react-router-dom";

function Errorboundary() {

  const error = useRouteError();
  const navigate = useNavigate();

  const data = error?.data || "Something went wrong";
  const status = error?.status || "Error";
  const statusText = error?.statusText || "";

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white shadow-md rounded-lg p-8 text-center w-100">

        <h1 className="text-5xl font-bold text-red-500 mb-4">
          {status}
        </h1>

        <p className="text-lg font-semibold mb-2">
          {statusText}
        </p>

        <p className="text-gray-600 mb-6">
          {data}
        </p>

        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
        >
          Go Home
        </button>

      </div>

    </div>
  );
}

export default Errorboundary;