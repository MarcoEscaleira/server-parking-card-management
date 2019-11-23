import schedule from 'node-schedule';
import {format, subDays} from 'date-fns';
// import { sendEmail } from './sendEmail';
import { CheckIn } from "../entity/CheckIn";
import {sendEmail} from "./sendEmail";

const dateCheckIns = async (date: string) => {
  const checkIns = await CheckIn.find();
  return checkIns.filter(checkIn => checkIn.startDate.includes(date));
};

export const ScheduleTodayNight = () => {
  const rule = new schedule.RecurrenceRule();
  rule.dayOfWeek = [0, new schedule.Range(0, 6)]; // 0-6 - starting on sunday
  rule.hour = 20;
  rule.minute = 0;

  schedule.scheduleJob(rule, async () => {
    const showDate = format(new Date(),"dd-MM-yyyy");
    const checkIns = await dateCheckIns(format(new Date(),"yyyy-MM-dd"));
  
    checkIns.forEach(({ userEmail, hasCheckedOut }) => {
      if (!hasCheckedOut) {
        // Checkin still open so sending email to user
        sendEmail(
          userEmail,
          `You have a check in for ${showDate}!!!`,
          "Do not forget to do your checkout. Good night :)"
        );
      }
    });
  });
};

export const ScheduleTodayMorning = () => {
  const rule = new schedule.RecurrenceRule();
  rule.dayOfWeek = [0, new schedule.Range(0, 6)]; // 0-6 - starting on sunday
  rule.hour = 9;
  rule.minute = 0;
  
  schedule.scheduleJob(rule, async () => {
    const showDate = format(subDays(new Date, 1), "dd-MM-yyyy");
    const checkIns = await dateCheckIns(format(subDays(new Date, 1), "yyyy-MM-dd"));
  
    checkIns.forEach(({ checkInId, userEmail, hasCheckedOut }) => {
      if (!hasCheckedOut) {
        // Do checkout
        CheckIn.update({
          checkInId
        }, {
          hasExpired: true,
          hasCheckedOut: true
        });
        // Checkin still open so sending email to user to warn we are checking out
        sendEmail(
          userEmail,
          `Your check in for ${showDate} has been expired (checked out automatically)!!!`,
          "We have checked out for you. Hoping you left the card in the spot :)"
        );
      }
    });
  })
};
