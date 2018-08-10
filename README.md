![header](header.png)

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/43ca5dba403b4a75bdf6d285d6d8f994)](https://app.codacy.com/app/axel.rindle/wog?utm_source=github.com&utm_medium=referral&utm_content=axelrindle/wog&utm_campaign=badger)
[![Known Vulnerabilities](https://snyk.io/test/github/axelrindle/wog/badge.svg?targetFile=package.json)](https://snyk.io/test/github/axelrindle/wog?targetFile=package.json)
[![Dependabot](https://badgen.net/badge/Dependabot/enabled/green?icon=dependabot)](https://dependabot.com/)

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

## ToDo
[Moved here](https://github.com/axelrindle/wog/projects/1)

## License
[MIT](LICENSE)
