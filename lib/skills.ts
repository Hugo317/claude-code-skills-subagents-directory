import data from "@/data/skills.json";
import { validateCatalog, type CatalogConfig, type CatalogItem } from "./catalog";

export const skillsConfig: CatalogConfig = {
  categories: [
    "development",
    "documents",
    "design",
    "data",
    "devops",
    "testing",
    "security",
    "research",
    "productivity",
    "meta",
  ],
  labels: {
    development: "Development",
    documents: "Documents",
    design: "Design",
    data: "Data",
    devops: "DevOps",
    testing: "Testing",
    security: "Security",
    research: "Research",
    productivity: "Productivity",
    meta: "Meta",
  },
  pillStyles: {
    development: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300",
    documents: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
    design: "bg-fuchsia-50 text-fuchsia-700 dark:bg-fuchsia-950/60 dark:text-fuchsia-300",
    data: "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300",
    devops: "bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300",
    testing: "bg-green-50 text-green-700 dark:bg-green-950/60 dark:text-green-300",
    security: "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300",
    research: "bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300",
    productivity: "bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300",
    meta: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  },
};

const skills = validateCatalog(data, skillsConfig, "data/skills.json");

export function getSkills(): CatalogItem[] {
  return skills;
}
