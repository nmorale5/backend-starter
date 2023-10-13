import { ObjectId } from "mongodb";
import { BaseDoc } from "../framework/doc";
import PostConcept from "./post";
import UserConcept from "./user";

interface Post extends BaseDoc {
  user: UserConcept;
  posts: Set<PostConcept>;
  followers: Set<ObjectId>;
  following: Set<ObjectId>;
}
