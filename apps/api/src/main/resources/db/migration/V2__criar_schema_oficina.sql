-- Schema de dominio da oficina (ADR-003: aditiva, nunca reescreve a V1 ja
-- aplicada). Convencao (ADR-007): tabela plural snake_case, PK `id`
-- (BIGINT UNSIGNED AUTO_INCREMENT), FK `<entidade_singular>_id`.
--
-- LIMITACAO CONHECIDA (registrar para CARTOGRAFO/CORRENTE antes de Catalogo/
-- OS/Financeiro usarem este schema para regra de negocio): as colunas abaixo
-- replicam apenas o que `docs/architecture/overview.md` especifica
-- explicitamente por tabela. O `BD/script.sql` original (estrutura de
-- referencia, ADR-007) nao estava acessivel nesta sessao de ESPRESSO -- fica
-- fora da pasta desta operacao e so o CARTOGRAFO leu. Por isso este V2 e
-- deliberadamente minimo: cobre US-FUND-02 (entidade mapeia tabela real), mas
-- algumas tabelas ficam sem colunas de negocio obvias e ainda nao decididas
-- (ex.: `servicos`/`pecas` sem nome/descricao, `movimentacoes_estoque` sem
-- quantidade, `financeiro` sem valor). Cada feature (Catalogo, OS, Financeiro)
-- deve trazer sua propria migration aditiva completando essas tabelas quando
-- for implementada (ADR-003), com validacao do CARTOGRAFO/CORRENTE a partir
-- do script original.
--
-- ADR-006: todo enum de dominio e VARCHAR + EnumType.STRING. `status` de
-- `ordens_servico` fica deliberadamente sem CHECK: a lista de valores de
-- StatusOS so fecha na Sprint 04 (overview.md); como enum STRING, adicionar
-- valor novo depois nao exige migration de dado.

CREATE TABLE clientes (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome        VARCHAR(150) NOT NULL,
    telefone    VARCHAR(20)  NULL,
    email       VARCHAR(190) NULL,
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB;

CREATE TABLE veiculos (
    id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    cliente_id     BIGINT UNSIGNED NOT NULL,
    placa          VARCHAR(10)  NOT NULL,
    modelo         VARCHAR(100) NOT NULL,
    marca          VARCHAR(100) NOT NULL,
    ano            INT          NULL,
    cor            VARCHAR(40)  NULL,
    quilometragem  INT          NULL,
    CONSTRAINT fk_veiculos_cliente FOREIGN KEY (cliente_id) REFERENCES clientes (id)
) ENGINE = InnoDB;

CREATE TABLE servicos (
    id                     BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    valor_padrao_mao_obra  DECIMAL(10, 2) NOT NULL,
    tempo_estimado_horas   DECIMAL(5, 2)  NULL,
    ativo                  BOOLEAN        NOT NULL DEFAULT TRUE
) ENGINE = InnoDB;

CREATE TABLE pecas (
    id                   BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    codigo               VARCHAR(50)    NOT NULL,
    custo                DECIMAL(10, 2) NOT NULL,
    preco_venda          DECIMAL(10, 2) NOT NULL,
    quantidade_estoque   INT            NOT NULL DEFAULT 0,
    estoque_minimo       INT            NOT NULL DEFAULT 0,
    ativo                BOOLEAN        NOT NULL DEFAULT TRUE,
    CONSTRAINT uq_pecas_codigo UNIQUE (codigo)
) ENGINE = InnoDB;

CREATE TABLE ordens_servico (
    id                 BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    cliente_id         BIGINT UNSIGNED NOT NULL,
    veiculo_id         BIGINT UNSIGNED NOT NULL,
    status             VARCHAR(20)    NOT NULL,
    subtotal_servicos  DECIMAL(10, 2) NOT NULL DEFAULT 0,
    subtotal_pecas     DECIMAL(10, 2) NOT NULL DEFAULT 0,
    desconto           DECIMAL(10, 2) NOT NULL DEFAULT 0,
    valor_total        DECIMAL(10, 2) NOT NULL DEFAULT 0,
    CONSTRAINT fk_os_cliente FOREIGN KEY (cliente_id) REFERENCES clientes (id),
    CONSTRAINT fk_os_veiculo FOREIGN KEY (veiculo_id) REFERENCES veiculos (id)
) ENGINE = InnoDB;

-- ADR-005: subtotal e coluna gerada, nunca gravada pela aplicacao.
CREATE TABLE ordens_servico_servicos (
    id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ordem_id       BIGINT UNSIGNED NOT NULL,
    servico_id     BIGINT UNSIGNED NOT NULL,
    valor_cobrado  DECIMAL(10, 2) NOT NULL,
    quantidade     INT            NOT NULL DEFAULT 1,
    subtotal       DECIMAL(10, 2) GENERATED ALWAYS AS (valor_cobrado * quantidade) STORED,
    CONSTRAINT fk_oss_ordem FOREIGN KEY (ordem_id) REFERENCES ordens_servico (id),
    CONSTRAINT fk_oss_servico FOREIGN KEY (servico_id) REFERENCES servicos (id)
) ENGINE = InnoDB;

-- ADR-005: subtotal e coluna gerada, nunca gravada pela aplicacao.
CREATE TABLE ordens_servico_pecas (
    id                      BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ordem_id                BIGINT UNSIGNED NOT NULL,
    peca_id                 BIGINT UNSIGNED NOT NULL,
    valor_unitario_cobrado  DECIMAL(10, 2) NOT NULL,
    quantidade              INT            NOT NULL DEFAULT 1,
    subtotal                DECIMAL(10, 2)
        GENERATED ALWAYS AS (valor_unitario_cobrado * quantidade) STORED,
    CONSTRAINT fk_osp_ordem FOREIGN KEY (ordem_id) REFERENCES ordens_servico (id),
    CONSTRAINT fk_osp_peca FOREIGN KEY (peca_id) REFERENCES pecas (id)
) ENGINE = InnoDB;

CREATE TABLE movimentacoes_estoque (
    id        BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    peca_id   BIGINT UNSIGNED NOT NULL,
    ordem_id  BIGINT UNSIGNED NULL,
    tipo      VARCHAR(10)  NOT NULL,
    motivo    VARCHAR(255) NULL,
    CONSTRAINT fk_mov_peca FOREIGN KEY (peca_id) REFERENCES pecas (id),
    CONSTRAINT fk_mov_ordem FOREIGN KEY (ordem_id) REFERENCES ordens_servico (id),
    CONSTRAINT ck_mov_tipo CHECK (tipo IN ('ENTRADA', 'SAIDA', 'AJUSTE'))
) ENGINE = InnoDB;

-- Status da parcela e calculado em runtime (overview.md), nao e coluna.
CREATE TABLE parcelas (
    id               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ordem_id         BIGINT UNSIGNED NOT NULL,
    numero           INT            NOT NULL,
    total_parcelas   INT            NOT NULL,
    valor_previsto   DECIMAL(10, 2) NOT NULL,
    data_vencimento  DATE           NOT NULL,
    CONSTRAINT fk_parcela_ordem FOREIGN KEY (ordem_id) REFERENCES ordens_servico (id)
) ENGINE = InnoDB;

CREATE TABLE pagamentos (
    id               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    parcela_id       BIGINT UNSIGNED NOT NULL,
    valor            DECIMAL(10, 2) NOT NULL,
    forma_pagamento  VARCHAR(20)    NOT NULL,
    CONSTRAINT fk_pagamento_parcela FOREIGN KEY (parcela_id) REFERENCES parcelas (id),
    CONSTRAINT ck_pagamento_forma CHECK (forma_pagamento IN ('DINHEIRO', 'PIX', 'CARTAO', 'BOLETO'))
) ENGINE = InnoDB;

CREATE TABLE financeiro (
    id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tipo          VARCHAR(10) NOT NULL,
    ordem_id      BIGINT UNSIGNED NULL,
    pagamento_id  BIGINT UNSIGNED NULL,
    CONSTRAINT fk_financeiro_ordem FOREIGN KEY (ordem_id) REFERENCES ordens_servico (id),
    CONSTRAINT fk_financeiro_pagamento FOREIGN KEY (pagamento_id) REFERENCES pagamentos (id),
    CONSTRAINT ck_financeiro_tipo CHECK (tipo IN ('ENTRADA', 'SAIDA'))
) ENGINE = InnoDB;
