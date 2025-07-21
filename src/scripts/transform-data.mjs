#!/usr/bin/env node

/**
 * FOR USERS: 
 * The only thing you'll have to change in this script should be the name of the column
 * you want to sort on. So where it says "const sortBy = "COL_TO_SORT_BY"" -- replace COL_TO_SORT_BY 
 * with the name of the column you want your dataset sorted on. If you make that value null,
 * then your data won't be sorted by anything.
 * 
 * FOR THE CURIOUS: 
 * Use Danfo.js to transform source data into the format that will be consumed
 * by JavaScript code to render the searchable database.
 *
 * This code is run from the `build:data` npm script defined in `package.json`.
 *
 * You could also do the data processing in the data loading/analysis code,
 * but often it's easier to do some final processing in the front-end
 * codebase instead of going back and forth between two people to
 * determine data format.
 *
 * You could also use a variety of command-line tools such as csvkit or
 * ndjson-cli to transform the data in an npm script, but after a certain
 * point, that command-line syntax becomes as complex as programming, but
 * is more difficult to read and comment for a wide range of data
 * journalists.
 *
 * Using this script allows for straightforward and documented final data
 * transformation prior to visualization.
 *
 * Example:
 *
 *   transform-data.mjs data/source/data.csv public/data/data.json
 */

import fs from "fs";

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import dfd from "danfojs-node";

const argv = yargs(hideBin(process.argv))
  .positional("inputPath", {
    describe: "Path to input data file.",
    type: "string",
  })
  .options({
    output: {
      alias: "o",
      describe: "Path to output file with cleaned, transformed data",
    },
  }).argv;

const inputPath = argv._[0];

/**
 * Clean source data and output as JSON
 * @param inputPath - Path to file containing source data.
 * @param outputPath - Path to file containing cleaned, transformed data.
 */
async function transformData(inputPath, outputPath) {
  let data = await dfd.read_csv(inputPath);

  // Sort data by this column.
  // @todo Update this to reflect the column you want to sort in your data
  // or set to null to use the sort order of the input data.
  const sortBy = "name";

  if (sortBy !== null) {
    data = data.sort_values({ by: sortBy });
  }

  // Standardize column names
  const newColumnNames = data.columns.reduce((nameMap, name) => {
    return {
      ...nameMap,
      [name]: name.toLowerCase().replace(/[ \/]/g, "_"),
    };
  }, {});
  data = data.rename({ mapper: newColumnNames });

  const outputJSON = JSON.stringify(data.to_json());

  if (outputPath) {
    fs.writeFileSync(outputPath, outputJSON);
  } else {
    process.stdout.write(outputJSON);
  }
}

transformData(inputPath, argv.output);
