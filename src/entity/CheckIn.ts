import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, JoinColumn } from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { Card } from "./Card";

@ObjectType()
@Entity()
export class CheckIn extends BaseEntity {
	@Field()
	@PrimaryGeneratedColumn()
	id: number;

	@Field()
	@OneToOne(() => Card)
	@JoinColumn()
	card: Card;

	@Field()
	@Column()
	email: string;

	@Field()
	@Column()
	startDate: string;

	@Field()
	@Column()
	endDate: string;

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
