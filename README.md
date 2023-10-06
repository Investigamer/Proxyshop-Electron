<div align="center">

# Rebuilding Proxyshop as an Electron App
### Vite + Electron + React + Material-UI

[![license](https://img.shields.io/badge/license-MPL2.0-blue.svg)](https://github.com/jooy2/retron/blob/master/LICENSE) ![Programming Language Usage](https://img.shields.io/github/languages/top/MrTeferi/Proxyshop-Electron) ![Languages](https://img.shields.io/github/languages/count/MrTeferi/Proxyshop-Electron) ![github repo size](https://img.shields.io/github/repo-size/MrTeferi/Proxyshop-Electron)

</div>

## Advantages of Electron

- ✅ Powerful WebGUI technologies like CSS/SASS, React, Material-UI, Tailwind, etc
- ✅ Baked-in installer, update system, cross-platform support
- ✅ Smooth frontend development and maintenance

## Components

- **For compile & build**

  - `vite`
  - `electron`
  - `electron-builder` (Package builder)

- **For web development framework**

  - `react`
  - `react-dom`
  - `react-router-dom`
  - `@redux/toolkit` & `react-redux` (Global state management)
  - `typescript`

- **For CSS Design**

  - `@mui/material` (Material Design CSS Framework)
  - `@emotion/react`

- **For Multilingual language support**

  - `i18next` (Multilingual translation)

- **For development utils**

  - `eslint` (Code syntax checking)
  - `eslint-plugin-react-hooks`
  - `prettier`

- **For testing**

  - `playwright`

## Installation

Clone this repo:
```shell
git clone https://github.com/MrTeferi/Proxyshop-Electron.git
```

Install dependencies:
```shell
# via npm
npm install
```

Test the project:
```shell
npm run dev
```

## Build

Can build targeting Windows 10 or later, macOS 14.x or later, and major Linux distributions.

```shell
# For Windows (.exe, .appx)
$ npm run build:win

# For macOS (.dmg)
$ npm run build:mac

# For Linux (.rpm, .deb, .snap)
$ npm run build:linux
```

The built packages can be found in `release/{version}` location.

### What do I need to do for a multi-platform build?

**macOS** is recommended if you want to build multiple platforms simultaneously on one platform. Because it can be configured with just a few very simple settings.

You can perform multi-platform builds at once with the following command. Alternatively, you can just do it for the OS you want via the individual build commands above.

```shell
$ npm run build
```
