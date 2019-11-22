import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class Card extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  cardId: number;

  @Field(() => Int)
  @Column()
  cardNumber: number;

  @Field()
  @Column('boolean', { default: false })
  isDisabled: boolean;
}
