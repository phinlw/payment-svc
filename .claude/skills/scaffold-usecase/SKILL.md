---
name: scaffold-usecase
description: สร้างโมดูล CRUD ใหม่ตาม Clean Architecture (proto + domain model/dto/interface + usecase + repository action/validation + controller + proxy registration + module wiring) ใน NestJS gRPC payment-svc โดยยึดตามโครงสร้างของโมดูล `payment-provider` และ `generate-qr` ที่มีอยู่ ใช้เมื่อผู้ใช้พูดว่า "scaffold โมดูลใหม่", "เพิ่ม entity/resource ใหม่", "สร้าง CRUD สำหรับ X", หรือระบุชื่อ aggregate ใหม่ที่ต้องการเพิ่มในเซอร์วิสนี้
---

# Scaffold Use Case (payment-svc)

สร้างโมดูล CRUD แบบสมบูรณ์ที่ลอกโครงสร้างของโมดูลอ้างอิง `payment-provider` แบบทีละไฟล์ โค้ดเบสนี้ใช้ Clean Architecture แบ่งเลเยอร์อย่างเคร่งครัด และใช้รูปแบบ DI ผ่าน `UseCaseProxy` ต้องสร้างไฟล์ที่เทียบเคียงครบทุกตัว

## ข้อมูลที่ต้องถามก่อน

ก่อนเขียนไฟล์ใดๆ ให้ใช้ `AskUserQuestion` ครั้งเดียวรวมคำถามต่อไปนี้:

1. **ชื่อโมดูล** ในสามรูปแบบ: `kebab-case` (เช่น `payment-method`), `camelCase` (เช่น `paymentMethod`), `PascalCase` (เช่น `PaymentMethod`), `SCREAMING_SNAKE_CASE` (เช่น `PAYMENT_METHOD`) ถ้าผู้ใช้ให้มาเพียงรูปแบบเดียว ให้แปลงเป็นรูปแบบอื่นๆ เอง
2. **ฟิลด์** ที่นอกเหนือจากฟิลด์มาตรฐาน `_id / uniqueId / isActive / createdAt / updatedAt` แต่ละฟิลด์ระบุ: ชื่อ, TS type, proto type, nullable, default
3. **Operation** ที่จะสร้าง ค่าเริ่มต้น: `create`, `update`, `delete`, `loadAll`, `loadById` หากต้องการเพิ่มอย่างอื่นต้องยืนยันก่อน
4. **ชื่อตาราง** สำหรับ TypeORM entity (snake_case เช่น `payment_method`)

ห้ามเดาฟิลด์เอง ถ้าผู้ใช้ระบุไม่ชัด ให้หยุดและถามก่อน

## ไฟล์ที่ต้องสร้าง

ใช้ตัวแทน `<kebab>`, `<camel>`, `<Pascal>`, `<UPPER>` ใช้ไฟล์อ้างอิงต่อไปนี้เป็นต้นแบบ และลอกโครงสร้างทีละบรรทัด:

- [src/_proto/payment-provider.proto](src/_proto/payment-provider.proto)
- [src/domain/dtos/payment-provider.dto.ts](src/domain/dtos/payment-provider.dto.ts)
- [src/domain/models/payment-provider.model.ts](src/domain/models/payment-provider.model.ts)
- [src/domain/repositories/payment-provider.interface.ts](src/domain/repositories/payment-provider.interface.ts)
- [src/infrastructure/entities/payment-provider.entity.ts](src/infrastructure/entities/payment-provider.entity.ts)
- [src/infrastructure/repositories/payment-provider/](src/infrastructure/repositories/payment-provider/)
- [src/usecases/payment-provider.usecase.ts](src/usecases/payment-provider.usecase.ts)
- [src/infrastructure/usecases-proxy/payment-provider.usecase.proxy.ts](src/infrastructure/usecases-proxy/payment-provider.usecase.proxy.ts)
- [src/infrastructure/controllers/payment-provider/payment-provider.controller.ts](src/infrastructure/controllers/payment-provider/payment-provider.controller.ts)

### 1. Proto — `src/_proto/<kebab>.proto`
- `package <camel>;`
- `import "common.proto";`
- Service `<Pascal>Service` มี 5 RPC: `<Pascal>Create / Update / Delete / LoadAll / LoadById`
- Request ของ `LoadAll` ใช้ `common.QueryString`
- จองหมายเลข proto field สำหรับคอลัมน์พื้นฐานให้คงที่: `_id = 100`, `uniqueId = 101`, `isActive = 102`, `createdAt = 103`, `updatedAt = 104` ฟิลด์ของผู้ใช้เริ่มที่ `1`
- ประกาศ `Response<Pascal>Model`, คู่ `Request/Response` ทั้งสี่ชุด, และ `LoadAll<Pascal>Response { repeated Response<Pascal>Model items = 1; int32 total = 2; }`

### 2. Domain DTO — `src/domain/dtos/<kebab>.dto.ts`
- ใช้ `class-validator` + `@nestjs/swagger` `ApiProperty` ลอกตามไฟล์อ้างอิง

### 3. Domain models — `src/domain/models/<kebab>.model.ts`
- `<Pascal>Model extends DefaultModel` พร้อมฟิลด์ของผู้ใช้
- `Response<Pascal>Model extends <Pascal>Model {}`
- `Create<Pascal>Request`, `Create<Pascal>Response extends Response<Pascal>Model`
- `Update<Pascal>Request` (ทุกฟิลด์ optional ยกเว้น `_id: string`), `Update<Pascal>Response extends Response<Pascal>Model`
- `Delete<Pascal>Request { _id: string }`, `Delete<Pascal>Response { _id: string }`
- `LoadAll<Pascal>Request { name: string }` (ตามต้นแบบจริง — provider เก็บ field นี้แม้ไม่ใช้)
- `LoadAll<Pascal>Response { items: Response<Pascal>Model[]; total: number; }`
- `LoadById Request/Response` ของชื่อใหม่

### 4. Domain repository interface — `src/domain/repositories/<kebab>.interface.ts`
ลอกจาก `payment-provider.interface.ts` ทุกเมธอดรับ `Metadata?` และ `loadAll(query: QueryProps, metadata?)`

### 5. Infrastructure entity — `src/infrastructure/entities/<kebab>.entity.ts`
- `@Entity({ name: '<snake_case_table>' })`
- `@Column("varchar", { length: 50, nullable: true }) _id: string;`
- `@PrimaryGeneratedColumn({ type: "integer" }) uniqueId: number;`
- คอลัมน์ของผู้ใช้
- `@Column({ default: true }) isActive: boolean;`
- คอลัมน์ `timestamp` สองตัว ใช้ `default: () => 'CURRENT_TIMESTAMP'`

### 6. Repository implementation — `src/infrastructure/repositories/<kebab>/`
สร้างไฟล์หลัก `<kebab>.repository.ts` พร้อมโฟลเดอร์ย่อย 5 โฟลเดอร์ (หนึ่งโฟลเดอร์ต่อหนึ่ง operation) แต่ละโฟลเดอร์มี `<op><Pascal>.action.ts` และ `<op><Pascal>.validation.ts` operation ที่เปลี่ยนแปลงข้อมูลต้องห่อด้วย `handleGrpcOperation` + transaction จาก `dataSource.createQueryRunner()` ส่วน `loadAll` ห้ามใช้ `handleGrpcOperation` Inject `DataSource` + `@InjectRepository(<Pascal>Entity)`

โครง action:
- คลาส extends domain model
- มีเมธอด `validateAndBuildParams`, `prepare<Pascal>Model`, `persist<Pascal>`, `buildResponse`
- ใช้ `_ID()` จาก `@shared/utils/base.util` สำหรับ `_id`

โครง validation:
- คลาส extends request model
- เรียก `buildParams` จากนั้น `validateParams` โดยใช้ `validateMultiple` + `validateText` จาก `@shared/utils/base.util`

### 7. Usecase — `src/usecases/<kebab>.usecase.ts`
- `abstract class Base<Pascal>Usecase` ถือ `LoggerInterface` + `<Pascal>Interface` พร้อมเมธอด `logExecution`
- คลาสรูปธรรม 5 ตัว `LoadAll` คืน list ตรงๆ ส่วนอีก 4 ตัวต้อง throw error เมื่อ repo คืน null

### 8. Proxy — `src/infrastructure/usecases-proxy/<kebab>.usecase.proxy.ts`
- คลาส `<Pascal>UsecaseProxy` มี `providers()` คืน `useFactory` 5 ตัว แต่ละตัว `inject: [LoggerService, <Pascal>RepoImpl]`
- ห่อแต่ละ usecase ด้วย `new UseCaseProxy(...)`

### 9. ลงทะเบียนใน `src/infrastructure/usecases-proxy/usecases-proxy.module.ts`
- เพิ่ม static token 5 ตัว: `POST_CREATE_<UPPER>_USECASE_PROXY` ฯลฯ
- spread `...new <Pascal>UsecaseProxy().providers()` ใน `register().providers`
- เพิ่ม token ทั้ง 5 ใน `exports`

### 10. Controller — `src/infrastructure/controllers/<kebab>/<kebab>.controller.ts`
- `@UseGuards(APIGrpcGuard)` + `@Controller('<camel>')`
- Inject proxy ทั้ง 5 ผ่าน static token
- เมธอด `@GrpcMethod("<Pascal>Service", "<Pascal>Create"|...)` 5 ตัว เรียก `proxy.getInstance().execute(params, metadata)`

### 11. ลงทะเบียน controller — `src/infrastructure/controllers/controllers.module.ts`
- import และเพิ่ม `<Pascal>Controller` ใน array `controllers`

### 12. ลงทะเบียน repository — `src/infrastructure/repositories/repositories.module.ts`
- import `<Pascal>RepoImpl` และ `<Pascal>Entity`
- เพิ่ม entity ใน `TypeOrmModule.forFeature([...])`
- เพิ่ม repo impl ทั้งใน `providers` และ `exports`

### 13. ลงทะเบียน proto ใน bootstrap — `src/main.ts`
- เพิ่ม `"<camel>"` ใน array `package`
- เพิ่ม `join(__dirname, './_proto/<kebab>.proto')` ใน `protoPath`

## ข้อกำหนดที่ต้องรักษา

- Path alias: `@domain/...`, `@infrastructure/...`, `@usecases/...`, `@shared/...`, `@/...` ห้ามใช้ relative path ลึกๆ
- ใช้ `pnpm` (lockfile คือ `pnpm-lock.yaml`) ห้ามเรียก `npm` หรือ `yarn`
- คงคอมเมนต์ `eslint-disable` ที่หัวไฟล์ `main.ts` และ `controllers.module.ts` เมื่อแก้ไฟล์เหล่านี้
- ห้าม auto-format โค้ดรอบๆ ในโมดูลอ้างอิง

## ขั้นตอนทำงาน

1. รวบรวม input จากผู้ใช้
2. ใช้ TodoWrite เพื่อติดตามไฟล์ทั้ง 13 รายการ
3. อ่านไฟล์อ้างอิงของ `payment-provider` ก่อนเขียนไฟล์ใหม่ทุกครั้ง — ลอกโครงสร้างก่อน แล้วค่อยเปลี่ยนชื่อและฟิลด์
4. หลังสร้างไฟล์ครบ ให้รัน `pnpm run build` เพื่อตรวจ TS / path alias error แก้ให้ผ่านก่อนรายงานว่าเสร็จ
5. ห้าม start server, รัน migration, หรือ commit เว้นแต่ผู้ใช้สั่ง

## ไม่อยู่ในขอบเขต (อย่าทำเว้นแต่ผู้ใช้สั่ง)

- Database migration
- HTTP/REST controller — เซอร์วิสนี้ใช้ gRPC อย่างเดียว
- เทสต์ — โมดูลอ้างอิงไม่มีไฟล์ spec ห้ามสร้างเอง
- แก้ `README.md` หรือ `prompt/modify-service.md`
