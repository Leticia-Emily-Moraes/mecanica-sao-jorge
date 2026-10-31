# OP-002 — App Mecânica São Jorge

Monorepo da operação. Objetivo: substituir o controle manual da oficina por um
sistema próprio de clientes, veículos, ordens de serviço, catálogo, estoque e
financeiro.

## Estrutura

```
op-002-app-mecanica-sao-jorge/
├── apps/
│   ├── api/      # backend Java 21 + Spring Boot (dono: TORRE)
│   └── mobile/   # React Native + Expo — ainda não iniciado (dono: ORLA)
└── docs/
    └── architecture/   # ADRs e decisões de arquitetura — pendente de commit (ver "Pendências")
```

## Como rodar o backend

Ver [apps/api/README.md](apps/api/README.md) para pré-requisitos, subida do
banco local e execução passo a passo.

## Status desta etapa (Setup do projeto — F00)

- [x] `apps/api`: estrutura de pastas, dependências, lint/formatação, exemplo
      de teste rodável, `.env.example` sem segredo.
- [x] `apps/mobile`: scaffold Expo + Expo Router + TypeScript estrito,
      ESLint/Prettier, dois testes de exemplo e `.env.example` sem segredo.
      Ver [apps/mobile/README.md](apps/mobile/README.md) — nenhum comando foi
      executado nesta sessão (sem shell disponível); pendente de alguém
      rodar `npm install`, `npm test`, `npm run lint` e abrir o app em pelo
      menos um simulador/emulador antes de aceitar a etapa como pronta.
- [ ] `docs/architecture`: decisões (ADRs, diagramas, mapa de dados LGPD)
      foram desenhadas pelo CARTOGRAFO, mas não chegaram a ser gravadas em
      arquivo nesta operação por restrição de ferramenta na sessão dele.
      Pendente de um commit específico de arquitetura — não fabricado aqui
      para não divergir do que foi de fato decidido.
- [ ] CI (`.github/workflows/ci.yml`): entra na etapa de ANCORA.

Nenhuma regra de negócio de feature (Clientes, Veículos, Ordens de Serviço,
Catálogo, Financeiro, Login) foi implementada nesta etapa.
