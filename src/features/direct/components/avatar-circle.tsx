"use client";

import { useEffect, useState } from "react";

export function AvatarCircle(props: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  forceSkeleton?: boolean;
  blur?: boolean;
  loading?: "eager" | "lazy";
}) {
  const { src, alt, className, imgClassName, forceSkeleton, blur, loading } =
    props;
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
  }, [src]);

  const showSkeleton = Boolean(forceSkeleton) || !loaded;

  return (
    <div className={className}>
      {showSkeleton ? (
        <div className="absolute inset-0 bg-white/10 animate-pulse" />
      ) : null}

      <img
        src={src}
        alt={alt}
        loading={loading ?? "lazy"}
        decoding="async"
        referrerPolicy="no-referrer"
        className={`${imgClassName ?? ""} ${showSkeleton ? "opacity-0" : "opacity-100"} ${blur ? "blur-md" : ""} transition-opacity`}
        onLoad={() => setLoaded(true)}
        onError={(e) => {
          e.currentTarget.src = "/placeholder-avatar.png";
          setLoaded(true);
        }}
      />
    </div>
  );
}
