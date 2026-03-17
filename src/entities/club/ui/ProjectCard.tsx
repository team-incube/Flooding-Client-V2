import Image from "next/image";
import DefaultClubThumbnail from "@/shared/asset/svg/DefaultThumbnail";
import { ClubProject } from "../model/club";

interface ProjectCardProps {
  project: ClubProject;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="flex gap-6 bg-sub-4 rounded-2xl h-37.75 p-3">
      <div className="relative shrink-0 self-stretch w-29.75 aspect-square rounded-xl overflow-hidden bg-sub-3">
        {project.imageUrl ? (
          <Image
            src={project.imageUrl}
            alt={project.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <DefaultClubThumbnail />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1 flex-1 min-w-0 py-1">
        <span className="text-text-2 text-main-text">{project.name}</span>
        <p className="text-caption-1 text-sub-1 line-clamp-2">
          {project.description}
        </p>
        <p className="text-caption-1">
          <span className="text-sub-1">참여인원 - </span>
          {project.participants.member.map((m, i) => (
            <span key={m.id}>
              <span className={m.isLeader ? "text-p-1" : "text-main-text"}>
                {m.name}
              </span>
              <span className="text-sub-1"> ({m.role})</span>
              {i < project.participants.member.length - 1 && (
                <span className="text-sub-1">, </span>
              )}
            </span>
          ))}
        </p>
        <p className="text-caption-1 text-sub-1">
          프로젝트 링크 -{" "}
          {project.links.map((l, i) => (
            <span key={i}>
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
