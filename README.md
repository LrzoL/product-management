🏛️ Sistema Unificado de Produtos - GovPE

    O Sistema Unificado de Produtos é uma solução Full-Stack de missão crítica desenvolvida para a gestão centralizada de ativos, usuários e categorias. O projeto foi construído seguindo rigorosos padrões de arquitetura de software, focando em auditabilidade, segurança da informação e uma experiência de usuário de alta performance.

    Este sistema utiliza a identidade visual oficial do Governo de Pernambuco, garantindo uma interface institucional, acessível e profissional, ideal para ambientes de administração pública.

🛠️ Stack Tecnológica

Frontend

    Next.js 14+ (App Router): Utilizando TypeScript para garantir um código tipado e livre de erros em tempo de execução.

    Tailwind CSS: Estilização moderna e responsiva, com componentes otimizados para evitar quebras de layout.

    Lucide React: Iconografia técnica e minimalista.

    Axios: Cliente HTTP para integração robusta com a API.

Backend

    NestJS: Framework Node.js escalável de alto desempenho.

    Prisma ORM: Modelagem de dados moderna com suporte a migrations e segurança contra SQL Injection.

    PostgreSQL: Banco de dados relacional robusto para persistência de dados críticos.

    JWT & Bcrypt: Autenticação baseada em tokens e criptografia de ponta para senhas.

Infraestrutura & DevOps

    Docker & Docker Compose: Todo o ecossistema é orquestrado em containers, garantindo isolamento de ambiente.

🌟 Funcionalidades Principais

    🔐 Autenticação Protegida: Fluxo completo de Login e Registro com tokens JWT e persistência de sessão.

    📦 Gestão de Inventário (CRUD): Gerenciamento de Produtos e Categorias com validação de cardinalidade.

    👥 Controle de Acesso (RBAC): Sistema de permissões onde apenas perfis ADMIN podem realizar exclusões.

    📱 Design Adaptativo: Interface "Slim Sidebar" otimizada para evitar rolagem lateral e garantir usabilidade em telas divididas.

    🔍 Busca e Paginação: Filtros inteligentes para localização rápida de ativos.

🏗️ Arquitetura do Projeto

    Camada de API: Endpoints seguindo os padrões RESTful para fácil integração.

    Camada de Dados: Integridade referencial garantida via Prisma entre Usuários, Produtos e Categorias.

    Segurança Global: Middleware de proteção de rotas e tratamento de exceções centralizado.

    

 📄 Documentação e Auditoria

    O sistema oferece rastreabilidade de ações e documentação automática de endpoints via Swagger, facilitando auditorias e futuras manutenções por outras equipes de desenvolvimento.


🚀 Como Executar o Projeto

    Certifique-se de ter o Docker instalado e, na raiz do projeto, execute:
Bash

    # Para subir todos os serviços (Banco, API e Front)
        docker-compose up -d --build

    # Para aplicar as tabelas ao banco de dados (Primeira execução)
        docker exec -it nestjs_api npx prisma migrate dev

🌐 Endereços de Acesso:

    Frontend: http://localhost:3001

    Backend / API: http://localhost:3000

    Documentação Swagger: http://localhost:3000/api/v1/docs
