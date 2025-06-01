'use client';
import { useEffect, useState } from 'react';

export default function LogoBanner() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Prevents hydration mismatch
  }

  return (
    <div className="bg-black w-full py-12 sm:py-16 md:py-24 flex items-center justify-center overflow-hidden">
      <div className="logo-container relative px-4 sm:px-6 md:px-8 transform scale-75 sm:scale-90 md:scale-100">
        <h1 className="text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-gray-200 tracking-wider font-light whitespace-nowrap">
          <span className="relative">
            {/* Simple floral decoration - visible on all screens but scaled */}
            <span className="floral-decoration"></span>
            <span className="floral-stem"></span>
            S
          </span>
          <span>CENTILUXE</span>
        </h1>
        {/* Flourish - visible on all screens */}
        <span className="flourish"></span>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&display=swap');
        
        .logo-container {
          opacity: 0;
          animation: fadeIn 1.5s forwards;
          font-family: 'Cormorant Garamond', serif;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .floral-decoration {
          position: absolute;
          top: -6px;
          left: -6px;
          width: 18px;
          height: 18px;
          border: 0.5px solid #9b9b9b;
          border-radius: 50% 0 50% 50%;
          border-right: none;
          transform: rotate(45deg);
        }
        
        .floral-stem {
          position: absolute;
          top: 3px;
          left: 12px;
          width: 9px;
          height: 0.5px;
          background-color: #9b9b9b;
        }
        
        .flourish {
          position: absolute;
          bottom: -12px;
          right: -60px;
          width: 90px;
          height: 30px;
          border-bottom: 0.5px solid #9b9b9b;
          border-radius: 0 0 0 100%;
        }
        
        /* Responsive adjustments */
        @media (min-width: 640px) {
          .floral-decoration {
            top: -8px;
            left: -8px;
            width: 24px;
            height: 24px;
          }
          
          .floral-stem {
            top: 4px;
            left: 16px;
            width: 12px;
          }
          
          .flourish {
            bottom: -16px;
            right: -80px;
            width: 120px;
            height: 40px;
          }
        }
        
        @media (min-width: 768px) {
          .floral-decoration {
            top: -10px;
            left: -10px;
            width: 30px;
            height: 30px;
          }
          
          .floral-stem {
            top: 5px;
            left: 20px;
            width: 15px;
          }
          
          .flourish {
            bottom: -20px;
            right: -100px;
            width: 150px;
            height: 50px;
          }
        }
      `}</style>
    </div>
  );
}