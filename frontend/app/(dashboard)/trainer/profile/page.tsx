"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { trainerService } from "@/lib/trainerService";
import { profileService } from "@/lib/profileService";
import Card from "@/components/ui/Card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ProfilePictureUpload from "@/components/ProfilePictureUpload";
import Button from "@/components/ui/Button";
import { Mail, User, BookOpen, Target, ArrowLeft, Save } from "lucide-react";
import type { TrainerProfileResponse } from "@/lib/types";

export default function TrainerProfileEditPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, updateUser } = useAuth();
  const [profile, setProfile] = useState<TrainerProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    specialty: "",
  });

  useEffect(() => {
    if (!authLoading && user?.role !== "ROLE_TRAINER") {
      router.push("/dashboard");
    }
  }, [user, authLoading, router]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await trainerService.getMyProfile();
      setProfile(data);
      setFormData({
        name: data.trainerName,
        email: data.email,
        bio: data.bio || "",
        specialty: data.specialty || "",
      });
    } catch (err: any) {
      setError("Gagal memuat profil trainer");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "ROLE_TRAINER") {
      fetchProfile();
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");
      const updatedProfile = await trainerService.updateProfile(formData);
      setProfile(updatedProfile);
      
      // Update global auth user context if name/email changed
      if (updateUser && user) {
         updateUser({
           ...user,
           name: updatedProfile.trainerName,
           email: updatedProfile.email
         });
      }

      setSuccess("Profil berhasil diperbarui!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message || "Gagal memperbarui profil");
    } finally {
      setSaving(false);
    }
  };

  const handleUploadProfilePicture = async (file: File): Promise<string> => {
    if (!profile) return "";
    try {
      setUploadingPicture(true);
      setError("");
      const response = await profileService.uploadTrainerProfilePicture(profile.id, file);
      
      // Update local state
      setProfile(prev => prev ? { ...prev, profilePictureUrl: response.url } : null);
      
      // Update auth context
      if (updateUser && user) {
        updateUser({ ...user, profilePictureUrl: response.url });
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

  if (authLoading || (loading && !profile)) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" label="Memuat profil..." />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push('/trainer')}>
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-white">Edit Profil Trainer</h1>
          <p className="text-gray-400 mt-1">Sesuaikan informasi publik Anda untuk menarik klien.</p>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 animate-fade-in">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 animate-fade-in">
          {success}
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Picture Card */}
        <div className="lg:col-span-1">
          <Card className="p-8 flex flex-col items-center gap-6 text-center border-indigo-500/10">
            <ProfilePictureUpload
              currentImage={profile?.profilePictureUrl}
              onUpload={handleUploadProfilePicture}
              isLoading={uploadingPicture}
            />
            <div>
              <h3 className="text-xl font-bold text-white">{formData.name}</h3>
              <p className="text-sm text-gray-400 mt-1">Trainer ID: #{profile?.id}</p>
            </div>
            <div className="w-full pt-6 border-t border-white/5 space-y-4">
               <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Rating</span>
                  <span className="text-white font-bold flex items-center gap-1">
                     <Star size={14} className="text-yellow-400 fill-yellow-400" />
                     {profile?.rating.toFixed(1)}
                  </span>
               </div>
               <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Status</span>
                  <span className={`font-bold ${profile?.isActive ? 'text-green-400' : 'text-red-400'}`}>
                     {profile?.isActive ? 'Aktif' : 'Nonaktif'}
                  </span>
               </div>
            </div>
          </Card>
        </div>

        {/* Form Card */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-8 space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-white/5 pb-4 mb-4">Profil Publik</h3>
            
            <div className="space-y-2">
               <label className="flex items-center gap-2 text-sm font-medium text-gray-400">
                  <BookOpen size={16} /> Bio / Pengalaman
               </label>
               <textarea
                 name="bio"
                 value={formData.bio}
                 onChange={handleInputChange}
                 rows={8}
                 className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-indigo-500/50 focus:outline-none resize-none"
                 placeholder="Ceritakan tentang keahlian dan pengalaman Anda kepada calon klien..."
                 required
               />
               <p className="text-xs text-gray-500 mt-2">
                  * Nama, Email, dan Spesialisasi tidak dapat diubah dari halaman ini. 
                  Silakan hubungi admin jika perlu perubahan data dasar.
               </p>
            </div>

            <div className="pt-6 flex justify-end">
               <Button type="submit" variant="primary" size="lg" isLoading={saving} className="w-full md:w-auto min-w-[200px]">
                  <Save size={18} />
                  Simpan Bio
               </Button>
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
}

function Star({ size, className }: { size: number; className?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
}
