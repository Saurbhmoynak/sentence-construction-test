import { Card } from "@/components/ui/card";

const WordOptions = ({ options, selectedWords, dragEnabled }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 mt-4">
      {options.map((word, index) => {
        const isUsed = selectedWords.includes(word);
        const isDraggable = dragEnabled && !isUsed;

        return (
          <Card
            key={index}
            draggable={isDraggable}
            onDragStart={(e) => {
              if (isDraggable) {
                e.dataTransfer.setData("text/plain", word);
              }
            }}
            className={`px-3 py-2 text-sm font-medium text-center transition-all duration-150 rounded-md whitespace-nowrap 
              ${
                isUsed || !dragEnabled
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-100 hover:bg-blue-200 cursor-move"
              }`}
          >
            {word}
          </Card>
        );
      })}
    </div>
  );
};

export default WordOptions;
