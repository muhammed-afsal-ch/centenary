// app/gallery/page.js
import { Suspense } from 'react';
import Gallery from './Gallery'; // Import the client component

export default function GalleryPage() {
    return (
        <Suspense fallback={<div className="container mx-auto p-6">Loading...</div>}>
            <Gallery />
        </Suspense>
    );
}