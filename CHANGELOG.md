# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), 
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Added

- Checking for updates before booting the application
- Files can now be collected into groups to split a huge list into many small(er) lists
- Passwords can be reset via email
- A warning is printed when wog is run with elevated permissions (e.g. `sudo`)

### Changed

- The sidebar can be collapsed and expanded
- The UI layout has been updated to be more intuitive and use the full screen size

### Fixed

- [EACCES error in FileAdapter stops loading · Issue #45](https://github.com/wog-js/wog/issues/45)
- [Crash on file deletion · Issue #47](https://github.com/wog-js/wog/issues/47)

### Security

- [Prototype Pollution in lodash · CVE-2020-8203 · GitHub Advisory Database](https://github.com/advisories/GHSA-p6mc-m468-83gw)
- [Signature Malleabillity in elliptic · CVE-2020-13822 · GitHub Advisory Database](https://github.com/advisories/GHSA-vh7m-p724-62c2)

## 0.4.0 `(07.04.2020)`

### Added

- A brand new administration panel has been implemented for easy user administration (more to come!)
- A local storage/ directory will be created for storing logs, data, etc.

### Changed

- User accounts are now stored in a SQLite database, which is more secure than a plain JSON file. In the future I might add support for other database backends, such as MySQL
- A lot has changed behind the scenes. The project structure has been simplified to allow for easier development in the future
- Assets will be releases separately from now on, so you don't need to mess with dev dependencies and asset compilation

## 0.3.0 `(03.10.2019)`

### Fixed

- [#40](https://github.com/wog-js/wog/issues/40)
- [#41](https://github.com/wog-js/wog/issues/41)

## 0.2.0 `(15.08.2018)`

### Added

- Support for custom adapters
- WebSockets connection for watching file changes

### Changed

- UI improvements
- Account storage unified

## 0.1.0 `(22.04.2018)`

### Added

- Find log files
- Display file information (still buggy)
- Search for lines matching a pattern (grep)
