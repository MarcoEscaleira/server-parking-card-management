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
  async cardsAvailableNumber(
    @Arg("date", () => String) date: string
  ) {
    const cards = await Card.find({
      isDisabled: false
    });
    const checkIns = await CheckIn.find();
    const dateCheckIns = checkIns.filter(checkIn => checkIn.startDate.includes(date));
    let counter = cards.length;
    
    dateCheckIns.forEach((checkin) => {
      cards.forEach(card => {
        if (checkin.cardId === card.cardId) {
          counter--;
        }
      })
    });
    return counter;
  }
  
  @Query(() => [Card])
  async cardsAvailableList(
    @Arg("date", () => String) date: string
  ) {
    const allCards = await Card.find({
      isDisabled: false
    });
    const checkIns = await CheckIn.find();
    const allDateCheckIns = checkIns.filter(checkIn => checkIn.startDate.includes(date.split('T')[0]));
    const mainCheckInHour = date.split('T')[1].split('Z')[0];
    let notAvailableCardsId: number[] = [];
    
    allDateCheckIns.forEach(checkIn => {
      const checkInFinishHour = checkIn.endDate.split('T')[1].split('Z')[0];
      if (checkInFinishHour > mainCheckInHour) {
          if (notAvailableCardsId.indexOf(checkIn.cardId) === -1) {
            notAvailableCardsId.push(checkIn.cardId);
          }
      }
    });
    return allCards.filter((card => notAvailableCardsId.indexOf(card.cardId) === -1));
  }
}
