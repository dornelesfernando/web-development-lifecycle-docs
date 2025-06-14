# Ciclo de Vida do Desenvolvimento de Software (Web): Metodologias e Implementação Prática

Este é o documento que detalha o ciclo de vida completo do desenvolvimento de um site, abrangendo desde a concepção da ideia até o deploy e manutenção. Ele explora as etapas de planejamento, design, desenvolvimento (com React/TS, Node.js/Express/TS e PostgreSQL), banco de dados, hospedagem e muito mais.

Árvore de arquivos:

    main/
    ├── FrontEnd/
    │   ├── public/
    │   │   └── # ADICIONAR #
    │   ├── src/
    │   │   ├── components/
    │   │	│   └── 
    │   │	├── pages/
    │   │   │   ├── 
    │   │   │   ├── 
    │   │   │   └── 
    |   │   ├── services/
    |   |   │   ├── api.ts
    |   |   │   ├── auth.ts
    |   |   │   └── # ADICIONAR #
    |   │   ├── types/
    |   |   │   ├── index.ts
    │   |   ├── App.tsx
    │   |   └── index.tsx
    │   ├── .env
    │   ├── package.json
    │   └── tsconfig.json
    ├── Backend/
    │   ├── node_modules/
    │   ├── dist/     # Pasta de saída dos arquivos compilados (criada após 'npm run build')
    │   ├── src/
    │   │   ├── config/
    │   │	│   └── database.ts # Configurações do Sequelize
    │   │	├── database/
    │   │   │   ├── index.ts    # Inicialização do Sequelize
    │   │   │   ├── migrations.ts
    │   │   │   └── seeders.ts    # Para popular o DB (opcional)
    |   │   ├── models/
    |   |   │   ├── Employee.ts
    |   |   │   ├── Position.ts
    |   |   │   ├── Department.ts
    |   |   │   ├── Project.ts
    |   |   │   ├── Task.ts
    |   |   │   ├── EmployeeTask.ts
    |   |   │   ├── HourLog.ts
    |   |   │   ├── Attachment.ts
    |   |   │   ├── Role.ts
    |   |   │   ├── Permission.ts
    |   |   │   ├── RolePermission.ts
    |   |   │   ├── EmployeeRole.ts
    |   |   │   └── index.ts    # Exporta todos os modelos e associações
    │   │   ├── routes/
    │   |   │   ├── authRoutes.ts
    │   |   │   ├── employeeRoutes.ts    # Rotas para gerenciamento de usuários (admins)
    │   |   │   ├── positionRoutes.ts
    │   |   │   ├── departmentRoutes.ts
    │   |   │   ├── projectRoutes.ts
    │   |   │   ├── taskRoutes.ts
    │   |   │   ├── hourLogRoutes.ts
    │   |   │   ├── attachmentRoutes.ts
    │   |   │   ├── roleRoutes.ts
    │   |   │   ├── permissionRoutes.ts
    │   |   │   └── uploadRoutes.ts
    │   │   ├── middleware/
    │   |   │   ├── authMiddleware.ts
    │   |   │   ├── permissionMiddleware.ts    # middleware para permissões granulares    
    │   |   │   └── errorMiddleware.ts
    │   │   ├── controllers/
    │   │   │   ├── authController.ts
    │   |   │   ├── employeeController.ts
    │   |   │   ├── positionController.ts
    │   |   │   ├── departmentController.ts
    │   |   │   ├── projectController.ts
    │   |   │   ├── taskController.ts
    │   |   │   ├── hourLogController.ts
    │   |   │   ├── attachmentController.ts
    │   |   │   ├── roleController.ts
    │   |   │   └── permissionController.ts
    │   │   ├── utils/
    │   │   │   ├── fileUpload.ts    # Configuração do Multer
    │   |   │   └── generateToken.ts    # Função auxiliar
    │   │   ├── types/
    │   |   │   └── express.d.ts    # Para estender tipos do Express
    │   │   └── server.ts
    │   ├── tests/
    │   |   └── # ADICIONAR #
    │   ├── .env
    │   ├── package.json
    │   └── tsconfig.json
    ├── .gitignore
    ├── README.md
    └── docker-compose.yml # Gerenciar os serviços do docker (PosgreSQL, Back-end)