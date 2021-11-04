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
 * Check whether the configuration variables match the defaults.
 *
 * @todo You can remove this function after you're done modifying this script
 *   from the template version.
 *
 * @param data {DataFrame} - Input data.
 * @param condition {Series} - Condition used to filter data.
 * @param dropColumns {Array} - Columns to remove.
 * @param renameColumns {Object} - Map of old column name to new column names.
 * @param colsToTransform {Array} - Array of pairs of column names and
 *   functions that will be used to alter or create the column.
 * @param sortBy {String} - Column name to sort by.
 */
function hasDefaultConfig(
  data,
  condition,
  dropColumns,
  renameColumns,
  colsToTransform,
  sortBy
) {
  if (condition === null) {
    return false;
  }

  const conditionValues = condition
    .eq(data["STATUS"].eq("ISSUED"))
    .unique().values;
  if (conditionValues.length !== 1) {
    return false;
  }

  if (conditionValues[0] !== true) {
    return false;
  }

  const defaultDropColumns = [
    "RRFFDD",
    "STATUS",
    "PREVIOUS_AUTH",
    "forest",
    "district",
    "rrffdd_count",
    "REGION",
    "FORESTNUMB",
  ];

  if (dropColumns.length != defaultDropColumns.length) {
    return false;
  }

  let i = dropColumns.length;
  while (i--) {
    if (dropColumns[i] !== defaultDropColumns[i]) {
      return false;
    }
  }

  if (Object.keys(renameColumns).length) {
    return false;
  }

  if (colsToTransform.length) {
    return false;
  }

  if (sortBy !== "ISSUE_DATE") {
    return false;
  }

  return true;
}

/**
 * Clean source data and output as JSON
 * @param inputPath - Path to file containing source data.
 * @param outputPath - Path to file containing cleaned, transformed data.
 */
async function transformData(inputPath, outputPath) {
  let data = await dfd.read_csv(inputPath);

  // Configuration variables
  // Modifying these will help you perform typical data processing and
  // cleaning tasks on your data.

  // If set, this condition will be used to filter your data.
  // See https://danfo.jsdata.org/api-reference/dataframe/danfo.dataframe.query
  // This happens before column renaming, so use the original column names here.
  // @todo: Update this with a more complex condition if you want to filter
  // your data.
  const condition = data["STATUS"].eq("ISSUED");

  // Columns to remove.
  // Use the original column names here as this step happens before we rename
  // columns.
  // @todo: Update this with any input columns that you want to remove
  const dropColumns = [
    "RRFFDD",
    "STATUS",
    "PREVIOUS_AUTH",
    "forest",
    "district",
    "rrffdd_count",
    "REGION",
    "FORESTNUMB",
  ];

  // Map from source column name to new column name
  // @todo: Update this with items where the key is the old column names
  // and values are the new column names.
  const renameColumns = {};

  // The contents of this array should be two-element arrays where the first
  // element is the column name and the second column is the function to run
  // on the column's data.
  // Since we may have renamed some column names in the previous step, make
  // sure to use the renamed column names.
  // @todo Update this to do any transformations needed in your data.
  const colsToTransform = [];

  // Sort data by this column.
  // @todo Update this to reflect the column you want to sort in your data
  // or set to null to use the sort order of the input data.
  const sortBy = "ISSUE_DATE";

  // @todo You can remove this check, as well as the definition of
  // hasDefaultConfig once you modify this script to match your own data.
  if (
    hasDefaultConfig(
      data,
      condition,
      dropColumns,
      renameColumns,
      colsToTransform,
      sortBy
    )
  ) {
    console.warn(
      "It appears you haven't changed the data processing script from the template. Any errors might be because you need to update this script to match your data."
    );
  }

  if (condition) {
    data = data.query({
      condition,
    });
  }

  data = data.drop({
    columns: dropColumns,
  });

  data = data.rename({
    mapper: renameColumns,
  });

  colsToTransform.forEach(([colName, transform]) => {
    const updated = transform(data.column(colName));
    // HACK: I don't know how to assign new values to a column so I have to drop
    // and re-add them.
    data = data.drop({ columns: [colName] });
    data = data.addColumn({ column: colName, values: updated });
  });

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
