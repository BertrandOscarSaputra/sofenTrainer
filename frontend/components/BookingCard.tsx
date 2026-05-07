import React, { useState } from "react";
import { Calendar, Clock, Star } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import RatingModal from "./RatingModal";
import { reviewService } from "@/lib/reviewService";
import type { Booking, Review } from "@/lib/types";

interface BookingCardProps {
  booking: Booking;
  onCancel?: (id: number) => void;
  onMarkDone?: (id: number) => void;
  onRefresh?: () => void;
}

export default function BookingCard({
  booking,
  onCancel,
  onMarkDone,
  onRefresh,
}: BookingCardProps) {
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [reviewDraft, setReviewDraft] = useState<Review | null>(null);
  const [isLoadingReview, setIsLoadingReview] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const isActive =
    booking.status === "PENDING" || booking.status === "CONFIRMED";
  const trainerName =
    booking.trainerName ||
    booking.trainer?.name ||
    `Trainer #${booking.trainerId}`;
  const specialty = booking.trainerSpecialty || booking.trainer?.specialty;

  const openRatingModal = async () => {
    setReviewError("");

    if (booking.reviewed) {
      setIsLoadingReview(true);
      try {
        const existingReview = await reviewService.getReviewByBooking(
          booking.id,
        );
        setReviewDraft(existingReview);
        setShowRatingModal(true);
      } catch (error) {
        console.error("Failed to load review:", error);
        setReviewError("Gagal memuat review yang sudah ada. Coba lagi.");
      } finally {
        setIsLoadingReview(false);
      }
      return;
    }

    setReviewDraft(null);
    setShowRatingModal(true);
  };

  const handleRatingSubmit = async (rating: number, comment: string) => {
    const payload = {
      bookingId: booking.id,
      rating,
      comment,
    };

    if (reviewDraft) {
      await reviewService.updateReview(booking.id, payload);
    } else {
      await reviewService.createReview(payload);
    }

    if (onRefresh) onRefresh();
    setShowRatingModal(false);
    setReviewDraft(null);
  };

  const closeRatingModal = () => {
    setShowRatingModal(false);
    setReviewDraft(null);
    setReviewError("");
  };

  const formattedDate = booking.scheduledAt
    ? new Date(booking.scheduledAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const formattedTime = booking.scheduledAt
    ? new Date(booking.scheduledAt).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const bookedDate = booking.bookedAt
    ? new Date(booking.bookedAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
      })
    : "";

  if (!isActive) {
    const isDone = String(booking.status).toUpperCase() === "DONE";
    return (
      <Card
        key={booking.id}
        className={`p-5 border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
          isDone
            ? "bg-green-500/[0.02] border-green-500/10"
            : "bg-red-500/[0.02] border-red-500/10 opacity-75"
        }`}
      >
        <div className="flex items-center gap-4">
          <Avatar
            src={booking.trainerProfilePictureUrl}
            name={trainerName}
            size="md"
          />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-bold text-white">{trainerName}</p>
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                  isDone
                    ? "bg-green-500/10 text-green-500"
                    : "bg-red-500/10 text-red-500"
                }`}
              >
                {isDone ? "Selesai" : "Batal"}
              </span>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {formattedDate}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {formattedTime}
              </span>
              <span>{booking.durationMinutes} menit</span>
            </div>
            {booking.notes && (
              <p className="mt-2 text-xs text-gray-400 italic">
                &quot;{booking.notes}&quot;
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          {isDone && (
            <Button
              variant="primary"
              size="sm"
              className="flex items-center gap-1.5 py-1 px-3 bg-yellow-500/20 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/30 transition-colors"
              onClick={openRatingModal}
              disabled={isLoadingReview}
            >
              <Star size={14} className="fill-current" />
              {booking.reviewed ? "Ubah Rating" : "Berikan Rating"}
            </Button>
          )}
          {isDone && booking.reviewed && (
            <span className="text-[10px] text-green-500/50 font-bold uppercase flex items-center gap-1">
              <Star size={10} className="fill-current" />
              Rating Terkirim
            </span>
          )}
          {reviewError && (
            <p className="text-xs text-red-400 max-w-[220px] text-right">
              {reviewError}
            </p>
          )}
          <div className="text-right flex flex-col items-end gap-1">
            <p className="text-[10px] text-gray-600 uppercase font-bold">
              Waktu Booking
            </p>
            <p className="text-xs text-gray-400">{bookedDate}</p>
          </div>
        </div>

        {showRatingModal && (
          <RatingModal
            trainerName={trainerName}
            mode={reviewDraft ? "edit" : "create"}
            initialRating={reviewDraft?.rating}
            initialComment={reviewDraft?.comment ?? ""}
            onClose={closeRatingModal}
            onSubmit={handleRatingSubmit}
          />
        )}
      </Card>
    );
  }

  return (
    <Card className="relative hover:border-indigo-500/30 transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar
            src={booking.trainerProfilePictureUrl}
            name={trainerName}
            size="md"
          />
          <div>
            <h4 className="text-sm font-semibold text-white">{trainerName}</h4>
            {specialty && <p className="text-xs text-gray-500">{specialty}</p>}
          </div>
        </div>
        <Badge status={booking.status} />
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <Calendar size={14} className="text-indigo-400" />
          <span>
            {formattedDate} — {formattedTime}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Clock size={14} className="text-gray-500" />
          <span>{booking.durationMinutes} menit</span>
        </div>
        {booking.notes && (
          <p className="mt-3 text-xs text-gray-400 italic bg-white/5 p-2 rounded-lg border border-white/5">
            &quot;{booking.notes}&quot;
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 pt-3 border-t border-white/5">
        {onCancel && (
          <Button
            variant="danger"
            size="sm"
            onClick={() => onCancel(booking.id)}
            className="flex-1"
          >
            Batalkan
          </Button>
        )}
        {onMarkDone && booking.status === "CONFIRMED" && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onMarkDone(booking.id)}
            className="flex-1"
          >
            Tandai Selesai
          </Button>
        )}
      </div>
    </Card>
  );
}
