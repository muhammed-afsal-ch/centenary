import { format } from 'date-fns';
import Link from 'next/link';
import { ArrowLeft, AlertCircle } from 'lucide-react';

// Debug function to log issues
function logError(message) {
    console.error(`[Page Error] ${message}`);
}

export default async function Page({ params }) {
    try {
        const { id } = await params; // Await params for Next.js 15+ compatibility

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${id}`, {
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store',
        });

        if (!res.ok) {
            logError(`Failed to load post ${id}: ${res.statusText}`);
            return <NoPostFound statusText={res.statusText} />;
        }

        const post = await res.json();
        if (!post || typeof post !== 'object') {
            logError(`Invalid post data for id ${id}:`, post);
            return <NoPostFound />;
        }

        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
                {/* Back Button */}
                <div className="container mx-auto px-4 py-6">
                    <Link
                        href="/"
                        className="group inline-flex items-center space-x-2 text-gray-800 bg-white/80 hover:bg-white hover:shadow-md px-4 py-2 rounded-lg transition-all duration-200 backdrop-blur-sm"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-medium">Back to Home</span>
                    </Link>
                </div>

                {/* Main Content */}
                <div className="container mx-auto px-4">
                    {/* Banner */}
                    <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] rounded-2xl overflow-hidden shadow-xl">
                        {post.IMAGEURL ? (
                            <img
                                src={post.IMAGEURL}
                                alt="Post Banner"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 font-medium">
                                No Image Available
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent flex items-end">
                            <div className="p-6 sm:p-8 md:p-12 max-w-3xl w-full">
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight drop-shadow-lg">
                                    {post.TITLE?.trim() || 'Untitled Post'}
                                </h1>
                                <p className="text-sm sm:text-base mt-3 text-gray-200 font-medium">
                                    {post.CREATEDAT
                                        ? format(new Date(post.CREATEDAT), 'MMMM d, yyyy h:mm a')
                                        : 'Unknown Date'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Caption Section */}
                    <div className="relative mt-2 bg-gradient-to-br from-white via-gray-50 to-gray-100 p-6 sm:p-8 rounded-xl shadow-md ring-1 ring-gray-200">
                        <div className="space-y-4 text-gray-800 text-base sm:text-lg leading-relaxed font-medium tracking-tight">
                            {post.CAPTION?.split('\n').filter(Boolean).map((line, index) => (
                                <div key={index} className="flex items-start space-x-3">
                                    <span className="text-blue-600 mt-1">✦</span>
                                    <p>{line}</p>
                                </div>
                            )) || (
                                    <div className="text-gray-500 italic">No caption available</div>
                                )}
                        </div>
                    </div>

                </div>
            </div>
        );
    } catch (error) {
        logError(`Unexpected error in Page: ${error.message}`);
        return <NoPostFound />;
    }
}

// No Post Found Component
function NoPostFound({ statusText = 'Post not found' }) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                    Oops! {statusText}
                </h2>
                <p className="text-gray-600 mb-6">
                    We couldn&apos;t find the post you&apos;re looking for. It might have been removed or doesn&apos;t exist.
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center space-x-2 bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Return to Home</span>
                </Link>
            </div>
        </div>
    );
}