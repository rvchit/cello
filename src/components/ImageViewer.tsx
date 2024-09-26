import React, { useEffect, useRef } from 'react';
import OpenSeadragon from 'openseadragon';

const ImageViewer: React.FC<{ imageUrl: string }> = ({ imageUrl }) => {
    const viewerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (viewerRef.current) {
            // Initialize OpenSeadragon viewer with an image
            const viewer = OpenSeadragon({
                element: viewerRef.current,
                tileSources: { 
                    type: 'imageUrl',
                    url: imageUrl, // URL of the image to display
                    },
                prefixUrl: '/openseadragon/images/', // Path to OpenSeadragon images
                showNavigator: true, // show nav map
                zoomInButton: 'zoom-in', 
                zoomOutButton: 'zoom-out',
                homeButton: 'home',
                fullPageButton: 'full-page',
            });

            return () => {
                if (viewer) {
                    viewer.destroy(); // clean up when component unmounts
                }
            };
        }
    }, [imageUrl]);

    return (
        <div>
            <div ref={viewerRef} style={{ width: '100%', height: '600px' }}></div>
            {/* UI Controls */}
            <div id="zoom-in">Zoom In</div>
            <div id="zoom-out">Zoom Out</div>
            <div id="home">Home</div>
            <div id="full-page">Full Page</div>
        </div>
        ); 
    };
    export default ImageViewer;

    // accepts and image url prop 
    // initializes an OpenSeadragon viewer with the image
    // returns a div element to render the viewer