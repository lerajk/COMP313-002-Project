pragma solidity ^0.4.18;


import "./SimpleToken.sol";
//import "./Ownable.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";



/**
 * @title Crowdsale
 * @dev Crowdsale is a base contract for managing a token crowdsale.
 * Crowdsales have a start and end timestamps, where investors can make
 * token purchases and the crowdsale will assign them tokens based
 * on a token per ETH rate. Funds collected are forwarded to a wallet
 * as they arrive. The contract requires a MintableToken that will be
 * minted as contributions arrive, note that the crowdsale contract
 * must be owner of the token in order to be able to mint it.
 */
contract Crowdsale is Ownable {
  using SafeMath for uint256;

  // The token being sold
  SimpleToken public token;

  // start and end timestamps where investments are allowed (both inclusive)
  uint256 public startTime;
  uint256 public endTime;

  // address where funds are collected
  address public wallet;

  // how many token units a buyer gets per wei
  uint256 public rate;

  // amount of raised money in wei
  uint256 public weiRaised;

  bool public tiersInitialized = false;


  uint8 public MAX_TIERS = 2;

  struct Tier {
    uint256 discount;
    uint256 from; // from which time 
    uint256 to;  // to which time 
    uint256 duration; // days of discount period
  }

   Tier[2] public tiers;


  /**
   * event for token purchase logging
   * @param purchaser who paid for the tokens
   * @param beneficiary who got the tokens
   * @param value weis paid for purchase
   * @param amount amount of tokens purchased
   */
  event TokenPurchase(address indexed purchaser, address indexed beneficiary, uint256 value, uint256 amount);


  function Crowdsale(uint256 _startTime, uint256 _endTime, uint256 _rate, address _wallet, address _token) public {
    require(_startTime >= now);
    require(_endTime >= _startTime);
    require(_rate > 0);
    require(_wallet != address(0));
    require(_token != address(0));

    startTime = _startTime;
    endTime = _endTime;
    rate = _rate;
    wallet = _wallet;
    token = SimpleToken(_token);
  }

  // fallback function can be used to buy tokens
  function () external payable {
    buyTokens(msg.sender, now);
  }

  // low level token purchase function
  function buyTokens(address beneficiary, uint256 _purchaseTime) public payable {
    require(beneficiary != address(0));
    require(validPurchase());

    uint256 weiAmount = msg.value;

    uint256 purchaseTime = _purchaseTime;

    // calculate token amount to be created
    uint256 tokens = getTokenAmount(purchaseTime);

    // update state
    weiRaised = weiRaised.add(weiAmount);

    token.transfer(beneficiary, tokens);
    TokenPurchase(msg.sender, beneficiary, weiAmount, tokens);

    forwardFunds();
  }

  // @return true if crowdsale event has ended
  function hasEnded() public view returns (bool) {
    return now > endTime;
  }

  // Override this method to have a way to add business logic to your crowdsale when buying
  function getTokenAmount(uint256 _purchaseTime) internal view returns(uint256) {
    
    if(_purchaseTime < tiers[1].to) {
      return 0;
    }
    uint256 tokens = 0;

    for(uint8 i = 0; i < tiers.length; i++) {
      Tier _tier = tiers[i];
      if(_purchaseTime < _tier.duration && _purchaseTime >= _tier.from && _purchaseTime <= _tier.to ) {
        tokens = tokens.mul(_tier.discount).div(100);
      }
    }

    return tokens;
  }

  // send ether to the fund collection wallet
  // override to create custom fund forwarding mechanisms
  function forwardFunds() internal {
    wallet.transfer(msg.value);
  }

  // @return true if the transaction can buy tokens
  function validPurchase() internal view returns (bool) {
    bool withinPeriod = now >= startTime && now <= endTime;
    bool nonZeroPurchase = msg.value != 0;
    return withinPeriod && nonZeroPurchase;
  }

    // @initialization of tiers
    function initTiers(uint256[] discount, uint256[] from, uint256[] to, uint256[] duration) public onlyOwner {
    require(discount.length == MAX_TIERS && from.length == MAX_TIERS && to.length == MAX_TIERS && duration.length == MAX_TIERS);

    for(uint8 i=0;i<MAX_TIERS; i++) {
      require(discount[i] > 0);
      require(to[i] > from[i]);
      require(duration[i] > 0);
      require(from[i] > 0);
      if(i>0) {
        require(from[i] > to[i-1]);
      }

      tiers[i] = Tier({
        discount: discount[i],
        from: from[i],
        to: to[i],
        duration: duration[i]
      });


    }

    tiersInitialized = true;
  }



} //contract ends