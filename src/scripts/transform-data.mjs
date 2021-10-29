#!/usr/bin/env node

/**
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


const argv = yargs(hideBin(process.argv)).positional("inputPath", {
  describe: "Path to input data file.",
  type: "string",
}).options({
  "output": {
    alias: "o",
    describe: "Path to output file with cleaned, transformed data",
  }
}).argv;

const inputPath = argv._[0];

/**
 * Clean source data and output as JSON
 * @param inputPath Path to file containing source data
 * @param outputPath Path to file containing cleaned, transformed data
 */
async function transformData(inputPath, outputPath) {
  let data = await dfd.read_csv(inputPath);

  data = data.drop({
    columns: [
      // @todo: Update this with any input columns that you want to remove
    ],
  });

  data = data.rename({
    mapper: {
      // @todo: Update this with items where the key is the old column names
      // and values are the new column names.
    }
  });

  // @todo: Update this with a more complex condition if you want to filter
  // your data.
  // See https://danfo.jsdata.org/api-reference/dataframe/danfo.dataframe.query 
  const condition = null;
  if (condition) {
    data = data.query({
      condition, 
    });
  }

  const colsToTransform = [
    // The contents of this array should be two-element arrays where the first
    // element is the column name and the second column is the function to run
    // on the column's data.
    // Since we may have renamed some column names in the previous step, make
    // sure to use the renamed column names.
  ];

  colsToTransform.forEach(([colName, transform]) => {
    const updated = transform(data.column(colName));
    // HACK: I don't know how to assign new values to a column so I have to drop
    // and re-add them.
    data = data.drop({ columns: [colName] });
    data.addColumn({ column: colName, value: updated });
  });

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
