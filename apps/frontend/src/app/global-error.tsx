// app/global-error.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const GlobalError = ({ error, reset }: GlobalErrorProps) => {
  // Log the error to an error reporting service
  useEffect(() => {
    console.error("Global Error Caught:", error);
    // Example: Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg border border-red-100">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Something Went Wrong!
          </h1>
          <p className="text-gray-600 mb-6">
            We encountered an unexpected error. Please try again or return to
            the home page.
          </p>

          {/* Show technical details only in development mode */}
          {process.env.NODE_ENV === "development" && (
            <details className="mb-6 text-left bg-gray-100 p-3 rounded text-sm text-red-600 overflow-auto">
              <summary className="cursor-pointer font-semibold">
                Technical Details (Debug)
              </summary>
              <p>{error.message}</p>
              <pre className="mt-2 whitespace-pre-wrap">{error.stack}</pre>
            </details>
          )}

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => reset()}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>

            <Link
              href="/"
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Go Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
};

export default GlobalError;
