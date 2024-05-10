<template>
    <div> 
        <div class="container px-2 mx-auto">
            <AddTodo />
            <div class="space-y-2" v-for="(todo, index) in Todos" :key="index"> 
                <TodoItem :title="todo.title"  :id ="todo.id" :completed="todo.completed" />
            </div>
        </div>  
        <div class='container pt-5 mx-auto '>
            <div class='mt-10 mx-2  border-t border-slate-100'>
                <h1 class='text-sm text-emerald-500 mt-1 font-semibold'>Completed todos</h1> 
                <div class="space-y-2" v-for="(todo, index) in CompletedTodos" :key="index"> 
                <TodoItem :title="todo.title"  :id ="todo.id" :completed="todo.completed" />
            </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import AddTodo from '../components/AddTodo.vue';
import TodoItem from '../components/TodoItem.vue'
import { Todos,CompletedTodos } from '../store/store'; 
</script>

<style lang="scss" scoped></style>
