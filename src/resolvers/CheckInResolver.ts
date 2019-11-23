import { Resolver, Mutation, Arg, Query, Int } from "type-graphql";
import { CheckIn } from '../entity/CheckIn';

@Resolver()
export class CheckInResolver {

  /*
  *  CREATE
  */
  @Mutation(() => Boolean)
  async createCheckIn(
    @Arg("cardId", () => Int) cardId: number,
    @Arg("userEmail", () => String) userEmail: string,
    @Arg("startDate", () => String) startDate: string,
    @Arg("endDate", () => String) endDate: string,
    @Arg("hasCheckedOut", () => Boolean) hasCheckedOut: boolean,
    @Arg("isReserved", () => Boolean) isReserved: boolean
  ) {
    try {
      await CheckIn.insert({
        cardId,
        userEmail,
        startDate,
        endDate,
        hasCheckedOut,
        isReserved
      });

      return true
    } catch(error) {
      console.error("CREATE CHECKIN:", error);
    }
    return false;
  }

  /*
  *  DELETE
  */
  @Mutation(() => Boolean)
  async deleteCheckIn(
    @Arg("checkInId", () => Int) checkInId: number
  ) {
    try {
      await CheckIn.delete({
        checkInId
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
  checkIns() {
    return CheckIn.find();
  }

  @Query(() => [CheckIn])
  userCheckIns(
    @Arg("email", () => String) userEmail: string
  ) {
    return CheckIn.find({
      userEmail
    });
  }
}