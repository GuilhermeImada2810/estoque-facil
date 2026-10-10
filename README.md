# 📦 Estoque Fácil

<p align="center">
  <strong>Sistema web moderno, ágil e intuitivo para controle e gestão de estoque de pequenas empresas e comércios locais.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/React%20Router-7.x-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white" alt="React Router" />
  <img src="https://img.shields.io/badge/Lucide%20Icons-Design-3b82f6?style=for-the-badge" alt="Lucide Icons" />
  <img src="https://img.shields.io/badge/Status-Concluído-10b981?style=for-the-badge" alt="Status" />
</p>

---

## 📑 Sumário

- [Visão Geral](#-visão-geral)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Como Executar o Projeto Localmente](#-como-executar-o-projeto-localmente)
- [Configuração do Firebase (Passo a Passo)](#-configuração-do-firebase-passo-a-passo)
  - [1. Criar Projeto](#1-criar-projeto-no-firebase)
  - [2. Ativar Autenticação](#2-ativar-o-firebase-authentication)
  - [3. Ativar o Cloud Firestore](#3-ativar-o-cloud-firestore)
  - [4. Regras de Segurança (Multi-tenant)](#4-configurar-as-regras-de-segurança-do-firestore)
  - [5. Obter Credenciais e Preencher o `.env`](#5-obter-as-chaves-e-preencher-o-env)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Boas Práticas e Segurança](#-boas-práticas-e-segurança)

---

## 🌟 Visão Geral

O **Estoque Fácil** foi desenvolvido para resolver as dores reais de pequenos empreendedores, autônomos e gestores que precisam manter o controle de seus produtos sem planilhas confusas ou sistemas corporativos pesados.

O sistema oferece uma experiência fluida com **sincronização em tempo real**, interface rica em modo escuro, métricas automáticas do patrimônio em mercadorias e **isolamento total de dados por usuário**, garantindo que cada conta acesse única e exclusivamente o seu próprio inventário.

---

## ✨ Funcionalidades Principais

### 🔐 1. Autenticação & Usuários (Firebase Auth)
- **Cadastro de Conta**: Formulário com validações para nome da empresa/gestor, e-mail, senha e confirmação de senha.
- **Login Seguro**: Autenticação com credenciais e persistência de sessão.
- **Recuperação de Senha**: Fluxo com envio de e-mail de redefinição de senha com um clique.
- **Feedback Amigável**: Tratamento de todas as mensagens de erro do Firebase traduzidas para o português (*e-mail já em uso, senha fraca, credenciais inválidas, etc.*).
- **Rotas Protegidas**: Bloqueio de acesso às páginas internas para visitantes não autenticados e redirecionamento automático de usuários logados.

### 🛡️ 2. Isolamento de Dados por Usuário (Multi-tenant)
- Cada produto é armazenado no Cloud Firestore com o identificador exclusivo `userId: auth.currentUser.uid`.
- As consultas são filtradas diretamente pelo UID do usuário autenticado.
- Regras de segurança no Firestore bloqueiam leitura, escrita ou exclusão de dados entre contas distintas.

### 📊 3. Dashboard Inteligente (KPIs em Tempo Real)
- **Cards de Métricas em Destaque**:
  - **Tipos de Produtos**: Total de itens cadastrados no catálogo.
  - **Total de Unidades Físicas**: Soma total de itens em prateleira/estoque.
  - **Valor Total do Estoque**: Cálculo dinâmico do valor monetário do inventário (R$).
  - **Estoque Baixo / Crítico**: Contagem de itens que atingiram ou estão abaixo do estoque mínimo.
  - **Produtos Esgotados**: Alerta imediato de produtos com quantidade zero.
- **Painel de Atenção Imediata**: Lista rápida de mercadorias que necessitam de reposição com botão de edição ágil.
- **Resumo por Categoria**: Distribuição de unidades e valor financeiro agrupados por setor.
- **Últimos Produtos**: Tabela com os itens modificados mais recentemente.

### 📦 4. Gestão de Produtos (CRUD Completo)
- **Cadastro & Edição Completa**:
  - Nome do Produto (obrigatório).
  - Categoria (com opções pré-configuradas: Alimentos, Eletrônicos, Roupas, Limpeza, etc.).
  - Quantidade em estoque (com validação de números positivos).
  - Preço unitário em Reais (R$).
  - Estoque mínimo para disparo de alerta visual (padrão configurável).
  - Código / SKU (opcional para leitura rápida).
  - Descrição detalhada e observações sobre fornecedores ou localização.
  - Pré-visualização em tempo real do **subtotal em estoque** (Quantidade × Preço).
- **Exclusão Segura**: Modal de confirmação com destaque visual para evitar remoções acidentais.
- **Pesquisa Instantânea**: Campo de busca em tempo real por nome, código SKU ou descrição.
- **Filtros Avançados**:
  - Filtro por Categoria.
  - Filtro por Status do Estoque (*Todos*, *Em Estoque Normal*, *Estoque Baixo*, *Esgotados*).
- **Ordenação Dinâmica**:
  - Mais Recentes.
  - Ordem Alfabética (A-Z).
  - Menor / Maior Preço.
  - Menor / Maior Quantidade.

### 🎨 5. Interface Moderna & Experiência do Usuário (UI/UX)
- **Design System Profissional**: Paleta escura moderna (*dark theme*) com tons de ardósia, índigo, esmeralda, âmbar e carmim.
- **Tipografia Premium**: Integração com as fontes **Plus Jakarta Sans** e **Inter** via Google Fonts.
- **Totalmente Responsivo**: Layout otimizado para celulares, tablets e computadores, incluindo menu lateral retrátil (*drawer mobile*).
- **Notificações Toast**: Alertas flutuantes de sucesso, aviso e erro com auto-fechamento.
- **Resiliência a Variáveis de Ambiente**: Leitura defensiva no `firebase.js` que trata automaticamente arquivos `.env` com caracteres BOM (*Byte Order Mark*).

---

## 💻 Tecnologias Utilizadas

| Tecnologia | Finalidade |
| :--- | :--- |
| **React 19** | Biblioteca principal de interface declarativa e componentização |
| **Vite 8** | Bundler ultra-rápido para desenvolvimento e build de produção |
| **Firebase Auth** | Gerenciamento seguro de autenticação e sessões |
| **Cloud Firestore** | Banco de dados NoSQL na nuvem com sincronização em tempo real |
| **React Router DOM 7** | Gerenciamento de rotas e proteção de páginas |
| **Lucide React** | Pacote de ícones SVG modernos e consistentes |
| **Vanilla CSS3** | Folha de estilos sob medida sem dependências externas pesadas |
| **Oxlint** | Verificação estática de código e integridade de imports |

---

## 📂 Estrutura do Projeto

```text
atividade-final-app/
├── public/                      # Arquivos públicos estáticos
├── src/
│   ├── assets/                  # Logos e recursos visuais
│   ├── components/              # Componentes de interface reutilizáveis
│   │   ├── ConfirmModal.jsx     # Modal de confirmação para exclusão
│   │   ├── FirebaseNotice.jsx   # Banner de aviso sobre configuração do Firebase
│   │   ├── Layout.jsx           # Shell da aplicação (Sidebar, Header e Mobile Menu)
│   │   ├── ProductModal.jsx     # Modal de criação e edição com validações
│   │   ├── ProtectedRoute.jsx   # Guarda de rotas que exigem usuário autenticado
│   │   ├── PublicRoute.jsx      # Redireciona usuários logados para fora do login
│   │   └── StatCard.jsx         # Card de métricas e KPIs do dashboard
│   ├── contexts/                # Provedores de estado global do React
│   │   ├── AuthContext.jsx      # Provedor de autenticação com Firebase
│   │   ├── authContextDef.js    # Definição isolada do contexto de autenticação
│   │   ├── ToastContext.jsx     # Provedor do sistema de notificações toast
│   │   └── toastContextDef.js   # Definição isolada do contexto de toasts
│   ├── hooks/                   # Hooks customizados para Fast Refresh
│   │   ├── useAuth.js           # Hook para consumo da autenticação
│   │   └── useToast.js          # Hook para disparo de notificações toast
│   ├── pages/                   # Páginas da aplicação
│   │   ├── Dashboard.jsx        # Visão geral de estoque, métricas e alertas
│   │   ├── Login.jsx            # Autenticação (Login, Cadastro e Recuperação)
│   │   ├── NotFound.jsx         # Página personalizada para rotas 404
│   │   └── Products.jsx         # Gestão completa de produtos, busca e filtros
│   ├── services/                # Integrações e comunicação externa
│   │   ├── firebase.js          # Inicialização resiliente do Firebase
│   │   └── productService.js    # Operações CRUD no Firestore isoladas por usuário
│   ├── utils/                   # Utilitários e helpers
│   │   └── authErrors.js        # Mapeamento dos códigos de erro do Firebase
│   ├── firebase.js              # Re-export da inicialização para conveniência
│   ├── App.jsx                  # Roteador central e mapeamento de páginas
│   ├── index.css                # Design System completo e estilos globais
│   └── main.jsx                 # Ponto de entrada e renderização do React
├── .env                         # Variáveis de ambiente reais (não versionado)
├── .env.example                 # Modelo demonstrativo das variáveis necessárias
├── .gitignore                   # Regras de exclusão do Git (.env, node_modules, dist)
├── index.html                   # HTML base com fontes e meta tags otimizadas
├── package.json                 # Dependências e scripts do projeto
└── vite.config.js               # Configuração do Vite e plugin React
```

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
- **Node.js** (versão 18 ou superior instalada)
- **NPM** (incluso com o Node.js)

### Passo a Passo

1. **Acesse a pasta do projeto**:
   ```bash
   cd atividade-final-app
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Configure as Variáveis de Ambiente**:
   Crie o arquivo `.env` na raiz do projeto com base no arquivo `.env.example`:
   ```bash
   # No Windows PowerShell:
   Copy-Item .env.example .env

   # No Linux/Mac:
   cp .env.example .env
   ```
   Abra o arquivo `.env` e preencha as variáveis com as credenciais do seu projeto Firebase.

4. **Inicie o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```
   O terminal exibirá o endereço local (geralmente `http://localhost:5173/`). Abra no seu navegador.

5. **Gerar a versão otimizada de produção**:
   ```bash
   npm run build
   ```

6. **Visualizar a versão de produção localmente**:
   ```bash
   npm run preview
   ```

---

## 🔒 Configuração do Firebase (Passo a Passo)

Para habilitar a autenticação na nuvem e a persistência em tempo real no banco de dados, siga as instruções abaixo:

### 1. Criar Projeto no Firebase
1. Acesse o [Firebase Console](https://console.firebase.google.com/).
2. Clique em **Adicionar projeto** (ou *Criar um projeto*).
3. Defina um nome para o seu projeto (ex: `estoque-facil`) e conclua a criação.

### 2. Ativar o Firebase Authentication
1. No menu lateral do console, clique em **Criação** > **Authentication**.
2. Clique no botão **Primeiros passos**.
3. Na aba **Método de login** (*Sign-in method*), selecione **E-mail/senha**.
4. Ative a primeira chave: **Permitir que os usuários façam login usando e-mail e senha**.
5. Clique em **Salvar**.

### 3. Ativar o Cloud Firestore
1. No menu lateral, acesse **Criação** > **Firestore Database**.
2. Clique em **Criar banco de dados**.
3. Selecione a localização do servidor mais próxima (ex: `southamerica-east1` em São Paulo ou o padrão `us-central`).
4. Escolha o modo inicial e confirme a ativação.

### 4. Configurar as Regras de Segurança do Firestore
Para garantir o **isolamento estrito entre usuários** (nenhum usuário poderá ler ou alterar produtos de outro), acesse a aba **Regras** (*Rules*) do Cloud Firestore, substitua o conteúdo pelo código abaixo e clique em **Publicar**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{productId} {
      // Usuário autenticado só pode ler e deletar se for o dono do produto
      allow read, delete: if request.auth != null && resource.data.userId == request.auth.uid;
      
      // Ao criar, o campo userId deve ser exatamente o UID do usuário logado
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      
      // Ao atualizar, só pode alterar seu próprio produto mantendo o userId inalterado
      allow update: if request.auth != null 
                    && resource.data.userId == request.auth.uid 
                    && request.resource.data.userId == request.auth.uid;
    }
  }
}
```

### 5. Obter as Chaves e Preencher o `.env`
1. No menu superior esquerdo, clique no ícone de engrenagem ⚙️ > **Configurações do projeto**.
2. Na aba **Geral**, role até a seção **Seus aplicativos** e clique no ícone Web `</>`.
3. Dê um apelido (ex: `EstoqueFacilWeb`) e clique em **Registrar app**.
4. Copie as chaves do objeto de configuração exibido e cole no seu arquivo `.env`:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
```

> **Dica:** Sempre que criar ou alterar o arquivo `.env`, reinicie o comando `npm run dev` para que as novas variáveis sejam carregadas pelo Vite.

---

## 🛠️ Scripts Disponíveis

No arquivo `package.json`, estão configurados os seguintes comandos:

| Comando | Descrição |
| :--- | :--- |
| `npm run dev` | Inicia o servidor de desenvolvimento com Hot Module Replacement (HMR) |
| `npm run build` | Compila os arquivos para a pasta `dist` otimizando para produção |
| `npm run lint` | Executa o linter Oxlint para garantir padrões de código e imports válidos |
| `npm run preview` | Executa um servidor local simulando o pacote de produção gerado |

---

## 🛡️ Boas Práticas e Segurança

- **Segurança de Credenciais**: As chaves privadas nunca são expostas em código versionado. O arquivo `.gitignore` foi configurado para ignorar `.env` e suas variações.
- **Tratamento de BOM em UTF-8**: O serviço de inicialização do Firebase foi construído para lidar tanto com caracteres UTF-8 padrão quanto com cabeçalhos BOM gerados pelo PowerShell do Windows.
- **Isolamento de Estado**: Contextos divididos entre arquivos de definição e hooks dedicados (`useAuth` e `useToast`), garantindo total compatibilidade com o React Fast Refresh.
- **Feedback Visual Contínuo**: Estados de carregamento com *spinners* em botões e skeleton loaders, garantindo que o usuário tenha retorno imediato de cada ação realizada.

---

<p align="center">
  Desenvolvido com dedicação para o controle simples, eficiente e moderno de inventário. 📦✨
</p>
