<script setup lang="ts">
import { BryntumDemoHeader } from '@bryntum/core-vue-community';
import { BryntumCalendar } from '@bryntum/calendar-vue-community';
import { calendarProps } from './AppConfig';
</script>

<template>
    <!-- Bryntum-demo-header is used for Bryntum example only. Not required for application -->
    <bryntum-demo-header />
    <bryntum-calendar
        v-bind="calendarProps"
    />
</template>

<style lang="scss">
@use "./App.scss";
</style>
