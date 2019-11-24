import { Resolver, Mutation, Arg, Int, Query } from "type-graphql";
import { Card } from "../entity/Card";
import { CheckIn } from "../entity/CheckIn";

@Resolver()
export class CardResolver {
	/*
	 *  CREATE
	 */
	@Mutation(() => Number)
	async createCard(@Arg("cardNumber", () => Number) number: number) {
		try {
			await Card.insert({
				number,
			});

			return number;
		} catch (error) {
			console.error("CREATE CARD: ", error);
		}
		return -1;
	}

	/*
	 *  UPDATE
	 */
	@Mutation(() => Boolean)
	async updateCard(@Arg("id", () => Int) id: number, @Arg("isDisabled", () => Boolean) isDisabled: boolean) {
		try {
			await Card.update(
				{
					id,
				},
				{
					isDisabled,
				},
			);

			return true;
		} catch (error) {
			console.error("UPDATE CARD: ", error);
		}
		return false;
	}

	/*
	 *  DELETE
	 */
	@Mutation(() => Boolean)
	async deleteCard(@Arg("id", () => Int) id: number) {
		try {
			await Card.delete({
				id,
			});

			return true;
		} catch (error) {
			console.error("DELETE CARD: ", error);
		}
		return false;
	}

	/*
	 *  READ
	 */
	@Query(() => [Card])
	cards() {
		return Card.find();
	}

	@Query(() => Number)
	async cardsAvailableNumber(@Arg("date", () => String) date: string) {
		const cards = await Card.find({
			isDisabled: false,
		});
		const checkIns = await CheckIn.find({
			relations: ["card"],
		});
		const dateCheckIns = checkIns.filter(checkIn => checkIn.startDate.includes(date));
		let counter = cards.length;

		dateCheckIns.forEach(checkin => {
			cards.forEach(card => {
				if (checkin.card.id === card.id) {
					counter--;
				}
			});
		});
		return counter;
	}

	@Query(() => [Card])
	async cardsAvailableList(@Arg("date", () => String) date: string) {
		const allCards = await Card.find({
			isDisabled: false,
		});
		const checkIns = await CheckIn.find();
		const allDateCheckIns = checkIns.filter(checkIn => checkIn.startDate.includes(date.split("T")[0]));
		const mainCheckInHour = date.split("T")[1].split("Z")[0];
		const notAvailableCardsId: number[] = [];

		allDateCheckIns.forEach(checkIn => {
			const checkInFinishHour = checkIn.endDate.split("T")[1].split("Z")[0];
			if (checkInFinishHour > mainCheckInHour) {
				if (notAvailableCardsId.indexOf(checkIn.card.id) === -1) {
					notAvailableCardsId.push(checkIn.card.id);
				}
			}
		});
		return allCards.filter(card => notAvailableCardsId.indexOf(card.id) === -1);
	}
}
