import { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import api from "../shared/api";
import { NewPost } from "../shared/components/NewPost";
import { Posts } from "../shared/components/Posts";
import { User } from "../shared/components/User";

const userState = {
  data: {},
  loading: false,
  error: null,
};

const fetchUsers = () => async (dispatch) => {
  dispatch({ type: "LOAD_USER_START" });
  try {
    const response = await api.getMe();
    dispatch({ type: "LOAD_USER_SUCCESS", payload: response });
  } catch (e) {
    dispatch({ type: "LOAD_USER_FAILURE", payload: e });
  }
};

export function userReducer(state = userState, action) {
  switch (action.type) {
    case "LOAD_USER_START": {
      return {
        ...state,
        loading: true,
        error: null,
        data: {},
      };
    }
    case "LOAD_USER_SUCCESS": {
      return {
        ...state,
        loading: false,
        error: null,
        data: action.payload,
      };
    }
    case "LOAD_USER_FAILURE": {
      return {
        ...state,
        loading: false,
        error: action.payload,
        data: {},
      };
    }

    default:
      return { ...state };
  }
}

const currentUserSelector = (state) => state.user.data;

const postState = {
  data: [],
  loading: false,
  error: null,
};

export function postsReducer(state = postState, action) {
  switch (action.type) {
    case "LOAD_POSTS_START": {
      return {
        ...state,
        loading: true,
        error: null,
        // data: [],
      };
    }
    case "LOAD_POSTS_SUCCESS": {
      return {
        ...state,
        loading: false,
        error: null,
        data: action.payload,
      };
    }
    case "LOAD_POSTS_FAILURE": {
      return {
        ...state,
        loading: false,
        error: action.payload,
        data: [],
      };
    }
    case "REMOVE_POST": {
      return {
        ...state,

        data: state.data.filter((post) => post.id !== action.payload),
      };
    }
    case "EDIT_POST": {
      return {
        ...state,
        data: state.data.map((post) => {
          if (post.id === action.payload.id) {
            return {
              ...post,
              text: action.payload.text,
            };
          } else return post;
        }),
      };
    }

    default:
      return { ...state };
  }
}

const fetchPosts = () => async (dispatch) => {
  dispatch({ type: "LOAD_POSTS_START" });
  try {
    const response = await api.getPosts();
    dispatch({ type: "LOAD_POSTS_SUCCESS", payload: response });
  } catch (e) {
    dispatch({ type: "LOAD_POSTS_FAILURE", payload: e });
  }
};

const createNewPost = (newPostData) => async (dispatch) => {
  dispatch({ type: "LOAD_POSTS_START" });
  try {
    await api.addPost(newPostData);
    await dispatch(fetchPosts());
  } catch (e) {
    dispatch({ type: "LOAD_POSTS_FAILURE", payload: e });
  }
};

const removePost = (id) => async (dispatch) => {
  dispatch({ type: "LOAD_POSTS_START" });
  try {
    await api.removePost(id);
    dispatch({ type: "REMOVE_POST", payload: id });
  } catch (e) {
    dispatch({ type: "LOAD_POSTS_FAILURE", payload: e });
  }
};

const postsSelector = (state) => state.posts.data;

const rootReducer = combineReducers({
  user: userReducer,
  posts: postsReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default function ReduxWay() {
  return (
    <Provider store={store}>
      <ReduxApp />
    </Provider>
  );
}

function ReduxApp() {
  const me = useSelector(currentUserSelector);
  const posts = useSelector(postsSelector);

  // console.log("me :>> ", me);
  // console.log("posts :>> ", posts);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchPosts());
  }, []);

  return (
    <div>
      <User name={me?.name} />
      <NewPost
        onCreate={(payload) => {
          dispatch(
            createNewPost({
              ...payload,
              authorId: me?.id,
            })
          );
        }}
      />
      <Posts
        data={posts}
        onRemove={(id) => {
          dispatch(removePost(id));
        }}
        onEdit={(id, text) => {
          dispatch({
            type: "EDIT_POST",
            payload: {
              id,
              text,
            },
          });
        }}
      />
    </div>
  );
}
