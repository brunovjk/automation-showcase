// abis
export const APICONSUMER_ABI = [
  "function exists ( bytes32 ) external view returns ( bool )",
  "function fulfill ( bytes32 _requestId, string _quote ) external",
  "function quote ( bytes32 ) external view returns ( string )",
  "function requestQuoteData (  ) external returns ( bytes32 requestId )",
  "function withdrawLink (  ) external returns ( bool )",

  "event RequestQuote(bytes32 indexed requestId, string quote)",
];
export const VRF_ABI = [
  "function acceptOwnership (  ) external",
  "function getRequestStatus ( uint256 _requestId ) external view returns ( uint256 paid, bool fulfilled, uint256[] randomWords )",
  "function lastRequestId (  ) external view returns ( uint256 )",
  "function owner (  ) external view returns ( address )",
  "function rawFulfillRandomWords ( uint256 _requestId, uint256[] _randomWords ) external",
  "function requestIds ( uint256 ) external view returns ( uint256 )",
  "function requestRandomWords (  ) external returns ( uint256 requestId )",
  "function s_requests ( uint256 ) external view returns ( uint256 paid, bool fulfilled )",
  "function transferOwnership ( address to ) external",
  "function withdrawLink (  ) external",

  "event RequestFulfilled( uint256 requestId, uint256[] randomWords, uint256 payment )",
];
export const SWAPER_ABI = [
  "function allowance ( address owner, address spender ) external view returns ( uint256 )",
  "function approve ( address spender, uint256 amount ) external returns ( bool )",
  "function balanceOf ( address account ) external view returns ( uint256 )",
  "function deposit (  ) external",
  "function totalSupply (  ) external view returns ( uint256 )",
  "function transfer ( address to, uint256 amount ) external returns ( bool )",
  "function transferFrom ( address from, address to, uint256 amount ) external returns ( bool )",
  "function withdraw ( uint256 ) external",
];
export const MINTER_ABI = [
  "function approve ( address to, uint256 tokenId ) external",
  "function balanceOf ( address owner ) external view returns ( uint256 )",
  "function burn ( uint256 tokenId ) external",
  "function formatTokenURI ( string tokenName, string quote, string imageURI ) external pure returns ( string )",
  "function generateSVG ( string tokenName, string quote, uint256[] randomNumbers, string quoteID, string vrfID ) external view returns ( string finalSvg )",
  "function getApproved ( uint256 tokenId ) external view returns ( address )",
  "function isApprovedForAll ( address owner, address operator ) external view returns ( bool )",
  "function name (  ) external view returns ( string )",
  "function ownerOf ( uint256 tokenId ) external view returns ( address )",
  "function safeMint ( address to, uint256 tokenId ) external",
  "function safeTransferFrom ( address from, address to, uint256 tokenId ) external",
  "function safeTransferFrom ( address from, address to, uint256 tokenId, bytes data ) external",
  "function setApprovalForAll ( address operator, bool approved ) external",
  "function setTokenURI ( uint256 tokenId, string tokenName, string quote, uint256[] randomNumbers, string quoteID, string vrfID ) external",
  "function supportsInterface ( bytes4 interfaceId ) external view returns ( bool )",
  "function svgToImageURI ( string svg ) external pure returns ( string )",
  "function symbol (  ) external view returns ( string )",
  "function tokenURI ( uint256 tokenId ) external view returns ( string )",
  "function totalSupply (  ) external view returns ( uint256 )",
  "function transferFrom ( address from, address to, uint256 tokenId ) external",

  "event CreatedRandomSVG(uint256 indexed tokenId, string tokenURI)",
];
export const AUTOMATION_ABI = [
  "function IDbyAddres ( address, uint256 ) external view returns ( string tokenName, uint256 tokenID, bytes32 quoteID, uint256 vrfID )",
  "function acceptOwnership (  ) external",
  "function checkUpkeep ( bytes checkData ) external view returns ( bool upkeepNeeded, bytes performData )",
  "function contractLinkBalance (  ) external view returns ( uint256 balance )",
  "function maxPerWallet (  ) external view returns ( uint256 )",
  "function mint (  )payable external",
  "function mintPrice (  ) external view returns ( uint256 )",
  "function mintedPerWallet ( address ) external view returns ( uint256 )",
  "function owner (  ) external view returns ( address )",
  "function performUpkeep ( bytes performData ) external",
  "function tokenToUpkeepID ( uint256 ) external view returns ( uint256 )",
  "function transferOwnership ( address to ) external",
  "function withdrawLink (  ) external",

  "event Created(uint256 indexed tokenID)",
];

// address
export const APICONSUMER_ADDRESS = {
  goerli: "",
  mumbai: "0xfC4e98830bfcA7ad82E98BC2FeEF339FfCcfe31A",
};
export const VRF_ADDRESS = {
  goerli: "",
  mumbai: "0x9E88dc823d36dC6A01734Cfb9A6C89a763d248C5",
};
export const SWAPER_ADDRESS = {
  goerli: "",
  mumbai: "0xE39dFA35e8A9C228d53CFaaf6fBA7633D492cDBb",
};
export const MINTER_ADDRESS = {
  goerli: "",
  mumbai: "0x2cea600f1aEe5cacD38718c78DEa35Af990b6b6F",
};
export const AUTOMATION_ADDRESS = {
  goerli: "",
  mumbai_With_Mint_Price_adn_Swaper:
    "0x9eED63a5259Ce95b5EA6c7cD4b7d3530BD344dEA",
  mumbai: "0x7d07a2dbaa23DB0729B032E843D307FC69310D20",
};
