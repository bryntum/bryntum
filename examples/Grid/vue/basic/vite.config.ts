import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
    plugins      : [vue()],
    optimizeDeps : {
        include : []
    },
    base  : '',
    build : {
        // Suppress warning for chunk size
        chunkSizeWarningLimit : 10000,

        // Targets with native light-dark(), older ones make Lightning CSS emit invalid colors
        cssTarget : ['chrome123', 'edge123', 'firefox120', 'safari17.5'],

        // Turn warnings into errors
        // https://rollupjs.org/configuration-options/#onlog
        rollupOptions : {
            onLog(level, log, handler) {
                if (log.code === 'CIRCULAR_DEPENDENCY') {
                    return; // Ignore circular dependency warnings
                }

                if (level === 'warn') {
                    handler('error', log);
                }
                else {
                    handler(level, log);
                }
            }
        }
    }
});
