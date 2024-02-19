# Scramjet reference apps

In this repository you will find a variety of Scramjet Sequences. Some of them constitute the basis for BDD tests located in the [transform-hub](https://github.com/scramjetorg/transform-hub) repository.

You can download apps from the [releases page](https://github.com/scramjetorg/reference-apps/releases).

Initial history was imported from <https://github.com/scramjetorg/transform-hub> repository.

## How to add a new Sequence

Create your package either in `js` or `python` directory. Add all necessary files. Include scripts in the `package.json` file:

- for `ts` package:

```json
    "scripts": {
        "build:refapps": "node ../../scripts/build-all.js",
        "postbuild:refapps": "yarn packseq",
        "packseq": "PACKAGES_DIR=ts node ../../scripts/packsequence.js",
        "clean": "rm -rf ./dist"
    }
```

- for `js` package:

```json
    "scripts": {
        "build:refapps": "build:refapps:only",
        "build:refapps:only": "mkdir -p dist/ && cp -r *.js package.json dist/ && (cd dist && npm i --omit=dev)",
        "postbuild:refapps": "yarn packseq",
        "packseq": "PACKAGES_DIR=js node ../../scripts/packsequence.js",
        "clean": "rm -rf ./dist"
    }
```

- for `python` package:

```json
    "scripts": {
        "build:refapps": "yarn build:refapps:only",
        "build:refapps:only": "mkdir -p dist/__pypackages__/ && cp *.py dist/ && pip3 install -t dist/__pypackages__/ -r requirements.txt",
        "postbuild:refapps": "yarn packseq",
        "packseq": "PACKAGES_DIR=python node ../../scripts/packsequence.js",
        "clean": "rm -rf ./dist"
    }
```

To make sure your package build process runs correctly alongside other sequence packages go to the root and:

- install dependencies:

```bash
yarn
```

- build all packages and create `.tar.gz`:

```bash
yarn build
```

## Release

Release is needed if you wish your new Sequence to be available for downloading.

>It is recommended to perform a release every time a new Sequence is added.

To perform a release:

- go to `main` branch and update:

```bash
git checkout main && git pull
```

- make sure build runs correctly locally:

```bash
yarn clean && yarn && yarn build
```

- create a new tag on the last commit (branch `main`), e.g.:

```bash
git tag -a v0.25.3 753d38689e5e7d89e2d9e3bf40b9693f5861830d -m "v0.25.3"
```

- push it to remote:

```bash
git push origin v0.25.3
```

Release will be triggered automatically. You can observe it in [Actions](https://github.com/scramjetorg/reference-apps/actions). After this process is complete without any errors, you will see your new Sequence in a `.tar.gz` format ready to to download from the [Release's](https://github.com/scramjetorg/reference-apps/releases) `Assets` list.

>**:exclamation:IMPORTANT:exclamation: [transform-hub](https://github.com/scramjetorg/transform-hub/tree/devel/bdd) BDD tests use the versions of Sequence released in the most recent reference-apps release.**
