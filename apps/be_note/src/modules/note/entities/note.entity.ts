import { BaseEntity } from 'src/common/entities/base.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('notes')
export class Note extends BaseEntity {
  @ManyToOne(() => User, (u) => u.notes, {
    eager: true,
  })
  user?: User;

  @Column()
  content: string;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt?: string;
}
