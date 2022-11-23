import { BaseEntity } from 'src/common/entities/base.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Column, Entity, OneToMany } from 'typeorm';

export enum AuthProvider {
  DEFAULT = 'APP',
  GOOGLE = 'GOOGLE',
}

@Entity('auths')
export class Auth extends BaseEntity {
  @Column({
    type: 'enum',
    enum: AuthProvider,
    default: AuthProvider.DEFAULT,
  })
  provider: string;

  @Column()
  username: string;

  @Column({ nullable: true })
  password?: string;

  @OneToMany(() => User, (user) => user.auth)
  users: User[];
}
