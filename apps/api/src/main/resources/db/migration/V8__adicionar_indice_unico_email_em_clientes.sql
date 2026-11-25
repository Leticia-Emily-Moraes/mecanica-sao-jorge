-- F03d (F10) / ADR-026: email unico quando preenchido (politica de dados do cliente, 2.1 e 2.5).
-- Aditiva (ADR-003). Varios NULL nao colidem. A collation da V3 (utf8mb4_0900_ai_ci) compara sem
-- caixa e sem acento e nao ignora espaco final (NO PAD). Falha se ja existir email repetido:
-- contar antes, sem mostrar valor (politica 2.5, duvida 2).
ALTER TABLE clientes ADD CONSTRAINT uk_clientes_email UNIQUE (email);
