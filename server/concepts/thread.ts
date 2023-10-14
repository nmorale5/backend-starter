import DocCollection, { BaseDoc } from "../framework/doc";
import { ObjectId } from "mongodb";
import { NotFoundError } from "./errors";

export interface ThreadParentDoc extends BaseDoc {
  content: ObjectId;
}

export interface ThreadLinkDoc extends BaseDoc {
  parent: ObjectId;
  content: ObjectId;
}

export default class ThreadConcept {
  public readonly threadParents = new DocCollection<ThreadParentDoc>("threadHeads");
  public readonly threads = new DocCollection<ThreadLinkDoc>("threads");

  public async createThread(content: ObjectId) {
    return await this.threadParents.createOne({ content: content as ObjectId });
  }

  public async linkToThread(content: ObjectId, parent: ObjectId) {
    console.log(content, typeof content);
    console.log(parent, typeof parent);
    let msg: string;
    if (await this.threads.readOne({ content, parent })) {
      msg = "Already linked to thread!";
    } else {
      await this.threads.createOne({ content, parent });
      msg = "Linked to thread!";
    }
    return { msg, thread: await this.threads.readOne({ content, parent }) };
  }

  public async getParent(content: ObjectId) {
    const parent = (await this.threads.readOne({ content }))?.parent;
    if (!parent) {
      throw new NotFoundError("Parent not found");
    }
    return parent;
  }

  public async getAllThreads() {
    return await this.threads.readMany({});
  }

  public async getAllFromThread(parent: ObjectId) {
    return await this.threads.readMany({ parent });
  }

  public async getAllThreadsFromCreator(creator: ObjectId) {
    return await this.threadParents.readMany({ creator });
  }

  public async removeFromThread(content: ObjectId, parent: ObjectId) {
    await this.threads.deleteOne({ content, parent });
    return { msg: "Removed from thread!" };
  }

  public async deleteThread(parent: ObjectId) {
    await this.threadParents.deleteOne({ _id: parent });
    await this.threads.deleteMany({ parent });
    return { msg: "Deleted Thread!" };
  }
}
