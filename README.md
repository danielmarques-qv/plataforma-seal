# 🎖️ PLATAFORMA SEAL

**Sistema de Estrategistas de Alta Performance** | v1.0.6

Plataforma completa para gestão de estrategistas de vendas com gamificação, CRM tático e sistema de onboarding progressivo.

---

## 📋 Visão Geral

A Plataforma SEAL oferece:

- **Onboarding Gamificado**: Jornada em 4 fases (Recruta → Briefing → Engajamento → Operacional)
- **War Room**: Dashboard com KPIs de performance e progresso financeiro
- **Frontline CRM**: Kanban tático (RADAR → COMBATE → EXTRAÇÃO → RESGATE)
- **Arsenal**: Biblioteca de scripts, playbooks e recursos de vendas
- **Heptagrama**: Quizz de 7 dimensões com gráfico de radar tático
- **Sistema de Comissões**: Comissões automáticas + gestão via Django Admin
- **Tema Claro/Escuro**: Toggle de tema persistente

---

## 🛠️ Stack Tecnológico

### Backend
- **Python 3.11+** com Poetry
- **Django 5** + **Django Ninja** (API REST)
- **Django Admin** (Gestão de dados)
- **PostgreSQL** (Supabase) - Schema `seal`
- **JWT** Authentication via Supabase Auth

### Frontend
- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS** (Paleta Camuflagem Digital)
- **Zustand** (State Management)
- **TanStack Query** (Data Fetching)
- **Chart.js** (Gráficos)
- **Lucide React** (Ícones)

---

## 🎨 Identidade Visual

### Tema Escuro (Padrão)
| Elemento | Cor | Hex |
|----------|-----|-----|
| Background | Preto Tático | `#1D1D1B` |
| Surface | Cinza Escuro | `#23262B` |
| Primary | Terra | `#785942` |
| Accent | Café | `#4A3728` |
| Texto | Creme | `#F2EFE9` |
| Muted | Areia | `#C4A88E` |

### Tema Claro
| Elemento | Cor | Hex |
|----------|-----|-----|
| Background | Creme | `#F2EFE9` |
| Surface | Branco | `#FFFFFF` |
| Primary | Terra | `#785942` |
| Accent | Café | `#4A3728` |
| Texto | Preto Tático | `#1D1D1B` |
| Muted | Café | `#4A3728` |

**Tipografia**: Archivo Black (headers) + Roboto (body)
**Estilo**: Bordas retas, visual tático/militar

**Arquivos de configuração de tema:**
- Cores: `frontend/src/index.css`
- Toggle: `frontend/src/components/ThemeToggle.tsx`
- Store: `frontend/src/stores/themeStore.ts`

---

## 🚀 Início Rápido

### 1. Clone o repositório
```bash
git clone <repo-url>
cd plataforma-seal
```

### 2. Backend (Django)
```bash
# Instalar dependências
poetry install

# Configurar variáveis de ambiente
cp backend/.env.example backend/.env
# Edite backend/.env com credenciais do Supabase

# Rodar servidor
cd backend
poetry run python manage.py runserver
```

### 3. Frontend (React)
```bash
cd frontend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite .env com credenciais do Supabase

# Rodar dev server
npm run dev
```

### 4. Acesse
- **Frontend**: http://localhost:5173
- **API Docs**: http://localhost:8000/api/docs
- **Django Admin**: http://localhost:8000/admin

---

## 🔧 Django Admin

### Acesso
- **URL**: http://localhost:8000/admin
- **Criar superusuário**:
```bash
cd backend
poetry run python manage.py createsuperuser
```

### Modelos Disponíveis

| App | Modelo | Funcionalidade |
|-----|--------|----------------|
| **Profiles** | Profile | Gerenciar usuários, definir % comissão, ver onboarding step |
| **Training** | TrainingModule | Criar/editar módulos de treinamento |
| **Training** | ModuleProgress | Ver progresso dos usuários nos módulos |
| **CRM** | Lead | Gerenciar leads de todos os estrategistas |
| **Resources** | Resource | Adicionar scripts, playbooks, templates |
| **Commissions** | Commission | Aprovar e pagar comissões |
| **Onboarding** | Onboarding | Ver agendamentos de kickoff |

### Gestão de Comissões no Admin

1. **Definir % de comissão por usuário**:
   - Profiles → selecione usuário → `commission_percentage` (padrão: 5%)

2. **Aprovar comissão**:
   - Commissions → selecione comissão → `status` = APPROVED

3. **Marcar como paga**:
   - Commissions → selecione comissão → `status` = PAID + definir `paid_at`

---

## 📁 Estrutura do Projeto

```
plataforma-seal/
├── backend/
│   ├── core/                 # Configurações Django
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── api.py            # Django Ninja config
│   │   └── auth.py           # JWT Supabase auth
│   ├── apps/
│   │   ├── profiles/         # Perfis de operadores
│   │   │   ├── models.py     # Profile model (commission_percentage)
│   │   │   ├── admin.py      # Django Admin config
│   │   │   └── api.py        # API endpoints
│   │   ├── crm/              # Leads e Kanban
│   │   │   ├── models.py     # Lead model
│   │   │   ├── admin.py      # Django Admin config
│   │   │   └── api.py        # API + auto-commission
│   │   ├── training/         # Módulos de treinamento
│   │   │   ├── models.py     # TrainingModule, ModuleProgress
│   │   │   ├── admin.py      # Django Admin config
│   │   │   └── api.py        # API endpoints
│   │   ├── resources/        # Arsenal (scripts/playbooks)
│   │   │   ├── models.py     # Resource model
│   │   │   ├── admin.py      # Django Admin config
│   │   │   └── api.py        # API endpoints
│   │   ├── commissions/      # Comissões
│   │   │   ├── models.py     # Commission model
│   │   │   ├── admin.py      # Django Admin config
│   │   │   └── api.py        # API endpoints
│   │   └── onboarding/       # Kickoff scheduling
│   │       ├── models.py     # Onboarding model
│   │       ├── admin.py      # Django Admin config
│   │       └── api.py        # API + dev endpoints
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── components/       # UI components
│   │   │   └── ThemeToggle.tsx  # Botão de tema
│   │   ├── pages/            # Páginas da aplicação
│   │   │   ├── onboarding/   # Steps 0-3
│   │   │   ├── crm/          # Frontline Kanban
│   │   │   ├── WarRoomPage.tsx
│   │   │   ├── ArsenalPage.tsx
│   │   │   └── CommissionsPage.tsx
│   │   ├── lib/              # API client, Supabase
│   │   ├── stores/           # Zustand stores
│   │   │   ├── authStore.ts
│   │   │   └── themeStore.ts # Tema claro/escuro
│   │   └── router/           # React Router config
│   ├── index.css             # Cores e temas CSS
│   └── package.json
└── pyproject.toml
```

---

## 🔐 Autenticação e Cadeados

### Autenticação
- Login via Supabase Auth
- JWT validado no backend Django
- Perfil criado automaticamente no primeiro login

### Sistema de Cadeados
Endpoints de CRM e Arsenal verificam `onboarding_step`:
- Step < 3 → Acesso negado (403)
- Step = 3 → Acesso liberado (Operacional)

---

## 🎮 Jornada do Usuário (Onboarding)

### Step 0 - Recruta (Cadastro)
- Preencher dados pessoais (nome, telefone, chave PIX)
- Definir meta financeira (Input de Sonhos)
- Completar Heptagrama (quiz de 7 dimensões)

### Step 1 - Briefing (Kickoff)
- Agendar reunião de kickoff via Calendly
- Aguardar confirmação do agendamento

### Step 2 - Engajamento (Contrato + Treinamento)
- Assistir módulos de treinamento obrigatórios
- Marcar cada módulo como concluído
- Assinar contrato (habilitado após todos os módulos)

### Step 3 - Operacional (Acesso Total)
- War Room liberado
- Frontline CRM liberado
- Arsenal liberado
- Comissões liberado

---

## 💰 Sistema de Comissões

### Fluxo Automático
1. **Lead vai para RESGATE** (CRM)
2. **Comissão criada automaticamente** com status `PENDING`
3. **Cálculo**: `potential_value × commission_percentage%`
4. **Profile atualizado**: `current_commission` soma todas comissões pendentes/aprovadas

### Status de Comissão
| Status | Descrição |
|--------|-----------|
| `PENDING` | Comissão criada, aguardando aprovação |
| `APPROVED` | Comissão aprovada pelo admin |
| `PAID` | Comissão paga ao estrategista |
| `CANCELLED` | Comissão cancelada |

### Gestão no Admin
1. **Aprovar**: Mudar status para `APPROVED`
2. **Pagar**: Mudar status para `PAID` + definir data em `paid_at`
3. **Ajustar %**: Editar `commission_percentage` no Profile do usuário

---

## 📊 Banco de Dados (Schema `seal`)

### Tabelas Principais

| Tabela | Descrição |
|--------|-----------|
| `profiles` | Dados do operador, onboarding_step, commission_percentage |
| `crm_leads` | Pipeline de vendas (RADAR/COMBATE/EXTRAÇÃO/RESGATE) |
| `training_modules` | Vídeos e conteúdos de treinamento |
| `module_progress` | Progresso dos usuários nos módulos |
| `resources` | Scripts, playbooks, templates para download |
| `commissions` | Registro de comissões (PENDING/APPROVED/PAID) |
| `onboarding` | Agendamentos de kickoff |

### SQL para Setup Inicial
```sql
-- Adicionar commission_percentage ao profiles
ALTER TABLE seal.profiles 
ADD COLUMN IF NOT EXISTS commission_percentage DECIMAL(5,2) DEFAULT 5.00;

-- Criar tabela resources
CREATE TABLE IF NOT EXISTS seal.resources (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category VARCHAR(20) DEFAULT 'SCRIPT',
    file_url TEXT NOT NULL,
    thumbnail_url TEXT,
    file_type VARCHAR(10),
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar tabela commissions
CREATE TABLE IF NOT EXISTS seal.commissions (
    id BIGSERIAL PRIMARY KEY,
    strategist_id UUID NOT NULL REFERENCES seal.profiles(id),
    lead_id BIGINT REFERENCES seal.crm_leads(id),
    amount DECIMAL(12,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    description TEXT,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🔌 API Endpoints

### Profiles
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/profiles/me` | Dados do perfil logado |
| PUT | `/api/profiles/me` | Atualizar perfil |
| POST | `/api/profiles/onboarding/complete-step-0` | Completar cadastro |

### CRM
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/crm/board` | Kanban completo |
| GET | `/api/crm/leads` | Listar leads |
| POST | `/api/crm/leads` | Criar lead |
| PUT | `/api/crm/leads/{id}` | Atualizar lead |
| PATCH | `/api/crm/leads/{id}/move` | Mover lead (cria comissão se RESGATE) |
| DELETE | `/api/crm/leads/{id}` | Deletar lead |

### Training
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/training/modules` | Lista de módulos com progresso |
| GET | `/api/training/modules/{id}` | Detalhes do módulo |
| POST | `/api/training/modules/{id}/complete` | Marcar como concluído |
| GET | `/api/training/pending` | Módulos pendentes |

### Resources
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/resources/arsenal` | Recursos por categoria |
| POST | `/api/resources/{id}/download` | Registrar download |

### Commissions
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/commissions/summary` | Resumo financeiro |
| GET | `/api/commissions/rules` | Regras de comissionamento |

### Onboarding
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/onboarding/schedule` | Salvar agendamento Calendly |
| GET | `/api/onboarding/status` | Status do agendamento |

### Dev Endpoints (apenas em desenvolvimento)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/onboarding/dev/simulate-schedule` | Simular agendamento |
| POST | `/api/onboarding/dev/simulate-contract` | Simular assinatura de contrato |
| POST | `/api/onboarding/dev/complete-training` | Completar todos os treinamentos |

---

## 🌙 Tema Claro/Escuro

### Como usar
- Botão no canto inferior direito (☀️/🌙)
- Preferência salva no localStorage
- Persiste entre sessões

### Customizar cores
Edite `frontend/src/index.css`:
```css
/* Tema Escuro */
@theme {
  --color-background: #1D1D1B;
  --color-surface: #23262B;
  --color-primary: #785942;
  --color-accent: #4A3728;
  --color-cream: #F2EFE9;
  --color-sand: #C4A88E;
}

/* Tema Claro */
:root.light {
  --color-background: #F2EFE9;
  --color-surface: #FFFFFF;
  --color-cream: #1D1D1B;
  --color-sand: #4A3728;
}
```

---

## 📝 Licença

Projeto proprietário - Todos os direitos reservados.
