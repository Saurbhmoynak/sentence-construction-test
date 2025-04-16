const ProgressBar = ({ current, total, results }) => {
  return (
    <div className="flex gap-1 w-full justify-center flex-wrap">
      {Array.from({ length: total }).map((_, idx) => {
        const isFilled = idx < current;
        const isCurrent = idx === current;
        return (
          <div
            key={idx}
            className={`h-2 flex-1 min-w-[20px] sm:min-w-[30px] lg:min-w-[40px] rounded-md transition-all duration-300 ${
              isFilled
                ? "bg-green-500"
                : isCurrent
                ? "bg-blue-500 animate-pulse"
                : "bg-gray-300"
            }`}
          />
        );
      })}
    </div>
  );
};

export default ProgressBar;