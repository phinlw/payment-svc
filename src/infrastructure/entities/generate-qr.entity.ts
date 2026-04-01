import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum GenerateQrStatus {
  PENDING = 'PENDING',
  COMPLETE = 'COMPLETE',
  CANCEL = 'CANCEL',
}

@Entity({
  name: 'generate_rq',
})
export class GenerateQrEntity {
  @Column("varchar", { length: 50, nullable: true })
  _id: string;

  @PrimaryGeneratedColumn({ type: "integer" })
  uniqueId: number;

  @Column()
  userId: string;

  @Column({ nullable: true })
  qrType: string;

  @Column({ nullable: true })
  platformType: string;

  @Column({ nullable: true })
  merchantId: string;

  @Column({ nullable: true })
  terminalId: string;

  @Column({ nullable: true })
  promotionCode: string;

  @Column({ nullable: true })
  expiryTime: string;

  @Column({ nullable: true })
  makeTxnTime: string;

  @Column({ type: 'decimal' })
  amount: number;

  @Column({ nullable: true })
  currency: string;

  @Column({ nullable: true })
  ref1: string;

  @Column({ nullable: true })
  ref2: string;

  @Column({ nullable: true })
  ref3: string;

  @Column({ nullable: true })
  mobileNum: string;

  @Column({ type: 'jsonb', nullable: true })
  deeplinkMetaData: any;

  @Column({ nullable: true })
  metadata: string;

  @Column({ type: 'varchar', default: GenerateQrStatus.PENDING })
  status: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}