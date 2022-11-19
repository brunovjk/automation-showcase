## 🚀 Automatic NFTs Generator

Our program consists of a group of smart contracts, which automatically interact with a single smart contrast: `Automation.sol`, and a react application to interact with this contract:

- `Swaper.sol` Contract responsible for swapping MATIC for ChainLink token. All automation of our software is done using tools supported by ChainLink Labs. Before starting any process, we need ChainLink Token.
- `APIConsumer.sol` Contract responsible for interviewing Kenny West, and returning us an epic quote, hehe.
- `VRF.sol` Contract responsible for requesting some random numbers using ChainLink VRF, with those numbers, `Minter.sol` contract creates a unique SVG.
- `Minter.sol` Contract responsible for minting and storing the entire collection of NFTs. A ideia era usar Filecoin para armazenamento.
-  `Automation.sol` Main contract responsible for automating the entire process and storing profits after creating them.

## ☕ Using Automation

To interact with our application, 0x7d07a2dbaa23DB0729B032E843D307FC69310D20, after go to:
[automation-showcase web-app](https://automation-showcase.web.app).

You can also clone this repository, change contracts in `smart_contracts` folder.

## 📇 Process

Our application consists of a button to create a new NFT and a section to show all the NFT created in this collection.
However, several steps are followed automatically during creation:

1º: Require before start to generate nft, swap the amount paid by the user in MATIC to ChainLink Token, using `Swaper.sol`. After Fund `APIConsumer.sol` and `VRF.sol`.

2º: Request KennyWestAPI quote through a ChainLink API call, get the `quoteID`. Request two ramdom numbers via ChainLink VRF, use those numbers and quote to mint a new token `Minter.sol`.

3º: Create a `upkeepID` by `tokenID` and finish to mint. Now the user have paid ChainLink and have they set of ID to proove it.

4º: ChainLink will keep checking `APIConsumer.sol` and `VRF.sol` if quote and numbers exists.

5º: When both contracts finish creating `quote` and `svg`, our ChainLinkUpKeep will set the tokenURI (link this information with our `tokenID`). And after that, cancel upkeep to not spend more ChainLink Token, and send the remaining amount to `Automation.sol`.

6º: All the ChainLink Token remaining (profit), can be checked `contractLinkBalance()` and withdrawn `withdrawLink()`.

### 🎚️ Adjustments and improvements

The project is still under development and the next updates will focus on the following tasks:

- [x] Contracts - Fully Automated
- [ ] Storage - Filecoin


## 📫 Contributing to Automation

To contribute to Automation, follow these steps:

1. Fork this repository.
2. Create a branch: `git checkout -b <branch_name>`.
3. Make your changes and commit them: `git commit -m '<message_commit>'`
4. Push to the original branch: `git push origin Automation / <local>`
5. Create the pull request.

Alternatively, see the GitHub documentation at [how to create a pull request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request).

## 📝 Considerations

The main idea was always to use ChainLink Automation, but in May of this year I started to learn blockchain, and I followed a class from Patrick Collins teaching how to create a random SVG NFT collection. At the time I managed to do it, but it wasn't enough, actually React did most of the work, I didn't know about ChainLink Automation.
For this hackathon, I used this same project as a starting point (just the idea of a random SVG).

The version of the application that is in this repository is very simple, just to work with Truflation and make the video.
The complete project is available only on Goerli for now, but I have plans to move everything to Polygon, was also developed during this hackathon, is available at: https://github.com/brunovjk/vjkNFT
Feel free to use and analyze any code, everything is open source.

[⬆ Back to top](#Automation)<br>
