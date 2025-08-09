#!/usr/bin/env node
import fs from "fs";

const dataPath = "public/data/data.json";

if (!fs.existsSync(dataPath)) {
  console.error(
    `${dataPath} does not exist. Run \"npm run build:data\" first.`
  );
  process.exit(1);
}