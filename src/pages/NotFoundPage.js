import React from "react";
import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-8">
      <h1 className="text-8xl font-extrabold text-red-500 drop-shadow-lg animate-pulse">
        404
      </h1>
      <p className="text-3xl mt-4 font-semibold">Page Not Found</p>
      <p className="text-lg mt-2 text-gray-300 max-w-lg text-center">
        Oops! The page you are looking for doesn’t exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Go to Home
      </Link>
    </div>
  );
}

export default NotFoundPage;
