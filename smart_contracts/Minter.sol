// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "base64-sol/base64.sol";

/// @custom:security-contact brunovjk@brunovjk.com
contract Minter is ERC721, ERC721URIStorage, ERC721Burnable {
    event CreatedRandomSVG(uint256 indexed tokenId, string tokenURI);
    uint256 public totalSupply;
    string[5] colorsText;
    string[10] colors;

    constructor() ERC721("TNI", "TNI") {
        colorsText = ["#090C89", "#910103", "#026B89", "#813904", "#25880F"];
        colors = [
            "#AAFF01",
            "#FF8F01",
            "#FF00AA",
            "#AA00FF",
            "#00AAFF",
            "#FBFAC4",
            "#97FEFD",
            "#FED2C5",
            "#80C7FB",
            "#F3D3FA"
        ];
    }

    function generateSVG(
        string memory tokenName,
        string memory quote,
        uint256[] memory randomNumbers,
        string memory quoteID,
        string memory vrfID
    ) public view returns (string memory finalSvg) {
        string memory path = string(
            abi.encodePacked(
                "<svg width='520' height='520' viewBox='0 0 520 520' fill='none' xmlns='http://www.w3.org/2000/svg'><style>.small{font:16px sans-serif}</style><defs><linearGradient id='a' x1='0%' y1='0%' x2='100%' y2='0%'><stop offset='0%' style='stop-color:",
                colors[randomNumbers[0] % colors.length],
                ";stop-opacity:1'/><stop offset='100%' style='stop-color:",
                colors[randomNumbers[1] % colors.length],
                ";stop-opacity:1'/></linearGradient></defs><rect rx='25' ry='25' width='520' height='520' fill='url(#a)' style='stroke:",
                colors[randomNumbers[0] % colors.length],
                ";stroke-width:15'/><text x='50' y='80' fill='",
                colorsText[randomNumbers[0] % colorsText.length],
                "' style='font:700 24px sans-serif'>",
                tokenName
            )
        );
        string memory text = string(
            abi.encodePacked(
                "</text><text x='40' y='130' style='font:italic 16px sans-serif;fill:",
                colorsText[randomNumbers[0] % colorsText.length],
                "'>",
                quote,
                "</text><text x='50' y='370' fill='",
                colorsText[randomNumbers[0] % colorsText.length],
                "' class='small'>QuoteID:</text><text x='50' y='400' fill='",
                colorsText[randomNumbers[0] % colorsText.length],
                "' class='small'>",
                quoteID,
                "</text><text x='50' y='440' fill='",
                colorsText[randomNumbers[0] % colorsText.length],
                "' class='small'>RandomID:</text><text x='50' y='470' fill='",
                colorsText[randomNumbers[0] % colorsText.length],
                "' class='small'>",
                vrfID,
                "</text></svg>"
            )
        );

        finalSvg = string(abi.encodePacked(path, text));
    }

    function svgToImageURI(string memory svg)
        public
        pure
        returns (string memory)
    {
        string memory baseURL = "data:image/svg+xml;base64,";
        string memory svgBase64Encoded = Base64.encode(
            bytes(string(abi.encodePacked(svg)))
        );
        return string(abi.encodePacked(baseURL, svgBase64Encoded));
    }

    function formatTokenURI(
        string memory tokenName,
        string memory quote,
        string memory imageURI
    ) public pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name":"',
                                tokenName,
                                '","description":"',
                                quote,
                                '","image":"',
                                imageURI,
                                '"}'
                            )
                        )
                    )
                )
            );
    }

    function safeMint(address to, uint256 tokenId) public {
        _safeMint(to, tokenId);
        totalSupply++;
    }

    function setTokenURI(
        uint256 tokenId,
        string memory tokenName,
        string memory quote,
        uint256[] memory randomNumbers,
        string memory quoteID,
        string memory vrfID
    ) public {
        string memory svg = generateSVG(
            tokenName,
            quote,
            randomNumbers,
            quoteID,
            vrfID
        );
        string memory imageURI = svgToImageURI(svg);
        _setTokenURI(tokenId, formatTokenURI(tokenName, quote, imageURI));
        emit CreatedRandomSVG(tokenId, svg);
    }

    // The following functions are overrides requifrefd by Solidity.

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}
