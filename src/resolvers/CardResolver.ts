import { Resolver, Mutation, Arg, Int, Query } from "type-graphql";
import { Card } from "../entity/Card";
import { CheckInResolver } from "./CheckInResolver";
import { getIsoStringDate, getISOHour } from "../utils/datesFormat";

const checkInResolver = new CheckInResolver();

const cardOptions = {
	relations: ["checkIns"]
};

@Resolver()
export class CardResolver {
	/*
	 *  CREATE
	 */
	@Mutation(() => Number)
	async createCard(@Arg("cardNumber", () => Number) number: number) {
		try {
			const allCards = await this.cards();
			let hasAlreadyCardNumber = false;

			allCards.forEach(card => {
				if (card.number === number) {
					hasAlreadyCardNumber = true;
				}
			});

			if (!hasAlreadyCardNumber) {
				await Card.insert({
					number
				});
				return number;
			}
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
					id
				},
				{
					isDisabled
				}
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
				id
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
		return Card.find(cardOptions);
	}

	@Query(() => [Card])
	async cardsEnabled() {
		return await Card.find({
			...cardOptions,
			where: {
				isDisabled: false
			}
		});
	}

	@Query(() => Number)
	async cardsAvailableNumberToday() {
		const cards = await this.cardsEnabled();
		const dateCheckIns = await checkInResolver.todayCheckIns();
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
		const allCards = await this.cardsEnabled();
		const checkIns = await checkInResolver.checkIns();
		const allDateCheckIns = checkIns.filter(checkIn => checkIn.startDate.includes(getIsoStringDate(date)));
		const mainCheckInHour = getISOHour(date);
		const notAvailableCardsId: number[] = [];

		allDateCheckIns.forEach(({ endDate, card: { id } }) => {
			const checkInFinishHour = getISOHour(endDate);
			if (checkInFinishHour > mainCheckInHour) {
				if (notAvailableCardsId.indexOf(id) === -1) {
					notAvailableCardsId.push(id);
				}
			}
		});
		return allCards.filter(card => notAvailableCardsId.indexOf(card.id) === -1);
	}
}
