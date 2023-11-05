
## Description

Small project that scrape Serie A players info and salary history from [Salary Sport](https://salarysport.com/)

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## Scraping tool
I utilized [Cheerio](https://github.com/cheeriojs/cheerio) since the [site](https://salarysport.com) is a plain HTML site. Using other tools would be an overkill for the purpose of this project.

## Docker

The project requires a local MongoDB instance running to store players information. A docker-compose.yml file is provided to facilitate the setup.

1. [Install Docker Compose](https://docs.docker.com/compose/install/)
2. Run all containers with `docker-compose up`


## API Reference

#### Get players

```http
  GET /players
```

| Query Parameters | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `name` | `string` | **Optional**. Filter by name |
| `limit` | `number` | **Optional**. Set the maximum number of players per returned |
| `page` | `number` | **Optional**. Specify the page number for pagination |
| `sort` | `string` | **Optional**. Sort players based on the specified attribute |
| `sortType` | `string` | **Optional**. Define the sorting order ("ASC" for ascending, "DESC" for descending) |

#### Get player salary

```http
  GET /players/{id}/salary-history
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |

## Future development
While this project was created under time constraints, there are areas that could benefit from further refinement and enhancement. In the future, considering an update for the project, the following improvements are suggested:

1) Scheduled Scraping: Transfer the scraping process into a cron job to automate data updates. Utilize the upsert operation instead of the current deleteMany - insertMany approach to enhance efficiency.

2) Test Coverage: Expand the test coverage to ensure a more robust and reliable codebase. Additional tests can be implemented to cover various scenarios and edge cases, enhancing the overall stability of the application.