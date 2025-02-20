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
    getAll : () => {
        throw Error('Not implemented !');
    },

    // Ajouter un nouveau film.
    create : () => {
        throw Error('Not implemented !');
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
