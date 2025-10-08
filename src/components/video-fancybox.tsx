"use client";

import { useEffect, useRef } from "react";
import { Fancybox } from "@fancyapps/ui";
import { VideoPlayer } from "./video-player";

interface VideoFancyboxProps {
  src: string;
  title?: string;
  poster?: string;
  thumbnail?: string;
  className?: string;
}

export function VideoFancybox({
  src,
  title,
  poster,
  thumbnail,
  className,
}: VideoFancyboxProps) {
  const triggerRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (triggerRef.current) {
      Fancybox.bind(triggerRef.current, {
        // Cấu hình Fancybox cho video
        Html: {
          video: {
            autoplay: false,
            controls: true,
            loop: false,
          },
        },
        // Tùy chỉnh giao diện
        Toolbar: {
          display: {
            left: ["infobar"],
            middle: ["play", "rotateCCW", "rotateCW", "zoomIn", "zoomOut"],
            right: ["slideshow", "thumbs", "close"],
          },
        },
        // Xử lý khi đóng modal
        on: {
          close: () => {
            // Dừng video khi đóng modal
            const video = document.querySelector("video");
            if (video) {
              video.pause();
              video.currentTime = 0;
            }
          },
        },
      });
    }

    return () => {
      Fancybox.unbind(triggerRef.current);
      Fancybox.close();
    };
  }, []);

  return (
    <a
      ref={triggerRef}
      href={src}
      data-fancybox="video-gallery"
      data-caption={title}
      className={className}
    >
      {thumbnail ? (
        <img
          src={thumbnail}
          alt={title || "Video thumbnail"}
          className="w-full h-full object-cover rounded-lg"
        />
      ) : (
        <VideoPlayer
          src={src}
          title={title}
          poster={poster}
          controls={false}
          className="cursor-pointer"
        />
      )}
    </a>
  );
}
