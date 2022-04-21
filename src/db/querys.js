const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    password: 'Feer1985',
    database: 'skatepark',
    port: 5432
});
//OBTENER TODOS LOS SKATERS
const getSkaters = async () => {
    try {
        const result = await pool.query(`SELECT * FROM skaters ORDER BY id ASC;`);
        return result.rows;
    } catch (err) {
        console.log(err);
        console.log(`El error se encuentra en la tabla: ${err.table}.
        El detalle del error es: ${err.detail}.
        El código de error es: ${err.code}.
        Restricción violada: ${err.constraint}`);
    }
}
//OBTENER ADMIN
const getAdmin = async (...login) => {
    try {
        const consulta = {
            text: `SELECT * FROM admin WHERE usuario = $1 AND password =$2`,
            values: login,
        }
        const result = await pool.query(consulta);
        return result.rows[0];
    } catch (err) {
        console.log(err);
        console.log(`El error se encuentra en la tabla: ${err.table}.
        El detalle del error es: ${err.detail}.
        El código de error es: ${err.code}.
        Restricción violada: ${err.constraint}`);
    }
}
//AGREGAR UN NUEVO SKATER
const nuevoSkater = async (...data) => {
    try {
        const consulta = {
            text: `INSERT INTO skaters(email, nombre, password, anos_experiencia, especialidad, foto, estado) VALUES ($1, $2, $3, $4, $5, $6, false) RETURNING *`,
            values: data,
        }
        const result = await pool.query(consulta);
        return result.rows[0];
    } catch (err) {
        console.log(err);
        console.log(`El error se encuentra en la tabla: ${err.table}.
        El detalle del error es: ${err.detail}.
        El código de error es: ${err.code}.
        Restricción violada: ${err.constraint}`);
    }
}
//CAMBIAR ESTADO DEL SKATER
const setSkaterStatus = async (...data) => {
    try {
        const consulta = {
            text: `UPDATE skaters SET estado = $2 WHERE id = $1 RETURNING *`,
            values: data
        }
        const result = await pool.query(consulta);
        return result.rows[0];
    } catch (err) {
        console.log(err);
        console.log(`El error se encuentra en la tabla: ${err.table}.
        El detalle del error es: ${err.detail}.
        El código de error es: ${err.code}.
        Restricción violada: ${err.constraint}`);
    }
}
//OBTENER DATOS DE COMPARACIÓN DESDE LA BASE DE DATOS
const getSkater = async (...login) => {
    try {
        const consulta = {
            text: `SELECT * FROM skaters WHERE email = $1 AND password =$2`,
            values: login,
        }
        const result = await pool.query(consulta);
        return result.rows[0];
    } catch (err) {
        console.log(err);
        console.log(`El error se encuentra en la tabla: ${err.table}.
        El detalle del error es: ${err.detail}.
        El código de error es: ${err.code}.
        Restricción violada: ${err.constraint}`);
    }
}
//ACTUALIZACIÓN SKATER
const updateSkater = async (...data) => {
    try {
        const consulta = {
            text: 'UPDATE skaters SET nombre = $2, password = $3, anos_experiencia = $4, especialidad = $5 WHERE id = $1 RETURNING *',
            values: data
        }
        const result = await pool.query(consulta);
        return result.rows[0];
    } catch (err) {
        console.log(err);
        console.log(`El error se encuentra en la tabla: ${err.table}.
        El detalle del error es: ${err.detail}.
        El código de error es: ${err.code}.
        Restricción violada: ${err.constraint}`);
    }
}
//ELIMINAR SKATER
const deleteSkater = async (...data) => {
    try{
        const consulta = {
            text: 'DELETE FROM skaters WHERE id = $1 RETURNING *',
            values: data
        }
        const result = await pool.query(consulta);
        return result.rows[0];
    }catch(err){
        console.log(err);
        console.log(`El error se encuentra en la tabla: ${err.table}.
        El detalle del error es: ${err.detail}.
        El código de error es: ${err.code}.
        Restricción violada: ${err.constraint}`);
    }
}

module.exports = {
    getSkaters,
    getAdmin,
    nuevoSkater,
    setSkaterStatus,
    getSkater,
    updateSkater,
    deleteSkater,
};