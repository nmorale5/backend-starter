import FriendConcept from "./concepts/friend";
import PostConcept from "./concepts/post";
import UserConcept from "./concepts/user";
import VoteConcept from "./concepts/vote";
import WebSessionConcept from "./concepts/websession";
import TimeoutConcept from "./concepts/timeout";
import ThreadConcept from "./concepts/thread";

// App Definition using concepts
export const WebSession = new WebSessionConcept();
export const User = new UserConcept();
export const Post = new PostConcept();
export const Friend = new FriendConcept();
export const Vote = new VoteConcept();
export const Thread = new ThreadConcept();
export const Timeout = new TimeoutConcept();
