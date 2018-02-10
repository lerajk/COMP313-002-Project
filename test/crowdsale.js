var Crowdsale = artifacts.require("./Crowdsale.sol");
var Token = artifacts.require("./SimpleToken.sol")
import {advanceBlock} from './helpers/advanceToBlock'
import ether  from './helpers/ether';
const EVMRevert = require('./helpers/EVMRevert.js')
import {increaseTimeTo, duration} from './helpers/increaseTime'
import latestTime from './helpers/latestTime'
import BigNumber  from 'bignumber.js'

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()


contract('Crowdsale', function(accounts) {

	describe('Crowdsale Initialization', async () => {

	let START_TIME;
	let END_TIME;
    let RATE = 10;
    let TOKEN = accounts[9];
    let WALLET = accounts[9];

      it('should initalize all the variables with correct values', async() => {

      let crowdsale = await Crowdsale.new(START_TIME, DURATION, RATE, WALLET, TOKEN, CAP, MIN_WEI)
      let startTime = await crowdsale.startTime();
      assert(startTime.toString() == START_TIME.toString());
      const expectedEndTime = START_TIME + duration.days(DURATION);
      let endTime = await crowdsale.endTime()
      assert(endTime.toString() == expectedEndTime.toString());

      let token = await crowdsale.token()
      assert(token == TOKEN);
      let rate = await crowdsale.rate();
      assert(rate == RATE);
      let wallet = await crowdsale.wallet();
      assert(wallet == WALLET);
      let weiRaised = await crowdsale.weiRaised();
      assert(weiRaised == 0)
      let cap = await crowdsale.cap();
      assert(cap == CAP);

      let tiersInitialized = await crowdsale.tiersInitialized();
      assert(tiersInitialized == false);

      var stage = await crowdsale.getStage();
      assert(stage == STAGE.Preparing);


    	})

	})

})

