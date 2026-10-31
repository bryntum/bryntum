![Bryntum](./Github-header.png)

# Bryntum

<a href="https://bryntum.com">Bryntum</a> builds high-performance JavaScript UI components for enterprise web
applications: data grids, schedulers, Gantt charts, calendars and Kanban boards. They are written in plain
JavaScript and CSS, and come with wrappers for React, Angular and Vue.

This repository is two things:

* **The source of the Bryntum community edition**, under the MIT license
* **The issue tracker** for all Bryntum products

## Community edition

The community edition is the free, open-source tier of the Bryntum components. It holds the core features of:

* <a href="https://bryntum.com/products/grid">Grid</a>
* <a href="https://bryntum.com/products/scheduler">Scheduler</a>
* <a href="https://bryntum.com/products/gantt">Gantt</a>
* <a href="https://bryntum.com/products/calendar">Calendar</a>
* <a href="https://bryntum.com/products/taskboard">Kanban Task Board</a>

Advanced features are part of the commercial Business and Enterprise editions.

See the product pages above for what each edition includes.

### About this repository

The code here is a copy of the community edition. It is built from Bryntum's internal repository every night,
**after the nightly test run passes**. Each nightly commit lists the changes merged that day.

| Folder | Contents |
|---|---|
| `lib/` | Source code of each product, as ES modules (`lib/Core`, `lib/Grid`, ...) |
| `build/` | Compiled theme CSS and Font Awesome, used by the examples |
| `resources/` | Fonts and icons |
| `examples-grid/`, `examples-gantt/`, `examples-taskboard/` | Demos per product, including the framework demos |

### Running the examples

The demos load the sources from `lib/` directly, with no build step. Serve the repository root with any static
web server, for example:

```bash
npx http-server -c-1 .
```

Then open `http://localhost:8080/examples-grid/` to browse the Grid demos. Opening the HTML files straight from
disk does not work, because browsers block ES module imports over `file://`.

### Framework demos

The React, Angular and Vue demos are in `examples-*/frameworks/`. They install the community packages from npm:

```bash
cd examples-grid/frameworks/react-vite/basic
npm install
npm run dev
```

The framework demos run the latest **published** npm packages, while the plain JavaScript demos run the
**nightly** sources in `lib/`, so the two can differ slightly between releases.

### npm packages

The community edition is on npm:

| Package | Description |
|---|---|
| `@bryntum/grid-community` | Grid |
| `@bryntum/grid-react-community`, `-angular-community`, `-vue-community` | Grid framework wrappers |
| `@bryntum/scheduler-community` | Scheduler |
| `@bryntum/gantt-community` | Gantt |
| `@bryntum/calendar-community` | Calendar |
| `@bryntum/taskboard-community` | Kanban Task Board |

```bash
npm install @bryntum/grid-community
```

## Reporting issues

Found a bug or have a feature request? Search the
[existing issues](https://github.com/bryntum/bryntum/issues) first, then open a new one using the
templates. For bugs, please reproduce the problem in one of our [online demos](https://bryntum.com/examples) or
include a small test case. Reports with clear steps get fixed sooner.

For questions and help, visit the [Bryntum Forum](https://forum.bryntum.com/).

## Contributing

This repository is a nightly copy, so pull requests cannot be merged here directly yet. If you have a fix, open
an issue describing it, and include a link to your branch or a patch.

## License

The community edition in this repository is released under the [MIT license](./LICENSE).

The Business and Enterprise editions are commercial products, see the
[Bryntum license terms](https://bryntum.com/licensing/).

## Contact

Questions about licensing or the commercial editions? Use our [contact form](https://bryntum.com/contact).
