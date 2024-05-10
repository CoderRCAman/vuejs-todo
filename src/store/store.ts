//* Early implementation without utilising composable apis
type TodosType = {
  title: string;
  id: string;
  completed: boolean;
  timestamp?: Date;
  userName: string;
  user_id: string;
};
export type BookMark = {
  title: string;
  id: string; //actually correspoonds to todos index
  completed: boolean;
  timestamp?: Date;
};
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
// import { reactive } from "vue";
// export const store = reactive<{
//   todos: TodosType[];
//   bookmarks: BookMark[];
//   addTodo: (todo: TodosType) => void;
//   removeTodo: (index: number) => void;
//   addToBookmark: (bookmark: BookMark) => void;
//   removeBookmark: (id: number) => void;
// }>({
//   todos: localStorage.getItem("todos")
//     ? JSON.parse(localStorage.getItem("todos") as string)
//     : [],
//   bookmarks: localStorage.getItem("bookmarks")
//     ? JSON.parse(localStorage.getItem("bookmarks") as string)
//     : [],
//   addTodo(todo: TodosType) {
//     this.todos = [...this.todos, todo];
//     localStorage.setItem("todos", JSON.stringify(store.todos));
//   },
//   removeTodo(index: number) {
//     console.log(index);
//     this.todos = this.todos.filter((todo, i) => i !== index);
//     localStorage.setItem("todos", JSON.stringify(store.todos));
//     const bookmarkLocal = localStorage.getItem("bookmarks")
//       ? JSON.parse(localStorage.getItem("bookmarks") as string)
//       : [];
//     const newBookmark = bookmarkLocal.filter((b: BookMark) => b.id !== index);
//     localStorage.setItem("bookmarks", JSON.stringify(newBookmark));
//     if (this.bookmarks.find((b) => b.id == index)) {
//       this.removeBookmark(index);
//     }
//   },
//   addToBookmark(bookmark: BookMark) {
//     this.bookmarks = [...this.bookmarks, bookmark];
//     localStorage.setItem("bookmarks", JSON.stringify(store.bookmarks));
//   },
//   removeBookmark(id: number) {
//     this.bookmarks = this.bookmarks.filter((b) => b.id !== id);
//     localStorage.setItem("bookmarks", JSON.stringify(store.bookmarks));
//   },
// });

//* Below starts kind of way of doind

import { ref } from "vue";
import { db } from "../firebase/firebase";
import { UserProfile } from "../router";
const Todos = ref<TodosType[]>([]);
const CompletedTodos = ref<TodosType[]>([]);
const Bookmarks = ref<BookMark[]>([]);
const add_loading = ref(false);
const unsubscribe = ref<any>();
const q = query(collection(db, "todos"), orderBy("timestamp", "desc"));
unsubscribe.value = onSnapshot(q, (querySnapshot) => {
  const todos: TodosType[] = [];
  querySnapshot.forEach((doc) => {
    todos.push({
      title: doc.data().title,
      id: doc.data().id,
      completed: doc.data().completed,
      userName: doc.data().userName,
      user_id: doc.data().user_id,
    });
  });
  Todos.value = todos.filter((todo) => !todo.completed);
  CompletedTodos.value = todos.filter((todo) => todo.completed);
  let bookmarks = localStorage.getItem("bookmarks")
    ? JSON.parse(localStorage.getItem("bookmarks") as string)
    : [];
  bookmarks = bookmarks.filter((b: BookMark) =>
    todos.some((t) => t.id == b.id)
  );
  Bookmarks.value = bookmarks;
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
});

window.onbeforeunload = () => {
  unsubscribe.value();
};

async function addTodos(todo: TodosType) {
  console.log(todo);
  try {
    add_loading.value = true;
    const docRef = doc(db, "todos", todo.id.toString());
    await setDoc(docRef, todo);
  } catch (error) {
    console.log(error);
  } finally {
    add_loading.value = false;
  }
}
async function removeTodo(id: string) {
  try {
    const ref = doc(db, "todos", id);
    const currTodo = await getDoc(ref);
    if (!currTodo.exists()) return;
    if (currTodo.data().user_id !== UserProfile.value?.uid)
      return alert("You cannot delete this todo!");
    await deleteDoc(doc(db, "todos", id));
    let bookmarks = localStorage.getItem("bookmarks")
      ? JSON.parse(localStorage.getItem("bookmarks") as string)
      : [];
    bookmarks = bookmarks.filter((b: BookMark) => b.id != id);
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    Bookmarks.value = bookmarks;
  } catch (error) {
    console.log(error);
  }
}

async function addToBookmark(bookmark: BookMark) {
  Bookmarks.value = [...Bookmarks.value, bookmark];
  localStorage.setItem("bookmarks", JSON.stringify(Bookmarks.value));
}

async function removeBookmark(id: string) {
  Bookmarks.value = Bookmarks.value.filter((b) => b.id != id);
  localStorage.setItem("bookmarks", JSON.stringify(Bookmarks.value));
}

async function markAsCompleted(id: string) {
  const ref = doc(db, "todos", id);
  const currTodo = await getDoc(ref);
  if (!currTodo.exists()) return;
  if (currTodo.data().user_id !== UserProfile.value?.uid)
    return alert("You cannot Mark this todo!");
  setDoc(doc(db, "todos", id), { completed: true }, { merge: true });
}

export {
  Todos,
  Bookmarks,
  CompletedTodos,
  addTodos,
  removeTodo,
  addToBookmark,
  removeBookmark,
  markAsCompleted,
};
