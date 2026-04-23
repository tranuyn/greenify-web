"use client";

import { useState } from "react";

interface UserAvatarProps {
  name: string;
  avatarUrl?: string | null;
  sizeClassName?: string;
  textClassName?: string;
  className?: string;
}

export function UserAvatar({
  name,
  avatarUrl,
  sizeClassName = "h-10 w-10",
  textClassName = "text-sm",
  className = "",
}: UserAvatarProps) {
  const [hasImageError, setHasImageError] = useState(false);
  const initial = (name?.trim()?.charAt(0) || "U").toUpperCase();
  const shouldShowImage = Boolean(avatarUrl) && !hasImageError;

  if (shouldShowImage) {
    return (
      <img
        src={avatarUrl || undefined}
        alt={name}
        onError={() => setHasImageError(true)}
        className={`${sizeClassName} rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`flex ${sizeClassName} items-center justify-center rounded-full bg-primary-100 font-bold text-primary-content ${textClassName} ${className}`}
    >
      {initial}
    </div>
  );
}
