import { BaseDoc } from "../framework/doc";

interface ThreadObj<Context> extends BaseDoc {
  context: Context;
}
