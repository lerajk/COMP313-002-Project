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

    before(async function() {
      await advanceBlock()
    })

    beforeEach(async () => {
      START_TIME = latestTime();
      END_TIME = latestTime() + duration.weeks(1);
    })

      it('should initalize all the variables with correct values', async() => {

      let crowdsale = await Crowdsale.new(START_TIME, END_TIME, RATE, TOKEN, WALLET);
      let startTime = await crowdsale.startTime();
      assert(startTime.toString() == START_TIME.toString());
      //const expectedEndTime = START_TIME + duration.days(DURATION);
      let endTime = await crowdsale.endTime()
      assert(endTime.toString() == END_TIME.toString());
      let token = await crowdsale.token()
      assert(token == TOKEN);
      let rate = await crowdsale.rate();
      assert(rate == RATE);
      let wallet = await crowdsale.wallet();
      assert(wallet == WALLET);
      let weiRaised = await crowdsale.weiRaised();
      assert(weiRaised == 0)
      let tiersInitialized = await crowdsale.tiersInitialized();
      assert(tiersInitialized == false);

    	})

	})

    describe('Token sale', async () => { 

        let START_TIME;
        let END_TIME;
        let RATE = 1000; //1 ETH = 1000 CC for base rate 
        let token;
        let WALLET = accounts[8];
        let OWNER = accounts[0]
        let NON_OWNER = accounts[1]
        let crowdsale;
   
       before(async function() {
       await advanceBlock()
      })

        //WIP
        beforeEach(async () => {
        START_TIME = latestTime();
        END_TIME  = latestTime() + duration.weeks(1);
        token = await Token.new();
        crowdsale = await Crowdsale.new(START_TIME, END_TIME, RATE, WALLET, token.address)
        let discounts = [200, 300];
        let from = [START_TIME, duration.days(3)]
        let to = [duration.days(2), duration.days(5)]
        //let duration = [latestTime() + duration.days(1), latestTime() + duration.days(2),latestTime() + duration.weeks(1)]
        let duration = END_TIME;
        await crowdsale.initTiers(discounts, from, to, duration, { from : OWNER })
        await token.transfer(crowdsale.address, ether(1000));
        //await increaseTimeTo(START_TIME + duration.days(1));
        
      }

    })


}) //contract ends

