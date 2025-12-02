# League Skins

A Windows skin changer for League of Legends based on lol-skins and cslol-manager.

<img src="docs/demo.gif">

## How it works

- It downloads the latest skins from [lol-skins](https://github.com/darkseal-org/lol-skins) and unzips them.
- It downloads, unzips and uses [cslol-manager](https://github.com/LeagueToolkit/cslol-manager) to change the skins in the game.
- It uses [Community Data Dragon](https://www.communitydragon.org/) to get the latest skin metadata.

## Installation

```bash
git clone https://github.com/KonstantinosPetrakis/league-skins.git
cd league-skins
npm install
npm run build-cslol # requires docker; clones latest cslol-manager and builds it from source so it can be packaged with electron
```

## Run it for development

```bash
npm run dev
```

## Build it yourself

```bash
npm run build:win
```

## Disclaimer

This project is not endorsed by Riot Games and does not reflect the views or opinions of Riot Games or any of its affiliates. League of Legends and all related properties are trademarks or registered trademarks of Riot Games, Inc.

Additionally, I do not know whether this software violates Riot Games' Terms of Service. Its use may be against their policies, and I cannot guarantee whether it is detectable or bannable. Use this software at your own risk, as I am not responsible for any consequences, including but not limited to account penalties, bans, or restrictions imposed by Riot Games.
