import React, { useState, useRef } from "react";

function InlineZoom({ src, alt }) {
  const [lensPos, setLensPos] = useState({ x: 0, y: 0, visible: false });
  const imgRef = useRef(null);

  const lensSize = 100; // lens width & height in px
  const zoom = 2; // zoom factor

  const handleMouseMove = (e) => {
    const rect = imgRef.current.getBoundingClientRect();
    let x = e.clientX - rect.left - lensSize / 2;
    let y = e.clientY - rect.top - lensSize / 2;

    // constrain lens inside image
    if (x < 0) x = 0;
    if (y < 0) y = 0;
    if (x > rect.width - lensSize) x = rect.width - lensSize;
    if (y > rect.height - lensSize) y = rect.height - lensSize;

    setLensPos({ x, y, visible: true });
  };

  const handleMouseLeave = () => {
    setLensPos((pos) => ({ ...pos, visible: false }));
  };

  return (
    <div
      style={{ position: "relative", display: "inline-block", cursor: "zoom-in" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Original Image */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        style={{ display: "block", maxWidth: "100%", borderRadius: "8px" }}
      />

      {/* Zoom Lens */}
      {lensPos.visible && (
        <div
          style={{
            position: "absolute",
            left: lensPos.x,
            top: lensPos.y,
            width: lensSize,
            height: lensSize,
            border: "2px solid rgba(0,0,0,0.3)",
            borderRadius: "50%",
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            pointerEvents: "none",
            boxShadow: "0 0 8px rgba(0,0,0,0.3)",
            backgroundImage: `url(${src})`,
            backgroundRepeat: "no-repeat",
            // calculate background position for zoom effect
            backgroundSize: `${imgRef.current.offsetWidth * zoom}px ${
              imgRef.current.offsetHeight * zoom
            }px`,
            backgroundPosition: `-${lensPos.x * zoom}px -${lensPos.y * zoom}px`,
            zIndex: 9999,
          }}
        />
      )}
    </div>
  );
}

export default InlineZoom;
