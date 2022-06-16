/* eslint @typescript-eslint/naming-convention: "off" */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
const Jasmine = require("jasmine");
/* eslint-enable @typescript-eslint/no-require-imports */
/* eslint-enable @typescript-eslint/no-var-requires */

import "reflect-metadata";

const jsm = new Jasmine({}) as any;
jsm.configureDefaultReporter({
  print: arg => {
    if (arg !== "[32m.[0m") {
      process.stdout.write(arg);
    }
  },
  showColors: true
});

jsm.loadConfig({
  spec_dir: "./out-tsc",
  spec_files: [
    "**/*.[sS]pec.js"
  ]
});

jsm.execute();
