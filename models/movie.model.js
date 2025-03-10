import pool from "./db.js";

function mapToMovie(result, defaultGenre = undefined) {

    return {
        id: result.rows[0].Id,
        name: result.rows[0].Name,
        desc: result.rows[0].Description,
        release: new Date(result.rows[0].ReleaseDate),
        duration: result.rows[0].Duration,
        rating: result.rows[0].Rating,
        genre: result.rows[0].Genre ?? defaultGenre,
    }
};

function mapToMovieList(result) {
    return result.rows.map((movie) => ({
        id: movie.Id,
        name: movie.Name,
        genre: movie.Genre
    }));
}

async function createGenreIfNotExists(client, genre) {

    const genreResult = await client.query({
        text: 'SELECT "Id" FROM "Genre" WHERE LOWER("Name") = LOWER($1)',
        values: [genre]
    });

    if (genreResult.rowCount === 1) {
        return genreResult.rows[0].Id;
    }
    
    const genreInserted = await client.query({
        text: 'INSERT INTO "Genre"("Name") VALUES($1) RETURNING "Id";',
        values: [genre]
    });
    return genreInserted.rows[0].Id;
}

const movieModel = {

    // Obtenir un film à l'aide du son identifiant.
    getById : async (movieId) => {
        const result = await pool.query({
            text: `
                SELECT M.*, G."Name" AS "Genre"
                FROM "Movie" M
                 JOIN "Genre" G ON M."GenreId" = G."Id"
                WHERE M."Id" = $1
            `,
            values: [movieId]
        });

        if(result.rowCount < 1) {
            return null;
        }

        return mapToMovie(result);
    },

    // Obtenir la liste des films.
    getAll : async () => {
        const result = await pool.query(`
            SELECT M."Id", M."Name", G."Name" AS "Genre"
            FROM "Movie" M
                JOIN "Genre" G ON M."GenreId" = G."Id"
        `);

        return mapToMovieList(result);
    },

    // Ajouter un nouveau film.
    create : async ({ name, desc, release, duration, rating, genre }) => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const genreId = await createGenreIfNotExists(client, genre);

            const movieInserted = await client.query({
                text: `
                INSERT INTO "Movie"("Name", "Description", "ReleaseDate", "Duration", "Rating", "GenreId")
                 VALUES($1, $2, $3, $4, $5, $6)
                 RETURNING *;
            `,
                values: [name, desc, release, duration, rating, genreId]
            });

            await client.query('COMMIT');

            return mapToMovie(movieInserted, genre);
        }
        catch (error) {
            await client.query('ROLLBACK');
            throw error;
        }
        finally {
            await client.release();
        }
    },

    // Modifier un film.
    update : async (movieId, { name, desc, release, duration, rating }) => {
        const movieUpdated = await pool.query({
            text: `
                UPDATE "Movie"
                 SET "Name" = $1,
                     "Description" = $2,
                     "ReleaseDate" = $3,
                     "Duration" = $4,
                     "Rating" = $5,
                     "UpdatedDate" = CURRENT_TIMESTAMP
                 WHERE "Id" = $6
            `,
            values: [name, desc, release, duration, rating, movieId]
        });
        
        return movieUpdated.rowCount === 1;
    },

    partialUpdate : async (movieId, data = { name: undefined, desc: undefined, release: undefined, duration: undefined, rating: undefined }) => {
        
        const getQuerySet = () => {
            const dataEntries = Object.entries(data).filter(([key, value]) => value !== undefined);
            let querySet  = '';
            let i = 1;
            
            for(const [key, value] of dataEntries) {
                const column = key[0].toUpperCase() + key.slice(1) 
                querySet += `"${column}" = $${i}, `;
                i++;
            }
            return querySet;
        }

        const movieUpdated = await pool.query({
            text: `
                UPDATE "Movie"
                 SET ${getQuerySet()}
                     "UpdatedDate" = CURRENT_TIMESTAMP
                 WHERE "Id" = $${i}
            `,
            values: [dataEntries.map(([key, value]) => value), movieId]
        });
        
        return movieUpdated.rowCount === 1;
    },

    // Supprimer un film.
    delete : async (movieId) => {
        const movieDeleted = await pool.query({
            text: 'DELETE FROM "Movie" WHERE "Id" = $1',
            values: [movieId]
        });

        return movieDeleted.rowCount == 1;
    }
};

export default movieModel;



