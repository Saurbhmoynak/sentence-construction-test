import React from "react";
import { PencilIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // optional for animation


const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 py-12">
      
      
      {/* Icon & Heading with animation */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <div className="flex justify-center mb-10">
          <PencilIcon className="h-16 w-16 text-gray-700" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-semibold mb-4 sm:mb-6 text-gray-800">
          Sentence Construction
        </h1>
        <p className="text-gray-700 text-base sm:text-xl px-2 sm:px-0 leading-relaxed mb-12">
          Users have to construct a sentence using random words by placing them
          in the correct order.
        </p>

        {/* Info Blocks */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-15 text-lg text-gray-800 mb-12 mt-12">
          <div className="text-center">
            <div className="font-semibold text-2xl mb-5">Time Per Question</div>
            <div className="text-gray-600 text-xl">30 Sec</div>
          </div>
          <div className="hidden md:block w-px h-20 bg-gray-300" />
          <div className="text-center mx-10">
            <div className="font-semibold text-2xl mb-5">Total Questions</div>
            <div className="text-gray-600 text-xl">10</div>
          </div>
          <div className="hidden md:block w-px h-20 bg-gray-300" />
          <div className="text-center ml-15 mr-10 sm:ml-8">
            <div className="font-semibold text-2xl mb-5">Coins</div>
            <div className="flex items-center justify-center gap-2 text-gray-600 text-xl">
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <span>20 coins</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-6 mt-30">
          <Button
            variant="outline"
            aria-label="Go Back"
            className="px-14 py-5 text-lg border-2 border-purple-600 text-purple-700 font-medium"
          >
            Back
          </Button>
          <Button
            onClick={() => navigate("/test")}
            aria-label="Start Sentence Construction Test"
            className="bg-violet-600 border-2 border-purple-600 hover:bg-violet-700 text-white text-lg px-14 py-5 medium"
          >
            Start
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
