'use client';

import { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import AllPosts from '../components/AllPosts';
import Downloads from '../components/Downloads';
import PodcastsList from '../components/PodcastsList';

// Skeleton Components
const NewsSkeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-[500px] bg-gray-200 rounded-2xl"></div>
  </div>
);

const CardSkeleton = () => (
  <div className="animate-pulse rounded-2xl bg-white/60 border border-[#2E7D32]/10 p-5 shadow-lg">
    <div className="flex gap-4">
      <div className="bg-gray-200 w-[70px] h-[70px] rounded-xl" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  </div>
);

const AlbumSkeleton = () => (
  <div className="animate-pulse rounded-2xl bg-white/60 border border-[#2E7D32]/10 p-5 shadow-lg">
    <div className="relative w-full aspect-square bg-gray-200 rounded-xl" />
    <div className="p-4">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    </div>
  </div>
);

const SocialMediaSkeleton = () => (
  <div className="animate-pulse rounded-2xl bg-white/60 border border-[#2E7D32]/10 p-4 shadow-lg mb-2">
    <div className="flex gap-4">
      <div className="bg-gray-200 w-12 h-12 rounded-md" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
      </div>
    </div>
  </div>
);

function SocialMediaLinks({ socialMedia }) {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-[#2E7D32] mb-6">Follow Us</h2>

      <div className="flex flex-col gap-4">
        {socialMedia.map((item, index) => (
          <a
            key={index}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 p-4 rounded-2xl shadow-lg border border-white/10 bg-white/20 backdrop-blur-md hover:shadow-2xl transition-transform duration-300 hover:scale-105"
          >
            {/* Image */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-xl overflow-hidden border border-gray-200">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="64px"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Text Content */}
            <div className="flex flex-col">
              <h3 className="text-lg sm:text-xl font-semibold text-[#1A237E] group-hover:text-[#2E7D32] transition-colors duration-300">
                {item.name}
              </h3>
              <p className="text-sm sm:text-base text-[#1A237E]/70">
                {item.description}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [recommendedNews, setRecommendedNews] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [downloads, setDownloads] = useState([]);
  const [bannerNews, setBannerNews] = useState([]);
  const [podcasts, setPodcasts] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [socialMedia, setSocialMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLogged] = useState(false);
  const [pageDownloads, setPageDownloads] = useState(1);
  const [pagePodcasts, setPagePodcasts] = useState(1);
  const [hasMoreDownloads, setHasMoreDownloads] = useState(true);
  const [hasMorePodcasts, setHasMorePodcasts] = useState(true);

  const fetchMoreDownloads = async () => {
    if (loading || !hasMoreDownloads) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/downloads/all?page=${pageDownloads + 1}&limit=10`);
      if (!res.ok) throw new Error('Failed to fetch more downloads');
      const data = await res.json();
      setDownloads((prev) => [...prev, ...data]);
      if (data.length < 10) setHasMoreDownloads(false);
      setPageDownloads((prev) => prev + 1);
    } catch (err) {
      console.error('Error fetching more downloads:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMorePodcasts = async () => {
    if (loading || !hasMorePodcasts) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/podcasts/all?page=${pagePodcasts + 1}&limit=3`);
      if (!res.ok) throw new Error('Failed to fetch more podcasts');
      const data = await res.json();
      setPodcasts((prev) => [...prev, ...data]);
      if (data.length < 3) setHasMorePodcasts(false);
      setPagePodcasts((prev) => prev + 1);
    } catch (err) {
      console.error('Error fetching more podcasts:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [postsRes, notiRes, downloadsRes, bannerRes, podcastsRes, albumsRes, socialRes] = await Promise.all([
          fetch('/api/posts/recentposts').then(res => res.ok ? res.json() : Promise.reject('Posts fetch failed')),
          fetch('/api/notification/all').then(res => res.ok ? res.json() : Promise.reject('Notifications fetch failed')),
          fetch('/api/downloads/all?page=1&limit=10').then(res => res.ok ? res.json() : Promise.reject('Downloads fetch failed')),
          fetch('/api/web/webbanner').then(res => res.ok ? res.json() : Promise.reject('Banner fetch failed')),
          fetch('/api/podcasts/all?page=1&limit=3').then(res => res.ok ? res.json() : Promise.reject('Podcasts fetch failed')),
          fetch('/api/albums').then(res => res.ok ? res.json() : Promise.reject('Albums fetch failed')),
          fetch('/api/social-media').then(res => res.ok ? res.json() : Promise.reject('Social media fetch failed')),
        ]);

        const formattedNews = postsRes
          .filter((post) => post.TYPE !== 'textonly' && post.TYPE !== 'naseehath')
          .slice(0, 6)
          .map((post, index) => ({
            id: post.POST_ID || `post-${index}`,
            title: post.TITLE || 'Untitled',
            description: post.CAPTION || '',
            image: (() => {
              try {
                return JSON.parse(post.IMAGEURL || '[]')[0] || '/images/placeholder.png';
              } catch (e) {
                console.error('Error parsing IMAGEURL for post', post.POST_ID, ':', post.IMAGEURL);
                return '/images/placeholder.png';
              }
            })(),
            source: 'സമസ്ത വാർത്തകൾ',
            time: new Date(post.CREATEDAT || Date.now()).toLocaleDateString('ml-IN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
          }));

        setRecommendedNews(formattedNews);
        setNotifications(notiRes);
        setDownloads(downloadsRes);
        setBannerNews(bannerRes);
        setPodcasts(podcastsRes);
        setAlbums(albumsRes.map((album, index) => ({
          ...album,
          name: album.name || `Album ${index + 1}`,
          thumbnail: album.thumbnail?.replace(/^http:/, 'https:') || '/images/placeholder.png',
        })));
        setSocialMedia(socialRes.map((org, index) => ({
          ...org,
          name: org.name || `Social ${index + 1}`,
          description: org.description || 'No description',
          image: org.image || '/images/placeholder.png',
          link: org.link || '#',
        })));
      } catch (err) {
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleDownloadDelete = (downloadId) => {
    setDownloads((prev) => prev.filter((download) => download.DOWNLOAD_ID !== downloadId));
  };

  const handlePodcastDelete = (podcastId) => {
    setPodcasts((prev) => prev.filter((podcast) => podcast.PODCAST_ID !== podcastId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F7FA] to-[#E6ECEF] text-[#1A237E] p-6 rounded-xl shadow-lg">
      <div className="container mx-auto flex flex-col lg:flex-row gap-6">
        {/* 🟡 Banner */}
        <div className="order-1 lg:order-none lg:w-3/4">
          <div className="bg-white rounded-2xl overflow-hidden shadow-xl relative">
            {loading ? (
              <NewsSkeleton />
            ) : (
              <Carousel
                showThumbs={false}
                autoPlay
                infiniteLoop
                interval={5000}
                showStatus={false}
                showArrows
                transitionTime={800}
                className="rounded-2xl"
              >
                {bannerNews.map((news, index) => (
                  <div key={news.ID || `banner-${index}`} className="relative group">
                    <img
                      src={news.IMAGE_URL || '/images/placeholder.png'}
                      alt={news.TITLE || 'Banner'}
                      className="w-full h-[500px] object-cover brightness-100 group-hover:brightness-90 transition duration-500 ease-in-out rounded-2xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A237E]/50 via-[#1A237E]/20 to-transparent p-6 flex flex-col justify-end">
                      <p className="text-sm text-white/80 font-medium">{news.TIME_LABEL || 'No date'}</p>
                      <h2 className="text-3xl font-bold text-white drop-shadow-md mb-2">{news.TITLE || 'Untitled'}</h2>
                      <p className="text-base text-white/90 mb-4 line-clamp-3">{news.DESCRIPTION || ''}</p>
                      <Link
                        href={`/news/${news.ID || ''}`}
                        className="absolute bottom-6 right-6 bg-[#FFD700] hover:bg-[#FFB300] text-[#1A237E] w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300"
                        title="കൂടുതൽ വായിക്കുക"
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M12.293 4.293a1 1 0 011.414 0L19 9.586a1 1 0 010 1.414l-5.293 5.293a1 1 0 01-1.414-1.414L15.586 11H4a1 1 0 110-2h11.586l-3.293-3.293a1 1 0 010-1.414z" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                ))}
              </Carousel>
            )}
          </div>

          {/* Notifications (Mobile) */}
          <div className="lg:hidden mb-6 mt-6">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="text-center text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-[#1A237E] to-[#2E7D32] bg-clip-text text-transparent"
            >
              Notifications
            </motion.h3>
            {notifications.slice(0, 4).map((noti, index) => (
              <div
                key={noti.NOTIF_ID || `noti-${index}`}
                className="relative mb-2 backdrop-blur-md bg-white/60 hover:bg-white/80 border border-[#2E7D32]/10 rounded-2xl p-4 shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer group"
              >
                <p className="text-sm text-[#1A237E]/60 mb-1">
                  🕒{' '}
                  {new Date(noti.CREATED_AT || Date.now()).toLocaleDateString('ml-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
                <h3 className="text-base font-semibold text-[#1A237E] group-hover:text-[#2E7D32] transition-colors duration-300">
                  {noti.TITLE || 'Untitled'}
                </h3>
                {noti.LINK && (
                  <a
                    href={noti.LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 z-10"
                  />
                )}
              </div>
            ))}
          </div>

          {/* 🟢 Recommended News */}
          <div className="mt-4">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </div>
            ) : error ? (
              <div className="text-center text-red-500">Error: {error}</div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {recommendedNews.map((news, index) => (
                    <div
                      key={news.id || `news-${index}`}
                      className="relative backdrop-blur-md bg-white/60 hover:bg-white/80 border border-[#2E7D32]/10 rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all duration-500 group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="relative w-[70px] h-[70px] flex-shrink-0 rounded-xl overflow-hidden">
                          <Image
                            src={news.image || '/images/placeholder.png'}
                            alt={news.title || 'News'}
                            width={70}
                            height={70}
                            priority={index === 0}
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <a
                            href={`/p/${news.id}`}
                            rel="noopener noreferrer"
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                          >
                            <svg
                              className="w-5 h-5 text-white transform scale-90 group-hover:scale-110 transition-transform duration-300"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M12.293 4.293a1 1 0 011.414 0L19 9.586a1 1 0 010 1.414l-5.293 5.293a1 1 0 01-1.414-1.414L15.586 11H6a1 1 0 110-2h9.586l-3.293-3.293a1 1 0 010-1.414z" />
                            </svg>
                          </a>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-[#1A237E] group-hover:text-[#2E7D32] transition-colors duration-300 mb-1 line-clamp-2">
                            {news.title || 'Untitled'}
                          </h3>
                          <p className="text-sm text-[#1A237E]/70 line-clamp-2 mb-2">{news.description || ''}</p>
                          <span className="inline-block text-xs text-[#1A237E]/50 bg-[#E8F5E9] px-2 py-1 rounded-full">
                            🕒 {news.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <a
                    href="/all-posts"
                    className="inline-block px-6 py-3 bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] text-white rounded-lg font-bold shadow-xl 
                     hover:shadow-[0_0_25px_rgba(46,125,50,0.6)] hover:scale-105 transition-all duration-300 ease-in-out 
                     transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-[#2E7D32]/50"
                  >
                    View All Posts
                  </a>
                </div>
              </>
            )}
          </div>

          {/* 🟣 Latest Updates Section */}
          <div className="mt-6">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="text-center text-3xl md:text-4xl font-bold mb-12 text-[#1A237E]"
            >
              Latest Updates
            </motion.h3>
            <AllPosts initialPosts={recommendedNews} />
          </div>

          {/* 🟠 Gallery Albums Section */}
          <div className="mt-6">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="text-center text-3xl md:text-4xl font-bold mb-12 text-[#1A237E]"
            >
              Gallery Albums
            </motion.h3>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <AlbumSkeleton />
                <AlbumSkeleton />
                <AlbumSkeleton />
              </div>
            ) : error ? (
              <div className="text-center text-red-500">Error: {error}</div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {albums.slice(0, 6).map((album, index) => (
                    <Link
                      key={album.name || `album-${index}`}
                      href={`/gallery?album=${encodeURIComponent(album.name)}`}
                      className="relative backdrop-blur-md bg-white/60 hover:bg-white/80 border border-[#2E7D32]/10 rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all duration-500 group"
                    >
                      <div className="relative w-full aspect-square rounded-xl overflow-hidden">
                        <Image
                          src={album.thumbnail?.replace(/^http:/, 'https:') || '/images/placeholder.png'}
                          alt={album.name || 'Album'}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw"
                          priority={index === 0}
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-[#1A237E] group-hover:text-[#2E7D32] transition-colors duration-300">
                          {album.name || 'Untitled'}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <Link
                    href="/gallery"
                    className="inline-block px-6 py-3 bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] text-white rounded-lg font-bold shadow-xl 
                     hover:shadow-[0_0_25px_rgba(46,125,50,0.6)] hover:scale-105 transition-all duration-300 ease-in-out 
                     transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-[#2E7D32]/50"
                  >
                    View All Albums
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {/* 🔷 Sidebar (Notifications & Downloads & Podcasts & Social Media) */}
        <div className="order-2 lg:order-none lg:w-1/4 lg:mt-0 mt-6">
          <div className="backdrop-blur-md bg-white/70 p-5 w-full rounded-2xl shadow-lg mb-6 border border-[#2E7D32]/10">
            <h2 className="text-xl font-bold text-[#2E7D32] mb-3">Search</h2>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Article name, tag, category..."
                className="w-full p-3 rounded-xl border border-[#2E7D32]/10 bg-[#F5F7FA]/70 text-[#1A237E] focus:outline-none focus:ring-2 focus:ring-[#FFD700] transition-all duration-300"
              />
              <button className="absolute right-3 top-3 text-[#1A237E]/60 hover:text-[#1A237E] transition-colors duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M12.9 14.32a8 8 0 111.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 108 2a6 6 0 000 12z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Notifications (Desktop) */}
          <div className="hidden lg:block mb-6">
            {notifications.slice(0, 4).map((noti, index) => (
              <div
                key={noti.NOTIF_ID || `noti-${index}`}
                className="relative mb-2 backdrop-blur-md bg-white/60 hover:bg-white/80 border border-[#2E7D32]/10 rounded-2xl p-4 shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer group"
              >
                <p className="text-sm text-[#1A237E]/60 mb-1">
                  🕒{' '}
                  {new Date(noti.CREATED_AT || Date.now()).toLocaleDateString('ml-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
                <h3 className="text-base font-semibold text-[#1A237E] group-hover:text-[#2E7D32] transition-colors duration-300">
                  {noti.TITLE || 'Untitled'}
                </h3>
                {noti.LINK && (
                  <a
                    href={noti.LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 z-10"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Downloads (Mobile) */}
          <div className="lg:hidden">
            <Downloads downloads={downloads} isLogged={isLogged} onDownloadDelete={handleDownloadDelete} />
          </div>

          {/* Downloads (Desktop) */}
          <div className="hidden lg:block">
            <Downloads
              downloads={downloads}
              isLogged={isLogged}
              onDownloadDelete={handleDownloadDelete}
              loadMore={fetchMoreDownloads}
              hasMore={hasMoreDownloads}
            />
          </div>

          {/* Podcasts (Mobile) */}
          <div className="lg:hidden mt-6">
            <PodcastsList podcasts={podcasts} isLogged={isLogged} onPodcastDelete={handlePodcastDelete} />
          </div>

          {/* Podcasts (Desktop) */}
          <div className="hidden lg:block mt-6">
            <PodcastsList
              podcasts={podcasts}
              isLogged={isLogged}
              onPodcastDelete={handlePodcastDelete}
              loadMore={fetchMorePodcasts}
              hasMore={hasMorePodcasts}
            />
          </div>

          {/* Social Media Links (Mobile) */}
          <div className="lg:hidden mt-6">
            <SocialMediaLinks socialMedia={socialMedia} loading={loading} error={error} />
          </div>

          {/* Social Media Links (Desktop) */}
          <div className="hidden lg:block mt-6">
            <SocialMediaLinks socialMedia={socialMedia} loading={loading} error={error} />
          </div>
        </div>
      </div>
    </div>
  );
}