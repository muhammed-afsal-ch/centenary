'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Gallery() {
    const [albums, setAlbums] = useState([]);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [imageErrors, setImageErrors] = useState({});
    const searchParams = useSearchParams();

    // Fetch albums on mount and check for album query parameter
    useEffect(() => {
        async function fetchAlbums() {
            setLoading(true);
            try {
                const response = await fetch('/api/albums');
                const data = await response.json();
                if (response.ok) {
                    setAlbums(data);
                    // Check for album query parameter
                    const albumName = searchParams.get('album');
                    if (albumName) {
                        fetchImages(decodeURIComponent(albumName));
                    }
                } else {
                    setError(data.error);
                }
            } catch (err) {
                setError('Failed to fetch albums');
            } finally {
                setLoading(false);
            }
        }
        fetchAlbums();
    }, [searchParams]);

    // Fetch images when an album is selected
    const fetchImages = async (albumName) => {
        setLoading(true);
        setImageErrors({});
        try {
            const response = await fetch(`/api/gallery?album=${encodeURIComponent(albumName)}`);
            const data = await response.json();
            if (response.ok) {
                setImages(data.images.map(url => url.replace(/^http:/, 'https:')));
                setSelectedAlbum(albumName);
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('Failed to fetch images');
        } finally {
            setLoading(false);
        }
    };

    // Handle image load errors
    const handleImageError = (key) => {
        setImageErrors(prev => ({ ...prev, [key]: true }));
    };

    // Handle modal close
    const closeModal = () => {
        setSelectedImage(null);
    };

    // Handle next/previous image navigation
    const goToNextImage = () => {
        const currentIndex = images.indexOf(selectedImage);
        if (currentIndex < images.length - 1) {
            setSelectedImage(images[currentIndex + 1]);
        }
    };

    const goToPreviousImage = () => {
        const currentIndex = images.indexOf(selectedImage);
        if (currentIndex > 0) {
            setSelectedImage(images[currentIndex - 1]);
        }
    };

    // Modal animation variants
    const modalVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
        exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2, ease: 'easeIn' } },
    };

    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } },
        exit: { opacity: 0, transition: { duration: 0.2 } },
    };

    const imageVariants = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
        exit: { opacity: 0, x: -50, transition: { duration: 0.3 } },
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-900">Photo Gallery</h1>

            {/* Albums List */}
            {!selectedAlbum && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {loading && (
                        <div className="col-span-full flex justify-center">
                            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin animate-pulse" />
                        </div>
                    )}
                    {error && <p className="col-span-full text-center text-red-600 font-medium">{error}</p>}
                    {albums.map((album) => (
                        <motion.div
                            key={album.name}
                            className="relative cursor-pointer bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl hover:brightness-110 transition-all duration-300"
                            whileHover={{ scale: 1.05 }}
                            onClick={() => fetchImages(album.name)}
                        >
                            <div className="relative w-full aspect-square">
                                {imageErrors[album.name] ? (
                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-t-xl">
                                        <p className="text-gray-500 font-medium">Image Not Found</p>
                                    </div>
                                ) : (
                                    <Image
                                        src={album.thumbnail.replace(/^http:/, 'https:')}
                                        alt={album.name}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                        className="rounded-t-xl"
                                        priority
                                        onError={() => handleImageError(album.name)}
                                    />
                                )}
                            </div>
                            <div className="p-4">
                                <h2 className="text-lg font-semibold text-gray-800">{album.name}</h2>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Images List */}
            {selectedAlbum && (
                <div>
                    <motion.button
                        onClick={() => setSelectedAlbum(null)}
                        className="mb-6 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Back to Albums
                    </motion.button>
                    <h2 className="text-3xl font-semibold mb-6 text-gray-900">{selectedAlbum}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {loading && (
                            <div className="col-span-full flex justify-center">
                                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin animate-pulse" />
                            </div>
                        )}
                        {error && <p className="col-span-full text-center text-red-600 font-medium">{error}</p>}
                        {images.map((image, index) => (
                            <motion.div
                                key={index}
                                className="relative cursor-pointer bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl hover:brightness-110 transition-all duration-300"
                                whileHover={{ scale: 1.05 }}
                                onClick={() => setSelectedImage(image)}
                            >
                                <div className="relative w-full aspect-square">
                                    {imageErrors[index] ? (
                                        <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-lg">
                                            <p className="text-gray-500 font-medium">Image Not Found</p>
                                        </div>
                                    ) : (
                                        <Image
                                            src={image}
                                            alt={`Image ${index + 1}`}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                            className="rounded-lg"
                                            onError={() => handleImageError(index)}
                                        />
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Modal for Image Preview */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        className="fixed inset-0 bg-opacity-70 backdrop-blur-md flex items-center justify-center z-50 p-4"
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={closeModal}
                    >
                        <motion.div
                            className="relative w-full max-w-4xl bg-transparent rounded-xl "
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="relative w-full h-[90vh] flex items-center justify-center">
                                {imageErrors[selectedImage] ? (
                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-lg">
                                        <p className="text-gray-500 font-medium">Image Not Found</p>
                                    </div>
                                ) : (
                                    <motion.div
                                        className="relative w-full h-full"
                                        key={selectedImage}
                                        variants={imageVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        onClick={(e) => {
                                            const rect = e.currentTarget.getBoundingClientRect();
                                            const clickX = e.clientX - rect.left;
                                            if (clickX > rect.width / 2) {
                                                goToNextImage();
                                            } else {
                                                goToPreviousImage();
                                            }
                                        }}
                                    >
                                        <Image
                                            src={selectedImage}
                                            alt="Selected Image"
                                            fill
                                            style={{ objectFit: 'contain' }}
                                            sizes="100vw"
                                            className="rounded-lg"
                                            onError={() => handleImageError(selectedImage)}
                                        />
                                        <motion.button
                                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800/50 text-white rounded-full p-3 hover:bg-gray-800/80 transition-colors duration-300"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                goToPreviousImage();
                                            }}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            style={{ display: images.indexOf(selectedImage) === 0 ? 'none' : 'block' }}
                                            title="Previous Image"
                                        >
                                            <ChevronLeft size={24} />
                                        </motion.button>
                                        <motion.button
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800/50 text-white rounded-full p-3 hover:bg-gray-800/80 transition-colors duration-300"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                goToNextImage();
                                            }}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            style={{ display: images.indexOf(selectedImage) === images.length - 1 ? 'none' : 'block' }}
                                            title="Next Image"
                                        >
                                            <ChevronRight size={24} />
                                        </motion.button>
                                    </motion.div>
                                )}
                            </div>
                            <div className="absolute top-4 right-4 flex space-x-2">
                                <motion.button
                                    onClick={closeModal}
                                    className="bg-red-500 text-white rounded-full p-3 w-10 h-10 flex items-center justify-center hover:bg-red-600 transition-colors duration-300"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    title="Close"
                                >
                                    ✕
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}