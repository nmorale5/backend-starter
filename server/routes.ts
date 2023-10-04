import { ObjectId } from "mongodb";

import { Router, getExpressRouter } from "./framework/router";

import { Friend, Post, User, Vote, WebSession } from "./app";
import { PostDoc, PostOptions } from "./concepts/post";
import { UserDoc } from "./concepts/user";
import { VoteStatus } from "./concepts/vote";
import { WebSessionDoc } from "./concepts/websession";
import Responses from "./responses";

class Routes {
  @Router.get("/session")
  async getSessionUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await User.getUserById(user);
  }

  @Router.get("/users")
  async getUsers() {
    return await User.getUsers();
  }

  @Router.get("/users/:username")
  async getUser(username: string) {
    return await User.getUserByUsername(username);
  }

  @Router.post("/users")
  async createUser(session: WebSessionDoc, username: string, password: string) {
    WebSession.isLoggedOut(session);
    return await User.create(username, password);
  }

  @Router.patch("/users")
  async updateUser(session: WebSessionDoc, update: Partial<UserDoc>) {
    const user = WebSession.getUser(session);
    return await User.update(user, update);
  }

  @Router.delete("/users")
  async deleteUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    WebSession.end(session);
    return await User.delete(user);
  }

  @Router.post("/login")
  async logIn(session: WebSessionDoc, username: string, password: string) {
    const u = await User.authenticate(username, password);
    WebSession.start(session, u._id);
    return { msg: "Logged in!" };
  }

  @Router.post("/logout")
  async logOut(session: WebSessionDoc) {
    WebSession.end(session);
    return { msg: "Logged out!" };
  }

  @Router.get("/posts")
  async getPosts(author?: string) {
    let posts;
    if (author) {
      const id = (await User.getUserByUsername(author))._id;
      posts = await Post.getByAuthor(id);
    } else {
      posts = await Post.getPosts({});
    }
    return Responses.posts(posts);
  }

  @Router.post("/posts")
  async createPost(session: WebSessionDoc, content: string, options?: PostOptions) {
    const user = WebSession.getUser(session);
    const created = await Post.create(user, content, options);
    return { msg: created.msg, post: await Responses.post(created.post) };
  }

  @Router.patch("/posts/:_id")
  async updatePost(session: WebSessionDoc, _id: ObjectId, update: Partial<PostDoc>) {
    const user = WebSession.getUser(session);
    await Post.isAuthor(user, _id);
    return await Post.update(_id, update);
  }

  @Router.delete("/posts/:_id")
  async deletePost(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    await Post.isAuthor(user, _id);
    return Post.delete(_id);
  }

  @Router.get("/friends")
  async getFriends(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await User.idsToUsernames(await Friend.getFriends(user));
  }

  @Router.delete("/friends/:friend")
  async removeFriend(session: WebSessionDoc, friend: string) {
    const user = WebSession.getUser(session);
    const friendId = (await User.getUserByUsername(friend))._id;
    return await Friend.removeFriend(user, friendId);
  }

  @Router.get("/friend/requests")
  async getRequests(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await Responses.friendRequests(await Friend.getRequests(user));
  }

  @Router.post("/friend/requests/:to")
  async sendFriendRequest(session: WebSessionDoc, to: string) {
    const user = WebSession.getUser(session);
    const toId = (await User.getUserByUsername(to))._id;
    return await Friend.sendRequest(user, toId);
  }

  @Router.delete("/friend/requests/:to")
  async removeFriendRequest(session: WebSessionDoc, to: string) {
    const user = WebSession.getUser(session);
    const toId = (await User.getUserByUsername(to))._id;
    return await Friend.removeRequest(user, toId);
  }

  @Router.put("/friend/accept/:from")
  async acceptFriendRequest(session: WebSessionDoc, from: string) {
    const user = WebSession.getUser(session);
    const fromId = (await User.getUserByUsername(from))._id;
    return await Friend.acceptRequest(fromId, user);
  }

  @Router.put("/friend/reject/:from")
  async rejectFriendRequest(session: WebSessionDoc, from: string) {
    const user = WebSession.getUser(session);
    const fromId = (await User.getUserByUsername(from))._id;
    return await Friend.rejectRequest(fromId, user);
  }

  // view all notifications for the user in the current session
  @Router.get("/notifications")
  async getNotifications(session: WebSessionDoc) {
    throw new Error("Not implemented yet");
  }

  // post the notification event so that other users can see the notification in their notification board
  @Router.put("/notifications/:eventData")
  async postNotificationEvent(session: WebSessionDoc, eventData: string) {
    throw new Error("Not implemented yet");
  }

  // determine whether the given post has been voted, and return the type of vote
  @Router.get("/vote/status/:post")
  async getVoteStatus(session: WebSessionDoc, post: ObjectId) {
    Vote.getVote(post);
  }

  // upvote a post. Also removes a downvote if one exists for this user
  @Router.put("/vote/upvote/:post")
  async sendUpvote(session: WebSessionDoc, post: ObjectId) {
    Vote.setVote(VoteStatus.Upvote, post);
  }

  // downvote a post. Also removes an upvote if one exists for this user
  @Router.put("/vote/downvote/:post")
  async sendDownvote(session: WebSessionDoc, post: ObjectId) {
    Vote.setVote(VoteStatus.Downvote, post);
  }

  // remove the vote status (i.e., an upvote or downvote) on a post
  @Router.put("/vote/unvote/:post")
  async sendUnvote(session: WebSessionDoc, post: ObjectId) {
    Vote.removeVote(post);
  }

  // get all existing threads
  @Router.get("/thread")
  async getThreads(session: WebSessionDoc) {
    throw new Error("Not implemented yet");
  }

  // create a new thread
  @Router.post("/thread")
  async createThread(session: WebSessionDoc, content: string) {
    throw new Error("Not implemented yet");
  }

  // add the given post to the given thread
  @Router.put("/thread/:thread/:post")
  async addThread(session: WebSessionDoc, thread: ObjectId, post: ObjectId) {
    throw new Error("Not implemented yet");
  }

  // deletes a thread
  @Router.delete("/thread/:thread")
  async deleteThread(session: WebSessionDoc, thread: ObjectId) {
    throw new Error("Not implemented yet");
  }
}

export default getExpressRouter(new Routes());
