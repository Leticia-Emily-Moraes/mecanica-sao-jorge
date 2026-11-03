-- Tabela base de usuarios do sistema (fundacao da feature Login, proxima no
-- roadmap). ADR-006: enum de dominio (perfil) persistido como STRING, nunca
-- como tipo nativo do banco, para evitar migration em cascata ao adicionar
-- um perfil novo.
--
-- Dado pessoal (LGPD): nome, email e senha_hash identificam um funcionario
-- da propria oficina.
--   Base legal: execucao de contrato de trabalho / legitimo interesse no
--     controle de acesso ao sistema interno (LGPD art. 7, V e IX).
--   Quem enxerga: administradores do sistema (perfil ADMIN) e o proprio
--     usuario autenticado; nunca exposta em log ou retorno de API (senha_hash
--     nunca deve ser lida pela aplicacao, so comparada).
--   Retencao: enquanto o vinculo do usuario com a oficina estiver ativo;
--     apos o desligamento, inativar (ativo = FALSE) e anonimizar/remover em
--     ate 90 dias, salvo obrigacao legal de guarda por prazo maior.
CREATE TABLE usuarios (
    id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome           VARCHAR(150) NOT NULL,
    email          VARCHAR(190) NOT NULL,
    senha_hash     VARCHAR(255) NOT NULL,
    perfil         VARCHAR(20)  NOT NULL,
    ativo          BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_usuarios_email UNIQUE (email),
    CONSTRAINT ck_usuarios_perfil CHECK (perfil IN ('ADMIN', 'FUNCIONARIO'))
) ENGINE = InnoDB;
