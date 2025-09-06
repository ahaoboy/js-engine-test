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

function execCmd(cmd: string, cwd?: string) {
  console.error(`cmd:`, { cmd, cwd });
  return new Promise<string>((r) => {
    // exec(`bash -c "${cmd}"`, { cwd }, (err, stdout, stderr) => {
    exec(cmd, { cwd }, (err, stdout, stderr) => {
      console.error("exec output", { err, stdout, stderr });

      // goja output to stderr
      r(stdout?.trim() || stderr?.trim());
    });
  });
}

async function getVersion(cmd) {
  if (
    ["primjs", "rquickjs", "ladybird", "goja", "mozjs", "jint-cli"].includes(
      cmd,
    )
  ) {
    return "";
  }
  if (cmd === "engine262") {
    // engine262 v0.0.1-5dece49950e94360d45198df59f3adf4ceb94cb4
    const text = (await execCmd(`${cmd} -h`)).trim();
    return text.match(/v(\d+\.\d+\.\d+)/)?.[1].trim();
  }
  if (cmd === "ch" || cmd === "dune" || cmd === "ringo") {
    // ch version 1.13.0.0-beta
    const text = await execCmd(`${cmd} --version`);
    return text.split(" ").at(-1)?.trim() || "";
  }
  if (cmd === "llrt") {
    const text = await execCmd(`${cmd} --version`);
    return text.match(/v([\d.]+(?:-[a-zA-Z0-9]+)?)/)?.[1].trim();
  }
  if (cmd === "qjs") {
    const text = await execCmd(`${cmd} -h`);
    return text.match(/version (\d{4}-\d{2}-\d{2})/)?.[1].trim();
  }
  if (cmd === "qjs-ng") {
    const text = await execCmd(`${cmd} -h`);
    return text.match(/version (\d+\.\d+\.\d+)/)?.[1].trim();
  }
  if (cmd === "tjs" || cmd === "lo") {
    const text = await execCmd(`${cmd} --version`);
    return text.match(/v([\d.]+(?:-[a-zA-Z0-9]+)?)/)?.[1].trim();
  }
  if (cmd === "mujs") {
    const text = await execCmd(`echo "exit" | ${cmd}`);
    return text.match(/([\d.]+(?:-[a-zA-Z0-9]+)?)/)?.[1].trim().slice(0, -1);
  }
  if (cmd === "boa") {
    const text = await execCmd(`${cmd} --version`);
    return text.match(/([\d.]+(?:-[a-zA-Z0-9]+)?)/)?.[1].trim();
  }
  if (cmd === "hermes") {
    const text = await execCmd(`${cmd} --version`);
    return text.match(/Hermes release version: (\d+\.\d+\.\d+)/)?.[1].trim();
  }
  if (cmd === "xst") {
    const text = await execCmd(`${cmd} -v`);
    return text.match(/([\d.]+(?:-[a-zA-Z0-9]+)?)/)?.[1].trim();
  }

  if (cmd === "deno") {
    const text = await execCmd(`${cmd} --version`);
    return text.match(/([\d.]+(?:-[a-zA-Z0-9]+)?)/)?.[1].trim();
  }
  if (cmd === "node") {
    const text = await execCmd(`${cmd} --version`);
    return text.match(/v([\d.]+(?:-[a-zA-Z0-9]+)?)/)?.[1].trim();
  }
  if (cmd === "bun") {
    const text = await execCmd(`${cmd} --version`);
    return text.match(/([\d.]+(?:-[a-zA-Z0-9]+)?)/)?.[1].trim();
  }
  if (cmd === "graaljs") {
    const text = await execCmd(`${cmd} --version`);
    return text.match(/([\d.]+(?:-[a-zA-Z0-9]+)?)/)?.[1].trim();
  }
  if (cmd === "jsc") {
    // FIXME: get jsc version by cli
    return "";
  }
  if (cmd === "d8") {
    const cwd = path.dirname(getExePath("d8"));
    const text = await execCmd(`echo "exit" | ${cmd}`, cwd);
    return text.match(/version ([\d.]+(?:-[a-zA-Z0-9]+)?)/)?.[1].trim();
  }
  if (cmd === "js") {
    const text = await execCmd(`${cmd} --version`);
    return text.match(/JavaScript-C([\d.]+(?:-[a-zA-Z0-9]+)?)/)?.[1].trim();
  }
  if (cmd === "jerry") {
    const text = await execCmd(`${cmd} --version`);
    return text.match(/([\d.]+(?:-[a-zA-Z0-9]+)?)/)?.[1].trim();
  }
  if (cmd === "duk" || cmd == "kiesel") {
    const text = await execCmd(`echo "exit" | ${cmd}`);
    return text.match(/([\d.]+(?:-[a-zA-Z0-9]+)?)/)?.[1].trim();
  }
  if (cmd === "jjs") {
    const text = await execCmd(`echo 'exit()' | ${cmd} -v`);
    return text.match(/([\d.]+(?:-[a-zA-Z0-9]+)?)/)?.[1].trim();
  }
  if (cmd === "njs") {
    const text = await execCmd(`${cmd} -v`);
    return text.trim();
  }
  return "";
}

const data = {};
const platform = os.platform();

function isMsys() {
  return !!process.env["MSYSTEM"];
}
function toMsysPath(s) {
  s = s.replaceAll("\\", "/");
  s = s.replace(/^([A-Za-z]):\//, (_, drive) => `/${drive.toLowerCase()}/`);
  return s;
}
function fromMsysPath(s) {
  if (!isMsys() || !s.startsWith("/")) {
    return s;
  }
  s = s.replace(/^\/([A-Za-z])\//, (_, drive) => `${drive.toUpperCase()}:/`);
  return s;
}

function getJavaSize() {
  const v = [
    "/usr/lib/jvm",
    "C:/Program Files/Java",
    "/Library/Java/JavaVirtualMachines",
    "C:/hostedtoolcache/windows/Java_Temurin-Hotspot_jdk/21.0.7-6.0/x64",
    "/opt/hostedtoolcache/Java_Temurin-Hotspot_jdk/21.0.7-6/x64",
    "/Users/runner/hostedtoolcache/Java_Temurin-Hotspot_jdk/21.0.7-6.0/x64/Contents/Home",
    "/Users/runner/hostedtoolcache/Java_Temurin-Hotspot_jdk/21.0.7-6.0/arm64/Contents/Home",
  ];

  for (const i of v) {
    try {
      const n = +execSync(`du -s "${i}"`).toString().split("\t")[0].split(
        " ",
      )[0];
      if (n > 0) {
        return n * 1000;
      }
    } catch (e) {
      // console.error('error: ', e.me)
    }
  }
  return 0;
}

function getFileSize(filePath) {
  try {
    if (filePath.includes("rhino.sh") || filePath.includes("jjs")) {
      return getJavaSize();
    }
    let p = isMsys() ? fromMsysPath(filePath) : filePath;
    if (!fs.existsSync(p) && isMsys() && fs.existsSync(p + ".exe")) {
      p = p + ".exe";
    }
    const stats = fs.statSync(p);
    return stats.size;
  } catch (err) {
    // console.error(err)
    return 0;
  }
}

function getDllSize(programPath) {
  if (isMsys()) {
    programPath = fromMsysPath(programPath);
  }

  let dependencies: string[] = [];

  // JavaScriptCore
  if (programPath.endsWith("jsc")) {
    const dir = path.dirname(programPath);
    const dllPath = dir + "/JavaScriptCore.framework/Versions/A/JavaScriptCore";
    dependencies.push(dllPath);
  }

  if (programPath.includes("graaljs")) {
    const dir = path.dirname(path.dirname(programPath));
    for (const d of ["lib", "modules"]) {
      for (const i of fs.readdirSync(path.join(dir, d))) {
        dependencies.push(path.join(dir, d, i));
      }
    }
  }

  // libChakraCore.so or libChakraCore.dylib
  if (programPath.endsWith("ch")) {
    const dir = path.dirname(programPath);
    for (const i of fs.readdirSync(dir)) {
      if (i.includes("libChakraCore")) {
        dependencies.push(path.join(dir, i));
      }
    }
  }

  try {
    if (platform === "darwin") {
      const output = execSync(`otool -L "${programPath}"`, {
        encoding: "utf-8",
      });
      dependencies = dependencies.concat(
        output
          .split("\n")
          .slice(1)
          .map((line) => line.trim().split(" ")[0])
          .filter((dep) => dep && !dep.startsWith("(")),
      );
    } else if (platform === "linux" || platform === "win32") {
      const output = execSync(`ldd "${programPath}"`, { encoding: "utf-8" });
      for (const line of output.split("\n")) {
        const path = line.split("=>")?.[1]?.trim().split(" (")?.[0];
        if (!path) {
          continue;
        }
        if (
          path.startsWith("/lib/") ||
          path.startsWith("/lib64/") ||
          path.startsWith("/c/WINDOWS/") ||
          path.startsWith("linux-")
        ) {
          continue;
        }
        dependencies.push(path);
      }
    }
  } catch (err) {
    console.error(`Error getting dependencies: ${err.message}`);
    return dependencies.reduce((pre, cur) => pre + getFileSize(cur), 0);
  }

  return dependencies.reduce((pre, cur) => pre + getFileSize(cur), 0);
}

function getExePath(i) {
  const execPath = execSync(`which ${i}`).toString().trim();
  return fromMsysPath(execPath);
}

const JS_BINS = [
  "engine262",
  "quickjs-emscripten-cli",
]

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
        const out = await execCmd(
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
