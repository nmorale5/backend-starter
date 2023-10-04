import { BaseDoc } from "../framework/doc";

export enum VoteStatus {
  Upvote,
  Downvote,
}
interface VoteObj extends BaseDoc {
  status: VoteStatus;
}
export default class VoteConcept<Context> {
  private votedCollection = new Map<Context, VoteStatus>();

  public setVote(vote: VoteStatus, context: Context) {
    this.votedCollection.set(context, vote);
  }

  public removeVote(context: Context) {
    this.votedCollection.delete(context);
  }

  public getVote(context: Context): VoteStatus | undefined {
    return this.votedCollection.get(context);
  }
}
