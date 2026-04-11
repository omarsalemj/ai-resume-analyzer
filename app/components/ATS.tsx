interface ATSProps {
  score: number;
  suggestions: {
    type: "good" | "improve";
    tip: string;
  }[];
}

const ATS = ({ score, suggestions }: ATSProps) => {
  const cardGradient =
    score > 70
      ? "from-green-100"
      : score > 49
        ? "from-yellow-100"
        : "from-red-100";

  const atsIcon =
    score > 70
      ? "/icons/ats-good.svg"
      : score > 49
        ? "/icons/ats-warning.svg"
        : "/icons/ats-bad.svg";

  return (
    <div className={`bg-gradient-to-b ${cardGradient} to-white rounded-2xl p-6 shadow-sm`}>
      <div className="flex items-center gap-4">
        <img src={atsIcon} alt="ATS score" className="size-16" />
        <div className="flex flex-col gap-1">
          <h3 className="text-2xl font-bold text-black">ATS Score - {score}/100</h3>
          <p className="text-sm text-dark-200">How well your resume is likely to perform in applicant tracking systems.</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-lg font-semibold text-black">What this means</p>
          <p className="text-gray-500">
            ATS tools scan your resume for keywords, formatting, and relevance before a recruiter ever sees it.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {suggestions.map((suggestion, index) => (
            <div key={`${suggestion.tip}-${index}`} className="flex items-start gap-3">
              <img
                src={suggestion.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
                alt={suggestion.type}
                className="size-5 mt-0.5"
              />
              <p className="text-base text-black">{suggestion.tip}</p>
            </div>
          ))}
        </div>

        <p className="text-sm font-medium text-dark-200">
          Keep refining your resume so it is easier for ATS tools and recruiters to understand quickly.
        </p>
      </div>
    </div>
  );
};

export default ATS;
