-- F03c (F09) / ADR-021: telefone do cliente so com 10 ou 11 digitos. Aditiva (ADR-003): so
-- acrescenta restricao; sem NOT NULL, porque a anonimizacao (politica de dados do cliente,
-- secao 2) grava NULL. NULL passa no CHECK. Falha se ja existir telefone fora do formato.
ALTER TABLE clientes
    ADD CONSTRAINT ck_clientes_telefone_digitos
        CHECK (CHAR_LENGTH(telefone) BETWEEN 10 AND 11 AND telefone NOT REGEXP '[^0-9]');
