import { Badge } from "@/components/ui/badge";

const Blank = ({ word, index, onDropWord, onClear }) => {
  const handleDrop = (e) => {
    const droppedWord = e.dataTransfer.getData("text");
    if (droppedWord) onDropWord(droppedWord);
  };

  return (
    <span
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="inline-block min-w-[80px] h-[36px] px-2 py-1 border-b-2 border-muted mx-1 bg-muted rounded-md cursor-pointer"
    >
      {word ? (
        <Badge
          variant="outline"
          className="cursor-pointer"
          onClick={onClear}
        >
          {word}
        </Badge>
      ) : (
        <span className="text-muted-foreground">_____</span>
      )}
    </span>
  );
};

export default Blank;
