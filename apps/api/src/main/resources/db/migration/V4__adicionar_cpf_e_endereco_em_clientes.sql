-- F03b (F08) / ADR-018: CPF e endereco do cliente, opcionais. Aditiva (ADR-003):
-- nao altera linha existente; cliente ja gravado fica com NULL nas duas colunas.
-- Base legal, retencao e descarte: docs/security/politica-dados-pessoais-cliente.md, secao 2.
ALTER TABLE clientes
    ADD COLUMN cpf      VARCHAR(11)  NULL AFTER email,
    ADD COLUMN endereco VARCHAR(255) NULL AFTER cpf,
    ADD CONSTRAINT ck_clientes_cpf_digitos CHECK (CHAR_LENGTH(cpf) = 11 AND cpf NOT REGEXP '[^0-9]');
