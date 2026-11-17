<script setup lang="ts">
import { BryntumDemoHeader } from '@bryntum/core-vue-community';
import { BryntumTaskBoard } from '@bryntum/taskboard-vue-community';
import { taskBoardProps } from './AppConfig';
</script>

<template>
    <!-- Bryntum-demo-header is used for Bryntum example only. Not required for application -->
    <bryntum-demo-header />
    <bryntum-task-board
        v-bind="taskBoardProps"
    />
</template>

<style lang="scss">
@use "./App.scss";
</style>
