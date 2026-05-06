"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { trainerService } from "@/lib/trainerService";
import { profileService } from "@/lib/profileService";
import type { TrainerProfileResponse } from "@/lib/types";
import Card from "@/components/ui/Card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Avatar from "@/components/ui/Avatar";
import ProfilePictureUpload from "@/components/ProfilePictureUpload";
import { Calendar, Star, AlertCircle, CheckCircle, XCircle, Clock, Users } from "lucide-react";
import { getTrainerBookings, updateBookingStatus } from "@/lib/bookingService";
import type { Booking } from "@/lib/types";

export default function TrainerDashboard() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState<TrainerProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  // Check authorization
  useEffect(() => {
    if (!authLoading && user?.role !== "ROLE_TRAINER") {
      router.push("/dashboard");
    }
  }, [user, authLoading, router]);

  const fetchBookings = async () => {
    try {
      setLoadingBookings(true);
      const data = await getTrainerBookings();
      setBookings(data);
    } catch (err: any) {
      console.error("Failed to load bookings", err);
    } finally {
      setLoadingBookings(false);
    }
  };

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
      fetchBookings();
    }
  }, [user]);

  const handleUpdateBookingStatus = async (id: number, status: string) => {
    try {
      await updateBookingStatus(id, status);
      let message = '';
      if (status === 'CONFIRMED') message = 'Booking diterima';
      else if (status === 'CANCELLED') message = 'Booking ditolak';
      else if (status === 'DONE') message = 'Sesi latihan selesai';
      
      setSuccess(message);
      setTimeout(() => setSuccess(""), 3000);
      fetchBookings();
    } catch (err: any) {
      setError(err.message || "Gagal mengupdate status booking");
    }
  };

  const handleUploadProfilePicture = async (file: File): Promise<string> => {
    try {
      setUploadingPicture(true);
      setError("");
      const response = await profileService.uploadTrainerProfilePicture(
        profile!.id,
        file,
      );
      setProfile((prev) =>
        prev ? { ...prev, profilePictureUrl: response.url } : null,
      );
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

  const pendingRequests = bookings.filter(b => b.status === 'PENDING');
  const confirmedSchedules = bookings.filter(b => b.status === 'CONFIRMED').sort((a, b) => 
    new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
  );
  const bookingHistory = bookings.filter(b => b.status === 'DONE' || b.status === 'CANCELLED').sort((a, b) => 
    new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()
  );

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

      {/* Success Message */}
      {success && (
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400">
          {success}
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
            <div className="flex items-start gap-8 justify-between">
              <div className="flex items-start gap-6">
                <ProfilePictureUpload
                  currentImage={profile.profilePictureUrl}
                  onUpload={handleUploadProfilePicture}
                  isLoading={uploadingPicture}
                />
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {profile.trainerName}
                  </h2>
                  <p className="text-gray-400 mb-4">{profile.specialty}</p>
                  {profile.bio && (
                    <p className="text-gray-300 max-w-2xl">{profile.bio}</p>
                  )}
                </div>
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
            <Card className="p-6 bg-gradient-to-br from-indigo-500/10 to-transparent border border-indigo-500/20">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-2">Total Klien</p>
                  <p className="text-3xl font-bold text-white">{new Set(bookings.map(b => b.userId)).size}</p>
                  <p className="text-xs text-gray-500 mt-2">Klien aktif</p>
                </div>
                <Users size={32} className="text-indigo-400" />
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-2">Sesi Terkonfirmasi</p>
                  <p className="text-3xl font-bold text-white">{confirmedSchedules.length}</p>
                  <p className="text-xs text-gray-500 mt-2">Sesi aktif</p>
                </div>
                <Calendar size={32} className="text-purple-400" />
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
              <button onClick={() => router.push('/trainer/bookings')} className="px-4 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-medium transition-colors">
                Lihat Jadwal Booking
              </button>
              <button onClick={() => router.push('/profile')} className="px-4 py-3 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-medium transition-colors">
                Update Profil
              </button>
            </div>
          </Card>

          {/* Confirmed Schedule Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <CheckCircle size={24} className="text-green-400" />
              Jadwal Latihan Terkonfirmasi
            </h2>
            {confirmedSchedules.length === 0 ? (
              <Card className="text-center p-8 border-dashed border-white/10 bg-transparent text-gray-500">
                Belum ada sesi latihan yang dijadwalkan.
              </Card>
            ) : (
              <div className="grid gap-4">
                {confirmedSchedules.map((booking) => (
                  <Card key={booking.id} className="p-5 border border-white/5 bg-white/[0.02] flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                          <Calendar size={24} className="text-indigo-400" />
                       </div>
                       <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                            {new Date(booking.scheduledAt).toLocaleDateString('id-ID', { weekday: 'long' })}
                          </p>
                          <p className="text-lg font-bold text-white">
                            {new Date(booking.scheduledAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}
                          </p>
                          <p className="text-sm text-indigo-400 font-semibold">
                            {new Date(booking.scheduledAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} — {booking.durationMinutes} menit
                          </p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4 border-l border-white/5 pl-4 md:pl-8">
                       <div className="text-right hidden md:block">
                          <p className="text-xs text-gray-500">Klien</p>
                          <p className="text-sm font-bold text-white">{booking.userName || `User #${booking.userId}`}</p>
                       </div>
                       <Avatar src={booking.userProfilePictureUrl} name={booking.userName || `User #${booking.userId}`} size="sm" />
                       <button 
                         onClick={() => handleUpdateBookingStatus(booking.id, 'DONE')}
                         className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20"
                       >
                         Selesaikan Sesi
                       </button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Incoming Bookings Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <AlertCircle size={24} className="text-yellow-400" />
              Permintaan Booking Masuk
            </h2>
            {loadingBookings ? (
              <div className="flex justify-center p-8">
                <LoadingSpinner size="md" label="Memuat booking..." />
              </div>
            ) : pendingRequests.length === 0 ? (
              <Card className="text-center p-8 border-dashed border-white/10 bg-transparent text-gray-500">
                Tidak ada permintaan booking baru.
              </Card>
            ) : (
              <div className="grid gap-4">
                {pendingRequests.map((booking) => (
                  <Card key={booking.id} className="p-6 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <Avatar src={booking.userProfilePictureUrl} name={booking.userName || `User #${booking.userId}`} size="md" />
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">{booking.userName || `User #${booking.userId}`}</h3>
                          <span className={`px-2 py-1 text-xs font-bold rounded-md ${
                          booking.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                          booking.status === 'CONFIRMED' ? 'bg-green-500/20 text-green-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-indigo-400" />
                          <span>
                            {new Date(booking.scheduledAt).toLocaleString('id-ID', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="flex items-center gap-1"><Clock size={14} /> {booking.durationMinutes} Menit</span>
                        </div>
                      </div>
                      {booking.notes && (
                        <p className="mt-2 text-sm text-gray-300 italic">"{booking.notes}"</p>
                      )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleUpdateBookingStatus(booking.id, 'CONFIRMED')}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 rounded-lg transition-colors"
                      >
                        <CheckCircle size={18} /> Terima
                      </button>
                      <button 
                        onClick={() => handleUpdateBookingStatus(booking.id, 'CANCELLED')}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg transition-colors"
                      >
                        <XCircle size={18} /> Tolak
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

        </>
      ) : null}
    </div>
  );
}
