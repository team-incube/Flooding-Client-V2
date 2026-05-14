const specialtyLabelMap: Record<string, string> = {
  SW_DEVELOPMENT: "SW 개발과",
  SMART_IOT: "스마트 IOT과",
  AI: "AI과",
};

export function formatSpecialty(specialty: string) {
  return specialtyLabelMap[specialty] ?? specialty;
}
