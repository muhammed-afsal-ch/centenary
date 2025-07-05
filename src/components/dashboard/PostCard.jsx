'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const getTimeAgo = (date) => {
  if (!date) return "Centenary";

  const now = new Date();
  const created = new Date(date);
  const diffInSeconds = Math.floor((now - created) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "Yesterday";

  return created.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const PostCard = ({ caption, thumbnail, postId, createdAt, naseehath, video, videoheight, videowidth, imageheight, imagewidth }) => {
  const [imageDimensions, setImageDimensions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [timeAgo, setTimeAgo] = useState(getTimeAgo(createdAt));
  const [imageLoadError, setImageLoadError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const isLogged = false;

  // Normalize naseehath types for video handling
  const isVideoPost = video && (naseehath === 'naseehath' || naseehath === 'video' || naseehath.toLowerCase().includes('video'));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeAgo(getTimeAgo(createdAt));
    }, 60000);

    return () => clearInterval(interval);
  }, [createdAt]);

  useEffect(() => {
    console.log('====================================');
    console.log(naseehath, "type");
    console.log('====================================');

    if (thumbnail && thumbnail.length > 0 && thumbnail[0] && naseehath !== 'textonly' && !isVideoPost) {
      const img = new window.Image();
      img.src = thumbnail[0];
      img.onload = () => {
        setImageDimensions({ width: imagewidth || img.width, height: imageheight || img.height });
      };
      img.onerror = () => {
        console.error(`Failed to load image for post ${postId}:`, thumbnail[0]);
        setImageLoadError(true);
        setImageDimensions({ width: 640, height: 360 }); // Default 16:9 aspect ratio
      };
    } else if (isVideoPost) {
      // Set dimensions for video posts
      setImageDimensions({ width: videowidth || 640, height: videoheight || 360 });
    }
  }, [thumbnail, postId, naseehath, video, imagewidth, imageheight, videowidth, videoheight, isVideoPost]);

  useEffect(() => {
    if (isPlaying && videoRef.current) {
      videoRef.current.play();
    } else if (videoRef.current) {
      videoRef.current.pause();
    }
  }, [isPlaying]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Share Post',
          text: `${caption} @Sargalayam App`,
          url: video || thumbnail[currentImageIndex],
        });
        console.log("Shared successfully!");
      } catch (error) {
        console.error("Error sharing:", error);
        alert("Failed to share post.");
      }
    } else {
      alert("Sharing is not supported on this browser.");
    }
  };

  const download = async () => {
    setIsLoading(true);
    const activeMedia = video || thumbnail[currentImageIndex];
    const filename = `sargalayam_${new Date().getTime()}.${video ? 'mp4' : 'jpg'}`;

    try {
      const response = await fetch(activeMedia);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      alert(`${video ? 'Video' : 'Image'} downloaded successfully!`);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert(`Failed to download ${video ? 'video' : 'image'}.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReadMoreToggle = () => {
    setExpanded(!expanded);
  };

  const screenWidth = 640;
  const paddingHorizontal = 16;
  const adjustedWidth = screenWidth - paddingHorizontal;
  const aspectRatio = imageDimensions ? imageDimensions.width / imageDimensions.height : 1;
  const normalHeight = adjustedWidth / aspectRatio;

  const shouldRenderContent = naseehath === "textonly" || imageDimensions || imageLoadError;

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? thumbnail.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === thumbnail.length - 1 ? 0 : prev + 1));
  };

  if (!shouldRenderContent) {
    return (
      <div className="flex flex-col items-center px-4 mb-14 border border-white pt-4 rounded-lg bg-gray-50">
        <div className="flex flex-row gap-3 items-start justify-center border border-gray-200 py-1 px-2 rounded-lg bg-gray-50 mb-4 w-full">
          <div className="flex justify-center items-center flex-row flex-1">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <div className="flex justify-center flex-1 ml-3 gap-y-1">
              <p className="font-semibold text-sm line-clamp-1">SAMASTHA</p>
              <p className="text-xs text-gray-900 line-clamp-1">Centenary</p>
            </div>
          </div>
          <div className="flex flex-row gap-2">
            <button onClick={download} disabled className="p-3 rounded-full">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M16 12l-4 4m0 0l-4-4m4 4V3" />
              </svg>
            </button>
            <button onClick={handleShare} disabled className="p-3 rounded-full">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </button>
          </div>
        </div>
        <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center px-4 mb-8 border border-white pt-4 rounded-lg bg-gray-50">
      <div className="flex flex-row gap-3 items-start justify-center border border-gray-200 py-1 px-2 rounded-lg bg-gray-50 w-full">
        <div className="flex justify-center items-center flex-row flex-1">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div className="flex justify-center flex-1 ml-2 mt-1 flex-col">
            <p className="font-semibold text-sm line-clamp-1">
              {isVideoPost ? "Daily Video" : naseehath === "textonly" ? "SAMASTHA" : naseehath}
            </p>
            <p className="text-xs text-gray-900 line-clamp-1">{timeAgo}</p>
          </div>
        </div>
        <div className="flex flex-row gap-2">
          <button onClick={download} disabled={!thumbnail && !video} className="p-3 rounded-full">
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M16 12l-4 4m0 0l-4-4m4 4V3" />
            </svg>
          </button>
          <button onClick={handleShare} disabled={!thumbnail && !video} className="p-3 rounded-full">
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="mt-4 w-full relative rounded-lg overflow-hidden">
        {naseehath === "textonly" ? (
          <p className="text-2xl font-amedium text-left pb-2">{caption}</p>
        ) : isVideoPost && typeof video === 'string' && video.startsWith('http') ? (
          !isPlaying ? (
            <button
              onClick={() => setIsPlaying(true)}
              className="relative w-full"
              style={{ height: videoheight || normalHeight }}
            >
              <img
                src={thumbnail[0] || '/images/placeholder.png'}
                alt="Video Thumbnail"
                style={{ width: adjustedWidth, height: videoheight || normalHeight, objectFit: 'cover' }}
                className="rounded-lg"
                onError={() => {
                  console.error(`Thumbnail display failed for post ${postId}:`, thumbnail[0]);
                  setImageLoadError(true);
                }}
              />
              <svg
                className="absolute w-12 h-12 text-white opacity-80"
                style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          ) : (
            <video
              ref={videoRef}
              src={video}
              style={{ width: adjustedWidth, height: videoheight || normalHeight, borderRadius: 8 }}
              controls
              onEnded={() => setIsPlaying(false)}
              onError={(e) => {
                console.error(`Video error for post ${postId}:`, e);
                setIsPlaying(false);
                alert('Failed to load video.');
              }}
            />
          )
        ) : thumbnail && Array.isArray(thumbnail) && thumbnail.length > 0 ? (
          <div className="relative">
            <img
              src={thumbnail[currentImageIndex]}
              alt="Post"
              style={{ width: adjustedWidth, height: normalHeight }}
              className="rounded-lg object-cover"
              onError={() => {
                console.error(`Image display failed for post ${postId}:`, thumbnail[currentImageIndex]);
                setImageLoadError(true);
              }}
            />
            {thumbnail.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-green-600 text-white p-2 rounded-full hover:bg-green-700 opacity-80"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-600 text-white p-2 rounded-full hover:bg-green-700 opacity-80"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/50 text-white text-sm px-2 py-1 rounded">
                  {currentImageIndex + 1}/{thumbnail.length}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
            <p>No media available</p>
          </div>
        )}

        {!isLogged && naseehath !== "textonly" && !isVideoPost && (
          <button
            className="absolute right-4 bottom-4 bg-gray-400 p-2 rounded-full opacity-40"
            onClick={() => setIsModalVisible(true)}
            disabled={thumbnail?.length === 0}
          >
            <svg
              className="w-6 h-6 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 3H5a2 2 0 00-2 2v3m0 8v3a2 2 0 002 2h3m8-18h3a2 2 0 012 2v3m0 8v3a2 2 0 01-2 2h-3"
              />
            </svg>
          </button>
        )}
      </div>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      )}

      {caption && naseehath !== "textonly" && (
        <div className="flex flex-col w-full mt-3">
          <p className={`text-base font-light ${!expanded ? 'line-clamp-2' : ''}`}>
            {caption}
          </p>
          {caption.length > 100 && (
            <button onClick={handleReadMoreToggle} className="text-blue-500 mt-1 text-left">
              {expanded ? 'Read Less' : 'Read More'}
            </button>
          )}
        </div>
      )}

      {isModalVisible && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/70"
          onClick={() => setIsModalVisible(false)}
        >
          <div
            className="relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={thumbnail[currentImageIndex]}
              alt="Full Screen Post"
              style={{
                maxWidth: '90vw',
                maxHeight: '90vh',
                objectFit: 'contain',
                borderRadius: '8px',
              }}
            />
            <button
              className="absolute top-2 right-2 text-white text-3xl bg-black/50 rounded-full p-1 hover:bg-black/70"
              onClick={() => setIsModalVisible(false)}
            >
              ✕
            </button>
            {thumbnail.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-green-600 text-white p-2 rounded-full hover:bg-green-700 opacity-80"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-600 text-white p-2 rounded-full hover:bg-green-700 opacity-80"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/50 text-white text-sm px-2 py-1 rounded">
                  {currentImageIndex + 1}/{thumbnail.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;