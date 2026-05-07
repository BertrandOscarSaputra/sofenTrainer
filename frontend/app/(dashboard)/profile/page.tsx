"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { profileService } from "@/lib/profileService";
import Card from "@/components/ui/Card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ProfilePictureUpload from "@/components/ProfilePictureUpload";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { Mail, User, BookOpen, Target, Star } from "lucide-react";
import { useEffect } from "react";
import { trainerService } from "@/lib/trainerService";
import type { TrainerProfileResponse } from "@/lib/types";

export default function UserProfilePage() {
  const router = useRouter();
  const { user, isLoading: authLoading, updateUser } = useAuth();
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [trainerProfile, setTrainerProfile] = useState<TrainerProfileResponse | null>(null);
  const [loadingTrainer, setLoadingTrainer] = useState(false);

  useEffect(() => {
    if (user?.role === 'ROLE_TRAINER') {
      (async () => {
        try {
          setLoadingTrainer(true);
          const data = await trainerService.getMyProfile();
          setTrainerProfile(data);
        } catch (err) {
          console.error("Failed to load trainer profile", err);
        } finally {
          setLoadingTrainer(false);
        }
      })();
    }
  }, [user]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" label="Memuat profil..." />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleUploadProfilePicture = async (file: File): Promise<string> => {
    try {
      setUploadingPicture(true);
      setError("");
      const response = await profileService.uploadUserProfilePicture(file);
      // Update user in context with new profile picture
      const updatedUser = { ...user, profilePictureUrl: response.url };
      if (updateUser) {
        updateUser(updatedUser);
      }
      setSuccess("Foto profil berhasil diupload");
      setTimeout(() => setSuccess(""), 3000);
      return response.url;
    } catch (err: any) {
      setError(err.message || "Gagal mengupload foto profil");
      throw err;
    } finally {
      setUploadingPicture(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white">Profil Saya</h1>
        <p className="text-gray-400 mt-2">Kelola informasi profil Anda</p>
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

      {/* Profile Card */}
      <Card className="p-8 bg-gradient-to-br from-indigo-500/10 to-transparent border border-indigo-500/20">
        <div className="flex items-start gap-8">
          <div className="flex flex-col items-center gap-4">
            <ProfilePictureUpload
              currentImage={user.profilePictureUrl}
              onUpload={handleUploadProfilePicture}
              isLoading={uploadingPicture}
            />
            <p className="text-sm text-gray-400 text-center">
              Klik untuk mengubah foto profil
            </p>
          </div>

          <div className="flex-1 space-y-6">
            {/* Name */}
            <div>
              <label className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                <User size={16} />
                Nama Lengkap
              </label>
              <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white">
                {user.name}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                <Mail size={16} />
                Email
              </label>
              <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white">
                {user.email}
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Role</label>
              <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                <span
                  className={`px-3 py-1 rounded-lg text-sm font-medium inline-block ${
                    user.role === "ROLE_ADMIN"
                      ? "bg-red-500/20 text-red-400"
                      : user.role === "ROLE_TRAINER"
                        ? "bg-purple-500/20 text-purple-400"
                        : "bg-blue-500/20 text-blue-400"
                  }`}
                >
                  {user.role === "ROLE_ADMIN"
                    ? "Administrator"
                    : user.role === "ROLE_TRAINER"
                      ? "Trainer"
                      : "Pengguna"}
                </span>
              </div>
            </div>

            {/* Trainer Specific Info */}
            {user.role === 'ROLE_TRAINER' && trainerProfile && (
              <div className="pt-6 border-t border-white/5 space-y-6">
                 <div className="flex items-center gap-4">
                    <div className="px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center gap-2">
                       <Star size={16} className="text-yellow-400 fill-yellow-400" />
                       <span className="text-sm font-bold text-white">{trainerProfile.rating.toFixed(1)} Rating</span>
                    </div>
                    <div className="px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-green-500"></span>
                       <span className="text-sm font-bold text-white">{trainerProfile.isActive ? 'Aktif' : 'Nonaktif'}</span>
                    </div>
                 </div>

                 <div>
                    <label className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                      <Target size={16} />
                      Spesialisasi
                    </label>
                    <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white">
                      {trainerProfile.specialty}
                    </div>
                 </div>

                 <div>
                    <label className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                      <BookOpen size={16} />
                      Bio / Tentang Saya
                    </label>
                    <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white min-h-[100px] whitespace-pre-wrap">
                      {trainerProfile.bio || "Belum ada bio."}
                    </div>
                 </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Info Card */}
      <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20">
        <h3 className="text-lg font-semibold text-white mb-2">Tips</h3>
        <ul className="space-y-2 text-gray-400 text-sm">
          <li>• Foto profil harus berformat gambar (JPG, PNG, etc)</li>
          <li>• Ukuran maksimal foto adalah 5MB</li>
          <li>• Foto akan ditampilkan di sidebar dan profil Anda</li>
        </ul>
      </Card>
    </div>
  );
}
