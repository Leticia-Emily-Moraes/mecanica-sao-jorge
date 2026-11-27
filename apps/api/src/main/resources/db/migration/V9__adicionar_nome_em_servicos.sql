-- F05a / ADR-033: nome do servico (matriz de reconciliacao do overview.md).
-- Aditiva (ADR-003). Linha criada antes desta migration recebe nome provisorio com o id,
-- corrigivel pela edicao (F12). Nao toca ordens_servico_servicos nem a coluna gerada
-- subtotal (ADR-005). Collation fixada para a busca (ADR-017).
ALTER TABLE servicos ADD COLUMN nome VARCHAR(150) NULL AFTER id;
UPDATE servicos SET nome = CONCAT('Servico sem nome #', id) WHERE nome IS NULL;
ALTER TABLE servicos
    MODIFY COLUMN nome VARCHAR(150) NOT NULL,
    ADD CONSTRAINT ck_servicos_nome_preenchido CHECK (CHAR_LENGTH(TRIM(nome)) > 0);
ALTER TABLE servicos CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
