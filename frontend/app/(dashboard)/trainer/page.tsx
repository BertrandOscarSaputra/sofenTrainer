"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { trainerService } from "@/lib/trainerService";
import type { TrainerProfileResponse } from "@/lib/types";
import Card from "@/components/ui/Card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Calendar, Star, AlertCircle } from "lucide-react";

export default function TrainerDashboard() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState<TrainerProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Check authorization
  useEffect(() => {
    if (!authLoading && user?.role !== "ROLE_TRAINER") {
      router.push("/dashboard");
    }
  }, [user, authLoading, router]);

  // Load trainer profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await trainerService.getMyProfile();
        setProfile(data);
      } catch (err: any) {
        setError(err.message || "Gagal memuat profil");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "ROLE_TRAINER") {
      fetchProfile();
    }
  }, [user]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" label="Memuat..." />
      </div>
    );
  }

  if (user?.role !== "ROLE_TRAINER") {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white">Trainer Dashboard</h1>
        <p className="text-gray-400 mt-2">Kelola profil dan jadwal Anda</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" label="Memuat profil..." />
        </div>
      ) : profile ? (
        <>
          {/* Profile Card */}
          <Card className="p-8 bg-gradient-to-br from-indigo-500/10 to-transparent border border-indigo-500/20">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  {profile.name}
                </h2>
                <p className="text-gray-400 mb-4">{profile.specialty}</p>
                {profile.bio && (
                  <p className="text-gray-300 max-w-2xl">{profile.bio}</p>
                )}
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 justify-end mb-4">
                  <Star size={24} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-3xl font-bold text-white">
                    {profile.rating.toFixed(1)}
                  </span>
                </div>
                <span
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    profile.isActive
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {profile.isActive ? "Aktif" : "Nonaktif"}
                </span>
              </div>
            </div>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-2">Total Booking</p>
                  <p className="text-3xl font-bold text-white">--</p>
                  <p className="text-xs text-gray-500 mt-2">Bulan ini</p>
                </div>
                <Calendar size={32} className="text-purple-400" />
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-2">Rating Rata-rata</p>
                  <p className="text-3xl font-bold text-white">
                    {profile.rating.toFixed(1)}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Dari semua booking
                  </p>
                </div>
                <Star size={32} className="text-yellow-400 fill-yellow-400" />
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-2">Status</p>
                  <p className="text-3xl font-bold text-white">
                    {profile.isActive ? "Aktif" : "Nonaktif"}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Profil Anda</p>
                </div>
                <AlertCircle
                  size={32}
                  className={
                    profile.isActive ? "text-green-400" : "text-red-400"
                  }
                />
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="p-6 border border-white/10">
            <h2 className="text-lg font-semibold text-white mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="px-4 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-medium transition-colors">
                Lihat Jadwal Booking
              </button>
              <button className="px-4 py-3 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-medium transition-colors">
                Update Profil
              </button>
            </div>
          </Card>
        </>
      ) : null}
    </div>
  );
}
