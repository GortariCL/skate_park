const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    password: 'Feer1985',
    database: 'skatepark',
    port: 5432
});

const getSkaters = async () => {
    try {
        const result = await pool.query(`SELECT * FROM skaters;`);
        return result.rows;
    } catch (err) {
        console.log(err);
        console.log(`El error se encuentra en la tabla: ${err.table}.
        El detalle del error es: ${err.detail}.
        El código de error es: ${err.code}.
        Restricción violada: ${err.constraint}`);
    }

}

const nuevoSkater = async (...data) => {
    try {
        const consulta = {
            text: `INSERT INTO skaters(email, nombre, password, anos_experiencia, especialidad, foto, estado) VALUES ($1, $2, $3, $4, $5, $6, false) RETURNING *`,
            values: data,
        }
        const result = await pool.query(consulta);
        return result;
    } catch (err) {
        console.log(err);
        console.log(`El error se encuentra en la tabla: ${err.table}.
        El detalle del error es: ${err.detail}.
        El código de error es: ${err.code}.
        Restricción violada: ${err.constraint}`);
    }
}

module.exports = {
    nuevoSkater,
    getSkaters
}