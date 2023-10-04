import { ObjectId } from "mongodb";
import { BaseDoc } from "../framework/doc";

enum NotificationType {
  Comment,
  Post,
  ThreadStart,
  ThreadEnd,
}
interface NotificationObj extends BaseDoc {
  event: NotificationType;
  related: ObjectId;
  time: Date;
}
