# Searchable Database

This is a database of TK. 

This project uses [Simple-Datatables](https://github.com/fiduswriter/Simple-DataTables) to provide most of the functionality and was created from a [template](#about-this-template). 

## Story links

- Main story in which the database is embedded or the main bar from which the database story is linked 
  - Presto ID: TK 
  - Story URL: TK

- Standalone database story

  - Presto ID: TK 
  - Story URL: TK 

- Embed asset
  - Presto ID: TK 

## Staff involved

List people who requested data, reported, performed data analysis and developed this database.

## Source data

- Data set 1 name TK
  - URL: TK
  - Agency: TK
  - Any notes about how this data was obtained; caveats or warnings and notes about other projects where this data was analyzed or processed.

## What's in here?

✏️: You'll need to edit this file for your particular table/data set.

- ✏ `README.md`: This file. You'll want to modify this to reflect your project description, data sources and story/CMS information.
- ✏ `index.html`: Host page for this app. You'll want to edit the title and before deploying, switch to using the production Google Analytics property ID.
- ✏ `package.json`: Change all instances of `vanilla-searchable-db` to a project slug you choose for your project. 
- ✏ `vite.config.js`: Vite configuration. Change the `base` property to match the staging or production URL before deploying.
- `src/analytics.js`: Helper functions for sending custom analytics events related to using the database. You shouldn't need to edit this.
- `src/datatable.js`: A class that extends the functionality of the default Simple-DataTables. You shouldn't need to edit this.
- ✏ `src/main.js`: Main application code. You'll need to edit the properties at the beginning of the `SearchableDatabase` class declaration to configure the table behavior and update the `renderDetail` method so it displays record details in a way that is suitable for your data.
- ✏ `src/style.css`: Application styles. You'll need to edit this for any custom styling of table or detail elements as well as to configure which columns will be hidden on narrower screens.
- `src/data/data.csv`: Sample source data file. Either replace this file with your file or edit `package.json` to change the `build:data` npm script to read data from a different filename.
- `src/scripts/transform-data.mjs`: Script to do final processing on your data and output a JSON file that will be consumed by the application JavaScript.

## Technical details

This project uses [Vite](https://vitejs.dev/) to handle running the development server and final bundling. It's probably worth having the [Vite guide](https://vitejs.dev/guide/) open in a browser tab while working in this project. I wanted to use some kind of tool to bundle all the dependencies together to make this app more archival. That means once it's deployed, all the files needed to run it will live in the same directory, rather than relying on a CDN that may go away. Using a tool like Vite also makes the development process smoother. The development server will reload when source files are changed. Finally, using Vite lets people working on this project write more modular code. It's a good practice and lets us refactor the code more easily looking to the future. I could have used something like browserify or Webpack, but Vite is a more modern option.

Connected to the use of Vite, and the goal of writing modular code, this project imports dependencies as modules. If you're not familiar with the concept, maybe the [MDN guide on modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) is a good place to start.

### Assumptions

- Node.js (for development, Geoff used v14.15.1 when starting the FY 2020 version)
- Google Cloud SDK `gsutil` command installed (to deploy to Google Cloud Storage)

### Installing dependencies

Before you can run the local development server or rebuild the site for production, you'll need to install some dependencies:

```
npm install
```

### Building the data

```
npm run build:data
```

### Previewing for local development

Running `npm run dev` will start the development webserver. Watch the console for the URL at which the app will be available locally.

If you want to see what the app will look like inside an iframe, add `iframe-test` to the end of the URL.

### Building the site for production

Run `npm run build`.

### Previewing the production build

Run `npm run serve`.

### Deploying the app

Currently this is deployed to Google Cloud Storage in the `azr-data-public` bucket.

```
npm run deploy
```

Note that this will not delete prior versions of the files in `assets`, so you might want to periodically clean up old versions with `gsutil rm` or in the Cloud Console.

## Methods and techniques

List any new tools, libraries or approaches you used in this project.

## About this template

This project was created from a [Vanilla Searchable Database Template](https://github.com/Arizona-Republic-Data/vanilla-searchable-database-template)

A lot of what @ghing and @qstin built in 2021 at the Arizona Republic has been searchable databases that are rendered as static HTML/CSS/JavaScript that can be embedded in CMS pages. These are useful when a simple solution such as Caspio, [Datawrapper](https://www.datawrapper.de/tables) or [Flourish](https://app.flourish.studio/@flourish/table) doesn't provide the desired functionality. This could be because we want to capture custom analytics, show details for records in a flexible or styled way or stream large amounts of data.

[DataTables](https://datatables.net/) is a great tool for building these kinds of searchable tables. However, it has a dependency on jQuery, which adds unneeded bloat as we mostly target modern browsers, and the library has a lot of built-in features we don't use that also increases size.

This template uses the dependency-free [Simple-DataTables](https://github.com/fiduswriter/Simple-DataTables) library and uses [Vite](https://vitejs.dev/) for project building and a nice development experience. It also includes pre-wired analytics and deployment scripts that follow best practices for the Arizona Republic Data Team.

### Using the template

Use [degit](https://github.com/Rich-Harris/degit) to copy the template to create a new project directory.

```
npx degit Arizona-Republic-Data/vanilla-searchable-database-template my-new-project
```

### Modifying your copy

See the "What's in here?" section of this README to see which files you'll likely need to modify for your particular data.
