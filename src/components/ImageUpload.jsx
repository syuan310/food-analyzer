import React, { useRef, useEffect, useState } from 'react';
import folderUploadSvg from '../assets/folder-upload.svg';
import folderWithImageSvg from '../assets/folder-with-image.svg';

function ImageUpload({ image, onImageChange }) {
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

    // Load SVG and inject image when available
    useEffect(() => {
        if (image && svgContainerRef.current) {
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
                    svgContainerRef.current.innerHTML = '';
                    svgContainerRef.current.appendChild(svgDoc.documentElement);
                    setSvgLoaded(true);
                })
                .catch(error => {
                    console.error('Error loading SVG:', error);
                });
        }
    }, [image]);

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
                onClick={() => !image && fileInputRef.current.click()}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                {!image ? (
                    <div className="folder-display">
                        <img src={folderUploadSvg} alt="Upload" className="folder-svg" />
                    </div>
                ) : (
                    <div className="uploaded-image-container">
                        <div className="folder-with-image-wrapper">
                            <div className="tilted-group-wrapper">
                                <div ref={svgContainerRef} className="folder-svg-container"></div>
                                <button className="remove-btn" onClick={removeImage}>✕</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ImageUpload;
