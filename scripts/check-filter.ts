/**
 * Exercises lib/filter.ts against every real catalog.
 * Run with: npm run check
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { filterAndSort } from "../lib/filter.ts";
import type { CatalogItem } from "../lib/catalog.ts";

const base = { query: "", category: "all", sort: "name" } as const;

const CATALOGS = [
  { noun: "skills", path: "data/skills.json" },
  { noun: "subagents", path: "data/subagents.json" },
].map((c) => ({
  ...c,
  items: JSON.parse(readFileSync(c.path, "utf8")) as CatalogItem[],
}));

let passed = 0;
function check(label: string, fn: () => void) {
  fn();
  passed++;
  console.log(`  ok  ${label}`);
}

// ---- Behaviour that must hold for every catalog -----------------------------

for (const { noun, items } of CATALOGS) {
  console.log(`\n${noun} (${items.length} entries)`);

  check(`${noun}: no filters returns everything`, () => {
    assert.equal(filterAndSort(items, base).length, items.length);
  });

  check(`${noun}: search matches name`, () => {
    const target = items[0].name.toLowerCase();
    const got = filterAndSort(items, { ...base, query: target });
    assert.ok(got.some((i) => i.id === items[0].id));
  });

  check(`${noun}: search matches description text`, () => {
    const word = items[0].description.split(" ")[0].toLowerCase();
    const got = filterAndSort(items, { ...base, query: word });
    assert.ok(got.length > 0);
  });

  check(`${noun}: search matches tags`, () => {
    const tagged = items.find((i) => i.tags && i.tags.length > 0);
    assert.ok(tagged, "expected at least one tagged entry");
    const got = filterAndSort(items, { ...base, query: tagged.tags![0] });
    assert.ok(got.some((i) => i.id === tagged.id));
  });

  check(`${noun}: search is case-insensitive`, () => {
    const word = items[0].name;
    assert.deepEqual(
      filterAndSort(items, { ...base, query: word.toUpperCase() }).map((i) => i.id),
      filterAndSort(items, { ...base, query: word.toLowerCase() }).map((i) => i.id),
    );
  });

  check(`${noun}: category filter narrows to that category only`, () => {
    const cat = items[0].category;
    const got = filterAndSort(items, { ...base, category: cat });
    assert.ok(got.length > 0);
    assert.ok(got.every((i) => i.category === cat));
  });

  check(`${noun}: query AND category, not OR`, () => {
    const cat = items[0].category;
    const catOnly = filterAndSort(items, { ...base, category: cat });
    const both = filterAndSort(items, { ...base, query: "e", category: cat });
    assert.ok(both.every((i) => i.category === cat));
    assert.ok(both.length <= catOnly.length);
  });

  check(`${noun}: no match returns empty, driving the empty state`, () => {
    assert.equal(filterAndSort(items, { ...base, query: "zzzznope" }).length, 0);
  });

  check(`${noun}: sort by name is alphabetical`, () => {
    const names = filterAndSort(items, base).map((i) => i.name);
    assert.deepEqual(names, [...names].sort((a, b) => a.localeCompare(b)));
  });

  check(`${noun}: sort by category groups categories, names within`, () => {
    const got = filterAndSort(items, { ...base, sort: "category" });
    const cats = got.map((i) => i.category);
    assert.deepEqual(cats, [...cats].sort((a, b) => a.localeCompare(b)));
    for (let i = 1; i < got.length; i++) {
      if (got[i].category === got[i - 1].category) {
        assert.ok(got[i - 1].name.localeCompare(got[i].name) <= 0);
      }
    }
  });

  check(`${noun}: sort does not mutate the input array`, () => {
    const before = items.map((i) => i.id);
    filterAndSort(items, { ...base, sort: "category" });
    assert.deepEqual(items.map((i) => i.id), before);
  });

  check(`${noun}: every entry is reachable via its own category`, () => {
    for (const item of items) {
      const got = filterAndSort(items, { ...base, category: item.category });
      assert.ok(got.some((i) => i.id === item.id), `${item.id} unreachable`);
    }
  });
}

// ---- Catalog-specific data shape -------------------------------------------

const skills = CATALOGS[0].items;
const subagents = CATALOGS[1].items;
const VALID_MODELS = new Set(["opus", "sonnet", "haiku", "fable", "inherit"]);

console.log("\ndata shape");

check("subagents: every declared model is a valid value", () => {
  for (const s of subagents) {
    if (s.model !== undefined) {
      assert.ok(VALID_MODELS.has(s.model), `${s.id} has model "${s.model}"`);
    }
  }
});

check("subagents: tools, when present, is a non-empty string array", () => {
  for (const s of subagents) {
    if (s.tools !== undefined) {
      assert.ok(Array.isArray(s.tools) && s.tools.length > 0, `${s.id} has empty tools`);
      assert.ok(s.tools.every((t) => typeof t === "string" && t.length > 0));
    }
  }
});

check("subagents: all carry a model, so the badge always renders", () => {
  assert.ok(subagents.every((s) => typeof s.model === "string"));
});

check("skills: carry neither model nor tools", () => {
  assert.ok(skills.every((s) => s.model === undefined && s.tools === undefined));
});

check("catalogs share no category slugs, so filters can't leak", () => {
  const a = new Set(skills.map((s) => s.category));
  const b = new Set(subagents.map((s) => s.category));
  const overlap = [...a].filter((c) => b.has(c));
  assert.deepEqual(overlap, []);
});

console.log(`\n${passed} checks passed across ${CATALOGS.length} catalogs.`);
