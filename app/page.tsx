import { CatalogPage } from "@/components/catalog/catalog-page";
import { getSkills, skillsConfig } from "@/lib/skills";

export default function Home() {
  return (
    <CatalogPage
      current="skills"
      title="Agent Skills Repo"
      tagline="An open directory of publicly available Agent Skills for Claude Code. Every entry links straight to its source on GitHub."
      noun="skills"
      items={getSkills()}
      config={skillsConfig}
      sourceUrl="https://github.com/anthropics/skills"
      footnote="Skills are executable instructions. Review one before installing it."
    />
  );
}
