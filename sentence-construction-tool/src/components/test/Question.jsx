import Blank from "./Blank";

const Question = ({ question, selectedWords, setSelectedWords }) => {
  const blanks = question.match(/_{5,}/g)?.length || 0;
  const splitText = question.split(/_{5,}/g);

  return (
    <div className="text-xl font-medium mb-6 leading-relaxed w-full text-justify">
      {splitText.map((part, index) => (
        <span key={index} style={{ whiteSpace: "pre-wrap" }}>
          {part}
          {index < blanks && (
            <span
              style={{
                display: "inline-block",
                margin: "2px",
                verticalAlign: "middle",
              }}
            >
              <Blank
                index={index}
                word={selectedWords[index]}
                onDropWord={(word) => {
                  const updated = [...selectedWords];
                  updated[index] = word;
                  setSelectedWords(updated);
                }}
                onClear={() => {
                  const updated = [...selectedWords];
                  updated[index] = null;
                  setSelectedWords(updated);
                }}
              />
            </span>
          )}
        </span>
      ))}
    </div>
  );
};

export default Question;
