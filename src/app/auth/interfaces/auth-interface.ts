
export interface AuthResponse {     // Objeto que devuelve el api cuando la petición es correcta
    ok: boolean;
    uid?: string;
    name?: string;
    token?: string;
    msg?: string;
    email?: string;
}

export interface Usuario {
    uid: string;
    name: string;
    email: string;
}