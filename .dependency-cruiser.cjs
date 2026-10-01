/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "no-circular",
      severity: "error",
      from: {},
      to: {
        circular: true,
      },
    },

    {
      name: "not-to-test",
      severity: "error",
      from: {
        pathNot: "^tests",
      },
      to: {
        path: "^tests",
      },
    },

    {
      name: "not-to-unresolvable",
      severity: "error",
      from: {},
      to: {
        couldNotResolve: true,
      },
    },

    {
      name: "ui-not-to-fakes",
      severity: "error",
      from: {
        path: "^src/ui",
      },
      to: {
        path: "^src/fakes",
      },
    },

    {
      name: "usecases-not-to-fakes",
      severity: "error",
      from: {
        path: "^src/usecases",
      },
      to: {
        path: "^src/fakes",
      },
    },

    {
      name: "ports-not-to-ui",
      severity: "error",
      from: {
        path: "^src/ports",
      },
      to: {
        path: "^src/(ui|app|inputs)",
      },
    },

    {
      name: "ports-not-to-next",
      severity: "error",
      from: {
        path: "^src/ports",
      },
      to: {
        path: "node_modules/next",
      },
    },
  ],

  options: {
    doNotFollow: {
      path: ["node_modules"],
    },

    tsConfig: {
      fileName: "tsconfig.json",
    },

    tsPreCompilationDeps: true,
    skipAnalysisNotInRules: true,
  },
};
