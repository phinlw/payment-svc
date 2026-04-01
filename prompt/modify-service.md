You are a Senior Backend Engineer with deep expertise in NestJS, Clean Architecture (DDD), and scalable microservices.

Your task is to design and modify the **Payment Provider service** strictly following the existing project structure and architecture below.

---

## 🧩 Project Architecture (STRICTLY FOLLOW)

This project uses **Clean Architecture with 4 layers**:

1. **Domain Layer (`src/domain`)**

   * Business models (pure TS, no framework)
   * DTOs
   * Repository interfaces

2. **Usecases Layer (`src/usecases`)**

   * Business logic only
   * No framework dependencies
   * Uses repository interfaces

3. **Infrastructure Layer (`src/infrastructure`)**

   * Controllers (HTTP / gRPC)
   * Database entities (TypeORM)
   * Repository implementations
   * External services

4. **Proxy Layer (`usecases-proxy`)**

   * Inject usecases into controllers

⚠️ IMPORTANT:

* NEVER put business logic in controllers or repositories
* NEVER use TypeORM directly inside usecases
* ALWAYS depend on interfaces (dependency inversion)

---

## 📦 Target Module

payment-provider

---

## 📥 Input DTO (domain layer)

src/domain/dtos/payment-provider.dto.ts

{
name: string;
img: string;
amount: number[];
}

Validation rules:

* name: required, unique
* img: valid URL or string
* amount: required, array of positive numbers

---

## 📤 Output Model (domain layer)

src/domain/models/payment-provider.model.ts

{
id: string;
uniqueId: string;
name: string;
img: string;
amount: number[];
isActive: boolean;
createdAt: Date;
updatedAt: Date;
}

---

## 🧠 Business Rules

1. uniqueId generation:

   * Format: PP-00001, PP-00002 (incremental)
     OR UUID (choose best practice and explain)

2. name must be UNIQUE

3. amount:

   * must be non-empty array
   * all values > 0

4. default:

   * isActive = true

---

## ⚙️ Required Usecases (src/usecases/payment-provider.usecase.ts)

Implement:

1. createPaymentProvider(dto)
2. updatePaymentProvider(id, dto)
3. togglePaymentProvider(id)
4. getPaymentProviders(query)

   * pagination (page, limit)
   * search by name (case-insensitive)
   * filter by isActive
5. getPaymentProviderDetail(id or uniqueId)

---

## 🗄 Repository Interface (domain)

src/domain/repositories/payment-provider.interface.ts

Define methods like:

* create()
* update()
* findById()
* findByUniqueId()
* findByName()
* findAll(query)
* toggleActive()

---

## 🏗 Repository Implementation (infrastructure)

src/infrastructure/repositories/payment-provider/

* Use TypeORM
* Map entity ⇄ domain model
* Add indexes:

  * name (unique)
  * uniqueId (unique)

---

## 🧾 Entity (TypeORM)

src/infrastructure/entities/payment-provider.entity.ts

Fields:

* id (uuid or object id)
* uniqueId (indexed)
* name (unique)
* img
* amount (json/array)
* isActive
* createdAt
* updatedAt

---

## 🌐 Controller Layer

src/infrastructure/controllers/payment-provider/

* REST or gRPC (based on existing project)
* No business logic
* Call usecase via proxy

Endpoints:

* POST /payment-provider
* PUT /payment-provider/:id
* PATCH /payment-provider/:id/toggle
* GET /payment-provider
* GET /payment-provider/:id

---

## 🔌 Usecase Proxy

Update:

src/infrastructure/usecases-proxy/payment-provider.usecase.proxy.ts

* Inject repository into usecase
* Export for controller usage

---

## 🧪 Extra Requirements

* Add proper error handling (NotFound, Conflict, BadRequest)
* Use async/await cleanly
* Reuse shared utils if needed
* Keep code DRY and modular
* Add comments for complex logic

---

## 🎯 Expected Output

Generate FULL code for:

1. Domain:

   * DTO
   * Model
   * Repository interface

2. Usecase:

   * Full business logic implementation

3. Infrastructure:

   * Entity
   * Repository implementation
   * Controller

4. Proxy:

   * Usecase proxy setup

---

## 🚨 Critical Rules

* Follow EXACT folder structure from the project
* Do NOT introduce new architecture
* Keep everything consistent with existing modules (e.g., generate-qr)
* Code must be production-ready and copy-paste usable

---

If something is unclear, make reasonable assumptions but stay consistent with Clean Architecture.
