-- F03c (F09) / ADR-020: CPF unico quando preenchido (politica de dados do cliente, secao 2.1).
-- Aditiva (ADR-003). Varios NULL nao colidem num indice UNIQUE do MySQL: cliente sem CPF e
-- cliente anonimizado passam. Falha se ja existir CPF repetido (contar antes, sem mostrar valor).
ALTER TABLE clientes ADD CONSTRAINT uk_clientes_cpf UNIQUE (cpf);
