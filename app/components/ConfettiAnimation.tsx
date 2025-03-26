"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Confetti = dynamic(() => import("react-confetti"), { ssr: false });

export default function ConfettiAnimation() {
  const [windowDimension, setWindowDimension] = useState({ width: 0, height: 0 });
  const [partyMode, setPartyMode] = useState(false);

  // Detect window size
  const detectSize = () => {
    setWindowDimension({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    detectSize();
    window.addEventListener("resize", detectSize);

    // Start with a burst, then switch to a continuous party mode after 2 seconds
    const partyTimer = setTimeout(() => {
      setPartyMode(true);
    }, 2000);

    return () => {
      window.removeEventListener("resize", detectSize);
      clearTimeout(partyTimer);
    };
  }, []);

  // Custom confetti colors
  const colors = [
    "#FF6B6B", // Coral
    "#4ECDC4", // Turquoise
    "#45B7D1", // Sky Blue
    "#96CEB4", // Mint
    "#FFEEAD", // Pale Yellow
    "#D4A5A5", // Soft Pink
    "#9B59B6", // Purple
  ];

  // Custom shapes for confetti pieces
  const customShapes = (context) => {
    const shapes = [
      // Star
      () => {
        context.beginPath();
        for (let i = 0; i < 5; i++) {
          context.lineTo(
            Math.cos((18 + i * 72) * Math.PI / 180) * 10,
            -Math.sin((18 + i * 72) * Math.PI / 180) * 10
          );
          context.lineTo(
            Math.cos((54 + i * 72) * Math.PI / 180) * 5,
            -Math.sin((54 + i * 72) * Math.PI / 180) * 5
          );
        }
        context.closePath();
        context.fill();
      },
      // Heart
      () => {
        context.beginPath();
        context.moveTo(0, 5);
        context.quadraticCurveTo(-7, -2, -3, -7);
        context.quadraticCurveTo(0, -4, 3, -7);
        context.quadraticCurveTo(7, -2, 0, 5);
        context.fill();
      },
    ];
    return shapes[Math.floor(Math.random() * shapes.length)];
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <Confetti
        width={windowDimension.width}
        height={windowDimension.height}
        recycle={partyMode} // Switches to continuous mode after initial burst
        numberOfPieces={partyMode ? 50 : 300} // Initial burst of 300, then 50 continuous
        colors={colors}
        gravity={partyMode ? 0.1 : 0.2} // Slower fall in party mode
        wind={partyMode ? 0.02 : 0} // Slight breeze in party mode
        opacity={0.9}
        confettiSource={{
          x: windowDimension.width / 2,
          y: -10,
          w: windowDimension.width,
          h: 0,
        }} // Burst from top center
        initialVelocityY={{ min: -20, max: 0 }} // Shoot upwards initially
        initialVelocityX={{ min: -10, max: 10 }} // Spread horizontally
        drawShape={customShapes} // Custom star and heart shapes
        tweenDuration={partyMode ? 5000 : 3000} // Slower animation in party mode
        onConfettiComplete={(confetti) => {
          if (!partyMode) confetti?.reset(); // Reset for continuous mode
        }}
      />
      {/* Celebration Message */}
      {!partyMode && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <h1
            className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-pulse"
          >
            Hooray!
          </h1>
          <p className="text-xl md:text-2xl text-white font-semibold mt-2 drop-shadow-lg">
            You’re a Step Closer!
          </p>
        </div>
      )}
    </div>
  );
}