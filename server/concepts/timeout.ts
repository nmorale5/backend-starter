import DocCollection, { BaseDoc } from "../framework/doc";
import { ObjectId } from "mongodb";

export interface TimeoutDoc extends BaseDoc {
  content: ObjectId;
  deadline: Date;
}

export default class TimeoutConcept {
  public resources = new DocCollection<TimeoutDoc>("resources");

  public async setTimeout(content: ObjectId, deadline: Date) {
    await this.resources.deleteOne({ content });
    await this.resources.createOne({ content, deadline });
    return { msg: "Timeout set!" };
  }

  public async getDeadline(content: ObjectId) {
    return (await this.resources.readOne({ content }))?.deadline;
  }

  public async isActive(content: ObjectId) {
    const deadline = await this.getDeadline(content);
    return deadline ? deadline < new Date(Date.now()) : undefined;
  }
}
