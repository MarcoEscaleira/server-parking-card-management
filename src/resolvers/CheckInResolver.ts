import { Arg, Int, Mutation, Query, Resolver } from "type-graphql";
import { CheckIn } from "../entity/CheckIn";
import { format } from "date-fns";

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
			await CheckIn.insert({
				card: {
					id: cardId
				},
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
		return await CheckIn.find({
			relations: ["card"]
		});
	}

	@Query(() => [CheckIn])
	async todayCheckIns() {
		const allCheckIns = await CheckIn.find({
			relations: ["card"]
		});

		return allCheckIns.filter(checkIn => checkIn.startDate.includes(format(new Date(), "yyyy-MM-dd")));
	}

	@Query(() => [CheckIn])
	async userCheckIns(@Arg("email", () => String) email: string) {
		return await CheckIn.find({
			relations: ["card"],
			where: {
				email
			}
		});
	}
}
