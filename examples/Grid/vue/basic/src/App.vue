<script setup lang="ts">
import { BryntumDemoHeader } from '@bryntum/core-vue-community';
import { BryntumGrid } from '@bryntum/grid-vue-community';
import { gridProps } from './AppConfig';
</script>

<template>
    <!-- Bryntum-demo-header is used for Bryntum example only. Not required for application -->
    <bryntum-demo-header />
    <bryntum-grid
        v-bind="gridProps"
    />
</template>

<style lang="scss">
@use "./App.scss";
</style>
