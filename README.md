# Nest.js Movie API

## About the API

This API allows the user to operate on two resources - `movies` and `genres`.

Each `movie` has an `id` (Integer), `title` (String), `description` (String), `releaseDate` (Date) and a list of `genres` (Genre[]).

Each `genre` has an `id` (Integer), `name` and a list of `movies` (Movie[]) qualifying to this genre.

In both cases, the `id` is the field uniquely identifying the record, although this API also enforces that for each `genre` its `name` be unique as well.
This rule does not apply to other fields, in particular it does not apply to movie's `title`. In fact, it is not uncommon for two movies to share the exact same title, however they usually have different release dates, genre, plot etc.

## Project structure and manual testing

This is a dockerized project that runs in two containers. The first contains a Nest.js app, the API. The other one is a PostgresQL database, where the API data is stored.

In order to test the API, you can use the attached Postman collection, localized in the top level of the project directory, named `movies_api.postman_collection.json`.

## Running the app

1. Make sure you have `docker-compose` installed. It is required to run this project. You can check the installation instructions in the [docker-compose docs](https://docs.docker.com/compose/install/)
2. Unzip the project
3. In the top level of the unzipped directory, find a file named `.env.example`. It’s a hidden file, so you might have to show hidden files in the directory first. If you're browsing the directory with an IDE it is most probably visible by default. Rename the file to `.env` and inside it, replace the values in the square brackets (<>) with values of your choice (without the brackets) and save the file.
4. (Optional) You can _optionally_ override the `APP_PORT` variable value `3000` in order to link the API running in the Docker container to a different port on your local machine. However, it is advised to leave this value unchanged so that you can use the attached Postman collection to test the API without the need to ajdust the URLs (they are set to `localhost:3000` by default).
5. Open your terminal in the top level of the unzipped directory and run command `docker-compose up -d`.
6. Once the build is finished and Docker containers start, your Movie API is ready to receive requests!

## Endpoints and availbale operations

For opertaions on `genres`, the following endpoints are exposed:

- `GET /genres` - list all genres. Genres are sorted by `name`, ascending, by default
- `GET /genres/:id` - find a single genre by its `id`
- `POST /genres` - create a new genre. This endpoint expects a body containing only genre's `name`. The `id`, if provided, will be ignored and assigned automatically by the database. This API requires that genre `name` be at least 1 and at most 50 characters long. The genre names must be unique, and are saved to the database converted to lowercase and trimmed of the whitespace, so if a genre named `"horror"` already exists, then an attempt to create a new genre named `"Horror"` or `" hORRoR "` will result in a `HTTP 409 Conflict` response.
- `PATCH /genres/:id` - update a genre with the provided `id`. Since the `name` is the only editable genre's property, it is required in the request body
- `DELETE /genres/:id` - remove a genre with the provided `id`. The genre will also be removed from a list of genres of any movie which contained it. As a result of this operation some movies can become "genreless" (with no associated genres) and this API allows such state.

  The last 3 endpoints (POST, PATCH, DELETE) return an object (genre) being the result (POST, PATCH) or the subject (DELETE) of a performed operation.

  All of the above enpoints, except for the `POST /genres`, accept a query parameter `includeMovies`. Setting the paramenter to `true` adds to each `genre` in the reponse a list of `movies` which qualify to this genre. Since such list can potenitally contain a huge amount of data, this behaviour is disabled by deafult, i.e. the paramanter sent with any other value, or ommited at all, will return the results without the nested `movies`.

For opertaions on `movies`, the following endpoints are exposed:

- `GET /movies` - list all movies. The result can by filtered through the use of two optional query parameters - `title` and `genre`. Each of them will limit results to only those containing a provided value in its `title` or one of its `genres` name, accordingly. Both filters are case-insensitive, so a request with parameters `?title=tIt&genre=eNr` would include a `movie` with a `title` "Title" and one of its `genres` being named "genre". The route also accepts optional query paratemeters for sorting and pagination. For sorting you can use `sortBy` parameter, which accepts `id`, `title` and `releaseDate` values, and `sortingDirection` parameter, which accepts values `asc` and `desc` (it is case-insencitive, so `aSc` and other variations will also be accepted). By default, the result will be sorted by `id`, in ascending order. If you provide for `sortBy` a value different than `id`, the results will be sorted firstly by that value, and then by `id`, ascending. Example: while sorting by `title`, the result contains two movies with an identical title. The movie with lower `id` will appear in the result first. For pagination you can use `page` and `pageSize` parameters. `pageSize` defines how many records will be returned and `page` defines which page of all records divided by `pageSize` number should be returned. Example: `?page=2&pageSize=10` will return records 11 through 20 (a second page of records divided by 10 records per page), etc. By default this endpoint returns the first page, 10 records per page. The response contains and object with two fields: `items` - an array of the movies and `pagination` - an object containing the pagination metadata: `page` - page number, `pageSize` - amount of items per page and `totalCount` - a number of all records in the database conforming to the provided filters. Based of those values the API client can calculate appropriate number of pages and correctly display current page.
- `GET /movies/:id` - find a single movie by its `id`
- `GET /movies/search` - search movies by title or genre. Almost identical to `GET /movies`, although instead of `title` and `genre` parameters, it accepts a single query parameter `titleOrGenre` and returns a list of all movies in which `title` or one of its `genres` names contain the provided value. The search is also case-insensitive. This endpoint also accepts the same query parameters for sorting and pagination as `GET /movies`, and the response is shaped in the same (paginated) manner.
- `POST /movies` - create a new movie. This endpoint expects a body containing movie's `name`, `description`, `releaseDate` and an array of movie's `genres` (specifically, those genres' `names`). The `id`, if provided, will be ignored and assigned automatically by the database. The `title` must be a string of length between 1 and 100 characters (inclusive) and will be trimmed of whitespace in the beggining and the end of the string. The `description` must be a string between 1 and 1000 characters (inclusive) and will be trimmed of whitespace in the beggining and the end of the string. The `releaseDate` can be any value, which provided as an argument to JS Date constructor produces a valid Date object, e.g. a datestring `2020-02-02` or `2020-02-20T00:00:00.000Z`, or a timestamp (integer). Finally, the `genres` must be an array containing only strings, each of them must comply to the requirements regarding genre's `name` and corresponding to a `name` of a `genre` currently exiting in the database. Each element will be sanitized - trimmed of whitespace and conerted to lowercase. Additionally, this array must contain at least one element (cannot be empty), therefore without any exisitng `genre`, no `movie` can be created.
- `PATCH /movies/:id` - update a genre with the provided `id`. It expects a body similar to the `POST` endpoint, but where all values are optional, and instead of a `genres` array, it accepts two other arrays - `genresToAdd` and `genresToRemove`, both containing genres' names and both will get sanitized in the same manner. Those genres will be added or removed, accordingly, from movie's genres list. Attempt to add or remove a non-existent genre will result in a `HTTP 404 Not Found` reponse. Attempt to add or remove a genre which a given movie already does have/does not have appropriately, will both be ignored - the request will be accepted and no changes will be made. Simultaneouly adding and removing the same genre will also bear no effect on the end result.
- `DELETE /movies/:id`- remove a movie with the provided `id`. The movie will be also removed from the list of movies of any `genre` that contained that movie.

  The last 3 endpoints (POST, PATCH, DELETE) return an object (genre) being the result (POST, PATCH) or the subject (DELETE) of a performed operation.

  Since in general each movie only belongs to a single or a couple of genres, by default each movie in the responses will contain a list of `genres` it qualifies to. This behaviour cannot be altered by the API user. A potential scenario where a requested movie would contain a large dataset of associated `genres` is highly unlikely and would have to be planned by a malicious actor. At this point, this API does not include any mechanism preventing users from associating an unlimited amount of genres to a movie.
