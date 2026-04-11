import { Link } from "react-router";
import ScoreCircle from "./ScoreCircle";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";
import { convertPdfToImage } from "~/lib/pdf2img";

const ResumeCard = ({
  resume: { id, companyName, jobTitle, feedback, imagePath, resumePath },
}: {
  resume: Resume;
}) => {
  const { fs } = usePuterStore();
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    let objectUrl = "";

    const loadResume = async () => {
      const pdfBlob = await fs.read(resumePath);
      if (pdfBlob) {
        const previewImage = await convertPdfToImage(
          new File([pdfBlob], "resume.pdf", { type: "application/pdf" }),
        );
        if (previewImage.imageUrl) {
          objectUrl = previewImage.imageUrl;
          setPreviewUrl(objectUrl);
          return;
        }
      }

      if (typeof imagePath === "string" && imagePath.startsWith("/")) {
        setPreviewUrl(imagePath);
        return;
      }

      const imageBlob = await fs.read(imagePath);
      if (!imageBlob) return;

      objectUrl = URL.createObjectURL(imageBlob);
      setPreviewUrl(objectUrl);
    };

    loadResume();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [fs, imagePath, resumePath]);

  return (
    <Link
      to={`/resume/${id}`}
      className="resume-card animate-in fade-in duration-1000"
    >
      <div className="resume-card-header">
        <div className="flex flex-col gap-2">
          {companyName && (
            <h2 className="!text-black font-bold break-words">{companyName}</h2>
          )}
          {jobTitle && (
            <h3 className="text-lg break-words text-gray-500">{jobTitle}</h3>
          )}
          {!companyName && !jobTitle && (
            <h2 className="!text-black font-bold">Resume</h2>
          )}
        </div>
        <div className="flex-shrink-0">
          <ScoreCircle score={feedback.overallScore} />
        </div>
      </div>
      {previewUrl && (
        <div className="gradient-border animate-in fade-in duration-1000">
          <div className="w-full h-full">
            <img
              src={previewUrl}
              alt="resume"
              className="w-full h-[350px] max-sm:h-[200px] object-cover object-top"
            />
          </div>
        </div>
      )}
    </Link>
  );
};

export default ResumeCard;
