This repo helps you to get started with ExpressJs, MongoDB, NodeJs and Typescript in docker Environment.

## Setup and Run Locally with or without using Docker

Commands

```bash
    # SET DATABASE_URL
    $ npm install
    $ npm run dev

#### Get Home URL

```
  GET /api/v1/
```

#### Register User

```
  POST /api/v1/register
```

| Parameter  | Type     | Description                 |
| :--------- | :------- | :-------------------------- |
| `name`     | `string` | **Required**. Your Name     |
| `email`    | `string` | **Required**. Your Email    |
| `password` | `string` | **Required**. Your Password |

#### Login User

```
  POST /api/v1/login
```

| Parameter  | Type     | Description                 |
| :--------- | :------- | :-------------------------- |
| `email`    | `string` | **Required**. Your Email    |
| `password` | `string` | **Required**. Your Password |