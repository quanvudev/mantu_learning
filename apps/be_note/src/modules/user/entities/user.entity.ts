import { BaseEntity } from 'src/common/entities/base.entity';
import { Auth } from 'src/modules/auth/entities/auth.entity';
import { Note } from 'src/modules/note/entities/note.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
  @Column()
  authId: number;

  @Column()
  name: string;

  @ManyToOne(() => Auth, (a) => a.users)
  auth: Auth;

  @OneToMany(() => Note, (n) => n.user)
  notes: Note[];
}
