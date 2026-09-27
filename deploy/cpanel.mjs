// Builds the app and pushes dist/ to the `cpanel-deploy` branch, which cPanel
// (Git Version Control -> Update from Remote -> Deploy HEAD Commit) pulls and copies into place.
import { execSync } from "node:child_process";
import { cpSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const BRANCH = "cpanel-deploy";
const sh = (cmd, cwd) => execSync(cmd, { cwd, stdio: "inherit" });
const tryRun = (cmd, cwd) => { try { execSync(cmd, { cwd, stdio: "ignore" }); return true; } catch { return false; } };

const root = execSync("git rev-parse --show-toplevel").toString().trim();
const worktree = join(root, ".deploy-worktree");
process.chdir(root);

sh("npm run build");

tryRun(`git worktree remove --force "${worktree}"`);
rmSync(worktree, { recursive: true, force: true });
sh("git worktree prune");
if (tryRun(`git fetch origin ${BRANCH}`)) {
  sh(`git worktree add -B ${BRANCH} "${worktree}" origin/${BRANCH}`);
} else {
  sh(`git worktree add --detach "${worktree}"`);
  sh(`git checkout --orphan ${BRANCH}`, worktree);
}

for (const name of readdirSync(worktree)) {
  if (name !== ".git") rmSync(join(worktree, name), { recursive: true, force: true });
}
cpSync(join(root, "dist"), worktree, { recursive: true });
cpSync(join(root, "deploy", ".cpanel.yml"), join(worktree, ".cpanel.yml"));

const rev = execSync("git rev-parse --short HEAD").toString().trim();
sh("git add -A", worktree);
if (!tryRun(`git commit -q -m "build: ${rev}"`, worktree)) console.log("No changes to deploy");
sh(`git push origin ${BRANCH}`, worktree);

sh(`git worktree remove --force "${worktree}"`);
console.log(`Pushed ${BRANCH}. Now in cPanel: Git Version Control -> Manage -> Pull or Deploy -> Update from Remote -> Deploy HEAD Commit.`);
