-- F04 / politica de dados do cliente (revisao 5, 8.5): placa unica e em formato valido.
-- Aditiva (ADR-003). Aceita o padrao antigo (ABC1234), o Mercosul (ABC1D23) e o marcador de
-- anonimizacao ANON<id> (ate 6 digitos). REGEXP_LIKE com 'c' diferencia maiuscula: a collation da
-- coluna e case-insensitive e, sem o 'c', placa em minuscula passaria.
-- Falha se ja existir placa repetida ou fora do formato: contar antes com COUNT(*), nunca com
-- SELECT placa (o valor e dado pessoal).
ALTER TABLE veiculos
    ADD CONSTRAINT uk_veiculos_placa UNIQUE (placa),
    ADD CONSTRAINT ck_veiculos_placa_formato
        CHECK (REGEXP_LIKE(placa, '^([A-Z]{3}[0-9][A-Z0-9][0-9]{2}|ANON[0-9]{1,6})$', 'c'));
