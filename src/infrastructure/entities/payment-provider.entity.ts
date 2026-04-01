import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({
  name: 'payment_provider',
})
export class PaymentProviderEntity {
  @Column("varchar", { length: 50, nullable: true })
  _id: string;

  @PrimaryGeneratedColumn({ type: "integer" })
  uniqueId: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  img: string;

  @Column({ type: 'jsonb', default: [] })
  amount: number[];

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}