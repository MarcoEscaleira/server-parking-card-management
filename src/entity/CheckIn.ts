import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class CheckIn extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  checkInId: number;

  @Field(() => Int)
  @Column()
  cardId: number;

  @Field()
  @Column()
  userEmail: string;

  @Field()
  @Column()
  startDate: string;

  @Field()
  @Column()
  endDate: string;

  @Field()
  @Column('boolean', { default: false })
  hasCheckedOut: boolean;
  
  @Field()
  @Column('boolean', { default: false })
  hasExpired: boolean;

  @Field()
  @Column('boolean', { default: false })
  isReserved: boolean;
}
