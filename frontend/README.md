# 🎖️ SEAL Platform - Frontend

Interface tática da Plataforma SEAL - Sistema de Estrategistas de Alta Performance

## Stack Tecnológico

- **React 19** + **TypeScript**
- **Vite** - Build tool
- **Tailwind CSS** - Estilização com paleta Camuflagem Digital
- **Zustand** - Gerenciamento de estado
- **TanStack Query** - Cache e fetching de dados
- **React Router** - Roteamento
- **Chart.js** - Gráficos (Heptagrama)
- **Lucide React** - Ícones táticos

## Estrutura do Projeto

```
frontend/src/
├── components/
│   ├── Dashboard/      # HypeCounter, ProgressBar, HeptagramChart
│   ├── Layout/         # Sidebar, MainLayout
│   └── ui/             # Button, Card, Input (componentes base)
├── lib/
│   ├── api.ts          # Cliente API com tipos
│   └── supabase.ts     # Cliente Supabase
├── pages/
│   ├── auth/           # LoginPage
│   ├── onboarding/     # Step0, Step1, Step2
│   ├── dashboard/      # WarRoomPage
│   ├── crm/            # FrontlinePage (Kanban)
│   ├── resources/      # ArsenalPage
│   ├── training/       # TrainingPage
│   └── commissions/    # CommissionsPage
├── router/             # Rotas e proteção
├── stores/             # Zustand stores
└── App.tsx
```

## Instalação

```bash
cd frontend
npm install
```

## Configuração

Copie o arquivo de exemplo e configure as variáveis:

```bash
cp .env.example .env
```

Edite `.env` com suas credenciais do Supabase.

## Desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:5173`

## Paleta de Cores (Camuflagem Digital)

| Cor | Hex | Uso |
|-----|-----|-----|
| Background | `#1D1D1B` | Fundo principal |
| Surface | `#23262B` | Cards e containers |
| Primary | `#785942` | Botões e destaques |
| Accent | `#4A3728` | Hover states |
| Cream | `#F2EFE9` | Texto principal |
| Sand | `#C4A88E` | Texto secundário |

## Jornada do Usuário

1. **Step 0 (Recruta)**: Cadastro de dados, sonhos e Heptagrama
2. **Step 1 (Briefing)**: Agendamento de Kickoff
3. **Step 2 (Engajamento)**: Contrato e treinamentos iniciais
4. **Step 3 (Operacional)**: Acesso total à War Room
