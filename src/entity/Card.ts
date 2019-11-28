import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";
import { CheckIn } from "./CheckIn";

@ObjectType()
@Entity()
export class Card extends BaseEntity {
	@Field(() => Int)
	@PrimaryGeneratedColumn()
	id: number;

	@Field(() => Int)
	@Column()
	number: number;

	@Field()
	@Column("boolean", { default: false })
	isDisabled: boolean;

	@Field(() => [CheckIn])
	@OneToMany(
		() => CheckIn,
		checkin => checkin.card
	)
	checkIns: CheckIn[];
}
