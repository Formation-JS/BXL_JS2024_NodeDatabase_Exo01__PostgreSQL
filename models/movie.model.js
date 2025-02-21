import pg from 'pg';

const movieModel = {

    // Obtenir un film à l'aide du son identifiant.
    getById : async (movieId) => {
        const pool = new pg.Pool({
            host: process.env.PGHOST,
            port: process.env.PGPORT,
            user: process.env.PGUSER,
            password: process.env.PGPASSWORD,
            database: process.env.PGDATABASE,
            connectionTimeoutMillis: 15_000,
            max: 25
        });

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

        return {
            id: result.rows[0].Id,
            name: result.rows[0].Name,
            desc: result.rows[0].Description,
            release: new Date(result.rows[0].ReleaseDate),
            duration: result.rows[0].Duration,
            rating: result.rows[0].Rating,
            genre: result.rows[0].Genre,
        }
    },


    // Obtenir la liste des films.
    getAll : async () => {
        const pool = new pg.Pool({
            host: process.env.PGHOST,
            port: process.env.PGPORT,
            user: process.env.PGUSER,
            password: process.env.PGPASSWORD,
            database: process.env.PGDATABASE,
            connectionTimeoutMillis: 15_000,
            max: 25
        });

        const result = await pool.query(`
            SELECT M."Id", M."Name", G."Name" AS "Genre"
            FROM "Movie" M
                JOIN "Genre" G ON M."GenreId" = G."Id"
        `);

        return result.rows.map((movie) => ({
            id: movie.Id,
            name: movie.Name,
            genre: movie.Genre
        }));
    },

    // Ajouter un nouveau film.
    create : async ({ name, desc, release, duration, rating, genre }) => {
        const pool = new pg.Pool({
            host: process.env.PGHOST,
            port: process.env.PGPORT,
            user: process.env.PGUSER,
            password: process.env.PGPASSWORD,
            database: process.env.PGDATABASE,
            connectionTimeoutMillis: 15_000,
            max: 25
        });

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            let genreId;
            const genreResult = await client.query({
                text: 'SELECT "Id" FROM "Genre" WHERE LOWER("Name") = LOWER($1)',
                values: [genre]
            });

            if (genreResult.rowCount === 1) {
                genreId = genreResult.rows[0].Id;
            }
            else {
                const genreInserted = await client.query({
                    text: 'INSERT INTO "Genre"("Name") VALUES($1) RETURNING "Id";',
                    values: [genre]
                });
                genreId = genreInserted.rows[0].Id;
            }

            const movieInserted = await client.query({
                text: `
                INSERT INTO "Movie"("Name", "Description", "ReleaseDate", "Duration", "Rating", "GenreId")
                 VALUES($1, $2, $3, $4, $5, $6)
                 RETURNING *;
            `,
                values: [name, desc, release, duration, rating, genreId]
            });

            await client.query('COMMIT');

            return {
                id: movieInserted.rows[0].Id,
                name: movieInserted.rows[0].Name,
                desc: movieInserted.rows[0].Description,
                release: new Date(movieInserted.rows[0].ReleaseDate),
                duration: movieInserted.rows[0].Duration,
                rating: movieInserted.rows[0].Rating,
                genre
            };
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
    update : () => {
        throw Error('Not implemented !');
    },

    // Supprimer un film.
    delete : () => {
        throw Error('Not implemented !');
    }
};

export default movieModel;
