import EventModel from "../models/event.model";

export async function findEventById(eventId: string) {
  const event = await EventModel.findById(eventId);

  if (!event) throw new Error("Event not found");

  return event;
}
