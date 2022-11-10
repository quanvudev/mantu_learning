import { Auth } from 'src/modules/auth/entities/auth.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  authId: number;

  @Column()
  name: string;

  @ManyToOne(() => Auth, (a) => a.users)
  auth: Auth;
}
