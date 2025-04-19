"use client"

import { LayoutGroup, motion } from "framer-motion"
import { TextRotate } from "./text-rotate"

function TextRotateDemo() {
  return (
    <div className="flex flex-col justify-center items-center w-full relative px-4">
      <motion.h1
        className="text-4xl sm:text-5xl md:text-7xl text-center w-full justify-center items-center flex-col flex leading-tight font-bold tracking-tight space-y-1 sm:space-y-2 md:space-y-4 relative"
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <motion.div 
          className="flex items-center gap-2 sm:gap-3 text-gray-900"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <span>Discover</span>
          <motion.span
            initial={{ rotate: -3, scale: 0.95 }}
            animate={{ rotate: 3, scale: 1.05 }}
            transition={{ 
              duration: 0.8,
              repeat: Infinity, 
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          >
            🌟
          </motion.span>
        </motion.div>

        <LayoutGroup>
          <motion.div 
            layout 
            className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 md:gap-4"
          >
            <TextRotate
              texts={[
                "Nearby 🗺️",
                "Local 📍",
                "Amazing ✨",
                "Exciting 🎉",
                "Fun 🎮",
                "Social 🤝",
              ]}
              mainClassName="overflow-hidden text-[#7C3AED] py-0 pb-1 sm:pb-2 md:pb-4 rounded-xl font-extrabold"
              staggerDuration={0.03}
              staggerFrom="last"
              rotationInterval={3000}
              transition={{ 
                type: "spring", 
                damping: 25, 
                stiffness: 350,
                duration: 0.4
              }}
            />
            <motion.div
              layout
              className="flex items-center gap-2 sm:gap-3 text-gray-900"
              transition={{ 
                type: "spring", 
                damping: 25, 
                stiffness: 350,
                duration: 0.4
              }}
            >
              <span>Events</span>
              <motion.span
                initial={{ scale: 0.95 }}
                animate={{ scale: 1.05 }}
                transition={{ 
                  duration: 0.8,
                  repeat: Infinity, 
                  repeatType: "reverse",
                  ease: "easeInOut"
                }}
              >
                🎪
              </motion.span>
            </motion.div>
          </motion.div>
        </LayoutGroup>
      </motion.h1>
    </div>
  )
}

export { TextRotateDemo } 