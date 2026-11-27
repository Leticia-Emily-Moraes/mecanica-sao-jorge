-- F06a (ADR-038): datas da OS que a lista ordena e devolve. Migration aditiva (ADR-013).
-- data_abertura: o banco preenche; a aplicacao so le (F18 decide como gravar na criacao).
-- data_previsao_entrega: so dia, nula ate a pessoa informar.
ALTER TABLE ordens_servico
    ADD COLUMN data_abertura TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN data_previsao_entrega DATE NULL;
