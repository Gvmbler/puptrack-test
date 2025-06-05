import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client('TU_CLIENT_ID_DE_GOOGLE'); 

// Función para verificar el token de Google
const verifyGoogleToken = async (token: string) => {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: 'TU_CLIENT_ID_DE_GOOGLE', 
    });
    return ticket.getPayload(); // Retorna la info del usuario
};

// Registro de usuario mediante Google Auth y JWT
const googleRegisterOrLogin = async (req: Request, res: Response): Promise<void> => {
    const { idToken } = req.body;

    if (!idToken) {
        res.status(400).json({ message: 'No se ha enviado el token de Google' });
        return;
    }

    try {
        const googleUser = await verifyGoogleToken(idToken);

        if (!googleUser || !googleUser.email) {
            res.status(400).json({ message: 'Token de Google inválido o incompleto' });
            return;
        }

        const email = googleUser.email;
        const token = jwt.sign({ email }, 'tu_clave_secreta', { expiresIn: '1h' });

        res.json({ message: 'Usuario autenticado con Google', token });
    } catch (err) {
        res.status(500).json({ error: 'Error al autenticar con Google' });
    }
};

// Middleware de autenticación JWT
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado' });
    }

    try {
        const verified = jwt.verify(token, 'tu_clave_secreta');
        (req as any).user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Token inválido' });
    }
};

export { googleRegisterOrLogin, authMiddleware };
