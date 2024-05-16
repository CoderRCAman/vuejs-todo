//* Early implementation without utilising composable apis
type TodosType = {
  title: string
  id: string
  completed: boolean
  timestamp?: Date
  userName: string
  user_id: string
}
export type BookMark = {
  title: string
  id: string //actually correspoonds to todos index
  completed: boolean
  timestamp?: Date
}
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  setDoc
} from 'firebase/firestore' 

import { ref } from 'vue'
import { db } from '../firebase/firebase'
import { UserProfile } from '../router'
const Todos = ref<TodosType[]>([])
const CompletedTodos = ref<TodosType[]>([])
const Bookmarks = ref<BookMark[]>([])
const add_loading = ref(false)
const unsubscribe = ref<any>()
const myLatLong = ref<{
  lat: number
  lng: number
}>({
  lat: -34.397,
  lng: 150.644
})
const q = query(collection(db, 'todos'), orderBy('timestamp', 'desc'))
unsubscribe.value = onSnapshot(q, (querySnapshot) => {
  const todos: TodosType[] = []
  querySnapshot.forEach((doc) => {
    todos.push({
      title: doc.data().title,
      id: doc.data().id,
      completed: doc.data().completed,
      userName: doc.data().userName,
      user_id: doc.data().user_id
    })
  })
  Todos.value = todos.filter((todo) => !todo.completed)
  CompletedTodos.value = todos.filter((todo) => todo.completed)
  let bookmarks = localStorage.getItem('bookmarks')
    ? JSON.parse(localStorage.getItem('bookmarks') as string)
    : []
  bookmarks = bookmarks.filter((b: BookMark) => todos.some((t) => t.id == b.id))
  Bookmarks.value = bookmarks
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
})

window.onbeforeunload = () => {
  unsubscribe.value()
}

async function addTodos(todo: TodosType) {
  try {
    add_loading.value = true
    const docRef = doc(db, 'todos', todo.id.toString())
    await setDoc(docRef, todo)
  } catch (error) {
    console.log(error)
  } finally {
    add_loading.value = false
  }
}
async function removeTodo(id: string) {
  try {
    const ref = doc(db, 'todos', id)
    const currTodo = await getDoc(ref)
    if (!currTodo.exists()) return
    if (currTodo.data().user_id !== UserProfile.value?.uid)
      return alert('You cannot delete this todo!')
    await deleteDoc(doc(db, 'todos', id))
    let bookmarks = localStorage.getItem('bookmarks')
      ? JSON.parse(localStorage.getItem('bookmarks') as string)
      : []
    bookmarks = bookmarks.filter((b: BookMark) => b.id != id)
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
    Bookmarks.value = bookmarks
  } catch (error) {
    console.log(error)
  }
}

async function addToBookmark(bookmark: BookMark) {
  Bookmarks.value = [...Bookmarks.value, bookmark]
  localStorage.setItem('bookmarks', JSON.stringify(Bookmarks.value))
}

async function removeBookmark(id: string) {
  Bookmarks.value = Bookmarks.value.filter((b) => b.id != id)
  localStorage.setItem('bookmarks', JSON.stringify(Bookmarks.value))
}

async function markAsCompleted(id: string) {
  const ref = doc(db, 'todos', id)
  const currTodo = await getDoc(ref)
  if (!currTodo.exists()) return
  if (currTodo.data().user_id !== UserProfile.value?.uid) return alert('You cannot Mark this todo!')
  setDoc(doc(db, 'todos', id), { completed: true }, { merge: true })
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
  myLatLong
}
