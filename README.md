![header](header.png)

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/43ca5dba403b4a75bdf6d285d6d8f994)](https://app.codacy.com/app/axel.rindle/wog?utm_source=github.com&utm_medium=referral&utm_content=axelrindle/wog&utm_campaign=badger)

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

## Why does this exist?
I was tired of always SSHing into my local server and looking through a log file in the terminal. It was painful, especially when the file was very large. So I decided to build myself a small web interface with some extra features to erase the pain of looking through log files via a small terminal.

## Install
1. Clone this repository
```bash
$ git clone https://github.com/axelrindle/wog
```

2. Install dependencies
```bash
$ npm install --only=production
```

3. Configure your installation
```bash
$ nano config.js
```

4. Start the server
```bash
$ node backend/main.js
```

## Configuration

[Look here](Configuration.md)

## ToDo

[Moved here](https://github.com/axelrindle/wog/projects/1)

## License
[MIT](LICENSE)
