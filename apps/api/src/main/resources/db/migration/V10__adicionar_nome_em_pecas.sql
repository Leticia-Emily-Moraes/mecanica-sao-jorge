-- F17 / ADR-036: nome da peca (matriz de reconciliacao do overview.md).
-- Aditiva (ADR-003). Linha criada antes desta migration recebe nome provisorio com o id,
-- corrigivel pela edicao (F15). Nao toca ordens_servico_pecas nem a coluna gerada
-- subtotal (ADR-005). Collation fixada na tabela inteira, inclusive codigo, para a busca
-- (ADR-017) e para a unicidade de codigo sem diferenciar caixa.
ALTER TABLE pecas ADD COLUMN nome VARCHAR(150) NULL AFTER id;
UPDATE pecas SET nome = CONCAT('Peca sem nome #', id) WHERE nome IS NULL;
ALTER TABLE pecas
    MODIFY COLUMN nome VARCHAR(150) NOT NULL,
    ADD CONSTRAINT ck_pecas_nome_preenchido CHECK (CHAR_LENGTH(TRIM(nome)) > 0);
ALTER TABLE pecas CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
