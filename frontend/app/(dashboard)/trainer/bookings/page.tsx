"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getTrainerBookings, updateBookingStatus } from "@/lib/bookingService";
import type { Booking } from "@/lib/types";
import Card from "@/components/ui/Card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Star,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";

export default function TrainerBookingsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!authLoading && user?.role !== "ROLE_TRAINER") {
      router.push("/dashboard");
    }
  }, [user, authLoading, router]);

  const fetchBookings = async () => {
    try {
      const data = await getTrainerBookings();
      setBookings(data);
    } catch (error: unknown) {
      setError("Gagal memuat daftar booking");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "ROLE_TRAINER") {
      getTrainerBookings()
        .then((data) => {
          setBookings(data);
        })
        .catch((error: unknown) => {
          setError("Gagal memuat daftar booking");
          console.error(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [user]);

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await updateBookingStatus(id, status);
      let message = "";
      if (status === "CONFIRMED") message = "Booking diterima";
      else if (status === "CANCELLED") message = "Booking ditolak";
      else if (status === "DONE") message = "Sesi latihan selesai";

      setSuccess(message);
      setTimeout(() => setSuccess(""), 3000);
      fetchBookings();
    } catch (error: unknown) {
      setError("Gagal mengupdate status booking");
      console.error(error);
    }
  };

  if (authLoading || (loading && bookings.length === 0)) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" label="Memuat booking..." />
      </div>
    );
  }

  const pendingRequests = bookings.filter((b) => b.status === "PENDING");
  const confirmedSchedules = bookings
    .filter((b) => b.status === "CONFIRMED")
    .sort(
      (a, b) =>
        new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
    );
  const bookingHistory = bookings
    .filter((b) => b.status === "DONE" || b.status === "CANCELLED")
    .sort(
      (a, b) =>
        new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime(),
    );

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/trainer")}
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-3xl font-bold text-white">Manajemen Booking</h1>
        </div>
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

      {/* Confirmed Schedule */}
      <section>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <CheckCircle size={20} className="text-green-400" />
          Jadwal Terkonfirmasi
        </h2>
        {confirmedSchedules.length === 0 ? (
          <Card className="p-10 text-center border-dashed border-white/10 bg-transparent text-gray-500">
            Belum ada jadwal yang dikonfirmasi.
          </Card>
        ) : (
          <div className="grid gap-4">
            {confirmedSchedules.map((booking) => (
              <Card
                key={booking.id}
                className="p-6 border border-white/5 bg-white/[0.02] flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex items-center gap-4">
                  <Avatar
                    src={booking.userProfilePictureUrl}
                    name={booking.userName || `User #${booking.userId}`}
                    size="md"
                  />
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">
                      {new Date(booking.scheduledAt).toLocaleDateString(
                        "id-ID",
                        { weekday: "long" },
                      )}
                    </p>
                    <p className="text-lg font-bold text-white">
                      {new Date(booking.scheduledAt).toLocaleDateString(
                        "id-ID",
                        { day: "numeric", month: "long" },
                      )}
                    </p>
                    <div className="flex items-center gap-3 text-sm text-indigo-400 font-semibold mt-1">
                      <span className="flex items-center gap-1">
                        <Clock size={14} />{" "}
                        {new Date(booking.scheduledAt).toLocaleTimeString(
                          "id-ID",
                          { hour: "2-digit", minute: "2-digit" },
                        )}
                      </span>
                      <span>•</span>
                      <span>{booking.durationMinutes} menit</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-gray-500">Klien</p>
                    <p className="text-sm font-bold text-white">
                      {booking.userName || `User #${booking.userId}`}
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleUpdateStatus(booking.id, "DONE")}
                  >
                    Selesai
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Pending Requests */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <AlertCircle size={20} className="text-yellow-400" />
          Permintaan Masuk
        </h2>
        {pendingRequests.length === 0 ? (
          <Card className="p-10 text-center border-dashed border-white/10 bg-transparent text-gray-500">
            Tidak ada permintaan booking baru.
          </Card>
        ) : (
          <div className="grid gap-4">
            {pendingRequests.map((booking) => (
              <Card
                key={booking.id}
                className="p-6 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex items-center gap-4 flex-1">
                  <Avatar
                    src={booking.userProfilePictureUrl}
                    name={booking.userName || `User #${booking.userId}`}
                    size="lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-white">
                        {booking.userName || `User #${booking.userId}`}
                      </h3>
                      <span className="px-2 py-0.5 rounded-md bg-yellow-500/20 text-yellow-500 text-[10px] font-black uppercase">
                        PENDING
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />{" "}
                        {new Date(booking.scheduledAt).toLocaleDateString(
                          "id-ID",
                          { weekday: "long", day: "numeric", month: "long" },
                        )}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />{" "}
                        {new Date(booking.scheduledAt).toLocaleTimeString(
                          "id-ID",
                          { hour: "2-digit", minute: "2-digit" },
                        )}
                      </span>
                    </div>
                    {booking.notes && (
                      <p className="mt-3 text-sm text-gray-400 italic bg-white/5 p-3 rounded-lg border border-white/5">
                        &quot;{booking.notes}&quot;
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateStatus(booking.id, "CONFIRMED")}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-bold rounded-xl transition-all"
                  >
                    Terima
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(booking.id, "CANCELLED")}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-400 text-sm font-bold rounded-xl border border-white/10 transition-all"
                  >
                    Tolak
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Booking History */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Clock size={20} className="text-gray-400" />
          Riwayat Sesi
        </h2>
        {bookingHistory.length === 0 ? (
          <Card className="p-10 text-center border-dashed border-white/10 bg-transparent text-gray-500">
            Belum ada riwayat sesi.
          </Card>
        ) : (
          <div className="grid gap-4 opacity-70">
            {bookingHistory.map((booking) => (
              <Card
                key={booking.id}
                className={`p-5 border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                  booking.status === "DONE"
                    ? "bg-green-500/[0.02] border-green-500/10"
                    : "bg-red-500/[0.02] border-red-500/10 opacity-75"
                }`}
              >
                <div className="flex items-center gap-4">
                  <Avatar
                    src={booking.userProfilePictureUrl}
                    name={booking.userName || `User #${booking.userId}`}
                    size="md"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-bold text-white">
                        {booking.userName || `User #${booking.userId}`}
                      </p>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                          booking.status === "DONE"
                            ? "bg-green-500/10 text-green-500"
                            : "bg-red-500/10 text-red-500"
                        }`}
                      >
                        {booking.status === "DONE" ? "Selesai" : "Batal"}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(booking.scheduledAt).toLocaleDateString(
                          "id-ID",
                          { day: "numeric", month: "long", year: "numeric" },
                        )}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(booking.scheduledAt).toLocaleTimeString(
                          "id-ID",
                          { hour: "2-digit", minute: "2-digit" },
                        )}
                      </span>
                      <span>{booking.durationMinutes} menit</span>
                    </div>
                    {booking.notes && (
                      <p className="mt-2 text-xs text-gray-400 italic">
                        &quot;{booking.notes}&quot;
                      </p>
                    )}
                    {booking.status === "DONE" && booking.reviewed && (
                      <div className="mt-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3">
                        <div className="flex items-center gap-2 text-amber-300 text-sm font-semibold">
                          <Star size={14} className="fill-current" />
                          Rating pengguna: {booking.reviewRating ?? "-"} / 5
                        </div>
                        {booking.reviewComment && (
                          <p className="mt-2 text-sm text-amber-100/90 italic leading-6">
                            &quot;{booking.reviewComment}&quot;
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right flex flex-col items-end gap-1">
                  <p className="text-[10px] text-gray-600 uppercase font-bold">
                    Waktu Booking
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(booking.bookedAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
