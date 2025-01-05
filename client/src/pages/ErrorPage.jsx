import React from 'react'
import { Link } from 'react-router-dom';


function ErrorPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600  to-purple-600 text-white">
            <div className="text-center px-6 sm:px-12">
                <h1 className="text-9xl font-extrabold tracking-tighter mb-6">404</h1>
                <h2 className="text-3xl sm:text-4xl font-semibold mb-4">
                    Oops! Page Not Found
                </h2>
                <p className="text-lg sm:text-xl opacity-80 mb-8">
                    The page you are looking for does not exist or has been moved.
                </p>
                <div className="flex justify-center gap-4">
                    <Link
                        to="/"
                        className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-gray-200 transition-all"
                    >
                        Go to Homepage
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ErrorPage
