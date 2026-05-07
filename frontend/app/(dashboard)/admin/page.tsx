"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader, UserPlus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { adminService } from "@/lib/adminService";
import type { CreateTrainerRequest } from "@/lib/types";
import Card from "@/components/ui/Card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [formData, setFormData] = useState<CreateTrainerRequest>({
    name: "",
    email: "",
    password: "",
    bio: "",
    specialty: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!isLoading && user?.role !== "ROLE_ADMIN") {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      bio: "",
      specialty: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.specialty
    ) {
      setError("Nama, email, password, dan spesialisasi harus diisi.");
      return;
    }

    try {
      setIsSubmitting(true);
      await adminService.createTrainer(formData);
      setSuccess("Trainer berhasil ditambahkan.");
      resetForm();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Gagal menambahkan trainer.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

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
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-white">Tambah Trainer</h1>
        <p className="text-gray-400 mt-2">
          Buat akun trainer baru dan lengkapi profil dasarnya.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400">
          {success}
        </div>
      )}

      <Card className="p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300">
            <UserPlus size={22} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">
              Data Trainer Baru
            </h2>
            <p className="text-sm text-gray-500">
              Akun akan dibuat dengan role trainer.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nama
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Nama trainer"
                className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="email@example.com"
                className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Password"
                className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Spesialisasi
              </label>
              <input
                type="text"
                value={formData.specialty}
                onChange={(e) =>
                  setFormData({ ...formData, specialty: e.target.value })
                }
                placeholder="Fitness, Yoga, Boxing"
                className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              placeholder="Deskripsi singkat tentang trainer"
              rows={4}
              className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-400"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={resetForm}
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-60 text-white font-medium transition-colors"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-500 text-white font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting && <Loader size={18} className="animate-spin" />}
              Tambah Trainer
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
