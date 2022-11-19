// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

contract APIConsumer is ChainlinkClient{
    using Chainlink for Chainlink.Request;

    mapping(bytes32 => string) public quote;
    mapping(bytes32 => bool) public exists;

    bytes32 private jobId;
    uint256 private fee;

    event RequestQuote(bytes32 indexed requestId, string quote);

    constructor() {
        setChainlinkToken(0x326C977E6efc84E512bB9C30f76E30c160eD06FB); // Mumbai
        setChainlinkOracle(0x40193c8518BB267228Fc409a613bDbD8eC5a97b3); // Mumbai
        jobId = "7d80a6386ef543a3abb52817f6707e3b"; // ChainLink String job ID
        fee = (1 * LINK_DIVISIBILITY) / 10;
    }

    function requestQuoteData() public returns (bytes32 requestId) {
        Chainlink.Request memory req = buildChainlinkRequest(
            jobId,
            address(this),
            this.fulfill.selector
        );

        req.add("get", "https://api.kanye.rest/");

        req.add("path", "quote");

        int256 timesAmount = 1;
        req.addInt("times", timesAmount);

        return sendChainlinkRequest(req, fee);
    }

    function fulfill(bytes32 _requestId, string memory _quote)
        public
        recordChainlinkFulfillment(_requestId)
    {
        quote[_requestId] = _quote;
        exists[_requestId] = true;
        emit RequestQuote(_requestId, _quote);
    }

    function withdrawLink() public returns (bool) {
        LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
        return link.transfer(msg.sender, link.balanceOf(address(this)));
    }
}
