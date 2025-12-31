# 🎖️ PLATAFORMA SEAL

**Sistema de Estrategistas de Alta Performance**

Plataforma completa para gestão de estrategistas de vendas com gamificação, CRM tático e sistema de onboarding progressivo.

---

## 📋 Visão Geral

A Plataforma SEAL oferece:

- **Onboarding Gamificado**: Jornada em 4 fases (Recruta → Briefing → Engajamento → Operacional)
- **War Room**: Dashboard com KPIs de performance e progresso financeiro
- **Frontline CRM**: Kanban tático (RADAR → COMBATE → EXTRAÇÃO → RESGATE)
- **Arsenal**: Biblioteca de scripts, playbooks e recursos de vendas
- **Heptagrama**: Quizz de 7 dimensões com gráfico de radar tático
- **Sistema de Comissões**: Regras de comissionamento e extrato

---

## 🛠️ Stack Tecnológico

### Backend
- **Python 3.11+** com Poetry
- **Django 5** + **Django Ninja** (API REST)
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

| Elemento | Cor | Hex |
|----------|-----|-----|
| Background | Preto Tático | `#1D1D1B` |
| Surface | Cinza Escuro | `#23262B` |
| Primary | Terra | `#785942` |
| Accent | Café | `#4A3728` |
| Texto | Creme | `#F2EFE9` |
| Muted | Areia | `#C4A88E` |

**Tipografia**: Archivo Black (headers) + Roboto (body)
**Estilo**: Bordas retas, visual tático/militar

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
│   │   ├── crm/              # Leads e Kanban
│   │   ├── training/         # Módulos de treinamento
│   │   ├── resources/        # Arsenal (scripts/playbooks)
│   │   └── commissions/      # Comissões
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── components/       # UI components
│   │   ├── pages/            # Páginas da aplicação
│   │   ├── lib/              # API client, Supabase
│   │   ├── stores/           # Zustand stores
│   │   └── router/           # React Router config
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

## 🎮 Jornada do Usuário

| Step | Fase | Descrição |
|------|------|-----------|
| 0 | Recruta | Cadastro de dados, sonhos e Heptagrama |
| 1 | Briefing | Agendamento de Kickoff |
| 2 | Engajamento | Assinatura de contrato + treinamento inicial |
| 3 | Operacional | Acesso total à plataforma |

---

## 📊 Banco de Dados (Schema `seal`)

### Tabelas Principais

- **profiles**: Dados do operador, onboarding_step, heptagram_scores
- **crm_leads**: Pipeline de vendas (RADAR/COMBATE/EXTRAÇÃO/RESGATE)
- **training_modules**: Vídeos e conteúdos de treinamento
- **resources**: Scripts e playbooks para download
- **commissions**: Registro de comissões

---

## 🔌 API Endpoints

### Profiles
- `GET /api/profiles/me` - Dados do perfil logado
- `POST /api/profiles/onboarding/complete-step-0` - Completar cadastro

### CRM
- `GET /api/crm/board` - Kanban completo
- `POST /api/crm/leads` - Criar lead
- `PATCH /api/crm/leads/{id}/move` - Mover lead

### Training
- `GET /api/training/modules` - Lista de módulos
- `POST /api/training/modules/{id}/complete` - Marcar como concluído

### Resources
- `GET /api/resources/arsenal` - Recursos por categoria
- `POST /api/resources/{id}/download` - Registrar download

### Commissions
- `GET /api/commissions/summary` - Resumo financeiro
- `GET /api/commissions/rules` - Regras de comissionamento

---

## 📝 Licença

Projeto proprietário - Todos os direitos reservados.
