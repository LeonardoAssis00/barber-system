# 💈 BarberSystem — Sistema de Gestão para Barbearias

O **BarberSystem** é um sistema web desenvolvido para facilitar a gestão de barbearias, oferecendo uma experiência simples e moderna tanto para **clientes** quanto para **barbeiros**.

O projeto foi idealizado com foco em **boas práticas de desenvolvimento**, **autenticação segura**, **componentização**, **organização de código** e **escalabilidade**, simulando um cenário real de aplicação profissional.

---

## 🎯 Objetivo do Projeto

Criar uma base sólida para um sistema completo de barbearia, permitindo:

- Diferenciação de perfis (cliente e barbeiro)
- Autenticação segura
- Estrutura preparada para agendamentos, serviços e dashboards
- Código organizado, reutilizável e fácil de evoluir

Este projeto faz parte do meu processo de transição para a área de desenvolvimento e demonstra minha capacidade de **planejar, estruturar e implementar** uma aplicação moderna do zero.

---

## 🧠 Visão Geral do Sistema

### 👤 Tipos de Usuário

- **Cliente**

  - Cria conta
  - Realiza login
  - Terá acesso ao dashboard do cliente

- **Barbeiro**
  - Cria conta específica
  - Realiza login próprio
  - Terá acesso ao dashboard do barbeiro

Cada tipo de usuário possui:

- Fluxo de cadastro separado
- Fluxo de login separado
- Estrutura de dashboard independente

---

## ✨ Funcionalidades Implementadas

✔ Página inicial apresentando o sistema  
✔ Escolha do tipo de conta (cliente ou barbeiro)  
✔ Cadastro com email e senha  
✔ Login com autenticação via Supabase  
✔ Criação automática de perfil no banco de dados  
✔ Contexto global de autenticação (AuthContext)  
✔ Componentes reutilizáveis  
✔ Layout moderno, escuro e responsivo  
✔ Navegação entre páginas com React Router

---

## 🛠️ Tecnologias Utilizadas e Como Foram Aplicadas

### ⚛️ React (com Vite)

Utilizado para construção da interface baseada em componentes reutilizáveis.

- Hooks (`useState`, `useEffect`, `useContext`)
- Componentização para inputs, botões e layouts
- Separação clara entre páginas, componentes e contexto

O Vite foi escolhido pela sua **rapidez**, **simplicidade** e **ambiente moderno de desenvolvimento**.

---

### 🌐 React Router DOM

Responsável pelo sistema de rotas da aplicação.

- Navegação entre páginas
- Separação de fluxos (home, login, cadastro, dashboard)
- Base preparada para proteção de rotas privadas no futuro

---

### 🔐 Supabase

Utilizado como **Backend as a Service (BaaS)**, fornecendo:

- Autenticação com email e senha
- Gerenciamento de sessão
- Banco de dados PostgreSQL
- Segurança via variáveis de ambiente

Foi implementada:

- Autenticação de usuários
- Criação de perfil (`profiles`) após o cadastro
- Recuperação de dados do usuário autenticado

---

### 🎨 Tailwind CSS

Responsável por toda a estilização do projeto.

- Layout responsivo
- Tema escuro moderno
- Padronização visual
- Agilidade no desenvolvimento
- Classes utilitárias bem organizadas

---

### 🧩 Lucide React

Biblioteca de ícones moderna e leve.

- Utilizada para botões de navegação e ações
- Melhora a experiência do usuário
- Mantém consistência visual

---

### 🔄 Context API (AuthContext)

Utilizada para gerenciamento global de autenticação.

- Estado do usuário logado
- Dados do perfil
- Controle de sessão
- Preparação para proteção de rotas

---

### 🗂️ Estrutura de Pastas

```text
src/
├── components/        # Componentes reutilizáveis
├── context/           # Contextos globais (Auth)
├── lib/               # Configurações externas (Supabase)
├── pages/             # Páginas da aplicação
│   ├── auth/          # Login e cadastro
│   ├── dashboard/     # Dashboards
│   └── Home.jsx
├── routes/            # Centralização das rotas
├── App.jsx
└── main.jsx
Essa organização facilita:

Manutenção

Escalabilidade

Leitura do código

Trabalho em equipe

🔐 Variáveis de Ambiente
O projeto utiliza variáveis de ambiente para segurança:

env
Copiar código
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
Um arquivo .env.example é fornecido como referência.
As chaves reais não são versionadas.

▶️ Como Executar o Projeto
bash
Copiar código
git clone https://github.com/seu-usuario/barbersystem.git
cd barbersystem
npm install
npm run dev
🚧 Funcionalidades Planejadas (Roadmap)
🔒 Proteção de rotas por tipo de usuário

📅 Sistema de agendamentos

🕒 Controle de horários do barbeiro

💼 Cadastro de serviços

📊 Dashboard com relatórios

🔔 Notificações

☁️ Deploy em produção (Vercel)

📈 O Que Este Projeto Demonstra
Capacidade de estruturar um projeto real

Conhecimento em React moderno

Uso consciente de backend como serviço

Organização de código

Pensamento voltado para escalabilidade

Boas práticas de versionamento e segurança

👨‍💻 Autor
Leonardo Abraão Assis
Estudante de Sistemas de Informação
Desenvolvedor em formação focado em Web e Mobile
Buscando a primeira oportunidade profissional na área de tecnologia 🚀

📄 Licença
Projeto desenvolvido para fins educacionais e profissionais.
```
