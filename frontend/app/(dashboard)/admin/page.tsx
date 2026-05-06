"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Users, TrendingUp, AlertCircle } from "lucide-react";
import Card from "@/components/ui/Card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user?.role !== "ROLE_ADMIN") {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" label="Memuat dashboard admin..." />
      </div>
    );
  }

  if (user?.role !== "ROLE_ADMIN") {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-gray-400 mt-2">Kelola platform Traino</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-indigo-500/10 to-transparent border border-indigo-500/20">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-2">Total Trainer</p>
              <p className="text-3xl font-bold text-white">--</p>
              <p className="text-xs text-gray-500 mt-2">Aktif di platform</p>
            </div>
            <Users size={32} className="text-indigo-400" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-2">Total User</p>
              <p className="text-3xl font-bold text-white">--</p>
              <p className="text-xs text-gray-500 mt-2">Pengguna aktif</p>
            </div>
            <TrendingUp size={32} className="text-purple-400" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-2">Total Booking</p>
              <p className="text-3xl font-bold text-white">--</p>
              <p className="text-xs text-gray-500 mt-2">Bulan ini</p>
            </div>
            <AlertCircle size={32} className="text-orange-400" />
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 border border-white/10">
          <h2 className="text-lg font-semibold text-white mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <button
              onClick={() => router.push("/admin/trainers")}
              className="w-full px-4 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-medium transition-colors"
            >
              Kelola Trainer
            </button>
            <button
              onClick={() => router.push("/admin/trainers")}
              className="w-full px-4 py-3 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-medium transition-colors"
            >
              Tambah Trainer Baru
            </button>
          </div>
        </Card>

        <Card className="p-6 border border-white/10">
          <h2 className="text-lg font-semibold text-white mb-4">
            Recent Activity
          </h2>
          <div className="text-gray-400 text-sm">
            <p>Fitur aktivitas terbaru akan ditampilkan di sini</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
