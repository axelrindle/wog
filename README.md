[![made with node](https://img.shields.io/badge/made%20with-node.js-c1282d.svg?style=for-the-badge&colorA=ef4041)](https://nodejs.org)
[![built by developers](https://img.shields.io/badge/built%20by-developers-D15E28.svg?style=for-the-badge&colorA=E36D26)](https://github.com/axelrindle)
![built for sysadmin](https://img.shields.io/badge/built%20for-sysadmins-D15E28.svg?style=for-the-badge&colorA=E36D26)
[![powered by vue.js](https://img.shields.io/badge/powered%20by-vue.js-43A047.svg?style=for-the-badge&colorA=66BB6A)](https://vuejs.org/)
[![powered by pugjs](https://img.shields.io/badge/powered%20by-pugjs-43A047.svg?style=for-the-badge&colorA=66BB6A)](https://github.com/pugjs/pug)

# wog
> :books: A web interface for viewing logs.

## Features
- Simple and clean user interface :sparkles:
- Powerful features for looking through logs :muscle:
- Shows file information :clipboard:
- Configurable :pencil:
- Watches the file for changes and auto-reloads on change :bell:

## Disclaimer
*wog* **does NOT** provide any form of authentication. You have to enable authentication by yourself if you wish to access your *wog* instance from outside your home network. I am not responsible for any damage taken to you or your company by not properly securing access to your logs.

If you are using **Apache 2**, you can follow [this tutorial](https://www.digitalocean.com/community/tutorials/how-to-set-up-password-authentication-with-apache-on-ubuntu-14-04) on how to password-protect a certain directory.

*Note*: You may replace the **Directory** directive used in the tutorial above with the **Location** directive to protect just a certain path of the URL, which may be a reverse proxy. [Look here](https://stackoverflow.com/questions/23565693/how-can-i-password-protect-applications-behind-mod-proxy-in-apache) for more information.

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
- [ ] Display errors in a nice way to the user.
- [ ] Display line numbers.
- [ ] Add a **Go to line** action.
- [ ] Watch files for changes and auto-reload on change.

Progress: **7**/**17** (**41,18**%)

## License
[MIT](LICENSE)
