import React, { useRef, useEffect, useState } from 'react';
import folderUploadSvg from '../assets/folder-upload.svg';
import folderWithImageSvg from '../assets/folder-with-image.svg';

function ImageUpload({ image, onImageChange, isLoading }) {
    const fileInputRef = useRef(null);
    const svgContainerRef = useRef(null);
    const [svgLoaded, setSvgLoaded] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            processFile(file);
        }
    };

    const processFile = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            onImageChange(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            processFile(file);
        }
    };

    const removeImage = (e) => {
        e.stopPropagation();
        onImageChange(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const triggerFileUpload = () => {
        if (!image && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Load SVG and inject image when available
    useEffect(() => {
        if (image) {
            // Fetch the SVG file
            fetch(folderWithImageSvg)
                .then(response => response.text())
                .then(svgText => {
                    // Parse SVG
                    const parser = new DOMParser();
                    const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');

                    // Find the image element and update its href
                    const imageElement = svgDoc.getElementById('user-uploaded-image');
                    if (imageElement) {
                        imageElement.setAttributeNS('http://www.w3.org/1999/xlink', 'href', image);
                    }

                    // Inject the modified SVG into the container
                    if (svgContainerRef.current) {
                        svgContainerRef.current.innerHTML = '';
                        svgContainerRef.current.appendChild(svgDoc.documentElement);
                        setSvgLoaded(true);
                    }
                })
                .catch(error => {
                    console.error('Error loading SVG:', error);
                });
        }
    }, [image]);

    // Toggle internal SVG scanning beam visibility
    useEffect(() => {
        if (svgContainerRef.current) {
            const svg = svgContainerRef.current.querySelector('svg');
            if (svg) {
                const beamGroup = svg.getElementById('scan-beam-group');
                if (beamGroup) {
                    beamGroup.style.display = isLoading ? 'block' : 'none';
                }
            }
        }
    }, [isLoading, svgLoaded]);

    return (
        <div className="computer-wrapper">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
            />

            <div
                className={`computer-container ${image ? 'has-image' : ''}`}
                onClick={triggerFileUpload}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <div className="seamless-container">
                    <div className="tilted-group-wrapper">
                        {/* State 1: Empty Folder (Always rendered, fades out) */}
                        <div className={`folder-display ${image ? 'hidden' : ''}`}>
                            <img src={folderUploadSvg} alt="Upload" className="folder-svg" />
                        </div>

                        {/* State 2: Uploaded Image (Always rendered, fades in) */}
                        <div className={`uploaded-image-container ${image ? 'visible' : ''}`}>
                            <div ref={svgContainerRef} className="folder-svg-container"></div>
                        </div>

                        {image && (
                            <button className="remove-btn" onClick={removeImage}>✕</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ImageUpload;
