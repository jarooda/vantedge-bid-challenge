# vantedge-bid-challenge

A tender listing dashboard for browsing procurement packages (agency, HPS value, deadline, and status), built with Vue 3, Vite, TypeScript, and Tailwind CSS.

## Running Locally

Demo: https://vantedge-bid-challenge.vercel.app/

**Prerequisites:** Node.js `^22.18.0` or `>=24.12.0`, and [pnpm](https://pnpm.io/installation) (`npm install -g pnpm`).

1. Clone the repo and enter the project folder:
   ```sh
   git clone https://github.com/jarooda/vantedge-bid-challenge.git
   cd vantedge-bid-challenge
   ```
2. Install dependencies:
   ```sh
   pnpm install
   ```
3. Start the dev server:
   ```sh
   pnpm dev
   ```
4. Open the URL shown in the terminal (default: http://localhost:5173).

To try the production build: `pnpm build`, then `pnpm preview`.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).