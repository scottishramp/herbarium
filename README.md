# Herbarium

A field guide to the plants of Scripture: six public-domain botanical plates beside the Bible passages that name each plant.

**Live site:** https://yvlabs.github.io/herbarium/

## Anyone can change it

A pull request that only changes files in `site/` merges itself, with no review. The live site updates a minute or two later.

Paste this into Claude, ChatGPT or any agent, then describe your change at the end:

> Change https://github.com/yvlabs/herbarium by editing only files inside `site/` and opening a pull request to `main` from a fork (it auto-merges and publishes to https://yvlabs.github.io/herbarium/); if you can't fork or open pull requests yourself, don't stop — give me each changed file in full with its link https://github.com/yvlabs/herbarium/edit/main/site/FILE so I can paste it there and follow GitHub's prompts to propose it — the change:

No fork tool? Open that edit link while signed in to GitHub, paste, and follow the prompts. GitHub makes the fork and the pull request for you, and it auto-merges like any other.

## How it works

- `site/` is the whole website: HTML, CSS, JavaScript, data and images.
- [`automerge.yml`](.github/workflows/automerge.yml) runs on every pull request. It reads the list of changed files from GitHub and never runs the pull request's code. If every file is a web file inside `site/` (html, css, js, json, images, fonts, audio/video, pdf; under 5 MB each), it squash-merges and starts a deploy. Otherwise it comments and stops.
- [`pages.yml`](.github/workflows/pages.yml) publishes `site/` to GitHub Pages after every change to `main`.
- Pipeline files can't be changed this way. Outside contributors can't merge anything themselves, and the auto-merge workflow refuses any pull request that touches a file outside `site/`, including `.github/`. GitHub always runs that workflow from `main`, so a pull request can't change the rules it is judged by. That workflow is the only gate: GitHub itself would let the built-in token merge workflow edits, so keep its file check strict.
- To pause auto-merge, set the repository variable `AUTOMERGE` to `off`.

## Please keep

Scripture text loads from the YouVersion Platform API. Show it exactly as returned and keep the version, copyright and "Scripture from YouVersion" attribution.

Scripture: World English Bible (public domain), courtesy of eBible.org, via the YouVersion Platform. Plates: public domain, from Wikimedia Commons. Run by Bibleinator Labs; not affiliated with YouVersion.
