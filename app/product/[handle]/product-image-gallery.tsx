"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface PerfumeImage {
  url: string;
  alt: string;
}

export function ProductImageGallery({
  images,
  name,
}: {
  images: PerfumeImage[];
  name: string;
}) {
  // State to track the currently selected image
  const [selectedImage, setSelectedImage] = useState(images[0]);
  // State to track zoom modal
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  // State to track hover position for magnification
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  // State to track if user is hovering on the image
  const [isHovering, setIsHovering] = useState(false);

  // Handler for thumbnail clicks
  const handleThumbnailClick = (image: PerfumeImage) => {
    setSelectedImage(image);
  };

  // Handle mouse movement for zoom effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isHovering) return;

    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setHoverPosition({ x, y });
  };

  return (
    <div className="space-y-4">
      {/* Main large image with hover zoom */}
      <motion.div
        className="mx-auto max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="aspect-square relative overflow-hidden bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 cursor-zoom-in"
          onClick={() => setIsZoomOpen(true)}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onMouseMove={handleMouseMove}
          whileHover={{ boxShadow: "0px 5px 15px rgba(0,0,0,0.1)" }}
          layout
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedImage?.url}
              className="w-full h-full relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {selectedImage && (
                <Image
                  src={selectedImage.url}
                  alt={selectedImage.alt || name}
                  fill
                  className={`
                    object-contain object-center transition-all duration-200
                    ${isHovering ? "scale-125" : "scale-100"}
                  `}
                  style={
                    isHovering
                      ? {
                          transformOrigin: `${hoverPosition.x}% ${hoverPosition.y}%`,
                        }
                      : {}
                  }
                  priority
                  sizes="(min-width: 1024px) 35vw, (min-width: 768px) 50vw, (min-width: 640px) 60vw, 75vw"
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Zoom icon overlay with animation */}
          <motion.div
            className="absolute bottom-3 right-3 bg-white dark:bg-gray-800 bg-opacity-70 dark:bg-opacity-70 p-1.5 rounded-full shadow-md dark:shadow-black/30 z-10"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.3,
            }}
            whileHover={{
              scale: 1.2,
              backgroundColor: "rgba(255,255,255,0.9)",
            }}
            whileTap={{ scale: 0.9 }}
          >
            <ZoomIn size={18} className="text-gray-700 dark:text-gray-300" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Thumbnail images with animation */}
      {images.length > 1 && (
        <motion.div
          className="flex flex-wrap gap-2 justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {images.map((image, index) => (
            <motion.div
              key={index}
              className={`w-16 h-16 border-2 rounded-md overflow-hidden 
                ${
                  image.url === selectedImage?.url
                    ? "border-amber-500 dark:border-amber-600"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                } 
                cursor-pointer transition-colors`}
              onClick={() => handleThumbnailClick(image)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: image.url === selectedImage?.url ? 1.05 : 1,
              }}
              transition={{
                duration: 0.3,
                delay: index * 0.05,
              }}
            >
              <div className="relative h-full w-full bg-gray-50 dark:bg-gray-800">
                <Image
                  src={image.url}
                  alt={image.alt || `${name} - View ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Zoom Modal with animations */}
      <AnimatePresence>
        {isZoomOpen && (
          <motion.div
            className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsZoomOpen(false)}
          >
            <motion.div
              className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
              {/* Close button with animation */}
              <motion.button
                onClick={() => setIsZoomOpen(false)}
                className="absolute top-2 right-2 z-10 bg-white dark:bg-gray-800 rounded-full p-1.5 shadow-md dark:shadow-black/50"
                whileHover={{ scale: 1.1, backgroundColor: "#f3f4f6" }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={24} className="text-gray-800 dark:text-gray-200" />
              </motion.button>

              {/* Zoomed image with animation */}
              <motion.div
                className="relative w-full h-auto bg-white dark:bg-gray-900 rounded-lg overflow-hidden"
                layoutId="zoomableImage"
              >
                <div className="aspect-square relative">
                  <Image
                    src={selectedImage?.url || ""}
                    alt={selectedImage?.alt || name}
                    fill
                    className="object-contain"
                    sizes="(min-width: 1280px) 90vw, 95vw"
                    quality={90}
                    priority
                  />
                </div>
              </motion.div>

              {/* Thumbnails in modal with animation */}
              {images.length > 1 && (
                <motion.div
                  className="flex gap-2 mt-4 overflow-x-auto py-2 px-4 bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.2,
                    duration: 0.4,
                  }}
                >
                  {images.map((image, index) => (
                    <motion.div
                      key={index}
                      className={`flex-shrink-0 w-16 h-16 border-2 rounded-md overflow-hidden 
                        ${
                          image.url === selectedImage?.url
                            ? "border-amber-500 dark:border-amber-600"
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                        } 
                        cursor-pointer transition-colors`}
                      onClick={() => handleThumbnailClick(image)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: 1,
                        scale: image.url === selectedImage?.url ? 1.1 : 1,
                        transition: {
                          delay: 0.2 + index * 0.05,
                          duration: 0.3,
                        },
                      }}
                    >
                      <div className="relative h-full w-full bg-gray-50 dark:bg-gray-700">
                        <Image
                          src={image.url}
                          alt={image.alt || `${name} - View ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
