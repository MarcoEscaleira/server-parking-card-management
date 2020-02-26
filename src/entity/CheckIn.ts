import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, JoinColumn, ManyToOne } from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { Card } from "./Card";

@ObjectType()
@Entity()
export class CheckIn extends BaseEntity {
	@Field()
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	cardId: number;
	@Field(() => Card)
	@ManyToOne(
		() => Card,
		card => card.checkIns
	)
	@JoinColumn({ name: "cardId" })
	card: Card;

	@Field()
	@Column()
	email: string;

	@Field()
	@Column()
	date: string;

	@Field()
	@Column()
	occupation: string;

	@Field()
	@Column("boolean", { default: false })
	hasCheckedOut: boolean;

	@Field()
	@Column("boolean", { default: false })
	hasExpired: boolean;

	@Field()
	@Column("boolean", { default: false })
	isReserved: boolean;
}
