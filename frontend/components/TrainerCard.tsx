import React, { useState } from "react";
import clsx from "clsx";
import { ChevronDown, Star } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import type { Trainer } from "@/lib/types";

interface TrainerCardProps {
  trainer: Trainer;
  onSelect: (trainer: Trainer) => void;
  isSelected?: boolean;
}

export default function TrainerCard({
  trainer,
  onSelect,
  isSelected = false,
}: TrainerCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const handleCardSelect = () => {
    onSelect(trainer);
  };

  const handleToggleDetails = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setShowDetails((prev) => !prev);
  };

  return (
    <Card
      hover
      onClick={handleCardSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleCardSelect();
        }
      }}
      role="button"
      tabIndex={0}
      className={clsx(
        "relative overflow-hidden group cursor-pointer",
        isSelected &&
          "ring-2 ring-indigo-500 border-indigo-500/50 shadow-lg shadow-indigo-500/20",
      )}
    >
      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
          <svg
            className="w-3.5 h-3.5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      )}

      {/* Avatar */}
      <div className="flex items-center gap-4 mb-4">
        <Avatar
          src={trainer.avatarUrl}
          name={trainer.name}
          size="md"
          className="shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-white truncate">
            {trainer.name}
          </h3>
          <p className="text-sm text-indigo-400 font-medium truncate">
            Spesialisasi: {trainer.specialty}
          </p>
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1.5 mb-3">
        <Star size={14} className="text-amber-400 fill-amber-400" />
        <span className="text-sm font-semibold text-amber-400">
          {(trainer.rating ?? 0).toFixed(1)}
        </span>
        <span className="text-xs text-gray-500 ml-1">rating</span>
      </div>

      {/* Bio */}
      <p
        className={clsx(
          "text-sm text-gray-400 leading-relaxed mb-3",
          !showDetails && "line-clamp-2",
        )}
      >
        {trainer.bio || "Belum ada deskripsi trainer."}
      </p>

      <button
        type="button"
        className="w-full mb-3 inline-flex items-center justify-center gap-2 text-xs text-indigo-300 hover:text-indigo-200 transition-colors"
        onClick={handleToggleDetails}
      >
        {showDetails ? "Sembunyikan bio" : "Lihat bio lengkap"}
        <ChevronDown
          size={14}
          className={clsx("transition-transform", showDetails && "rotate-180")}
        />
      </button>

      {/* Action */}
      <Button
        variant={isSelected ? "primary" : "outline"}
        size="sm"
        className="w-full"
        onClick={(event) => {
          event.stopPropagation();
          onSelect(trainer);
        }}
      >
        {isSelected ? "✓ Terpilih" : "Pilih Trainer"}
      </Button>
    </Card>
  );
}
