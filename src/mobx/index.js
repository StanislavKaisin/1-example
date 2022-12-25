import {
  flow,
  makeAutoObservable,
  makeObservable,
  observable,
  onBecomeObserved,
} from "mobx";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import api from "../shared/api";
import { NewPost } from "../shared/components/NewPost";
import { Posts } from "../shared/components/Posts";
import { User } from "../shared/components/User";

class UserStore {
  name = "";
  id = "";
  constructor() {
    makeObservable(this, {
      name: observable,
      id: observable,
      fetch: flow.bound,
    });
    onBecomeObserved(this, "name", this.fetch);
  }
  *fetch() {
    const response = yield api.getMe();
    this.name = response.name;
    this.id = response.id;
  }
}

class PostStore {
  id;
  title = "";
  text = "";
  authorId = -1;

  constructor({ id, title, text, authorId }) {
    makeAutoObservable(
      this,
      {},
      {
        autoBind: true,
      }
    );

    this.id = id;
    this.title = title;
    this.text = text;
    this.authorId = authorId;
  }
  updateText(text) {
    this.text = text;
  }
}

class PostsStore {
  list = [];
  constructor() {
    makeAutoObservable(
      this,
      {},
      {
        autoBind: true,
      }
    );
    onBecomeObserved(this, "list", this.fetch);
  }
  *fetch() {
    const response = yield api.getPosts();
    this.list = response.map((post) => new PostStore(post));
  }
  // addPost(payload) {
  //   this.list.push(new PostStore(payload));
  // }
  *addPost(payload) {
    yield api.addPost(payload);
    yield this.fetch();
  }
  *deletePost(id) {
    yield api.removePost(id);
    const postIndex = this.list.findIndex((p) => p.index === id);
    this.list.splice(postIndex, 1);
  }
}

const user = new UserStore();
const posts = new PostsStore();

const ObservablePosts = observer(Posts);

const MobxApp = observer(() => {
  // useEffect(() => {
  //   users.fetch();
  // }, []);
  // const { id, name } = users;
  // console.log("users:>>", users);
  // console.log("posts:>>", posts);
  // console.log("posts.list :>>", posts.list);

  return (
    <div>
      {/* {id}
      {name} */}
      <User name={user.name} />
      <NewPost
        onCreate={(postPayload) => {
          posts.addPost({
            authorId: user.id,
            ...postPayload,
          });
        }}
      />
      <ObservablePosts
        data={posts.list}
        onRemove={(id) => {
          posts.deletePost(id);
        }}
        onEdit={(id, text) => {
          const post = posts.list.find((post) => post.id === id);
          post.updateText(text);
        }}
      />
    </div>
  );
});

export default function MobxWay() {
  return <MobxApp />;
}
