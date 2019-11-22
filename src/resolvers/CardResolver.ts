import { Resolver, Mutation, Arg, Int, Query, InputType, Field } from "type-graphql";
import { Card } from "../entity/Card";


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

  @Query(() => [Card])
  cards() {
    return Card.find();
  }
}