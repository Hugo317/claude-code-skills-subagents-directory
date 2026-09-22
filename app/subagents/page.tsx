import type { Metadata } from "next";
import { CatalogPage } from "@/components/catalog/catalog-page";
import { getSubagents, subagentsConfig } from "@/lib/subagents";

export const metadata: Metadata = {
  title: "Subagents Repo",
  description:
    "An open directory of publicly available subagents for Claude Code. Browse by category, search, and jump straight to the source on GitHub.",
};

export default function Subagents() {
  return (
    <CatalogPage
      current="subagents"
      title="Subagents Repo"
      tagline="An open directory of publicly available subagents for Claude Code — specialists that run in their own context window. Every entry links straight to its source on GitHub."
      noun="subagents"
      items={getSubagents()}
      config={subagentsConfig}
      sourceUrl="https://github.com/VoltAgent/awesome-claude-code-subagents"
      footnote="Subagents live in .claude/agents/ (project) or ~/.claude/agents/ (personal). Review one before installing it."
    />
  );
}
