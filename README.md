# CrateAPI

The Crate API is a powerful API for retrieving information from PowerPoint games on the Crate website. With this API, you can access a wide range of functions to obtain game data and enhance your users' experience. Whether you want to retrieve game scores, player statistics, or leaderboard information, the Crate API has got you covered.

## Features

- **Game Data Retrieval**: Retrieve information about PowerPoint games, such as avaliations and game details.
- **Profiles**: Access data related to player informations.
- **API Integration**: Seamlessly integrate the Crate API with your application using our comprehensive documentation and client libraries.

## Get Started

To get started with the Crate API, follow these steps:

- Go to `CrateAPI` directory using: `cd CrateAPI`.

### Manual Host

You are running on your own machine, type this:

```shell
uvicorn base.config:app --host localhost --port 8000
```

Else, for example you are using a client server like `Replit`, type this:

```shell
uvicorn base.config:app --host 0.0.0.0 --port 8000
```