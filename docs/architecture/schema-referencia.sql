-- ============================================================
-- Mecânica São Jorge — Schema de referência (modelo de dados alvo)
-- Decisões e o porquê de cada uma estão documentadas em CLAUDE.md
-- (raiz do repositório).
--
-- ATENÇÃO: NÃO EXECUTAR. Este arquivo é só referência de modelagem.
-- O schema real é criado pelas migrations Flyway em
-- apps/api/src/main/resources/db/migration (Hibernate em ddl-auto: validate).
-- O DROP DATABASE abaixo apagaria todos os dados se rodado num banco real.
-- ============================================================

DROP DATABASE IF EXISTS mecanicaSaoJorge;
CREATE DATABASE IF NOT EXISTS mecanicaSaoJorge;
USE mecanicaSaoJorge;

-- ========================= CLIENTES =========================
CREATE TABLE Clientes (
    cliente_id     INT AUTO_INCREMENT PRIMARY KEY,
    nome           VARCHAR(100) NOT NULL,
    telefone       VARCHAR(20),
    email          VARCHAR(100),
    data_cadastro  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================= VEICULOS =========================
CREATE TABLE Veiculos (
    veiculo_id      INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id      INT NOT NULL,
    placa           VARCHAR(10) NOT NULL,
    modelo          VARCHAR(100),
    marca           VARCHAR(100),
    ano             INT,
    cor             VARCHAR(40),
    quilometragem   INT,
    data_cadastro   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_veiculo_cliente
        FOREIGN KEY (cliente_id) REFERENCES Clientes(cliente_id)
        ON DELETE CASCADE
);

-- ========================= SERVICOS (catálogo) =========================
CREATE TABLE Servicos (
    servico_id              INT AUTO_INCREMENT PRIMARY KEY,
    nome                    VARCHAR(150) NOT NULL,
    descricao               VARCHAR(255),
    valor_padrao_mao_obra   DECIMAL(10, 2) NOT NULL,
    tempo_estimado_horas    DECIMAL(5, 2),
    ativo                   BOOLEAN NOT NULL DEFAULT TRUE
);

-- ========================= PECAS (catálogo + estoque) =========================
CREATE TABLE Pecas (
    peca_id              INT AUTO_INCREMENT PRIMARY KEY,
    nome                 VARCHAR(150) NOT NULL,
    codigo               VARCHAR(50),
    categoria            VARCHAR(80),
    fabricante           VARCHAR(100),
    unidade              VARCHAR(20) NOT NULL DEFAULT 'UN',
    custo                DECIMAL(10, 2) NOT NULL,
    preco_venda          DECIMAL(10, 2) NOT NULL,
    quantidade_estoque   INT NOT NULL DEFAULT 0,
    estoque_minimo       INT NOT NULL DEFAULT 0,
    ativo                BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT uq_peca_codigo UNIQUE (codigo)
);

-- ========================= ORDENS DE SERVICO =========================
CREATE TABLE OrdensServico (
    ordem_id               INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id             INT NOT NULL,
    veiculo_id             INT NOT NULL,
    descricao_problema     TEXT,
    diagnostico            TEXT,
    status                 VARCHAR(30) NOT NULL DEFAULT 'ABERTA', -- ver fluxo de status em CLAUDE.md
    data_abertura          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_previsao_entrega  DATE,
    data_fechamento        TIMESTAMP NULL,
    subtotal_servicos      DECIMAL(10, 2) NOT NULL DEFAULT 0,
    subtotal_pecas         DECIMAL(10, 2) NOT NULL DEFAULT 0,
    desconto               DECIMAL(10, 2) NOT NULL DEFAULT 0,
    valor_total            DECIMAL(10, 2) NOT NULL DEFAULT 0,

    CONSTRAINT fk_ordem_cliente FOREIGN KEY (cliente_id) REFERENCES Clientes(cliente_id),
    CONSTRAINT fk_ordem_veiculo FOREIGN KEY (veiculo_id) REFERENCES Veiculos(veiculo_id)
);

-- ===== Junção: serviços executados em cada ordem (preço congelado) =====
CREATE TABLE OrdensServicoServicos (
    ordem_servico_id  INT AUTO_INCREMENT PRIMARY KEY,
    ordem_id          INT NOT NULL,
    servico_id        INT NOT NULL,
    quantidade        INT NOT NULL DEFAULT 1,
    valor_cobrado     DECIMAL(10, 2) NOT NULL,
    subtotal          DECIMAL(10, 2) GENERATED ALWAYS AS (valor_cobrado * quantidade) STORED,

    CONSTRAINT fk_osservico_ordem FOREIGN KEY (ordem_id) REFERENCES OrdensServico(ordem_id) ON DELETE CASCADE,
    CONSTRAINT fk_osservico_servico FOREIGN KEY (servico_id) REFERENCES Servicos(servico_id)
);

-- ===== Junção: peças usadas em cada ordem (preço congelado) =====
CREATE TABLE OrdensServicoPecas (
    ordem_peca_id           INT AUTO_INCREMENT PRIMARY KEY,
    ordem_id                INT NOT NULL,
    peca_id                 INT NOT NULL,
    quantidade              INT NOT NULL DEFAULT 1,
    valor_unitario_cobrado  DECIMAL(10, 2) NOT NULL,
    subtotal                DECIMAL(10, 2) GENERATED ALWAYS AS (valor_unitario_cobrado * quantidade) STORED,

    CONSTRAINT fk_ospeca_ordem FOREIGN KEY (ordem_id) REFERENCES OrdensServico(ordem_id) ON DELETE CASCADE,
    CONSTRAINT fk_ospeca_peca FOREIGN KEY (peca_id) REFERENCES Pecas(peca_id)
);

-- ========================= MOVIMENTACOES DE ESTOQUE =========================
CREATE TABLE MovimentacoesEstoque (
    movimentacao_id  INT AUTO_INCREMENT PRIMARY KEY,
    peca_id          INT NOT NULL,
    tipo             VARCHAR(10) NOT NULL, -- ENTRADA, SAIDA, AJUSTE
    quantidade       INT NOT NULL,
    motivo           VARCHAR(200),
    ordem_id         INT NULL,
    data_movimento   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_movestoque_peca FOREIGN KEY (peca_id) REFERENCES Pecas(peca_id),
    CONSTRAINT fk_movestoque_ordem FOREIGN KEY (ordem_id) REFERENCES OrdensServico(ordem_id) ON DELETE SET NULL
);

-- ========================= PARCELAS (o que é devido) =========================
CREATE TABLE Parcelas (
    parcela_id        INT AUTO_INCREMENT PRIMARY KEY,
    ordem_id          INT NOT NULL,
    numero_parcela    INT NOT NULL DEFAULT 1,
    total_parcelas    INT NOT NULL DEFAULT 1,
    valor_previsto    DECIMAL(10, 2) NOT NULL,
    data_vencimento   DATE NOT NULL,

    CONSTRAINT fk_parcela_ordem FOREIGN KEY (ordem_id) REFERENCES OrdensServico(ordem_id) ON DELETE CASCADE
);

-- ===== PAGAMENTOS (cada recebimento real; pode haver vários por parcela) =====
CREATE TABLE Pagamentos (
    pagamento_id     INT AUTO_INCREMENT PRIMARY KEY,
    parcela_id       INT NOT NULL,
    valor            DECIMAL(10, 2) NOT NULL,
    forma_pagamento  VARCHAR(30) NOT NULL, -- DINHEIRO, PIX, CARTAO, BOLETO (enum no Java)
    data_pagamento   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_pagamento_parcela FOREIGN KEY (parcela_id) REFERENCES Parcelas(parcela_id) ON DELETE CASCADE
);

-- ========================= FINANCEIRO =========================
CREATE TABLE Financeiro (
    financeiro_id    INT AUTO_INCREMENT PRIMARY KEY,
    tipo             VARCHAR(10) NOT NULL, -- ENTRADA, SAIDA
    valor            DECIMAL(10, 2) NOT NULL,
    descricao        VARCHAR(200),
    forma_pagamento  VARCHAR(30),
    data_movimento   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ordem_id         INT NULL,
    pagamento_id     INT NULL, -- rastreia qual recebimento gerou esta entrada

    CONSTRAINT fk_financeiro_ordem FOREIGN KEY (ordem_id) REFERENCES OrdensServico(ordem_id) ON DELETE SET NULL,
    CONSTRAINT fk_financeiro_pagamento FOREIGN KEY (pagamento_id) REFERENCES Pagamentos(pagamento_id) ON DELETE SET NULL
);

-- ========================= USUARIOS =========================
CREATE TABLE Usuarios (
    usuario_id     INT AUTO_INCREMENT PRIMARY KEY,
    nome           VARCHAR(100) NOT NULL,
    email          VARCHAR(150) NOT NULL,
    senha_hash     VARCHAR(255) NOT NULL,
    perfil         VARCHAR(20) NOT NULL DEFAULT 'FUNCIONARIO', -- ADMIN, FUNCIONARIO
    ativo          BOOLEAN NOT NULL DEFAULT TRUE,
    data_cadastro  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_usuario_email UNIQUE (email)
);

-- ========================= INDICES =========================
CREATE INDEX idx_veiculo_cliente ON Veiculos(cliente_id);
CREATE INDEX idx_ordem_cliente ON OrdensServico(cliente_id);
CREATE INDEX idx_ordem_veiculo ON OrdensServico(veiculo_id);
CREATE INDEX idx_ordem_status ON OrdensServico(status);
CREATE INDEX idx_osservico_ordem ON OrdensServicoServicos(ordem_id);
CREATE INDEX idx_ospeca_ordem ON OrdensServicoPecas(ordem_id);
CREATE INDEX idx_movestoque_peca ON MovimentacoesEstoque(peca_id);
CREATE INDEX idx_parcela_ordem ON Parcelas(ordem_id);
CREATE INDEX idx_parcela_vencimento ON Parcelas(data_vencimento);
CREATE INDEX idx_pagamento_parcela ON Pagamentos(parcela_id);
CREATE INDEX idx_financeiro_tipo ON Financeiro(tipo);
CREATE INDEX idx_financeiro_data ON Financeiro(data_movimento);
