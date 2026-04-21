🏛️ GovPE - Sistema Unificado de Produtos

O GovPE - Sistema Unificado de Produtos é uma solução Full-Stack robusta desenvolvida para a gestão centralizada de produtos, usuários e categorias. O projeto foi construído seguindo rigorosos padrões de arquitetura de software, focando em auditabilidade, segurança da informação e experiência do usuário responsiva (Mobile First).

Este sistema utiliza a identidade visual oficial do Governo de Pernambuco, garantindo uma interface institucional, acessível e profissional.
🛠️ Stack Tecnológica
Frontend

    Next.js 14+ (App Router) com TypeScript.

    Tailwind CSS para estilização baseada na biblioteca UI-GovPe.

    Lucide React para iconografia técnica.

    Axios para integração com a API.

Backend

    NestJS: Framework escalável em Node.js.

    Prisma ORM: Modelagem de dados e integração com o banco.

    PostgreSQL: Banco de dados relacional para persistência de dados críticos.

    JWT & Bcrypt: Autenticação segura e criptografia de senhas.

🌟 Funcionalidades Principais

    🔐 Autenticação Protegida: Fluxo completo de Login e Registro com tokens JWT e persistência de sessão.

    📦 Gestão de Inventário (CRUD): Gerenciamento completo de Produtos e Categorias com cardinalidade 1:N.

    👥 Controle de Acesso (RBAC): Perfil de ADMIN exclusivo para gestão de usuários e áreas sensíveis.

    📋 Auditoria do Sistema: Rastreamento detalhado de ações ("quem fez o quê e quando") para conformidade e segurança.

    📱 Design Mobile-First: Interface totalmente responsiva, otimizada para tablets, smartphones e desktops.

    📊 Dashboard de Indicadores: Visão geral em tempo real com estatísticas de ativos e usuários cadastrados.

🏗️ Arquitetura do Projeto

O sistema foi desenhado para ser modular e de fácil manutenção:

    Camada de API: Endpoints seguindo os padrões RESTful com prefixo /api/v1.

    Camada de Dados: Relacionamentos entre Usuários, Produtos e Categorias com integridade referencial via Prisma.

    Segurança: Middleware de proteção de rotas e tratamento de exceções (Error Handling) global.

📄 Documentação

A API possui documentação automática via Swagger, facilitando testes e integrações futuras. Para acessar, basta rodar o backend e navegar até /api/v1/docs.
