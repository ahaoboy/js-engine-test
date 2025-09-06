import { resolve } from "path";
import ubuntuJSON from "../ubuntu.json";
import { readFileSync, writeFileSync } from "fs";
import windowsJSON from "../windows.json";
import macosArm64JSON from "../macos-arm64.json";

const mdPath = resolve("./README.md");

function json2md(data) {
  const keys = Object.keys(data);

  const engines = Object.keys(data[keys[0]])

  const headerRow = `| Engine | ${keys.join(" | ")} |`;

  const separatorRow = `| ${new Array(keys.length + 1).fill(0).map(() => "---").join(" | ")
    } |`;

  const rows: string[] = [];
  for (const k of engines) {
    const row = [k];
    for (const i of keys) {
      const v = data[i][k] || '';
      row.push(v || "");
    }
    rows.push(`| ${row.join(" | ")} |`);
  }

  return [headerRow, separatorRow, ...rows].join("\n");
}

const ubuntuMd = json2md(ubuntuJSON);
const windowsMd = json2md(windowsJSON);
const macosArm64Md = json2md(macosArm64JSON);


const time = new Date().toLocaleString();
const mdTable =
  `\n## test\n${time}\n\n### ubuntu\n${ubuntuMd}\n### macos-arm64\n${macosArm64Md}\n### windows\n${windowsMd}\n`;
const doc = mdTable
writeFileSync(mdPath, doc);
