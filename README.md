[![made with node](https://img.shields.io/badge/made%20with-node.js-c1282d.svg?style=for-the-badge&colorA=ef4041)](https://nodejs.org)
[![built by developers](https://img.shields.io/badge/built%20by-developers-D15E28.svg?style=for-the-badge&colorA=E36D26)](https://github.com/axelrindle)
![built for sysadmin](https://img.shields.io/badge/built%20for-sysadmins-D15E28.svg?style=for-the-badge&colorA=E36D26)
[![powered by vue.js](https://img.shields.io/badge/powered%20by-vue.js-43A047.svg?style=for-the-badge&colorA=66BB6A)](https://vuejs.org/)
[![powered by pugjs](https://img.shields.io/badge/powered%20by-pugjs-43A047.svg?style=for-the-badge&colorA=66BB6A)](https://github.com/pugjs/pug)

# wog
> :books: Web interface for viewing logs.

## Features
- Simple and clean user interface :sparkles:
- Powerful features for looking through logs :muscle:
- Shows file information :clipboard:
- Configurable :pencil:
- Watches the file for changes and auto-reloads on change :bell:

## ToDo List
- [x] Load log files based on a [glob](https://github.com/isaacs/node-glob) pattern.
- [x] Have the basic UI set up.
- [x] Search for a specific log file.
- [x] Select a log file.
- [ ] Mark the selected log file as selected in the UI.
- [x] Show content of the selected log file.
- [x] Add content **grep** (means only show lines that contain the given search term).
- [ ] Option to switch between **grep**ping and **fuzzy finding**.
- [x] Display file information (lines, size).
- [ ] Add **head** and **tail** functionality (first and last lines of a file).
- [ ] Add action buttons (refresh, download, clear).
- [ ] No online resources to load.
- [ ] Make the UI more responsive.


## License
[MIT](LICENSE)
