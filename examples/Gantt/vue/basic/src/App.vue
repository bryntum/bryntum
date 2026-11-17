<script setup lang="ts">
import { ref } from 'vue';
import { BryntumDemoHeader } from '@bryntum/core-vue-community';
import { BryntumGantt, BryntumGanttProjectModel } from '@bryntum/gantt-vue-community';
import { ganttProps, projectProps } from './AppConfig';

const projectRef = ref<typeof BryntumGanttProjectModel | null>(null);
</script>

<template>
    <!-- Bryntum-demo-header is used for Bryntum example only. Not required for application -->
    <bryntum-demo-header />
    <bryntum-gantt-project-model
        ref="projectRef"
        v-bind="projectProps"
    />
    <bryntum-gantt
        v-bind="ganttProps"
        :project="projectRef"
    />
</template>

<style lang="scss">
@use "./App.scss";
</style>
