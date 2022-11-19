// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
//Functions needed to Automate
import {AutomationRegistryInterface, State, Config} from "@chainlink/contracts/src/v0.8/interfaces/AutomationRegistryInterface1_2.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import {KeeperRegistrarInterface} from "./interfaces/KeeperRegistrarInterface.sol";
// Functions to Automate
import {IAPIConsumer} from "./interfaces/IAPIConsumer.sol";
import {ISwaper} from "./interfaces/ISwaper.sol";
import {IMinter} from "./interfaces/IMinter.sol";
import {IVRF} from "./interfaces/IVRF.sol";

contract Automation is ConfirmedOwner {
    using Counters for Counters.Counter;
    using Strings for string;

    Counters.Counter private _tokenIdCounter;
    // Universal IDs, can be addedd upKeepID for more complex projects
    struct ID {
        string tokenName;
        uint256 tokenID;
        bytes32 quoteID;
        uint256 vrfID;
    }

    mapping(address => ID[]) public IDbyAddres;
    mapping(uint256 => uint256) public tokenToUpkeepID;

    mapping(address => uint256) public mintedPerWallet;
    uint256 public mintPrice;
    uint256 public maxPerWallet;
    uint96 automateLinkAmount;
    uint32 gasLimit;

    LinkTokenInterface private immutable link;
    ISwaper private immutable swaper;
    IAPIConsumer private immutable apiConsumer;
    IMinter private immutable minter;
    IVRF private immutable vrf;
    address private immutable registrar;
    AutomationRegistryInterface private immutable registry;
    bytes4 registerSig = KeeperRegistrarInterface.register.selector;

    event Created(uint256 indexed tokenID);

    constructor(
        IAPIConsumer _apiConsumer,
        ISwaper _swaper,
        IMinter _minter,
        IVRF _vrf
        // LinkTokenInterface _link,
        // address _registrar,
        // AutomationRegistryInterface _registry,
    ) ConfirmedOwner(msg.sender) {

        maxPerWallet = 30;

        // mintPrice = 2000000000000000000; // 2 MATIC
        automateLinkAmount = 5000000000000000000; // 5 Link
        gasLimit = 2000000;

        apiConsumer = _apiConsumer;
        swaper = _swaper;
        minter = _minter;
        vrf = _vrf;
        link = LinkTokenInterface(0x326C977E6efc84E512bB9C30f76E30c160eD06FB); // Mumbai
        registrar = 0xDb8e8e2ccb5C033938736aa89Fe4fa1eDfD15a1d; // Mumbai
        registry = AutomationRegistryInterface(0x02777053d6764996e594c3E88AF1D58D5363a2e6); // Mumbai
    }

    modifier requiredToCreate() {
        // require(msg.value == mintPrice, "wrong value");
        require(
            mintedPerWallet[msg.sender] < maxPerWallet,
            "exceeds max per wallet"
        );
        // require(  //Swap Wraped native amountIn to LINK maxAmountOut
        //     swaper.swapAndDeposit{value: msg.value}(),
        //     "not able to swap Wraped to Link"
        // );
        require(
            link.balanceOf(address(this)) > 7000000000000000000, // 5 LINK
            "not able to fund automation"
        );
        require(
            link.transfer(address(apiConsumer), 1000000000000000000), // 1 LINK
            "not able to fund apiConsumer"
        );
        require(
            link.transfer(address(vrf), 1000000000000000000 ), // 1 LINK
            "not able to fund vrf"
        );
        _;
    }

    function contractLinkBalance() public view returns (uint256 balance) {
        balance = link.balanceOf(address(this));
    }
    function withdrawLink() public onlyOwner {
        require(
            link.transfer(msg.sender, link.balanceOf(address(this))),
            "Unable to transfer"
        );
    }
    function createNewToken() internal returns (ID memory _ID) {
        _ID = ID(
            string(abi.encodePacked("#", Strings.toString(_tokenIdCounter.current()))),
            _tokenIdCounter.current(),
            apiConsumer.requestQuoteData(),
            vrf.requestRandomWords()
        );
        _tokenIdCounter.increment();        
        IDbyAddres[msg.sender].push(_ID);
        minter.safeMint(msg.sender, _ID.tokenID);
    }

    function mint()  public requiredToCreate {
        ID memory _ID = createNewToken();
        (State memory state, Config memory _c, address[] memory _k) = registry
            .getState();
        uint256 oldNonce = state.nonce;
        bytes memory checkData = abi.encode(_ID);
        bytes memory payload = abi.encode(
            _ID.tokenName,
            "0x",
            address(this),
            gasLimit,
            address(msg.sender),
            checkData,
            automateLinkAmount,
            0,
            address(this)
        );

        link.transferAndCall(
            registrar,
            automateLinkAmount,
            bytes.concat(registerSig, payload)
        );
        (state, _c, _k) = registry.getState();
        uint256 newNonce = state.nonce;
        if (newNonce == oldNonce + 1) {
            uint256 upkeepID = uint256(
                keccak256(
                    abi.encodePacked(
                        blockhash(block.number - 1),
                        address(registry),
                        uint32(oldNonce)
                    )
                )
            );
            tokenToUpkeepID[_ID.tokenID] = upkeepID;
        } else {
            revert("auto-approve disabled");
        }
    }

    function checkUpkeep(bytes calldata checkData)
        external
        view
        returns (bool upkeepNeeded, bytes memory performData)
    {
        ID memory _ID = abi.decode(checkData, (ID));
        (, bool fulfilled, ) = vrf.getRequestStatus(_ID.vrfID);
        ( bool exists) = apiConsumer.exists(_ID.quoteID);

        upkeepNeeded = (exists && fulfilled);
        performData = checkData;
    }

    function performUpkeep(bytes calldata performData) external {
        ID memory _ID = abi.decode(performData, (ID));
        (, bool fulfilled, uint256[] memory randomWords) = vrf.getRequestStatus(_ID.vrfID);
        ( bool exists) = apiConsumer.exists(_ID.quoteID);

        if (exists && fulfilled) {
            minter.setTokenURI(
                _ID.tokenID,
                _ID.tokenName,
                apiConsumer.quote(_ID.quoteID),
                randomWords,
                Strings.toString(uint256(_ID.quoteID)),
                Strings.toString(_ID.vrfID)
            );
            emit Created(_ID.tokenID);
        }
    }
}
