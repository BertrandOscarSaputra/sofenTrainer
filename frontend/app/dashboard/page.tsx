"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAuthState, clearToken, User } from "@/lib/auth";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authState = getAuthState();

    if (!authState.isAuthenticated) {
      router.push("/login");
      return;
    }

    setUser(authState.user);
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    clearToken();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">SofenTrainer</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Welcome back, {user.name}!
          </h2>

          {/* User Info Card */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Account Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="text-lg font-medium text-gray-900">{user.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-lg font-medium text-gray-900">
                  {user.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Role</p>
                <p className="text-lg font-medium text-gray-900 capitalize">
                  {user.role}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">User ID</p>
                <p className="text-lg font-medium text-gray-900">#{user.id}</p>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="border-t pt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Available Features
            </h3>
            <p className="text-gray-600 mb-6">
              Your authentication system is working! The next features to build
              are:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-xl">📅</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Schedule Management
                </h4>
                <p className="text-sm text-gray-600">
                  Manage trainer availability and schedules
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-xl">📚</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Booking System
                </h4>
                <p className="text-sm text-gray-600">
                  Book and manage training sessions
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-xl">🤖</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  AI Recommendations
                </h4>
                <p className="text-sm text-gray-600">
                  Get personalized training recommendations
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-xl">📊</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Booking History
                </h4>
                <p className="text-sm text-gray-600">
                  Track your past and upcoming bookings
                </p>
              </div>
            </div>
          </div>

          {/* Test Information */}
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>✓ Auth system is working!</strong> You successfully logged
              in and can see this protected page. Your JWT token is securely
              stored.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
