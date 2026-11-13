export type Perfil = 'ADMIN' | 'FUNCIONARIO';

export interface Usuario {
  readonly id: number;
  readonly nome: string;
  readonly email: string;
  readonly perfil: Perfil;
}

export interface RespostaLogin {
  readonly token: string;
  readonly tipo: string;
  readonly expiraEm: string;
  readonly usuario: Usuario;
}
