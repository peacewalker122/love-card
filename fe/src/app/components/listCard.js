import React from "react";
import { useState, useEffect, useRef } from "react";

const ListCard = ({ val }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const carouselRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused && carouselRef.current) {
        carouselRef.current.scrollLeft += 1;
        if (
          carouselRef.current.scrollLeft + carouselRef.current.clientWidth >=
          carouselRef.current.scrollWidth
        ) {
          carouselRef.current.scrollLeft = 0; // Reset to start for infinite scroll
        }
      }
    }, 30);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handleCardClick = (index) => {
    setExpandedCard(index);
    setIsPaused(true);
  };

  const handleCloseClick = () => {
    setExpandedCard(null);
    setIsPaused(false);
  };

  return (
    <div
      className="relative flex overflow-x-auto no-scrollbar"
      ref={carouselRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {val.map((item, index) => (
        <div
          key={`div-${index}`}
          className={`card bg-white border border-gray-200 rounded-lg shadow-md h-64 p-8 w-96 m-4 flex-shrink-0 transform transition-transform duration-500 ${expandedCard !== null ? "hidden" : ""
            }`}
          onClick={() => handleCardClick(index)}
          onMouseEnter={() => setIsPaused(true)}
        >
          <time dateTime={item.date} className="text-gray-500 text-sm">
            {new Date(item.createdAt * 1000).toLocaleDateString()}
          </time>
          <div className="bg-indigo-100 p-4 rounded-lg shadow-inner mt-2">
            <p className="text-indigo-600 text-lg font-semibold">
              {item.letter}
            </p>
          </div>
          <p className="text-gray-700 text-sm mt-4">Author: {item.author}</p>
        </div>
      ))}
      {expandedCard !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 w-3/4 h-3/4 relative">
            <button
              className="absolute top-4 right-4 bg-white text-black p-2 rounded-full"
              onClick={handleCloseClick}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <time
              dateTime={val[expandedCard].date}
              className="text-gray-500 text-sm"
            >
              {new Date(
                val[expandedCard].createdAt * 1000,
              ).toLocaleDateString()}
            </time>
            <div className="bg-indigo-100 p-4 rounded-lg shadow-inner mt-2">
              <p className="text-indigo-600 text-lg font-semibold">
                {val[expandedCard].letter}
              </p>
            </div>
            <p className="text-gray-700 text-sm mt-4">
              Author: {val[expandedCard].author}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListCard;
