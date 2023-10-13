import DocCollection, { BaseDoc } from "../framework/doc";
import { ObjectId } from "mongodb";

export interface VoteStateDoc extends BaseDoc {
  content: ObjectId;
  user: ObjectId;
  vote: "upvote" | "downvote";
}

export default class VoteConcept {
  public readonly votes = new DocCollection<VoteStateDoc>("votedCollection");

  public async setVote(content: ObjectId, user: ObjectId, upvote: boolean) {
    await this.votes.deleteOne({ content, user });
    await this.votes.createOne({ content, user, vote: upvote ? "upvote" : "downvote" });
    return { msg: (upvote ? "Up" : "Down") + "voted!" };
  }

  public async removeVote(content: ObjectId, user: ObjectId) {
    await this.votes.deleteOne({ content, user });
    return { msg: "Vote removed!" };
  }

  public async getVotes(content: ObjectId) {
    return await this.votes.readMany({ content });
  }

  public async getUserVote(content: ObjectId, user: ObjectId) {
    const voteDoc = await this.votes.readOne({ content, user });
    return voteDoc === null ? null : voteDoc.vote;
  }
}
