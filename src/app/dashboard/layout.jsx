'use client';

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardLayout({ children }) {
  // Sidebar states
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const pathname = usePathname();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);

  // Handle outside click for modal
  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setIsModalOpen(false);
    }
  };

  // Disable body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => document.body.classList.remove('overflow-hidden');
  }, [isModalOpen]);

  // Sidebar navigation items
  const navItems = [
    {
      name: 'Dashboard',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-green-600 group-hover:text-green-800"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
      href: '/dashboard',
      subItems: null,
    },
    {
      name: 'Posts',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-green-600 group-hover:text-green-800"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      href: null,
      subItems: [
        { name: 'Manage Posts', href: '/dashboard/allposts' },
        { name: 'Add Post', href: '/dashboard/addpost' },
        { name: 'Add Naseehath', href: '/dashboard/addnaseehath' },
      ],
    },
    {
      name: 'Updates',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-green-600 group-hover:text-green-800"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5v14l11-7L9 5z"
          />
        </svg>
      ),
      href: null,
      subItems: [
        { name: 'All Updates', href: '/dashboard/updates/all' },
        { name: 'Manage Updates', href: '/dashboard/updates/manage' },
        { name: 'Add Update', href: '/dashboard/updates/add' },
      ],
    },
    {
      name: 'Downloads',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-green-600 group-hover:text-green-800"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
      ),
      href: null, // This menu item itself doesn't navigate; its sub-items do
      subItems: [
        { name: 'Manage Downloads', href: '/dashboard/downloads/manage' },
        { name: 'Add Download', href: '/dashboard/downloads/add' },
      ],
    }
    , {
      name: 'Quiz',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-green-600 group-hover:text-green-800"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 17l-4 4m0 0l-4-4m4 4V3"
          />
        </svg>
      ),
      href: null,
      subItems: [
        { name: 'Add Question', href: '/dashboard/quiz/add-question' },
        { name: 'All Questions', href: '/dashboard/quiz/all-questions' },
        { name: 'All Response', href: '/dashboard/quiz/quiz-responses' },
      ],
    },
    {
      name: 'Settings',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-green-600 group-hover:text-green-800"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z"
          />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
      href: '/dashboard/quiz',
      subItems: null,
    },
  ];

  // Animation variants for sidebar
  const sidebarVariants = {
    expanded: { width: 256 },
    collapsed: { width: 64 },
  };

  // Animation variants for submenu
  const submenuVariants = {
    open: { height: 'auto', opacity: 1 },
    closed: { height: 0, opacity: 0 },
  };

  // Determine active item based on pathname
  const getActiveItemIndex = () => {
    const pathSegments = pathname.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1] || 'dashboard';
    if (lastSegment === 'dashboard') return 0;
    if (['allposts', 'addpost', 'addnaseehath'].includes(lastSegment)) return 1;
    if (['add-question', 'all-questions'].includes(lastSegment)) return 2;
    if (lastSegment === 'settings') return 3;
    return 0;
  };

  const activeItem = getActiveItemIndex();

  return (
    <>
      <Head>
        <title>Dashboard</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </Head>


      <div className="min-h-screen bg-gradient-to-r from-green-400 to-green-100 flex">
        {/* Desktop Sidebar */}
        <motion.aside
          className={`fixed top-0 left-0 h-full bg-white bg-gradient-to-b from-green-50 to-green-100 shadow-lg z-10 group ${isSidebarCollapsed ? 'hover:w-64' : ''}`}
          variants={sidebarVariants}
          animate={isSidebarCollapsed ? 'collapsed' : 'expanded'}
          transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.1 }}
        >
          <div className="p-4 flex items-center justify-between">
            <motion.h2
              className={`text-xl font-bold text-green-700 font-poppins ${isSidebarCollapsed ? 'hidden' : 'block'}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: 0.2 }}
            >
              Dashboard
            </motion.h2>
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="text-green-600 hover:text-green-800 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
          <nav className="mt-4">
            {navItems.map((item, index) => (
              <div key={item.name}>
                <div
                  className="relative flex items-center p-4 hover:bg-green-200 group transition-all duration-200"
                  onClick={() => {
                    if (item.subItems) {
                      setOpenSubmenu(openSubmenu === index ? null : index);
                    }
                  }}
                >
                  {item.href ? (
                    <Link href={item.href} className="flex items-center w-full">
                      <motion.span
                        className="mr-2"
                        animate={activeItem === index ? { scale: 1.1 } : { scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.icon}
                      </motion.span>
                      <span className={`font-poppins font-semibold text-gray-700 ${isSidebarCollapsed ? 'hidden' : 'block'}`}>
                        {item.name}
                      </span>
                    </Link>
                  ) : (
                    <div className="flex items-center w-full cursor-pointer">
                      <motion.span
                        className="mr-2"
                        animate={(activeItem === index || openSubmenu === index) ? { scale: 1.1 } : { scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.icon}
                      </motion.span>
                      <span className={`font-poppins font-semibold text-gray-700 ${isSidebarCollapsed ? 'hidden' : 'block'}`}>
                        {item.name}
                      </span>
                    </div>
                  )}
                  {item.subItems && (
                    <motion.svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 ml-auto text-green-600 ${isSidebarCollapsed ? 'hidden' : 'block'}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      animate={{ rotate: openSubmenu === index ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </motion.svg>
                  )}
                  <span className="absolute left-0 top-0 h-full w-1 bg-green-600 scale-y-0 group-hover:scale-y-100 transition-transform duration-200 origin-top"></span>
                </div>
                {item.subItems && openSubmenu === index && (!isSidebarCollapsed || document.querySelector('.group:hover')) && (
                  <AnimatePresence>
                    <motion.div
                      variants={submenuVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                      transition={{ duration: 0.2 }}
                      className={`${isSidebarCollapsed ? 'hidden' : 'block'}`}
                    >
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className={`block pl-12 py-2 text-sm font-poppins text-gray-600 hover:bg-green-100 hover:text-green-800 transition-all duration-200 rounded-lg mx-2 ${pathname === subItem.href ? 'bg-green-100 text-green-800' : ''
                            }`}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            ))}
          </nav>
        </motion.aside>

        {/* Mobile Sidebar (Icons Only) */}
        <aside className="md:hidden fixed bottom-0 left-0 w-full bg-white shadow-lg flex justify-around p-2">
          {navItems.map((item, index) => (
            <Link
              key={item.name}
              href={item.href || item.subItems?.[0]?.href || '#'}
              className={`text-green-600 hover:text-green-800 hover:scale-110 hover:rotate-12 transition-all duration-200 p-2 ${activeItem === index ? 'scale-110 text-green-800' : ''
                }`}
            >
              {item.icon}
            </Link>
          ))}
        </aside>

        {/* Main Content */}
        <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
          {/* Mobile Navbar */}
          <nav className="md:hidden bg-white shadow p-4 flex justify-center">
            <img src="/images/textlogo.png" alt="Logo" className="h-10" />
          </nav>

          {/* Desktop Navbar */}
          <nav className="hidden md:flex bg-white shadow p-4 justify-between items-center">
            <div className="flex items-center space-x-4">
              <img src="/images/logo.png" alt="Logo" className="h-10" />
              <img src="/images/textlogo.png" alt="Text Logo" className="h-10" />
            </div>
            <div
              className="flex items-center cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center mr-2">
                <span className="text-white text-lg font-semibold">A</span>
              </div>
              <span className="text-gray-700">Afsal Ch</span>
            </div>
          </nav>

          {/* Main Content Area */}
          <main className="flex-1 p-4 md:p-8">{children}</main>
        </div>

        {/* User Profile Modal */}
        {isModalOpen && (
          <AnimatePresence>
            <motion.div
              className="fixed inset-0 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={handleOutsideClick}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                ref={modalRef}
                onClick={(e) => e.stopPropagation()}
                className="bg-white border border-green-200 rounded-2xl p-6 max-w-sm w-full shadow-xl"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800 font-poppins">User Profile</h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-600 hover:text-green-600 transition"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex items-center">
                  <div className="h-20 w-20 rounded-full bg-green-500 flex items-center justify-center mr-4 shadow-md">
                    <span className="text-white text-3xl font-semibold">A</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 font-poppins">Afsal Ch</h3>
                    <p className="text-gray-500 font-poppins">User</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="mt-6 w-full bg-gradient-to-r from-green-500 to-green-400 text-white p-2 rounded-lg hover:from-green-600 hover:to-green-500 transition font-poppins"
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </>
  );
}