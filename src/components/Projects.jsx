import React, { useEffect, useState } from "react";
import { assets, projectsData } from "../assets/assets";

const Projects = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(1);

  useEffect(() => {
    const updateCardsToShow = () => {
      if (window.innerWidth >= 1280) setCardsToShow(4);
      else if (window.innerWidth >= 1024) setCardsToShow(3);
      else if (window.innerWidth >= 640) setCardsToShow(2);
      else setCardsToShow(1);
    };

    updateCardsToShow();
    window.addEventListener("resize", updateCardsToShow);
    return () => window.removeEventListener("resize", updateCardsToShow);
  }, []);

  const nextProject = () => {
    setCurrentIndex((prev) => (prev + 1) % projectsData.length);
  };

  const prevProject = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? projectsData.length - 1 : prev - 1
    );
  };

  return (
    <section
      id="Project"
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
          Projects <span className="font-light text-gray-500">Completed</span>
        </h1>
        <p className="text-gray-500 mt-3 max-w-2xl mx-auto text-sm sm:text-base">
          Crafting Spaces, Building Legacies — Explore Our Portfolio
        </p>
      </div>

      {/* Slider Buttons */}
      <div className="flex justify-end items-center gap-3 mb-6">
        <button
          onClick={prevProject}
          aria-label="Previous Project"
          className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full shadow-sm transition-all duration-300 active:scale-95"
        >
          <img src={assets.left_arrow} alt="previous" className="w-4 h-4" />
        </button>

        <button
          onClick={nextProject}
          aria-label="Next Project"
          className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full shadow-sm transition-all duration-300 active:scale-95"
        >
          <img src={assets.right_arrow} alt="next" className="w-4 h-4" />
        </button>
      </div>

      {/* Slider */}
      <div className="overflow-hidden">
        <div
          className="flex gap-6 transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${
              (currentIndex * 100) / cardsToShow
            }%)`,
          }}
        >
          {projectsData.map((project, index) => (
            <div
              key={index}
              className="relative min-w-full sm:min-w-[48%] lg:min-w-[31%] xl:min-w-[23%] group"
            >
              {/* Image */}
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-64 object-cover rounded-2xl shadow-md group-hover:scale-105 transition-transform duration-500"
              />

              {/* Overlay Card */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 rounded-2xl flex items-end">
                <div className="bg-white m-4 p-4 rounded-xl shadow-lg w-full">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {project.title}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {project.price}
                    <span className="block text-xs text-gray-400">
                      {project.location}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
