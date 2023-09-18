# Nest.js Movie API

## About the API

This API allows the user to operate on two resources - `movies` and `genres`.

Each `movie` has an `id` (Integer), `title` (String), `description` (String), `releaseDate` (Date) and a list of `genres` (Genre[]).

Each `genre` has an `id` (Integer), `name` and a list of `movies` (Movie[]) qualifying to this genre.

In both cases, the `id` is the field uniquely identifying the record, although this API also enforces that for each `genre` its `name` be unique as well.
This rule does not apply to other fields, in particular it does not apply to movie's `title`. In fact, it is not uncommon for two movies to share the exact same title, however they usually have different release dates, genre, plot etc.

The data is stored in a PostgresQL database.

## Running the app

1. Make sure you have `docker-compose` installed. It is required to run this project. You can check the installation instructions in the [docker-compose docs](https://docs.docker.com/compose/install/)
2. Unzip the project
3. In the top level of the unzipped directory, find a file named `.env.example`. It’s a hidden file, so you might have to show hidden files in the directory first. If you're browsing the directory with an IDE it is most probably visible by default. Rename the file to `.env` and inside it, replace the values in the square brackets (<>) with values of your choice (without the brackets) and save the file.
4. Open your terminal in the top level of the unzipped directory and run command `docker-compose up -d`.
5. Once the build is finished and Docker containers start, your Movie API is ready to receive requests!

## Endpoints and availbale operations

For opertaions on `genres`, the following endpoints are exposed:

- `GET /genres` - list all genres
- `GET /genres/:id` - find a single genre by its `id`
- `POST /genres` - create a new genre. This endpoint expects a body containing only genre's `name`. The `id`, if provided, will be ignored and assigned automatically by the database. This API requires that genre `name` be at least 1 and at most 50 characters long
- `PATCH /genres/:id` - update a genre with the provided `id`. Since the `name` is the only editable genre's property, it is required in the request body
- `DELETE /genres/:id` - remove a genre with the provided `id`. The genre will also be removed from a list of genres of any movie which contained it. As a result of this operation some movies can become "genreless" (with no associated genres) and this API allows such state.

  The last 3 endpoints (POST, PATCH, DELETE) return an object (genre) being the result (POST, PATCH) or the subject (DELETE) of a performed operation.

  All of the above enpoints, except for the `POST /genres`, accept a query parameter `includeMovies`. Setting the paramenter to `true` adds to each `genre` in the reponse a list of `movies` which qualify to this genre. Since such list can potenitally contain a huge amount of data, this behaviour is disabled by deafult, i.e. the paramanter sent with any other value, or ommited at all, will return the results without the nested `movies`.

For opertaions on `movies`, the following endpoints are exposed:

- `GET /movies` - list all movies. The result can by filtered through the use of two query parameters - `title` and `genre`. Each of them will limit results to only those containing a provided value in its `title` or one of its `genres` name, accordingly. Both filters are case-insensitive, so a request with parameters `?title=tIt&genre=eNr` would include a `movie` with a `title` "Title" and one of its `genres` being named "genre"
- `GET /movies/:id` - find a single movie by its `id`
- `POST /movies` - create a new movie. This endpoint expects a body containing movie's `name`, `description`, `releaseDate` and an array of movie's `genres` (specifically, those genres' `names`). The `id`, if provided, will be ignored and assigned automatically by the database. The `title` must be a string of length between 1 and 100 characters (inclusive). The `description` must be a string between 1 and 1000 characters (inclusive). The `releaseDate` can be any value, which provided as an argument to JS Date constructor produces a valid Date object, e.g. a datestring `2020-02-02` or `2020-02-20T00:00:00.000Z`, or a timestamp (integer). Finally, the `genres` must be an array containing only strings, each of them must comply to the requirements regarding genre's `name` and corresponding to a `name` of a `genre` currently exiting in the database. Additionally, this array must contain at least one element (cannot be empty), therefore without any exisitng `genre`, no `movie` can be created.
- `PATCH /movies/:id` - update a genre with the provided `id`. It expects a body similar to the `POST` endpoint, but where all values are optional, and instead of a `genres` array, it accepts two other arrays - `genresToAdd` and `genresToRemove`, both containing genres' names. Those genres will be added or removed, accordingly, from movie's genres list. Attempt to add a non-existent genre or remove a genre which a given movie already does not have will both be ignored - the request will be accepted and no changes will be made. Simultaneouly adding and removing the same genre will also bear no effect on the end result.
- `DELETE /movies/:id`- remove a movie with the provided `id`. The movie will be also removed from the list of movies of any `genre` that contained that movie.

  The last 3 endpoints (POST, PATCH, DELETE) return an object (genre) being the result (POST, PATCH) or the subject (DELETE) of a performed operation.

  Since in general each movie only belongs to a single or a couple of genres, by default each movie in the responses will contain a list of `genres` it qualifies to. This behaviour cannot be altered by the API user. A potential scenario where a requested movie would contain a large dataset of associated `genres` is highly unlikely and would have to be planned by a malicious actor. At this point, this API does not include any mechanism preventing users from associating an unlimited amount of genres to a movie.
