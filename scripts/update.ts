import fs from "fs";
import path from "path";
import { exec, execSync } from "child_process";
import os from "os";
import info from "../info.json";
import process from "node:process";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const execList = info.map((i) => i.bin || i.name);

const subCmd = {
  "tjs": "run",
  "dune": "run",
  "spiderfire": "run",
  "nova": "eval",
};

function execCmd(name: string, cmd: string, cwd?: string) {
  console.error(`cmd:`, { cmd, cwd });
  return new Promise<string>((r) => {
    // exec(`bash -c "${cmd}"`, { cwd }, (err, stdout, stderr) => {
    exec(cmd, { cwd }, (err, stdout, stderr) => {
      console.error("exec output", { err, stdout, stderr });

      let s = !err ? stdout?.trim() || "" : ""
      if (name === 'boa') {
        const i = s.lastIndexOf("\nundefined")
        if (i >= 0) {
          s = s.slice(0, i)
        }
      }
      // goja output to stderr
      r(s);
    });
  });
}


const data = {};
function isMsys() {
  return !!process.env["MSYSTEM"];
}
function fromMsysPath(s) {
  if (!isMsys() || !s.startsWith("/")) {
    return s;
  }
  s = s.replace(/^\/([A-Za-z])\//, (_, drive) => `${drive.toUpperCase()}:/`);
  return s;
}

function getExePath(i) {
  const execPath = execSync(`which ${i}`).toString().trim();
  return fromMsysPath(execPath);
}

function getTestFiles() {
  const init = readFileSync("tests/init.js", 'utf8')
  const tmp = "tmp/"
  if (!existsSync(tmp)) {
    mkdirSync(tmp, { recursive: true })
  }
  const v: string[] = readdirSync("tests").filter(i => i !== 'init.js')
  for (const name of v) {
    const js = readFileSync(`tests/${name}`)
    const code = [init, js,
      // boa
      "undefined"
    ].join("\n\n")
    writeFileSync(tmp + name, code)
  }

  return v
}

async function main() {
  const files = getTestFiles()
  for (const i of execList) {
    try {
      const execPath = getExePath(i);
      const execDir = path.dirname(execPath);
      for (const name of files) {
        const p = join(resolve("."), "tmp", name)
        const out = await execCmd(i,
          `${i} ${subCmd[i] || ""} ${p}`,
          execDir,
        );
        console.error("out: ", out);
        const s = name.split(".")[0]
        if (!data[s]) {
          data[s] = {}
        }
        data[s][i] = out;
      }
    } catch (e) {
      console.error("error:", e);
    }
  }

  // sort by score
  const keys = Object.keys(data);
  if (!keys.length) {
    console.error("no keys", JSON.stringify(data));
    return;
  }
  const engines = Object.keys(data[keys[0]])
  for (const i in data) {
    const obj = {};
    for (const e of engines) {
      const item = info.find((i) => i.bin == e || i.name == e);
      if (!item) {
        continue;
      }
      const name = item.name;
      obj[name] = data[i][e] ?? "";
    }
    data[i] = obj;
  }

  console.error(JSON.stringify(data));
  console.log(JSON.stringify(data));
}

main();
