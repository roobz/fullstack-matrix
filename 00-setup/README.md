# Module 0: Environment setup

Time: 2 to 3 days. Outcome: a working Node 24 installation managed by nvm, an editor that shows errors as you type, a debugger you know how to start, a git repository for the course, and a clear picture of the difference between running JavaScript in Node and in a browser.

Nothing in this module is hard, but every later module assumes it is done properly. A wrong Node version or a missing editor extension costs an hour of confusion later for every ten minutes saved now.

## Lessons

- [0.1 Install nvm and Node 24](#01-install-nvm-and-node-24)
- [0.2 npm, the package manager](#02-npm-the-package-manager)
- [0.3 VS Code](#03-vs-code)
- [0.4 Chrome DevTools, first look](#04-chrome-devtools-first-look)
- [0.5 Git for this course](#05-git-for-this-course)
- [0.6 Two runtimes: Node and the browser](#06-two-runtimes-node-and-the-browser)
- [Exercises](#exercises)
- [Troubleshooting](#troubleshooting)
- [Glossary](#glossary)
- [Self-check](#self-check)

---

## 0.1 Install nvm and Node 24

### Definitions

**Node.js** (usually just Node) is a program that runs JavaScript outside a browser. It bundles the V8 JavaScript engine (the same one Chrome uses) with libraries for reading files, opening network connections, and everything else a browser does not let a web page do.

**nvm** (Node Version Manager) installs and switches between Node versions. Projects pin a Node version, and different projects pin different ones. nvm makes switching a single command instead of a reinstall.

**npm** (Node Package Manager) is installed with Node. It downloads libraries other people have published and runs scripts defined in your project.

### Steps

1. Install nvm. Copy the install command from the nvm README at https://github.com/nvm-sh/nvm#installing-and-updating and run it in your terminal. It downloads a script, places nvm in `~/.nvm`, and appends a few lines to `~/.zshrc` so the `nvm` command exists in new shells.
2. Open a new terminal window, or run `source ~/.zshrc`, then confirm:
   ```sh
   nvm --version
   ```
3. Install Node 24 and make it the default for every new shell:
   ```sh
   nvm install 24
   nvm alias default 24
   ```
4. Confirm both Node and npm:
   ```sh
   node --version   # v24.x.x
   npm --version
   ```
5. In the training directory, create an `.nvmrc` file containing the version so `nvm use` picks it up automatically:
   ```sh
   cd ~/training
   echo "24" > .nvmrc
   nvm use
   ```

### Optional: switch versions automatically when you change directories

The nvm README has a zsh snippet under "Deeper Shell Integration" that runs `nvm use` whenever you `cd` into a directory with an `.nvmrc`. Add it to `~/.zshrc` below the nvm lines. It is worth the two minutes once you have more than one project.

### Why not install Node from the website or Homebrew?

Both work, but they install one global version. When a project needs a different one you end up with two competing installs and `node` pointing at whichever won. nvm avoids this. Never install Node more than one way on the same machine.

---

## 0.2 npm, the package manager

Module 3 covers npm in depth. For now you need enough to run the exercises.

### Definitions

**package.json** is the file that describes a project: its name, its dependencies, and named scripts. Every Node project has one at its root.

**A dependency** is a library your code imports. **A dev dependency** is a tool used while developing (a test runner, a linter) that your program does not need at runtime.

**node_modules/** is the folder where npm puts downloaded dependencies. It is large, regenerated from `package.json` at any time with `npm install`, and never committed to git.

**package-lock.json** records the exact version of every dependency that was installed, including dependencies of dependencies. It is committed, so everyone who clones the project installs identical versions.

### Commands you will use in Modules 1 and 2

| Command | What it does |
|---|---|
| `npm init -y` | Create a `package.json` with defaults |
| `npm install <name>` | Add a dependency and install it |
| `npm install -D <name>` | Add a dev dependency and install it |
| `npm install` | Install everything listed in `package.json` (after a clone) |
| `npm run <script>` | Run a script named in the `scripts` section |
| `npx <name>` | Run a package's command without installing it globally |

### One setting to make now

Module 1 uses ES modules (`import` and `export`). Node needs to be told a project uses them. Create a `package.json` in `01-js-fundamentals/` and add `"type": "module"`:

```sh
cd ~/training/01-js-fundamentals
npm init -y
npm pkg set type=module
```

`npm pkg set` edits `package.json` for you. Open the file and look at what it wrote.

---

## 0.3 VS Code

### Install

Download from https://code.visualstudio.com. Open it, press `Cmd+Shift+P`, run "Shell Command: Install 'code' command in PATH" so you can open any folder with `code .` from the terminal.

### Extensions

Install these from the Extensions panel (`Cmd+Shift+X`). Each is listed with its identifier so you can confirm you have the right one.

| Extension | Identifier | Why |
|---|---|---|
| ESLint | `dbaeumer.vscode-eslint` | Shows lint errors inline and fixes them on save. Does nothing until Module 3 configures ESLint, but install it now. |
| Error Lens | `usernamehw.errorlens` | Prints the error message on the line itself instead of only a red underline. |
| Pretty TypeScript Errors | `yoavbls.pretty-ts-errors` | Reformats TypeScript's error messages so they are readable. Used from Module 4. |

Do not install a formatter extension. ESLint will format from Module 3 onward.

### Settings

Open settings as JSON (`Cmd+Shift+P`, "Preferences: Open User Settings (JSON)") and add:

```json
{
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "editor.formatOnSave": false,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "files.eol": "\n",
  "files.insertFinalNewline": true,
  "files.trimTrailingWhitespace": true,
  "javascript.updateImportsOnFileMove.enabled": "always",
  "typescript.updateImportsOnFileMove.enabled": "always"
}
```

`editor.formatOnSave` is off on purpose. The ESLint code action does the fixing once Module 3 configures it.

### Things to know how to do

- Open the integrated terminal: `` Ctrl+` ``.
- Command palette: `Cmd+Shift+P`. Anything you cannot find a button for is in here.
- Go to file: `Cmd+P`.
- Go to definition: `F12` or `Cmd+click` on a name. Works for your own functions in Module 1 and for library types later.
- Rename symbol: `F2`. Renames every reference, not just the one under the cursor.
- Problems panel: `Cmd+Shift+M`. Every error and warning in the open project.
- JavaScript Debug Terminal: command palette, "JavaScript Debug Terminal". Any `node` command run in that terminal stops at your breakpoints. This is the easiest way to debug and Module 1 uses it.

---

## 0.4 Chrome DevTools, first look

Module 2 spends real time here. For now, open any web page, press `Cmd+Option+I`, and find these four panels.

- **Console.** A JavaScript prompt attached to the page. Type `document.title` and press Enter. Errors from the page also appear here.
- **Elements.** The live DOM tree. Click an element in the tree and the page highlights it. Change text in the tree and the page changes.
- **Network.** Every request the page makes. Reload with the panel open and watch them arrive.
- **Sources.** The page's JavaScript files, with breakpoints.

The Console is a second JavaScript runtime you will use in Exercise 2 to compare against Node.

---

## 0.5 Git for this course

### Definitions

**A repository** is a folder whose history git tracks. **A commit** is a saved snapshot of the tracked files with a message. **The working tree** is the files as they are now, which may differ from the last commit. **Staging** is choosing which changes go into the next commit.

### Set up the course repository

```sh
cd ~/training
git init
git config user.name "Your Name"
git config user.email "you@example.com"
```

Create `.gitignore` at the root:

```
node_modules/
dist/
.env
.env.*
.DS_Store
*.log
```

`node_modules` is regenerated by `npm install`. `dist` is build output. `.env` files hold secrets and must never be committed.

Make the first commit:

```sh
git add .
git commit -m "Module 0: repository setup"
```

### Daily commands

| Command | What it does |
|---|---|
| `git status` | What has changed since the last commit |
| `git diff` | The actual changed lines |
| `git add <path>` or `git add .` | Stage changes |
| `git commit -m "message"` | Save the staged changes |
| `git log --oneline` | History, one line per commit |
| `git switch -c <name>` | Create and move to a new branch |
| `git switch main` | Move back to the main branch |

### Habit for this course

Commit at the end of every exercise with a message in the form `Module N: exercise M, short description`. The history becomes a record of what you did and when, and `git diff` between commits shows how a solution evolved.

---

## 0.6 Two runtimes: Node and the browser

JavaScript the language is the same everywhere: the same syntax, the same `Array` and `Promise`, the same rules. What differs is the **runtime**, meaning the environment that runs the code and the extra objects it provides.

| | Browser | Node |
|---|---|---|
| Purpose | Run code inside a web page | Run code on a machine, like Python or Ruby |
| Global object | `window` (also `globalThis`) | `globalThis` (also `global`) |
| Has the DOM (`document`, `HTMLElement`) | Yes | No |
| Has the file system (`node:fs`) | No | Yes |
| Has `fetch` | Yes | Yes (since Node 18) |
| Has `console`, `setTimeout`, `Promise`, `JSON` | Yes | Yes |
| How code gets in | `<script>` tags in HTML | `node File.js` |
| What the code is allowed to do | Only what the browser permits a web page to do: no reading files, no running programs | Anything the person who ran it is allowed to do on that machine |

Modules 1, 5, 8, and 9 run in Node. Modules 2, 6, and 7 run in the browser. TypeScript, tests, and tooling run in Node even when the code they process is destined for the browser.

### Definitions

**JavaScript engine.** The program that parses and executes JavaScript. V8 is the engine in Chrome and Node. Firefox uses SpiderMonkey, Safari uses JavaScriptCore.

**Runtime.** An engine plus the surrounding environment: the browser or Node. The runtime decides what globals exist and how asynchronous work is scheduled.

**REPL.** Read, Evaluate, Print, Loop. An interactive prompt. Run `node` with no arguments to get one. The browser Console is also a REPL. Use it for one-line experiments; use files for anything you want to keep.

**Script.** A file of JavaScript run top to bottom.

**Module.** A file that uses `import` and `export` and has its own scope. Module 1 uses modules from the start.

---

## Exercises

### Exercise 1: Hello, runtime

Create `01-js-fundamentals/Hello.js`:

```js
console.log(`Node version: ${process.version}`);
console.log(`Platform: ${process.platform}`);
console.log(`Arguments: ${process.argv.slice(2).join(', ') || '(none)'}`);
```

Run it two ways:

```sh
node Hello.js
node Hello.js one two three
```

Then open the browser Console and type `process`. You will get `ReferenceError: process is not defined`.

*Done when:* the script prints a `v24` version and your arguments, and you can explain in your own words why `process` exists in Node but not in the browser. Write that explanation in `notes/module-0.md`.

### Exercise 2: Two consoles

In the Node REPL (`node`) and in the browser Console, evaluate each of these:

```js
1 + '1'
'3' * '4'
[] + {}
[] + []
0.1 + 0.2
typeof null
```

*Done when:* you have the same results in both runtimes and can explain why `1 + '1'` is `'11'` but `'3' * '4'` is `12`. (The `+` operator concatenates when either side is a string. `*` has no string meaning, so it converts both sides to numbers.) You do not need to memorize these. You need to know that automatic conversion exists, so that later you understand why the course insists on `===` and TypeScript.

### Setup checklist

Not an exercise, but confirm each before moving on:

- [ ] `node --version` prints v24 in a fresh terminal without running `nvm use`
- [ ] `~/training/.nvmrc` exists and contains `24`
- [ ] `01-js-fundamentals/package.json` exists with `"type": "module"`
- [ ] VS Code opens with `code .` and the three extensions are installed
- [ ] `git log` in `~/training` shows at least one commit
- [ ] `notes/module-0.md` and `notes/errors.md` exist (the errors file can be empty)

---

## Troubleshooting

**`nvm: command not found` after installing.** The install script edits `~/.zshrc`, but the current terminal loaded the old file. Open a new terminal or run `source ~/.zshrc`. If it still fails, open `~/.zshrc` and confirm the `NVM_DIR` lines the installer added are there.

**`node --version` shows the wrong version in a new terminal.** You did not set the default. Run `nvm alias default 24`.

**`node --version` shows the right version but `which node` points at `/usr/local/bin` or `/opt/homebrew`.** A second Node installation is ahead of nvm on your `PATH`. Uninstall it (`brew uninstall node` if Homebrew installed it) so only nvm's copy remains.

**`EACCES: permission denied` from npm.** Something is trying to write to a system directory. Never run `sudo npm`. With nvm, everything lives under your home directory and this error should not occur; if it does, a stray global install from a previous Node setup is the cause.

**`SyntaxError: Cannot use import statement outside a module`.** The file uses `import` but `package.json` in that folder (or a parent) lacks `"type": "module"`. Run `npm pkg set type=module` in the folder.

**VS Code shows no errors for obvious mistakes.** Expected until Module 3. The editor's built-in JavaScript checking is minimal by design. ESLint supplies the rest.

Record any problem that took you more than ten minutes in `notes/errors.md`, with the exact message and the fix.

---

## Glossary

- **CLI.** Command-line interface. A program you run from the terminal.
- **Dependency.** A library your project installs from npm.
- **Engine.** The program that executes JavaScript (V8).
- **ES modules (ESM).** The standard module system using `import` and `export`.
- **Global.** A variable available everywhere without importing it (`console`, `setTimeout`).
- **Lockfile.** `package-lock.json`, the exact versions installed.
- **LTS.** Long-term support. Even-numbered Node major versions become LTS releases. 24 is one.
- **PATH.** The list of directories the shell searches for commands. `which node` shows which one won.
- **REPL.** Interactive prompt that evaluates one expression at a time.
- **Runtime.** Engine plus environment: browser or Node.
- **Shell.** The program that interprets what you type in the terminal. Yours is zsh.

---

## Self-check

Answer without looking, then check.

1. What does nvm do that installing Node from the website does not?
2. Which file lists a project's dependencies, and which one records their exact installed versions?
3. Why is `node_modules` in `.gitignore`?
4. Name two globals that exist in the browser but not in Node, and two that exist in Node but not in the browser.
5. What does `"type": "module"` in `package.json` change?

<details>
<summary>Answers</summary>

1. It installs several Node versions side by side and switches between them per project, using `.nvmrc`.
2. `package.json` lists them with version ranges. `package-lock.json` records exact versions.
3. It is large and fully regenerated by `npm install` from the lockfile, so committing it adds nothing but size.
4. Browser only: `window`, `document`. Node only: `process`, `require` (or the `node:fs` module).
5. Node treats `.js` files in that folder as ES modules, so `import` and `export` work and top-level `await` is allowed.

</details>
