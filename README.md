![header](header.png)

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/43ca5dba403b4a75bdf6d285d6d8f994)](https://app.codacy.com/app/axel.rindle/wog?utm_source=github.com&utm_medium=referral&utm_content=axelrindle/wog&utm_campaign=badger)

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
1. [Download and unpack the latest release](https://github.com/axelrindle/wog/releases)
```bash
$ mkdir wog
$ tar xzvf wog-<LATEST>.tar.gz -C wog
$ tar xzvf assets.tar.gz -C wog
```

2. Install dependencies
```bash
$ npm install --only=production
```

3. [Configure your installation](https://github.com/axelrindle/wog/wiki/Configuration)
```bash
$ cp .env.example .env
$ nano .env
```

4. Start the server
```bash
$ node backend/main.js
```

## License
[MIT](LICENSE)
