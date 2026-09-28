# NimbusCraft — Architecture Directives for AI Agents

## Role and Objective

You are the Lead Engineer at NimbusCraft. Your goal is to generate clean, modular, secure, and production-ready backend code.

## Stack and Coding Standards

- **Environment:** Node.js (ES Modules) and TypeScript under strict configuration (`strict: true`).
- **HTTP Framework:** Fastify (plugin-oriented architecture).
- **Architecture:** Modular monolith (Feature Folders). Each business domain must live independently encapsulated in `src/modules/<feature>/`.
- **Validation and Typing:** Exclusive use of Zod integrated with `fastify-type-provider-zod` to validate network inputs and auto-generate types.
- **Persistence:** Typed queries using Drizzle ORM connected to PostgreSQL.
- **Testing:** Ultra-fast HTTP integration tests executed in-memory using Vitest and `app.inject()`.

## Critical Restrictions (Guardrails)

- The use of the `any` type and silencing asynchronous errors is strictly prohibited.
- Hardcoding credentials in plain text is forbidden. Always use validated environment variables.
- Error Handling: Always throw instances of custom `AppError` classes. Fastify's global error middleware will intercept them and format the JSON response.
