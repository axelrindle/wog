![header](header.png)

----

<p align="center">
  <img alt="ci status" src="https://github.com/wog-js/wog/workflows/CI/badge.svg">
  <a href="https://app.codacy.com/app/axel.rindle/wog?utm_source=github.com&utm_medium=referral&utm_content=axelrindle/wog&utm_campaign=badger">
    <img alt="Codacy Badge" src="https://api.codacy.com/project/badge/Grade/43ca5dba403b4a75bdf6d285d6d8f994">
  </a>
  <a href="https://github.com/wog-js/wog/releases">
    <img alt="latest release" src="https://img.shields.io/github/v/release/wog-js/wog?include_prereleases">
  </a>
  <a href="https://hub.docker.com/repository/docker/axelrindle/wog">
    <img alt="Docker Image Version (latest by date)" src="https://img.shields.io/docker/v/axelrindle/wog?color=0db7ed&label=image&logo=docker&logoColor=0db7ed">
  </a>
</p>

----

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

### Manual

1. [Download and unpack the latest release](https://github.com/wog-js/wog/releases)

```bash
$ mkdir wog
$ tar xzvf wog-<LATEST>.tar.gz -C wog
$ tar xzvf assets.tar.gz -C wog
```

2. Install dependencies

```bash
$ npm install --only=production
```

3. [Configure your installation](https://github.com/wog-js/wog/wiki/Configuration)

```bash
$ cp .env.example .env
$ nano .env
```

4. Start the server

```bash
$ node backend/main.js
```

### Docker

1. Create a volume for persistent storage

```bash
$ docker volume create wog
```

2. Store all configuration in the `wog` volume. This includes the following files:
   
   1. `.env`

3. Start the container

```bash
$ docker pull axelrindle/wog:<VERSION>
$ docker run \
--mount source=wog,target=/usr/src/app/storage \
--mount type=bind,source=/var/log,target=/var/log_host \
-p 8080:8082 \
--name wog \
--rm -d wog:latest
```

Short explanation on the parameters:

- The first `--mount` instruction connects the storage directory to the volume you just created. This is required so the configuration and data will be persisted on the host system.

- The second `--mount` instruction mounts the host's `/var/log` directory to the container's `/var/log_host` directory. This is optional, but required if you want to access log files on the host system.

- The `-p` parameter connects a port on the host system to the container's exposed port, where the first number is the host port and the second the container port. You should not change the container port.

- The `-d` will start the container as a daemon in the background.

- The `--rm` parameter instructs docker to remove the container as soon as it exits.

## License

[MIT](LICENSE)
