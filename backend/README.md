# 🎖️ SEAL Platform - Backend

Sistema de Estrategistas de Alta Performance - API Backend

## Stack Tecnológico

- **Python 3.11+**
- **Django 5** - Framework Web
- **Django Ninja** - API REST de alta performance
- **PostgreSQL** (Supabase) - Banco de dados
- **JWT** - Autenticação via Supabase Auth

## Estrutura do Projeto

```
backend/
├── core/                   # Configurações do projeto Django
│   ├── settings.py        # Configurações
│   ├── urls.py            # URLs principais
│   ├── api.py             # Configuração Django Ninja
│   └── auth.py            # Autenticação JWT Supabase
├── apps/
│   ├── profiles/          # Perfis de operadores
│   ├── crm/               # Frontline CRM (Kanban)
│   ├── training/          # Módulos de treinamento
│   ├── resources/         # Arsenal (Scripts/Playbooks)
│   └── commissions/       # Comissões
└── manage.py
```

## Instalação

1. Instale as dependências com Poetry:
```bash
cd plataforma-seal
poetry install
```

2. Configure as variáveis de ambiente:
```bash
cp backend/.env.example backend/.env
# Edite o arquivo .env com suas credenciais do Supabase
```

3. Execute as migrações (apenas para apps gerenciados):
```bash
cd backend
poetry run python manage.py migrate
```

4. Inicie o servidor de desenvolvimento:
```bash
poetry run python manage.py runserver
```

## API Endpoints

A documentação interativa está disponível em `/api/docs`

### Perfil do Operador
- `GET /api/profiles/me` - Dados do perfil logado
- `PUT /api/profiles/me` - Atualizar perfil
- `POST /api/profiles/onboarding/complete-step-0` - Completar cadastro inicial
- `POST /api/profiles/onboarding/complete-step-1` - Confirmar kickoff
- `POST /api/profiles/onboarding/complete-step-2` - Assinar contrato

### Frontline CRM
- `GET /api/crm/board` - Board Kanban completo
- `GET /api/crm/leads` - Listar leads
- `POST /api/crm/leads` - Criar lead
- `PATCH /api/crm/leads/{id}/move` - Mover lead no Kanban

### Treinamentos
- `GET /api/training/modules` - Visão geral dos módulos
- `POST /api/training/modules/{id}/complete` - Marcar como concluído

### Arsenal
- `GET /api/resources/arsenal` - Recursos por categoria
- `POST /api/resources/{id}/download` - Registrar download

### Comissões
- `GET /api/commissions/summary` - Resumo financeiro
- `GET /api/commissions/rules` - Regras de comissionamento

## Lógica de Cadeados

Endpoints de CRM e Arsenal verificam se `onboarding_step >= 3` antes de permitir acesso. Usuários que não completaram o onboarding recebem erro 403.

## Autenticação

Todos os endpoints protegidos requerem header:
```
Authorization: Bearer <supabase_jwt_token>
```

O JWT é validado usando o secret do Supabase configurado em `SUPABASE_JWT_SECRET`.
