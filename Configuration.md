# Configuration

## `config.js`

### `port`

> The port the server is listening on.

Defaults to **8082**.



### `url`

> The full url via which the application is accessible.

**Required.**



### `logs`

> An array of [globs](https://www.npmjs.com/package/glob) for selecting your log files.

**Required.**



### `enableFileDownloads`

> Whether to allow users to download log files to their computer.

Defaults to **true**.



### `session`

> Session settings.

#### `redis`

> Configuration for connecting to a redis server. Used for storing user session data.

| Property | Default | Description                                     |
| -------- | ------- | ----------------------------------------------- |
| host     |         | The host of the redis server.                   |
| port     | 6379    | The port the redis server is listening on.      |
| pass     | `null`  | A password to authenticate on the redis server. |
| db       | 0       | Which redis database to use.                    |

#### `secret`

> A secret string used to encrypt session data.



----



## `accounts.js`

> Contains all accounts one can login with.

Create an account by adding an entry like this:



```javascript
'USERNAME': 'PASSWORD'
```

