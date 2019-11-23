import { Resolver, Mutation, Arg, Int, Query, InputType, Field } from "type-graphql";
import { Card } from "../entity/Card";
import { CheckIn } from "../entity/CheckIn";


@InputType()
class CardInputUpdate {
  @Field(() => Int)
  cardId: number
  @Field(() => Boolean)
  isDisabled: boolean

  // @Field(() => Int, { nullable: true})
  // cardId: number | null

  // It can be undefined in this case
  // @Field(() => Int, { nullable: true})
  // cardId?: number
}


@Resolver()
export class CardResolver {

  /*
  *  CREATE
  */
  @Mutation(() => Number)
  async createCard(
    @Arg("cardNumber", () => Number) cardNumber: number
  ) {
    try {
      await Card.insert({
        cardNumber
      });

      return cardNumber;
    } catch (error) {
      console.error("CREATE CARD: ", error);
    }
    return -1;
  }

  /*
  *  UPDATE
  */
  @Mutation(() => Boolean)
  async updateCard(
    @Arg("options", () => CardInputUpdate) options: CardInputUpdate
  ) {
    try {
      const { cardId, isDisabled } = options;
      await Card.update({
        cardId
      }, {
        isDisabled
      });

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
  async deleteCard(
    @Arg("cardId", () => Int) cardId: number
  ) {
    try {
      await Card.delete({
        cardId
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
  async cardsAvailable(
    @Arg("date", () => String) date: string
  ) {
    const cards = await Card.find();
    const dateCheckins = await CheckIn.find({
      startDate: date
    });

    let counter = cards.length;

    dateCheckins.forEach((checkin) => {
      cards.forEach(card => {
        if (checkin.cardId === card.cardId) {
          counter--;
        }
      })
    });

    return counter;
  }
}