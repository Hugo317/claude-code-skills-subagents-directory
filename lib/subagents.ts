import data from "@/data/subagents.json";
import { validateCatalog, type CatalogConfig, type CatalogItem } from "./catalog";

export const subagentsConfig: CatalogConfig = {
  categories: [
    "core-development",
    "languages",
    "infrastructure",
    "quality-security",
    "data-ai",
    "developer-experience",
    "specialized-domains",
    "business-product",
    "meta-orchestration",
    "research-analysis",
  ],
  labels: {
    "core-development": "Core Development",
    languages: "Languages",
    infrastructure: "Infrastructure",
    "quality-security": "Quality & Security",
    "data-ai": "Data & AI",
    "developer-experience": "Developer Experience",
    "specialized-domains": "Specialized Domains",
    "business-product": "Business & Product",
    "meta-orchestration": "Meta & Orchestration",
    "research-analysis": "Research & Analysis",
  },
  pillStyles: {
    "core-development": "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300",
    languages: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300",
    infrastructure: "bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300",
    "quality-security": "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300",
    "data-ai": "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300",
    "developer-experience": "bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300",
    "specialized-domains": "bg-fuchsia-50 text-fuchsia-700 dark:bg-fuchsia-950/60 dark:text-fuchsia-300",
    "business-product": "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
    "meta-orchestration": "bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300",
    "research-analysis": "bg-green-50 text-green-700 dark:bg-green-950/60 dark:text-green-300",
  },
};

const subagents = validateCatalog(data, subagentsConfig, "data/subagents.json");

export function getSubagents(): CatalogItem[] {
  return subagents;
}
