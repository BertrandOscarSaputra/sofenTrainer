"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { adminService } from "@/lib/adminService";
import type {
  CreateTrainerRequest,
  TrainerManagementResponse,
} from "@/lib/types";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Modal from "@/components/ui/Modal";
import { Edit, Trash2, Plus, Loader } from "lucide-react";

export default function AdminTrainersPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [trainers, setTrainers] = useState<TrainerManagementResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState<CreateTrainerRequest>({
    name: "",
    email: "",
    password: "",
    bio: "",
    specialty: "",
  });

  // Check authorization
  useEffect(() => {
    if (!authLoading && user?.role !== "ROLE_ADMIN") {
      router.push("/dashboard");
    }
  }, [user, authLoading, router]);

  // Load trainers
  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        setLoading(true);
        const data = await adminService.getAllTrainers();
        setTrainers(data);
      } catch (err) {
        setError("Gagal memuat data trainer");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "ROLE_ADMIN") {
      fetchTrainers();
    }
  }, [user]);

  const handleOpenModal = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      bio: "",
      specialty: "",
    });
    setEditingId(null);
    setError("");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      name: "",
      email: "",
      password: "",
      bio: "",
      specialty: "",
    });
    setError("");
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
      setError("Semua field harus diisi");
      return;
    }

    try {
      setIsSubmitting(true);
      const newTrainer = await adminService.createTrainer(formData);
      setTrainers([...trainers, newTrainer]);
      setSuccess("Trainer berhasil ditambahkan");
      handleCloseModal();
    } catch (err: any) {
      setError(err.message || "Gagal menambahkan trainer");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (
    trainerId: number,
    currentStatus: boolean,
  ) => {
    try {
      const updated = await adminService.updateTrainerStatus(
        trainerId,
        !currentStatus,
      );
      setTrainers(trainers.map((t) => (t.id === trainerId ? updated : t)));
      setSuccess(`Trainer ${!currentStatus ? "diaktifkan" : "dinonaktifkan"}`);
    } catch (err: any) {
      setError(err.message || "Gagal mengubah status trainer");
    }
  };

  const handleDelete = async (trainerId: number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus trainer ini?")) {
      try {
        await adminService.deleteTrainer(trainerId);
        setTrainers(trainers.filter((t) => t.id !== trainerId));
        setSuccess("Trainer berhasil dihapus");
      } catch (err: any) {
        setError(err.message || "Gagal menghapus trainer");
      }
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" label="Memuat..." />
      </div>
    );
  }

  if (user?.role !== "ROLE_ADMIN") {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Kelola Trainer</h1>
          <p className="text-gray-400 mt-2">Tambah, edit, dan kelola trainer</p>
        </div>
        <button
          onClick={handleOpenModal}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl transition-colors"
        >
          <Plus size={20} />
          Tambah Trainer
        </button>
      </div>

      {/* Messages */}
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

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" label="Memuat data trainer..." />
        </div>
      ) : trainers.length === 0 ? (
        <Card className="p-12 text-center border border-white/10">
          <p className="text-gray-400 mb-4">Belum ada trainer</p>
          <button
            onClick={handleOpenModal}
            className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl transition-colors"
          >
            Tambah Trainer Pertama
          </button>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-6 py-4 text-gray-400 font-semibold">
                  Nama
                </th>
                <th className="text-left px-6 py-4 text-gray-400 font-semibold">
                  Email
                </th>
                <th className="text-left px-6 py-4 text-gray-400 font-semibold">
                  Spesialisasi
                </th>
                <th className="text-left px-6 py-4 text-gray-400 font-semibold">
                  Rating
                </th>
                <th className="text-left px-6 py-4 text-gray-400 font-semibold">
                  Status
                </th>
                <th className="text-right px-6 py-4 text-gray-400 font-semibold">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {trainers.map((trainer) => (
                <tr
                  key={trainer.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4 text-white">{trainer.name}</td>
                  <td className="px-6 py-4 text-gray-400">{trainer.email}</td>
                  <td className="px-6 py-4 text-gray-400">
                    {trainer.specialty}
                  </td>
                  <td className="px-6 py-4 text-yellow-400">
                    ★ {trainer.rating.toFixed(1)}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() =>
                        handleToggleStatus(trainer.id, trainer.isActive)
                      }
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        trainer.isActive
                          ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                          : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                      }`}
                    >
                      {trainer.isActive ? "Aktif" : "Nonaktif"}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleDelete(trainer.id)}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title="Tambah Trainer Baru"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="e.g., Fitness, Yoga, Boxing"
              className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-400"
            />
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
              rows={3}
              className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-400"
            />
          </div>

          {error && <div className="text-red-400 text-sm">{error}</div>}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleCloseModal}
              className="flex-1 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-500 text-white font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting && <Loader size={18} className="animate-spin" />}
              Tambah Trainer
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
