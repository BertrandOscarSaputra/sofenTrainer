"use client";

import React from "react";
import Image from "next/image";

interface AvatarProps {
  src?: string;
  name?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "w-10 h-10 text-xs",
  md: "w-16 h-16 text-sm",
  lg: "w-32 h-32 text-xl",
};

const getInitials = (name?: string) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export default function Avatar({
  src,
  name,
  size = "md",
  className = "",
}: AvatarProps) {
  const sizeClass = sizeClasses[size];

  if (src) {
    return (
      <div
        className={`relative rounded-full overflow-hidden border-2 border-indigo-500/20 ${sizeClass} ${className}`}
      >
        <Image src={src} alt={name || "Avatar"} fill className="object-cover" />
      </div>
    );
  }

  return (
    <div
      className={`rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center border-2 border-indigo-500/20 text-white font-bold ${sizeClass} ${className}`}
    >
      {getInitials(name)}
    </div>
  );
}
