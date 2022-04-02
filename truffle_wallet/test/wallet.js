const { expectRevert } = require("@openzeppelin/test-helpers");
const Wallet = artifacts.require("Wallet");

contract("Wallet", (accounts) =>{
    let wallet;
    beforeEach(async () => {
        wallet = await Wallet.new(
            [accounts[0], accounts[1], accounts[2]], 
            2);
        await web3.eth.sendTransaction({
            from: accounts[0], 
            to: wallet.address, 
            value: 1000});
    });
    // Test for initialization of approvers list and quorum 
    // BN.js
    // toNumber() vs toString()
    it("Should have correct number of approvers and quorum", async () => {
        const approvers = await wallet.getApprovers();
        const quorum = await wallet.quorum();
        assert(approvers.length == 3);
        assert(approvers[0] == accounts[0]);
        assert(approvers[1] == accounts[1]);
        assert(approvers[2] == accounts[2]);
        assert(quorum.toNumber() == 2);
    });

    // Test for createTransfer()
    // Happy path
    it("Should create a transfer", async () => {
        await wallet.createTransfer(100, accounts[3], {from: accounts[0]});

        const transfers = await wallet.getTransfers();
        assert(transfers.length == 1);
        assert(transfers[0].id == '0');
        assert(transfers[0].amount == '100');
        assert(transfers[0].to == accounts[3]);
        assert(transfers[0].approvals == '0');
        assert(transfers[0].sent == '0');
    });
    // Unhappy path
    it("Should NOT create a transfer if the sender is not in approvers", async () => {
        await expectRevert(
            wallet.createTransfer(100, accounts[5], {from: accounts[4]}),
            "Only approver allowed."
        );
    });

    // Test for approveTransfer
    // Happy path
    it("Should increment transfer's approvals by 1.", async () => {
        await wallet.createTransfer(100, accounts[3], {from: accounts[0]});
        await wallet.approveTransfer(0, {from: accounts[1]});

        const transfers = await wallet.getTransfers();
        const balance = await web3.eth.getBalance(wallet.address);
        assert(transfers[0].approvals == "1");
        assert(transfers[0].sent == false);
        assert(balance == "1000");
    });
    // Second happy path with transfer sent
    it("Should send transfer if quorum is reached.", async () => {
        // Need to check both before and after amount
        const balanceBefore = web3.utils.toBN(await web3.eth.getBalance(accounts[7]));

        await wallet.createTransfer(100, accounts[7], {from: accounts[0]});
        await wallet.approveTransfer(0, {from: accounts[1]});
        await wallet.approveTransfer(0, {from: accounts[2]});

        const transfers = await wallet.getTransfers();
        const balance = await web3.eth.getBalance(wallet.address);
        const balanceAfter = web3.utils.toBN(await web3.eth.getBalance(accounts[7]));


        assert(transfers[0].approvals == "2");
        assert(transfers[0].sent == true);
        assert(balance == "900");

        assert(balanceAfter.sub(balanceBefore).toNumber() == 100);
    });
    // Unhappy Path approver is not in the approvers list
    it("Should NOT approve if the caller is not in the approvers list.", async () => {
        await wallet.createTransfer(100, accounts[3], {from: accounts[0]});
        await expectRevert(
            wallet.approveTransfer(0, {from: accounts[4]}),
            "Only approver allowed."
        );
    });
    // Unhappy path when the transfer is already sent
    it("Should NOT approve if the transfer is sent.", async () => {
        await wallet.createTransfer(100, accounts[3], {from: accounts[0]});
        await wallet.approveTransfer(0, {from: accounts[1]});
        await wallet.approveTransfer(0, {from: accounts[2]});

        await expectRevert(
            wallet.approveTransfer(0, {from: accounts[0]}),
            "Transfer has already been sent."
        );

    });
    // Unhappy path when the approver is already approved once
    it("Should NOT approve a transfer twice.", async () => {
        await wallet.createTransfer(100, accounts[3], {from: accounts[0]});
        await wallet.approveTransfer(0, {from: accounts[1]});

        await expectRevert(
            wallet.approveTransfer(0, {from: accounts[1]}),
            "Cannot approve transfer again."
        );
    });

});