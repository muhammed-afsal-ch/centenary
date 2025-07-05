
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { motion } from 'framer-motion';


export default function Home() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);


    const handleDownloadRedirect = () => {
        if (typeof navigator === "undefined") return;

        const userAgent = navigator.userAgent || navigator.vendor || window.opera;

        if (/android/i.test(userAgent)) {
            // ✅ Android → Play Store
            window.location.href = "https://play.google.com/store/apps/details?id=com.samastha.centenary";
        } else if (
            /iPad|iPhone|iPod/.test(userAgent) ||
            (navigator.userAgent.includes("Macintosh") && 'ontouchend' in document)
        ) {
            // ✅ iOS or macOS (with touch support) → App Store
            window.location.href = "https://apps.apple.com/in/app/samastha-centenary/id6743690865?platform=iphone";
        } else {
            // ❌ Others → Show message
            window.location.href = "https://apps.apple.com/in/app/samastha-centenary/id6743690865?platform=iphone";

        }
    };


    // Lock body scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isMenuOpen]);

    return (
        <div className="relative min-h-screen text-white font-sans overflow-hidden">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-black/80 via-gray-900/80 to-black/80 backdrop-blur-md shadow-lg">
                <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                    {/* Logo */}
                    <Link href="#hero" className="flex items-center space-x-2">
                        <Image
                            src="/images/textlogo.png"
                            alt="Samastha Logo"
                            width={120}
                            height={40}
                            className="filter invert brightness-0 contrast-200"
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link href="#hero" className="text-white hover:text-yellow-300 transition-colors duration-300">
                            Home
                        </Link>
                        <Link href="#features" className="text-white hover:text-yellow-300 transition-colors duration-300">
                            Features
                        </Link>
                        <Link href="#posts" className="text-white hover:text-yellow-300 transition-colors duration-300">
                            Updates
                        </Link>
                        <Link href="#video-document" className="text-white hover:text-yellow-300 transition-colors duration-300">
                            Video
                        </Link>
                        <Link href="#about" className="text-white hover:text-yellow-300 transition-colors duration-300">
                            About
                        </Link>
                        <Link href="/sign-in" className="text-white bg-indigo-600 px-4 py-2 rounded-full hover:bg-indigo-700 transition-colors duration-300">
                            Sign In
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-white focus:outline-none"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16m-7 6h7"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Modal */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="bg-gray-900/90 rounded-xl p-6 w-11/12 max-w-md shadow-lg"
                    >
                        <button
                            onClick={() => setIsMenuOpen(false)}
                            className="absolute top-4 right-4 text-white text-2xl"
                        >
                            ✕
                        </button>
                        <div className="flex flex-col items-center space-y-6 mt-6">
                            <Link href="#hero" className="text-white hover:text-yellow-300 transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>
                                Home
                            </Link>
                            <Link href="#features" className="text-white hover:text-yellow-300 transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>
                                Features
                            </Link>
                            <Link href="#posts" className="text-white hover:text-yellow-300 transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>
                                Updates
                            </Link>
                            <Link href="#video-document" className="text-white hover:text-yellow-300 transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>
                                Video
                            </Link>
                            <Link href="#about" className="text-white hover:text-yellow-300 transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>
                                About
                            </Link>
                            <Link href="/sign-in" className="text-white bg-indigo-600 px-4 py-2 rounded-full hover:bg-indigo-700 transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>
                                Sign In
                            </Link>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Hero Section */}
            <section id="hero" className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-32 min-h-screen overflow-hidden mt-20">
                <div className="absolute inset-0 w-full h-full overflow-hidden z-[-1]">
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                        className="w-full h-full object-cover"
                    >
                        <source
                            src="https://centuryapp.samastha.info/public/app/p/1750841948409_post_video.mp4"
                            type="video/mp4"
                        />
                        Your browser does not support the video tag.
                    </video>
                    <div className="absolute inset-0 bg-black/50" />
                </div>

                <div className="hidden lg:flex items-center space-x-4">
                    <img
                        src="/images/textlogo.png"
                        className="h-40 filter invert brightness-0 contrast-200"
                        alt="Logo"
                    />
                </div>

                <h2 className="text-4xl md:text-6xl mt-8 font-extrabold mb-4 bg-gradient-to-r from-yellow-100 via-white to-pink-100 bg-clip-text text-transparent drop-shadow-lg">
                    Celebrate the Legacy
                </h2>

                <p className="text-lg md:text-xl max-w-2xl mb-8 text-white/90">
                    Join us in commemorating 100 years of excellence, unity, and spiritual heritage with the official Samastha app.
                </p>

                <div className="flex flex-wrap justify-center gap-4">
                    <button
                        onClick={handleDownloadRedirect}
                        className="relative inline-block px-6 py-3 rounded-full font-semibold text-indigo-700 bg-white shadow-lg hover:shadow-indigo-400 transition duration-300 overflow-hidden group"
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-white/40 via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-500 blur-lg" />
                        <span className="relative z-10">Download Now</span>
                    </button>


                    <Link
                        href="#features"
                        className="border border-white px-6 py-3 rounded-full hover:bg-white hover:text-indigo-700 transition"
                    >
                        Learn More
                    </Link>
                </div>

            </section>

            {/* App Highlights Section */}
            <section id="features" className="relative px-6 py-20 z-10 overflow-hidden">
                <div className="absolute inset-0 z-[-2]">
                    <img
                        src="/images/onebg.png"
                        alt="Background"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-[-1]" />

                <h3 className="text-center text-3xl md:text-4xl font-bold mb-12 bg-gradient-to-r from-yellow-100 via-white to-pink-100 bg-clip-text text-transparent">
                    App Highlights
                </h3>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                    {[
                        {
                            title: '📸 Photo Sharing & Memories',
                            desc: 'View and share beautiful moments from the centenary celebrations, with galleries updated daily.',
                        },
                        {
                            title: '📰 Real-Time News',
                            desc: 'Stay informed with live schedules, event alerts, and instant updates straight from Samastha.',
                        },
                        {
                            title: '📅 Event Highlights',
                            desc: 'Access a complete timeline of cultural and spiritual events happening across various locations.',
                        },
                        {
                            title: '📍 Location-Based Activities',
                            desc: 'Find local programs and exhibitions tied to the centenary celebrations wherever you are.',
                        },
                        {
                            title: '🤝 Community Connection',
                            desc: 'Celebrate together by sharing your stories, experiences, and prayers with the Samastha family.',
                        },
                        {
                            title: '📱 Lightweight & Fast',
                            desc: 'Optimized for all Android devices with real-time updates and minimal battery usage.',
                        },
                    ].map((item, index) => (
                        <div
                            key={index}
                            className="bg-white/10 border border-white/20 backdrop-blur-lg rounded-2xl p-6 shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                        >
                            <h4 className="text-xl font-semibold mb-2 bg-gradient-to-r from-yellow-200 via-white to-pink-200 bg-clip-text text-transparent">
                                {item.title}
                            </h4>
                            <p className="text-white/90">{item.desc}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-16 flex justify-center">
                    <div className="h-[2px] w-48 bg-gradient-to-r from-pink-400 via-white to-yellow-300 animate-pulse rounded-full opacity-60"></div>
                </div>
            </section>

            {/* All Posts Section */}
            <section id="posts" className="relative px-6 py-20 z-10 overflow-hidden">
                <div className="absolute inset-0 z-[-2]">
                    <img
                        src="/images/onebg.png"
                        alt="Background"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-[-1]" />

                <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="text-center text-3xl md:text-4xl font-bold mb-12 bg-gradient-to-r from-yellow-100 via-white to-pink-100 bg-clip-text text-transparent"
                >
                    Latest Updates
                </motion.h3>

                <AllPosts />
            </section>

            {/* Video Document Section */}
            <section id="video-document" className="relative px-6 py-20 z-10 overflow-hidden">
                <div className="absolute inset-0 z-[-2]">
                    <img
                        src="/images/onebg.png"
                        alt="Background"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-[-1]" />

                <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="text-center text-3xl md:text-4xl font-bold mb-12 bg-gradient-to-r from-yellow-100 via-white to-pink-100 bg-clip-text text-transparent"
                >
                    Documentary
                </motion.h3>

                <div className="max-w-4xl mx-auto">
                    <div className="bg-white/10 border border-white/20 backdrop-blur-lg rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            controls
                            className="w-full rounded-lg object-cover"
                            preload="auto"
                        >
                            <source
                                src="https://whitesmoke-panther-163774.hostingersite.com/public_html/1744246887271_WhatsApp%20Video%202025-04-08%20at%208.25.03%20AM.mp4"
                                type="video/mp4"
                            />
                            Your browser does not support the video tag.
                        </video>
                        <p className="mt-4 text-white/90 text-center">
                            A special video documenting the centenary celebrations of Samastha, recorded on April 08, 2025.
                        </p>
                    </div>
                </div>

                <div className="mt-16 flex justify-center">
                    <div className="h-[2px] w-48 bg-gradient-to-r from-pink-400 via-white to-yellow-300 animate-pulse rounded-full opacity-60"></div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="relative px-6 py-20 z-10 overflow-hidden">
                <div className="absolute inset-0 z-[-2]">
                    <img
                        src="/images/twobg.png"
                        alt="Background"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-[-1]" />

                <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="text-center text-3xl md:text-4xl font-bold mb-12 bg-gradient-to-r from-yellow-100 via-white to-pink-100 bg-clip-text text-transparent"
                >
                    About Us
                </motion.h3>

                <div className="max-w-5xl mx-auto">
                    {/* Header Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="bg-gradient-to-br from-black/20 to-gray-800/30 border border-white/20 backdrop-blur-md rounded-2xl p-6 mb-8 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        <h4 className="text-white text-lg font-semibold mb-2 text-center">About</h4>
                        <h2 className="text-4xl font-bold text-center text-yellow-500 my-4">
                            Samastha Kerala Jem-Iyyathul Ulama
                        </h2>
                        <p className="text-base font-medium text-gray-200 text-center">#samastha100</p>
                    </motion.div>

                    {/* About Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-[#F2EFE7]/80 border border-gray-300 rounded-2xl p-6 mb-8 shadow-md hover:shadow-lg transition-all duration-300"
                    >
                        <p className="text-lg text-gray-800 text-justify leading-relaxed">
                            <span className="text-3xl font-bold text-gray-800">K</span>erala Muslims, who constitute 24.7% of the total population of the state,
                            have their own characteristics and peculiarities that distinguish them from
                            other Muslim communities in India. Islam entered South India much earlier compared
                            to the Northern parts of the country. Arab traders and missionaries propagated
                            their faith by their own ideal manners, persuasion, and example. The direct
                            relation of Kerala Muslims with Arabian Islam alienates them from what is called
                            Indo-Persian Islam. In contrast to the rest of Muslims in India, Kerala Muslims
                            observe the Shafi’i school of law.
                        </p>
                    </motion.div>

                    {/* Mission Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="bg-[#F2EFE7]/80 border border-gray-300 rounded-2xl p-6 mb-8 shadow-md hover:shadow-lg transition-all duration-300"
                    >
                        <h4 className="text-xl font-bold text-yellow-600 mb-2 text-center">Mission</h4>
                        <div className="h-1 w-16 bg-yellow-600 mx-auto mb-4 rounded"></div>
                        <p className="text-gray-800 text-justify leading-relaxed">
                            <span className="text-3xl font-bold text-gray-800">T</span>he mission of Samastha Kerala Jamiathul Ulema is to propagate the ideology
                            of Ahlussunnathi Waljamaath among the Muslim community and to defend false
                            and new ideologies that have strayed from the true path of Islamic belief
                            and tradition.
                        </p>
                    </motion.div>

                    {/* Vision Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="bg-[#F2EFE7]/80 border border-gray-300 rounded-2xl p-6 mb-8 shadow-md hover:shadow-lg transition-all duration-300"
                    >
                        <h4 className="text-xl font-bold text-gray-600 mb-2 text-center">Vision</h4>
                        <div className="h-1 w-16 bg-gray-600 mx-auto mb-4 rounded"></div>

                        {/* <h4 className="text-xl font-bold text-green-500 mb-2 text-center">Vision</h4>
                        <div className="h-1 w-16 bg-green-400 mx-auto mb-4 rounded"></div> */}
                        <p className="text-gray-800 text-justify leading-relaxed">
                            <span className="text-3xl font-bold text-gray-800">T</span>he vision of Samastha Kerala Jamiathul Ulema is to extend absolute services
                            to the Muslim community, strengthening the existence and advancement of the
                            Ahlussunnathi Wal Jamaath and standing steadfastly for the propagation of
                            the same ideology within secular guidelines.
                        </p>
                    </motion.div>
                </div>

                <div className="mt-16 flex justify-center">
                    <div className="h-[2px] w-48 bg-gradient-to-r from-pink-400 via-white to-yellow-300 animate-pulse rounded-full opacity-60"></div>
                </div>
            </section>
        </div>
    );
}

function AllPosts() {
    const [posts, setPosts] = useState([]);
    const [pageNum, setPageNum] = useState(1);
    const [limit] = useState(6);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeType, setActiveType] = useState('All');
    const [selectedPost, setSelectedPost] = useState(null);
    const filterOptions = ['All', 'Images', 'video', 'textonly'];

    const fetchPosts = async (page) => {
        setLoading(true);
        setError('');
        try {
            const { data } = await axios.get(`/api/posts/all?page=${page}&limit=${limit}`);
            const newPosts = Array.isArray(data) ? data : (data.posts || []);
            setPosts((prevPosts) => [...prevPosts, ...newPosts]);
            if (newPosts.length === 0 || newPosts.length < limit) {
                setHasMore(false);
            }
        } catch (err) {
            console.error('Error fetching posts:', err);
            setError(err.response?.data?.error || 'Failed to fetch posts.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts(pageNum);
    }, [pageNum]);

    const loadMore = () => {
        setPageNum((prevPage) => prevPage + 1);
    };

    const getTimeAgo = (date) => {
        if (!date) return 'Centenary';
        const now = new Date();
        const created = new Date(date);
        const diffInSeconds = Math.floor((now - created) / 1000);
        if (diffInSeconds < 60) return 'Just now';
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays === 1) return 'Yesterday';
        return created.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const handleDownload = async (post) => {
        const isVideoPost = post.VIDEOLINK && (post.TYPE === 'video' || post.TYPE.toLowerCase().includes('video'));
        let thumbnail = [];
        try {
            thumbnail = JSON.parse(post.IMAGEURL) || [];
        } catch (e) {
            console.error('Error parsing IMAGEURL for post', post.POST_ID, ':', post.IMAGEURL);
            thumbnail = [];
        }

        const mediaUrl = isVideoPost ? post.VIDEOLINK : thumbnail[0];
        const filename = `samastha_${post.POST_ID}.${isVideoPost ? 'mp4' : 'jpg'}`;

        try {
            const response = await fetch(mediaUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            alert(`${isVideoPost ? 'Video' : 'Image'} downloaded successfully!`);
        } catch (error) {
            console.error('Error downloading:', error);
            alert(`Failed to download ${isVideoPost ? 'video' : 'image'}.`);
        }
    };

    const handleShare = async (post) => {
        const isVideoPost = post.VIDEOLINK && (post.TYPE === 'video' || post.TYPE.toLowerCase().includes('video'));
        const isTextOnly = post.TYPE === 'textonly';
        let thumbnail = [];
        try {
            thumbnail = JSON.parse(post.IMAGEURL) || [];
        } catch (e) {
            console.error('Error parsing IMAGEURL for post', post.POST_ID, ':', post.IMAGEURL);
            thumbnail = [];
        }

        const shareData = isTextOnly
            ? { title: 'Samastha Post', text: `${post.CAPTION} @Samastha App`, url: window.location.href }
            : { title: 'Samastha Post', text: `${post.CAPTION} @Samastha App`, url: isVideoPost ? post.VIDEOLINK : thumbnail[0] };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
                console.log('Shared successfully!');
            } catch (error) {
                console.error('Error sharing:', error);
                alert('Failed to share post.');
            }
        } else {
            alert('Sharing is not supported on this browser.');
        }
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text).then(
            () => alert('Text copied to clipboard!'),
            (err) => {
                console.error('Error copying text:', err);
                alert('Failed to copy text.');
            }
        );
    };

    const openModal = (post) => {
        const isTextOnly = post.TYPE === 'textonly';
        if (!isTextOnly) {
            setSelectedPost(post);
        }
    };

    const closeModal = () => {
        setSelectedPost(null);
    };

    return (
        <div className="max-w-6xl mx-auto">
            {error && (
                <div className="p-4 bg-red-100 text-red-800 rounded mb-4 text-center">
                    {error}
                </div>
            )}

            {posts.length === 0 && !loading && !error && (
                <p className="text-center text-white/90">No posts found.</p>
            )}

            <div className="flex flex-wrap justify-center gap-3 mb-10">
                {filterOptions.map((type) => (
                    <button
                        key={type}
                        onClick={() => setActiveType(type)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-md transition-all duration-300 border 
              ${activeType === type
                                ? 'bg-white/20 text-white border-white/30 shadow-lg shadow-white/10'
                                : 'bg-white/10 text-white/80 border-white/10 hover:bg-white/20 hover:shadow-white/10'
                            } relative overflow-hidden group`}
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/60 to-white/20 opacity-0 group-hover:opacity-10 transition duration-700 blur-md animate-pulse" />
                        <span className="relative z-10">
                            {type === 'All' ? 'All Posts' : type.charAt(0).toUpperCase() + type.slice(1)}
                        </span>
                    </button>
                ))}
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {posts
                    .filter((post) => {
                        let thumbnail = [];
                        try {
                            thumbnail = JSON.parse(post.IMAGEURL) || [];
                        } catch (e) {
                            console.error('Error parsing IMAGEURL for post', post.POST_ID, ':', post.IMAGEURL);
                            thumbnail = [];
                        }
                        if (activeType === 'All') return true;
                        if (activeType === 'Images') return !post.VIDEOLINK && post.TYPE !== 'textonly' && thumbnail.length > 0;
                        return post.TYPE?.toLowerCase() === activeType.toLowerCase();
                    })
                    .map((post, index) => {
                        let thumbnail = [];
                        try {
                            thumbnail = JSON.parse(post.IMAGEURL) || [];
                        } catch (e) {
                            console.error('Error parsing IMAGEURL for post', post.POST_ID, ':', post.IMAGEURL);
                            thumbnail = [];
                        }

                        const isVideoPost = post.VIDEOLINK && (post.TYPE === 'video' || post.TYPE.toLowerCase().includes('video'));
                        const isTextOnly = post.TYPE === 'textonly';
                        const displayMedia = isVideoPost ? post.VIDEOLINK : thumbnail[0] || '/images/placeholder.png';

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                className={`bg-white/10 border border-white/20 backdrop-blur-lg rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 ${!isTextOnly ? 'cursor-pointer' : ''}`}
                                onClick={() => openModal(post)}
                            >
                                {/* Post Header */}
                                <div className="flex items-center mb-4">
                                    <Image
                                        src="/images/logo.png"
                                        alt="Logo"
                                        width={40}
                                        height={40}
                                        className="rounded-full"
                                    />
                                    <div className="ml-3">
                                        <p className="text-sm font-semibold text-white">
                                            {isVideoPost ? 'Daily Video' : isTextOnly ? 'Daily Nasehath' : 'Posts'}
                                        </p>
                                        <p className="text-xs text-white/80">{getTimeAgo(post.CREATEDAT)}</p>
                                    </div>
                                </div>

                                {/* Media or Text */}
                                {isTextOnly ? (
                                    <p className="text-white/90 text-base">{post.CAPTION}</p>
                                ) : (
                                    <div className="relative rounded-lg overflow-hidden mb-4">
                                        {isVideoPost ? (
                                            <video
                                                src={post.VIDEOLINK}
                                                controls
                                                className="w-full h-48 object-cover rounded-lg"
                                                poster={thumbnail[0] || '/images/placeholder.png'}
                                            />
                                        ) : thumbnail.length > 0 ? (
                                            <img
                                                src={thumbnail[0]}
                                                alt="Post"
                                                className="w-full h-48 object-cover rounded-lg"
                                            />
                                        ) : (
                                            <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                                                <p className="text-white/90">No media available</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Caption */}
                                {!isTextOnly && post.CAPTION && (
                                    <p className="text-white/90 text-base line-clamp-2">{post.CAPTION}</p>
                                )}

                                {/* Actions */}
                                <div className="flex justify-end gap-2 mt-4">
                                    {isTextOnly ? (
                                        <>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCopy(post.CAPTION);
                                                }}
                                                className="p-2 rounded-full bg-white/20 hover:bg-white/30"
                                            >
                                                <svg className="w-5 h-5 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleShare(post);
                                                }}
                                                className="p-2 rounded-full bg-white/20 hover:bg-white/30"
                                            >
                                                <svg className="w-5 h-5 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                                                </svg>
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDownload(post);
                                                }}
                                                className="p-2 rounded-full bg-white/20 hover:bg-white/30"
                                                disabled={!thumbnail && !post.VIDEOLINK}
                                            >
                                                <svg className="w-5 h-5 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M16 12l-4 4m0 0l-4-4m4 4V3" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleShare(post);
                                                }}
                                                className="p-2 rounded-full bg-white/20 hover:bg-white/30"
                                                disabled={!thumbnail && !post.VIDEOLINK}
                                            >
                                                <svg className="w-5 h-5 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                                                </svg>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
            </div>

            {selectedPost && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/70"
                    onClick={closeModal}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                        className="relative max-w-3xl w-full mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {selectedPost.VIDEOLINK && (selectedPost.TYPE === 'video' || selectedPost.TYPE.toLowerCase().includes('video')) ? (
                            <video
                                src={selectedPost.VIDEOLINK}
                                controls
                                autoPlay
                                className="w-full max-h-[80vh] object-contain rounded-lg"
                                poster={(() => {
                                    let thumbnail = [];
                                    try {
                                        thumbnail = JSON.parse(selectedPost.IMAGEURL) || [];
                                    } catch (e) {
                                        console.error('Error parsing IMAGEURL for modal', selectedPost.POST_ID, ':', selectedPost.IMAGEURL);
                                    }
                                    return thumbnail[0] || '/images/placeholder.png';
                                })()}
                            />
                        ) : (
                            <img
                                src={(() => {
                                    let thumbnail = [];
                                    try {
                                        thumbnail = JSON.parse(selectedPost.IMAGEURL) || [];
                                    } catch (e) {
                                        console.error('Error parsing IMAGEURL for modal', selectedPost.POST_ID, ':', selectedPost.IMAGEURL);
                                    }
                                    return thumbnail[0] || '/images/placeholder.png';
                                })()}
                                alt="Full Post"
                                className="w-full max-h-[80vh] object-contain rounded-lg"
                            />
                        )}
                        <button
                            className="absolute top-2 right-2 text-white text-2xl bg-black/50 rounded-full p-2 hover:bg-black/70"
                            onClick={closeModal}
                        >
                            ✕
                        </button>
                        <div className="absolute bottom-4 left-4 right-4 bg-black/50 text-white text-sm p-2 rounded">
                            <p>{selectedPost.CAPTION}</p>
                        </div>
                    </motion.div>
                </div>
            )}

            {loading && (
                <div className="flex justify-center mt-8">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                </div>
            )}

            {hasMore && !loading && (
                <div className="flex justify-center mt-8">
                    <button
                        onClick={loadMore}
                        className="bg-white text-indigo-700 font-semibold px-6 py-3 rounded-full shadow-md hover:shadow-lg hover:bg-gray-100 transition"
                    >
                        Load More
                    </button>
                </div>
            )}
        </div>
    );
}
