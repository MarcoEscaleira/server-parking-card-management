import { Arg, Int, Mutation, Query, Resolver } from "type-graphql";
import { CheckIn } from "../entity/CheckIn";
import { getIsoStringDate, yearFirstDate } from "../utils/datesFormat";

const checkInOptions = {
	relations: ["card"]
};

@Resolver()
export class CheckInResolver {
	/*
	 *  CREATE
	 */
	@Mutation(() => Boolean)
	async createCheckIn(
		@Arg("cardId", () => Int) cardId: number,
		@Arg("email", () => String) email: string,
		@Arg("startDate", () => String) startDate: string,
		@Arg("endDate", () => String) endDate: string,
		@Arg("isReserved", () => Boolean) isReserved = false
	) {
		try {
			const userCheckIns = await this.userCheckIns(email);
			const newCheckInDate = getIsoStringDate(startDate);

			// Verifying if user has a checkIn for this date
			const userHasCheckInToday = userCheckIns.find(checkIn => getIsoStringDate(checkIn.startDate) === newCheckInDate);

			// User has a checkIn for the entered date
			if (userHasCheckInToday) return false;

			await CheckIn.insert({
				cardId,
				email,
				startDate,
				endDate,
				isReserved
			});
			return true;
		} catch (error) {
			console.error("CREATE CHECKIN:", error);
		}
		return false;
	}

	/*
	 *  UPDATE
	 */
	@Mutation(() => Boolean)
	async updateCheckIn(@Arg("id", () => Int) id: number, @Arg("hasCheckedOut", () => Boolean) hasCheckedOut: boolean) {
		try {
			await CheckIn.update(
				{ id },
				{
					hasCheckedOut
				}
			);

			return true;
		} catch (error) {
			console.error("UPDATE CHECKIN:", error);
		}
		return false;
	}

	/*
	 *  DELETE
	 */
	@Mutation(() => Boolean)
	async deleteCheckIn(@Arg("id", () => Int) id: number) {
		try {
			await CheckIn.delete({
				id
			});
			return true;
		} catch (error) {
			console.error("DELETE CHECK IN: ", error);
		}
		return false;
	}

	/*
	 *  READ
	 */
	@Query(() => [CheckIn])
	async checkIns() {
		return await CheckIn.find(checkInOptions);
	}

	@Query(() => [CheckIn])
	async todayCheckIns() {
		const allCheckIns = await CheckIn.find(checkInOptions);

		return allCheckIns.filter(checkIn => checkIn.startDate.includes(yearFirstDate()));
	}

	@Query(() => [CheckIn])
	async userCheckIns(@Arg("email", () => String) email: string) {
		return await CheckIn.find({
			...checkInOptions,
			where: {
				email
			}
		});
	}
}
