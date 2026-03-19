import Image from "next/image";
import DefaultClubThumbnail from "@/shared/asset/svg/DefaultThumbnail";
import { Project } from "../model/club";

interface ProjectCardProps {
  project: Project;
  leader?: string;
}

export default function ProjectCard({ project, leader }: ProjectCardProps) {
  return (
    <div className="flex h-auto flex-col gap-4 rounded-2xl bg-sub-4 p-4 sm:flex-row sm:gap-6">
      <div className="relative h-40 w-full rounded-xl overflow-hidden bg-sub-3 sm:h-29.75 sm:w-29.75 sm:shrink-0">
        {project.imageUrl ? (
          <Image
            src={project.imageUrl}
            alt={project.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <DefaultClubThumbnail className="h-full w-full" />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <span className="text-title-3 text-main-text">{project.name}</span>
        <p className="text-text-2 text-sub-1 line-clamp-2">
          {project.description}
        </p>
        <p className="text-text-4">
          <span className="text-sub-1">참여인원 - </span>
          <span className="text-sub-1">
            {project.participants.map((p, i) => {
              const participantName = p.name ?? String(p.studentNumber);
              const isLeader = participantName === leader;

              return (
                <span key={p.id} className={isLeader ? "text-p-1" : undefined}>
                  {participantName}
                  {i < project.participants.length - 1 && ", "}
                </span>
              );
            })}
          </span>
        </p>
        <p className="text-caption-1 text-sub-1">
          프로젝트 링크 -{" "}
          {project.links.map((l, i: number) => (
            <span key={l.link}>
              <a
                href={l.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sub-1 hover:underline"
              >
                {l.type}
              </a>
              {i < project.links.length - 1 && " "}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
