import cron from "node-cron";
import EventModel from "../models/event.model";

const isEventCompleted = (eventDate: Date, eventTime: string): boolean => {
  try {
    const now = new Date();

    const timeMatch = eventTime.match(
      /^(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})$/
    );

    if (!timeMatch) {
      console.log(`Invalid time format: ${eventTime}`);
      return false;
    }

    const endHour = parseInt(timeMatch[3], 10);
    const endMinute = parseInt(timeMatch[4], 10);

    const eventEndTime = new Date(eventDate);
    eventEndTime.setHours(endHour, endMinute, 0, 0);

    return now > eventEndTime;
  } catch (error) {
    console.error("Error checking event completion:", error);
    return false;
  }
};

const updateCompletedEvents = async () => {
  try {
    const activeEvents = await EventModel.find({ status: "active" });

    if (activeEvents.length === 0) {
      console.log("No active events found");
      return;
    }

    const eventsToComplete = [];

    for (const event of activeEvents) {
      if (isEventCompleted(event.date, event.time)) {
        eventsToComplete.push(event._id);
      }
    }

    if (eventsToComplete.length === 0) {
      return;
    }

    const result = await EventModel.updateMany(
      { _id: { $in: eventsToComplete } },
      { status: "completed" }
    );
  } catch (error) {
    console.error("Error updating completed events:", error);
  }
};

const eventCron = () => {
  cron.schedule("*/15 * * * *", () => {
    //   cron.schedule("* * * * *", () => {
    updateCompletedEvents();
  });

  updateCompletedEvents();

  console.log("Event completion check scheduled every 15 minutes");
};

export default eventCron;
