# 🪦Welcome to the iKeen Finance ecosystem🪦

Thanks for taking the time to contribute!
You can start by reading our [Contribution guidelines](CONTRIBUTING.md) first.

## Setup

Make sure to use Node 16.14.0 or above!
(16.0.0 has a weird issue with Parcel)

Install the dependencies

```shell
yarn
yarn start
```

Make sure you've configured your IDE with `prettier`.

You can reformat the project by running

```shell
npx prettier --write .
```

## Project structure

- **components** contains generic components used inside the application.
- **views** contains building blocks for each page. The entry point of a view is used as the root component of each route.
- **config** contains all the config files and ABIs.
- **state** contains the redux files for the global state of the app.
- **contexts** contains global contexts.
- **hooks** contains generic hooks.
- **utils** contains generic utilities functions.

## Useful Resources

- [Our project documentation](https://docs.ikeenfi.app/#/) will help you understand before start contributing
- Join our [Discord](https://discord.gg/fj6B245xdRy) community
- Bugs? Use the [Issues](https://github.com/iKeenFi/issues) section of our github to report them
