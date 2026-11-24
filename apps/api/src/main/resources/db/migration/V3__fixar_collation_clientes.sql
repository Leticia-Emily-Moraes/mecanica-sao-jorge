-- F03a / ADR-017 (eixo 1, opcao C2): fixa charset e collation da tabela de clientes para que a
-- busca ignore acento e caixa em qualquer servidor, sem depender do padrao implicito dele.
-- No mysql:8.4 padrao e um no-op logico; num servidor latin1 converte as colunas sem perder dado.
-- Tipos e tamanhos nao mudam, entao ddl-auto=validate continua passando.
ALTER TABLE clientes CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
