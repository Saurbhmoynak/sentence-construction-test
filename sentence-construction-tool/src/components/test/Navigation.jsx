import { Button } from "@/components/ui/button";

const Navigation = ({ current, total, onSubmit, isSubmitted, selectedWords, onNext }) => {
  // Check if all blanks are filled (all selectedWords are not null)
  const isAnswered = selectedWords.every((word) => word !== null);

  return (
    <div className="flex justify-end mt-10">
      {/* Show Submit button only on the last question */}
      {current === total - 1 ? (
        <Button
          onClick={onSubmit}
          disabled={!isAnswered || isSubmitted} // Disabled if not all words are selected or already submitted
          variant={isSubmitted ? "secondary" : "default"}
        >
          {isSubmitted ? "Submitted" : "Submit"}
        </Button>
      ) : (
        // Show Next button for all other questions
        <Button
          onClick={onNext}
          disabled={!isAnswered} // Disable Next button if not all blanks are filled
          variant="default"
        >
          Next
        </Button>
      )}
    </div>
  );
};

export default Navigation;
