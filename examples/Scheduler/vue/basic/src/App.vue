<script setup lang="ts">
import { BryntumDemoHeader } from '@bryntum/core-vue-community';
import { BryntumScheduler } from '@bryntum/scheduler-vue-community';
import { schedulerProps } from './AppConfig';
</script>

<template>
    <!-- Bryntum-demo-header is used for Bryntum example only. Not required for application -->
    <bryntum-demo-header />
    <bryntum-scheduler
        v-bind="schedulerProps"
    />
</template>

<style lang="scss">
@use "./App.scss";
</style>
