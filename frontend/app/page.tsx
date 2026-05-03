"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAuthState, clearToken } from "@/lib/auth";

export default function Home() {
  const router = useRouter();
  const [authState, setAuthState] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const state = getAuthState();
    setAuthState(state);
    setLoading(false);

    // Redirect to dashboard if already authenticated
    if (state.isAuthenticated) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleLogout = () => {
    clearToken();
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-600">SofenTrainer</h1>
          {authState?.isAuthenticated && (
            <div className="flex items-center gap-4">
              <span className="text-gray-600">
                Welcome, {authState.user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to SofenTrainer
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Connect with professional trainers and achieve your fitness goals
          </p>

          {!authState?.isAuthenticated ? (
            <div className="flex gap-4 justify-center">
              <Link
                href="/login"
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors"
              >
                Create Account
              </Link>
            </div>
          ) : (
            <div>
              <Link
                href="/dashboard"
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors inline-block"
              >
                Go to Dashboard
              </Link>
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-4xl mb-4">👤</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Secure Authentication
            </h3>
            <p className="text-gray-600">
              Sign up and log in securely with JWT authentication. Your data is
              protected and encrypted.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Schedule Management
            </h3>
            <p className="text-gray-600">
              View trainer availability and manage your training sessions
              efficiently.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              AI Recommendations
            </h3>
            <p className="text-gray-600">
              Get personalized training recommendations powered by AI
              technology.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-4xl mb-4">💪</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Professional Trainers
            </h3>
            <p className="text-gray-600">
              Connect with certified fitness trainers and achieve your goals
              together.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Progress Tracking
            </h3>
            <p className="text-gray-600">
              Monitor your booking history and track your fitness progress over
              time.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Goal Setting
            </h3>
            <p className="text-gray-600">
              Set fitness goals and get guidance from experienced trainers to
              achieve them.
            </p>
          </div>
        </div>

        {/* Test Info */}
        <div className="mt-16 bg-white rounded-lg shadow-lg p-8 border-l-4 border-green-500">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            ✓ Backend Authentication System Ready!
          </h3>
          <p className="text-gray-600 mb-4">
            The secure login and registration system is fully operational with
            JWT token support. Test it out by creating a new account or logging
            in with your credentials.
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Secure password hashing with BCrypt</li>
            <li>JWT token-based authentication</li>
            <li>Protected API endpoints</li>
            <li>Automatic token refresh and validation</li>
            <li>Environment variable configuration</li>
          </ul>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2026 SofenTrainer. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
