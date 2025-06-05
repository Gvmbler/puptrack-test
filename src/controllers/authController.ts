import { Request, Response } from 'express';
import { sql, pool, poolConnect } from '../db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const register = async (req: Request, res: Response): Promise<void> => {
    console.log('LLEGÓ UNA SOLICITUD AL REGISTRO');
    console.log('Body recibido:', req.body);

    const { NyA = null, direc = null, telefono = null, email, password } = req.body;
    
    try {
        await poolConnect;

        const existingUser = await pool.request()
            .input('email', sql.VarChar, email)
            .query('SELECT * FROM Users WHERE email = @email');

        if (existingUser.recordset.length > 0) {
            res.status(409).json({ message: 'El email ya está registrado' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.request()
            .input('NyA', sql.VarChar, NyA)
            .input('direc', sql.VarChar, direc)
            .input('telefono', sql.VarChar, telefono)
            .input('email', sql.VarChar, email)
            .input('password', sql.VarChar, hashedPassword)
            .query(`
                INSERT INTO Users (NyA, direc, telefono, email, password_hash)
                VALUES (@NyA, @direc, @telefono, @email, @password)
            `);
        
        const token = jwt.sign({ email }, 'tu_clave_secreta', { expiresIn: '1h' });

        res.status(201).json({ message: 'Usuario registrado', token });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        await poolConnect;

        const result = await pool.request()
            .input('email', sql.VarChar, email)
            .query('SELECT * FROM Users WHERE email = @email');

        if (result.recordset.length === 0) {
            res.status(400).json({ message: 'Usuario no encontrado' });
            return;
        }

        const user = result.recordset[0];

        const validPassword = await bcrypt.compare(password, user.password_hash);

        if (!validPassword) {
            res.status(400).json({ message: 'Contraseña incorrecta' });
            return;
        }

        // El token sigue usando email como identificador
        const token = jwt.sign({ email: user.email }, 'tu_clave_secreta', { expiresIn: '1h' });

        res.json({ token });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
const pet = async (req: Request, res: Response): Promise<void> => {
    const { nom, imagen, id_user } = req.body;

    try {
        await poolConnect;

        // 🔥 Convertir base64 a Buffer
        const imagenBuffer = Buffer.from(imagen, 'base64');

        await pool.request()
            .input('nom', sql.VarChar, nom)
            .input('imagen', sql.VarBinary, imagenBuffer) // ✅ ahora sí es un buffer
            .input('id_user', sql.Int, id_user)
            .query(`
                INSERT INTO Perro (nom, imagen, id_user)
                VALUES (@nom, @imagen, @id_user)
            `);

        res.status(201).json({ message: 'Mascota registrada' });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export default { register, login, pet };
