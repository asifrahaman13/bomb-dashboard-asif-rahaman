import React, { useMemo, useEffect, useState } from 'react';
import './Dasboard.css';
import { roundAndFormatNumber } from '../../0x';
import { useWallet } from 'use-wallet';
import moment from 'moment';
import useCurrentEpoch from '../../hooks/useCurrentEpoch';
import useTreasuryAllocationTimes from '../../hooks/useTreasuryAllocationTimes';
import ProgressCountdown from '../Boardroom/components/ProgressCountdown';
import useBombStats from '../../hooks/useBombStats';
import usebShareStats from '../../hooks/usebShareStats';
import useBondStats from '../../hooks/useBondStats';
import useRedeem from '../../hooks/useRedeem';
import useBank from '../../hooks/useBank';
import useStatsForPool from '../../hooks/useStatsForPool';
import UnlockWallet from '../../components/UnlockWallet';
import useShareStats from '../../hooks/usebShareStats';
import useEarnings from '../../hooks/useEarnings';
import useStakedBalance from '../../hooks/useStakedBalance';
import useTotalStakedOnBoardroom from '../../hooks/useTotalStakedOnBoardroom';
import { getDisplayBalance } from '../../utils/formatBalance';
import useStakedTokenPriceInDollars from '../../hooks/useStakedTokenPriceInDollars';
import useStakedBalanceOnBoardroom from '../../hooks/useStakedBalanceOnBoardroom';
import useBombFinance from '../../hooks/useBombFinance';
import useFetchBoardroomAPR from '../../hooks/useFetchBoardroomAPR';
import useEarningsOnBoardroom from '../../hooks/useEarningsOnBoardroom';
import useClaimRewardCheck from '../../hooks/boardroom/useClaimRewardCheck';
import useTokenBalance from '../../hooks/useTokenBalance';
import useTotalValueLocked from '../../hooks/useTotalValueLocked';
import useApprove, {ApprovalState} from '../../hooks/useApprove';
import useHarvestFromBoardroom from '../../hooks/useHarvestFromBoardroom';

import useRedeemOnBoardroom from '../../hooks/useRedeemOnBoardroom';


const Dashboard = () => {
  const formatNum = (n) => {
    if (n < 1e3) return n;
    if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + 'K';
    if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + 'M';
    if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + 'B';
    if (n >= 1e12) return +(n / 1e12).toFixed(1) + 'T';
  };

  const bondStat = useBondStats();
  const boardroomAPR = useFetchBoardroomAPR();
  const bombFinance = useBombFinance();
  const bombStats = useBombStats();
  const bShareStats = usebShareStats();
  const tBondStats = useBondStats();
  const currentEpoch = useCurrentEpoch();
  const { to } = useTreasuryAllocationTimes();

  const bombCirculatingSupply = useMemo(() => (bombStats ? String(bombStats.circulatingSupply) : null), [bombStats]);
  const bShareCirculatingSupply = useMemo(
    () => (bShareStats ? String(bShareStats.circulatingSupply) : null),
    [bShareStats],
  );
  const tBondCirculatingSupply = useMemo(
    () => (tBondStats ? String(tBondStats.circulatingSupply) : null),
    [tBondStats],
  );

  const bombTotalSupply = useMemo(() => (bombStats ? String(bombStats.totalSupply) : null), [bombStats]);
  const bShareTotalSupply = useMemo(() => (bShareStats ? String(bShareStats.totalSupply) : null), [bShareStats]);
  const tBondTotalSupply = useMemo(() => (tBondStats ? String(tBondStats.totalSupply) : null), [tBondStats]);
  const bombPriceInDollars = useMemo(
    () => (bombStats ? Number(bombStats.priceInDollars).toFixed(2) : null),
    [bombStats],
  );
  const bSharePriceInDollars = useMemo(
    () => (bShareStats ? Number(bShareStats.priceInDollars).toFixed(2) : null),
    [bShareStats],
  );
  const tBondPriceInDollars = useMemo(
    () => (tBondStats ? Number(tBondStats.priceInDollars).toFixed(2) : null),
    [tBondStats],
  );

  const [bankid, setBankId] = useState('BombBtcbLPBShareRewardPool');

  const abc = (e) => {
    e.preventDefault();
    setBankId(e.target.id);
    console.log(bankid);
  };

  const bank = useBank(bankid);
  const { account } = useWallet();
  const { onRedeem } = useRedeem(bank);

  const earnings = useEarnings(bank.contract, bank.earnTokenName, bank.poolId);
  
  const bshareBank = useBank("BshareBnbLPBShareRewardPool");
  const bshareEarnings = useEarnings(bshareBank.contract, bshareBank.earnTokenName, bshareBank .poolId);

  const bombBnb = useBank('BombBtcbLPBShareRewardPool');
  let bombStat = useStatsForPool(bombBnb);

  const bshareBnb = useBank('BshareBnbLPBShareRewardPool');
  let bshareStat = useStatsForPool(bshareBnb);

  const tShareStats = useShareStats();

  const tokenStats = bombStats;
  const bshareTokenStat=bshareStat;

  const tokenPriceInDollars = useMemo(
    () => (tokenStats ? Number(tokenStats.priceInDollars).toFixed(2) : null),
    [tokenStats],
  );

  const bshareTokePriceInDollars = useMemo(
    () => ( bshareTokenStat ? Number( bshareTokenStat.priceInDollars).toFixed(2) : null),
    [bshareTokenStat],
  );

  const bombearnedInDollars = (Number(tokenPriceInDollars) * Number(getDisplayBalance(earnings))).toFixed(2);

  const bshareearnedInDollars = (Number(bshareTokePriceInDollars) * Number(getDisplayBalance( bshareEarnings ))).toFixed(2);




//stack

  const bshareStakedBalance = useStakedBalance(bshareBank.contract, bshareBank.poolId);
  const stakedTokenPriceInDollars = useStakedTokenPriceInDollars(bshareBank.depositTokenName, bshareBank.depositToken);
  const stacktokenPriceInDollars = useMemo(
    () => (stakedTokenPriceInDollars ? stakedTokenPriceInDollars : null),
    [stakedTokenPriceInDollars],
  );
  const bshareEarnedInDollars = (
    Number(stacktokenPriceInDollars) * Number(getDisplayBalance(bshareStakedBalance, bshareBank.depositToken.decimal))
  ).toFixed(2);



  const bombStakedBalance = useStakedBalance(bombBnb.contract, bombBnb.poolId);
  const bombstakedTokenPriceInDollars = useStakedTokenPriceInDollars(bombBnb.depositTokenName, bombBnb.depositToken);
  const bombstacktokenPriceInDollars = useMemo(
    () => (bombstakedTokenPriceInDollars ? bombstakedTokenPriceInDollars : null),
    [bombstakedTokenPriceInDollars],
  );
  const bombEarnedInDollars = (
    Number(bombstacktokenPriceInDollars) * Number(getDisplayBalance(bombStakedBalance, bombBnb.depositToken.decimal))
  ).toFixed(2);


  // boardroom
  const stakedBalance = useStakedBalanceOnBoardroom();
  const totalStaked = useTotalStakedOnBoardroom();
  const boardroomTokenPriceInDollars = useStakedTokenPriceInDollars('BSHARE', bombFinance.BSHARE);
  const boardroomPriceInDollars = useMemo(
    () =>
      stakedTokenPriceInDollars
        ? (Number(boardroomTokenPriceInDollars ) * Number(getDisplayBalance(stakedBalance))).toFixed(2).toString()
        : null,
    [boardroomTokenPriceInDollars , stakedBalance],
  );

  // Earnings in boardroom

  const boardRoomEarnings = useEarningsOnBoardroom();
  const canClaimReward = useClaimRewardCheck();

  const boardRoomEarningInDollars = useMemo(
    () => (bombStats ? Number(bombStats.priceInDollars).toFixed(2) : null),
    [bombStats],
  );

  const earnedInDollars = (Number(tokenPriceInDollars) * Number(getDisplayBalance(boardRoomEarnings))).toFixed(2);


  const bondBalance = useTokenBalance(bombFinance?.BBOND);


  // TVL
  const TVL = useTotalValueLocked();

  // Boardfroom onClick listners
  const [approveStatus, approve] = useApprove(bombFinance.BSHARE, bombFinance.contracts.Boardroom.address);

  // Boardfroom onClick listners for claiming rewards

  const {onReward} = useHarvestFromBoardroom();

  const { onRedeem:boardRoomWithdraw } = useRedeemOnBoardroom();

  return account && bank ? (
    <>
      {/* <button onClick={abc}>click</button> */}
      <div className="dashboard">
        <img className="topology-1-icon" alt="" src="../topology1.svg" />
        <img className="dashboard-child" alt="" src="../group-3055.svg" />
        <img className="topology-1-icon1" alt="" src="../topology11.svg" />
        <img className="topology-1-icon2" alt="" src="../topology12.svg" />
        <img className="dashboard-item" alt="" src="../group-241.svg" />
        <img className="dashboard-item" alt="" src="../group-375.svg" />
        <img className="rectangle-icon" alt="" src="../rectangle-22665.svg" />
        <img className="line-icon" alt="" src="../line-82.svg" />
        <b className="boardroom">Boardroom</b>
        <img className="bshares-icon" alt="" src="../bshares@2x.png" />
        <div className="bshares-parent">
          <img className="bshares-icon1" alt="" src="../bshares1@2x.png" />
          <div className="your-stake-60000-container">
            <p className="your-stake">
              <span>{`Your Stake: `}</span>
            </p>
            <p className="your-stake">
              <span>{`    `}</span>
              <span className="span">
              {getDisplayBalance(stakedBalance)}
              </span>
            </p>
            <p className="btcb">
              <span>≈ ${boardroomPriceInDollars }
              </span>
            </p>
          </div>
        </div>
        <div className="earned-16604413-29888-parent">
          <div className="your-stake-60000-container">
            <p className="your-stake">
              <span>{`Earned: `}</span>
            </p>
            <p className="your-stake">
              <span>{`    `}</span>
              <span className="span">
                {getDisplayBalance(boardRoomEarnings)}
              </span>
            </p>
            <p className="btcb">
              <span>≈ $
              {earnedInDollars}
              </span>
            </p>
          </div>
          <img className="bomb-icon" alt="" src="../bomb@2x.png" />
        </div>
        <div className="stake-bshare-and">Stake BSHARE and earn BOMB every epoch</div>
        <button className="withdraw-buttons">
          <div className="withdraw"   onClick={boardRoomWithdraw}>Withdraw</div>
          <img className="icon-arrow-down-circle" alt="" src="../icon--arrowdowncircle.svg" />
        </button>
        <div className="deposit-buttons">
          <div className="deposit" onClick={approve}>Deposit</div>
          <img className="icon-arrow-down-circle" alt="" src="../icon--arrowdowncircle1.svg" />
        </div>
        <div className="daily-returns-2-container">
          <p className="your-stake">
            <span>Daily Returns:</span>
          </p>
          <p className="p4">
            <span className="span2">
              <span>
                {boardroomAPR.toFixed(2)}
              </span>
              <span className="span3"></span>
            </span>
          </p>
        </div>
        <div className="group-div">
          <div className="rectangle-parent">
            <div className="group-child" />
            <img className="group-item" alt="" src="../ellipse-287.svg" />
            <div className="bbond-wrapper">
              <img className="bbond-icon" alt="" src="../bbond@2x.png" />
            </div>
          </div>
        </div>
        <div className="current-epoch-258-container">
          <p className="your-stake">
            <span className="current-epoch1">Current Epoch</span>
          </p>
          <p className="p5">
            <b className="b">{Number(currentEpoch)}</b>
          </p>
        </div>
        <div className="next-epoch-in-container">
          <p className="your-stake">
            <b className="b1">
              <ProgressCountdown base={moment().toDate()} hideBar={true} deadline={to} description="Next Epoch" />
            </b>
          </p>
          <p className="next-epoch-in">
            <span className="current-epoch1">Next Epoch in</span>
          </p>
        </div>
        <img className="dashboard-child1" alt="" src="../line-75.svg" />
        <img className="dashboard-child2" alt="" src="../line-81.svg" />
        <img className="dashboard-child3" alt="" src="../line-85.svg" />
        <img className="dashboard-child4" alt="" src="../line-85.svg" />
        <img className="dashboard-child5" alt="" src="../line-87.svg" />
        <img className="dashboard-child6" alt="" src="../line-87.svg" />
        <img className="dashboard-child7" alt="" src="../line-76.svg" />
        <div className="unity">$BOMB</div>
        <div className="ellipse-parent">
          <img className="group-inner" alt="" src="../ellipse-287.svg" />
          <img className="bshares-icon2" alt="" src="../bshares2@2x.png" />
        </div>
        <div className="unity1">$BSHARE</div>
        <div className="unity-parent">
          <div className="unity2">
            {formatNum(parseInt(roundAndFormatNumber(bShareCirculatingSupply, 2).replace(/,/g, '')))}
          </div>
          <div className="unity3">
            {formatNum(parseInt(roundAndFormatNumber(bShareTotalSupply, 2).replace(/,/g, '')))}
          </div>
          <div className="unity4">
            <p className="your-stake">${roundAndFormatNumber(bSharePriceInDollars, 2)}</p>
            <p className="btcb">13000 BTCB</p>
          </div>
          <img className="wmetamask-icon" alt="" src="../wmetamask@2x.png" />
        </div>
        <div className="unity5">$BBOND</div>
        <div className="unity-group">
          <div className="unity6">
            {formatNum(parseInt(roundAndFormatNumber(tBondCirculatingSupply, 2).replace(/,/g, '')))}
          </div>
          <div className="unity7">
            {formatNum(parseInt(roundAndFormatNumber(tBondTotalSupply, 2).replace(/,/g, '')))}
          </div>
          <div className="unity8">
            <p className="your-stake">${roundAndFormatNumber(tBondPriceInDollars, 2)}</p>
            <p className="btcb">1.15 BTCB</p>
          </div>
          <img className="wmetamask-icon" alt="" src="../wmetamask@2x.png" />
        </div>
        <div className="last-epoch-twap-container">
          <span>
            <span className="last-epoch-twap">Last Epoch TWAP:</span>
            <span className="span4">{` `}</span>
          </span>
          <span className="span5">1.22</span>
        </div>
        <div className="unite-pricetwap">
          <span>
            <span className="last-epoch-twap">Live TWAP:</span>
            <span className="span4">{` `}</span>
          </span>
          <span className="span5">1.17</span>
        </div>
        <div className="tvl-5002412">
          <span>
            <span className="last-epoch-twap">TVL:</span>
            <span className="span4">{` `}</span>
          </span>
          <b className="b2">
            ${parseInt(TVL)} 
          </b>
        </div>
        <div className="wmetamask-parent">
          <img className="wmetamask-icon2" alt="" src="../wmetamask@2x.png" />
          <div className="unity9">
            <p className="your-stake">${roundAndFormatNumber(bombPriceInDollars, 2)}</p>
            <p className="btcb">1.05 BTCB</p>
          </div>
          <div className="unity10">
            {formatNum(parseInt(roundAndFormatNumber(bombCirculatingSupply, 2).replace(/,/g, '')))}
          </div>
          <div className="unity11">
            {formatNum(parseInt(roundAndFormatNumber(bombTotalSupply, 2).replace(/,/g, '')))}
          </div>
        </div>
        <div className="bomb-finance-summary">Bomb Finance Summary</div>
        <div className="rectangle-div" />
        <div className="recommended-wrapper">
          <div className="recommended">Recommended</div>
        </div>
        <div className="total-staked-7232-parent">
          <div className="total-staked-7232-container">
            <span>{`Total Staked:      `}</span>
            <span className="span9">
              {getDisplayBalance(totalStaked)}
            </span>
          </div>
          <img className="bshares-icon3" alt="" src="../bshares3@2x.png" />
        </div>
        <div className="dashboard-inner1">
          <div className="frame-wrapper">
            <div className="read-investment-strategy-parent">
              <div className="read-investment-strategy">Read Investment Strategy</div>
              <img className="vector-icon" alt="" src="../vector.svg" />
            </div>
          </div>
        </div>
        <div className="vector-parent">
          <img className="group-child1" alt="" src="../rectangle-22664.svg" />
          <img className="group-child2" alt="" src="../line-73.svg" />
          <img className="group-child3" alt="" src="../line-78.svg" />
          <img className="group-child4" alt="" src="../line-73.svg" />
          <div className="stake-your-lp">Stake your LP tokens in our farms to start earning $BSHARE</div>
          <b className="bomb-farms">Bomb Farms</b>
          <b className="bomb-btcb">{`BOMB-BTCB `}</b>
          <img className="bomb-bitcoin-lp-icon" alt="" src="../bombbitcoinlp@2x.png" />
          <div className="bshares-group">
            <img className="bshares-icon4" alt="" src="../bshares4@2x.png" />
            <div className="earned-64413-container">
              <p className="your-stake">
                <span>{`Earned: `}</span>
              </p>
              <p className="p10">
                <span>{`    `}</span>
                <span className="span2">
                {getDisplayBalance(earnings)}
                </span>
              </p>
              <p className="btcb">
                <span className="span2">≈ {bombearnedInDollars}</span>
              </p>
            </div>
          </div>
          <div className="bomb-bitcoin-lp-parent">
            <img className="bomb-bitcoin-lp-icon1" alt="" src="../bombbitcoinlp1@2x.png" />
            <div className="earned-64413-container">
              <p className="your-stake">
                <span>Your Stake</span>
              </p>
              <p className="p10">
                <span>{`    `}</span>
                <span className="span2">
                  {getDisplayBalance(bombStakedBalance)}
                </span>
              </p>
              <p className="btcb">
                <span className="span2">≈ $
                {bombEarnedInDollars}</span>
              </p>
            </div>
          </div>
          <div className="daily-returns-2-container1">
            <p className="your-stake">
              <span>{`Daily Returns: `}</span>
            </p>
            <p className="p4">
              <span className="span2">
                <span>{bombStat?.dailyAPR}%</span>
                <span className="span3"></span>
              </span>
            </p>
          </div>
          <div className="tvl-1008430">
            <span>{`TVL: `}</span>
            <span className="span9">{bombStat?.TVL}%</span>
          </div>
          <div className="claim-rewards-buttons">
            <div className="recommended" >Claim Rewards</div>
            <img className="claim-rewards-buttons-child" alt="" src="../group-535.svg" />
          </div>
          <div className="claim-rewards-buttons1">
            <div className="recommended">Claim All</div>
            <img className="claim-rewards-buttons-child" alt="" src="../group-5351.svg" />
          </div>
          <div className="withdraw-buttons1">
            <div
              className="deposit"
              id="BombBtcbLPBShareRewardPool"
              onClick={(e) => {
                abc(e);
                onRedeem();
              }}
            >
              Witdraw
            </div>
            <img className="icon-arrow-down-circle" alt="" src="../icon--arrowdowncircle2.svg" />
          </div>
          <div className="deposit-buttons1">
            <div className="deposit">Deposit</div>
            <img className="icon-arrow-down-circle" alt="" src="../icon--arrowdowncircle3.svg" />
          </div>
          <div className="bshares-container">
            <img className="bshares-icon4" alt="" src="../bshares4@2x.png" />
            <div className="earned-64413-container">
              <p className="your-stake">
                <span>{`Earned: `}</span>
              </p>
              <p className="p10">
                <span>{`    `}</span>
                <span className="span2">
               {getDisplayBalance(bshareEarnings)}
                </span>
              </p>
              <p className="btcb">
                <span className="span2">≈ $ {bshareEarnedInDollars}</span>
              </p>
            </div>
          </div>
          <div className="bshare-bnb-lp-parent">
            <img className="bshare-bnb-lp-icon" alt="" src="../bsharebnblp@2x.png" />
            <div className="earned-64413-container">
              <p className="your-stake">
                <span>Your Stake</span>
              </p>
              <p className="p10">
                <span>{`    `}</span>
                <span className="span2">
                {getDisplayBalance(bshareStakedBalance)}
                </span>
              </p>
              <p className="btcb">
                <span className="span2">≈ $
                { bshareEarnedInDollars }
                </span>
              </p>
            </div>
          </div>
          <div className="daily-returns-2-container2">
            <p className="your-stake">
              <span>{`Daily Returns: `}</span>
            </p>
            <p className="p4">
              <span className="span2">{bshareStat?.dailyAPR}%</span>
            </p>
          </div>
          <div className="tvl-10084301">
            <span>{`TVL: `}</span>
            <span className="span9">{bshareStat?.TVL}%</span>
          </div>
          <div className="claim-rewards-buttons2">
            <div className="recommended">Claim Rewards</div>
            <img className="claim-rewards-buttons-child" alt="" src="../group-5352.svg" />
          </div>
          <div className="withdraw-buttons2">
            <div
              className="deposit"
              id="BshareBnbLPBShareRewardPool"
              onClick={(e) => {
                abc(e);
                onRedeem();
              }}
            >
              Withdraw
            </div>
            <img className="icon-arrow-down-circle" alt="" src="../icon--arrowdowncircle4.svg" />
          </div>
          <b className="bshare-bnb">BSHARE-BNB</b>
          <img className="bshare-bnb-lp-icon1" alt="" src="../bsharebnblp1@2x.png" />
          <img className="group-child5" alt="" src="../rectangle-22704.svg" />
          <div className="group-child6" />
          <div className="recommended-container">
            <div className="recommended">Recommended</div>
          </div>
          <div className="recommended-frame">
            <div className="recommended">Recommended</div>
          </div>
          <div className="deposit-buttons2">
            <div className="deposit">Deposit</div>
            <img className="icon-arrow-down-circle" alt="" src="../icon--arrowdowncircle5.svg" />
          </div>
          <div className="ellipse-group">
            <img className="ellipse-icon" alt="" src="../ellipse-2872.svg" />
            <img className="bshares-icon6" alt="" src="../bshares4@2x.png" />
          </div>
          <div className="ellipse-container">
            <img className="ellipse-icon" alt="" src="../ellipse-2872.svg" />
            <img className="bshares-icon6" alt="" src="../bshares4@2x.png" />
          </div>
          <div className="ellipse-parent1">
            <img className="ellipse-icon" alt="" src="../ellipse-2872.svg" />
            <img className="bshares-icon6" alt="" src="../bshares4@2x.png" />
          </div>
        </div>
        <div className="dashboard-child8" />
        <div className="bbond-can-be">
          BBOND can be purchased only on contraction periods, when TWAP of BOMB is below 1
        </div>
        <img className="dashboard-child9" alt="" src="../line-80.svg" />
        <b className="bonds">{`Bonds `}</b>
        <div className="bomb-is-over">Bomb is over peg</div>
        <div className="ubond-available-in">0.0000 UBond available in wallet</div>
        <b className="bbond-62872">BBond = 
        {Number(bondStat?.tokenInFtm).toFixed(4) || '-'}
         BTCB</b>
        <div className="current-price-unite2">Current Price: (Bomb)^2</div>
        <div className="purchase-bbond">Purchase BBond</div>
        <div className="redeem-bomb">Redeem Bomb</div>
        <div className="purchase-buttons">
          <div className="deposit">Purchase</div>
          <img className="purchase-buttons-child" alt="" src="../group-2945.svg" />
        </div>
        <div className="redeem-buttons">
          <div className="deposit">Redeem</div>
          <img className="icon-arrow-down-circle" alt="" src="../icon--arrowdowncircle6.svg" />
        </div>
        <div className="available-to-redeem-parent">
          <div className="total-staked-7232-container">{`Available to redeem: `}</div>
          <div className="div">
          {getDisplayBalance(bondBalance)}
          </div>
        </div>
        <img className="bbond-icon1" alt="" src="../bbond1@2x.png" />
        <img className="bbond-icon2" alt="" src="../bbond2@2x.png" />
        <div className="rectangle-group">
          <div className="frame-child" />
          <b className="latest-news">Latest News</b>
        </div>
        <div className="unity12">Price</div>
        <div className="unity13">Current Supply</div>
        <div className="unity14">Total Supply</div>
        <div className="group-parent">
          <div className="rectangle-container">
            <div className="group-child9" />
            <a
                  href="https://discord.bomb.money"
                  rel="noopener noreferrer"
                  target="_blank"
                  style={{ color: '#dddfee' }}
                >
            <b className="chat-on-discord">Chat on Discord</b>
            </a>
          </div>
          <img className="group-child10" alt="" src="../ellipse-303.svg" />
          <img className="pw4945914-1-icon" alt="" src="../pw4945914-1@2x.png" />
        </div>
        <div className="group-container">
          <div className="group-wrapper">
            <div className="group-wrapper">
              <div className="group-child11" />
              <a
                href="https://docs.bomb.money"
                rel="noopener noreferrer"
                target="_blank"
              >
              <b className="read-docs">Read Docs</b>
              </a>
            </div>
          </div>
          <img className="group-child12" alt="" src="../ellipse-304.svg" />
          <img className="ww2991106-1-icon" alt="" src="../ww2991106-1@2x.png" />
        </div>
        <div className="rectangle-parent2">
          <div className="group-child13" />
          <div className="group-child14" />
          <div className="invest-now">Invest Now</div>
        </div>
        <div className="tvl-10084302">
          <span>{`TVL: `}</span>
          <span className="span9">$1,008,430</span>
        </div>
        <div className="claim-rewards-buttons3">
          <div className="recommended" onClick={onReward}>Claim Rewards</div>
          <img className="group-icon" alt="" src="../group-5353.svg" />
        </div>
        <div className="dashboard-child10" />
        <img className="bomb-icon1" alt="" src="../bomb1@2x.png" />
        <div className="ellipse-parent2">
          <img className="ellipse-icon" alt="" src="../ellipse-2872.svg" />
          <img className="bshares-icon6" alt="" src="../bshares4@2x.png" />
        </div>
      </div>
    </>
  ) : !bank ? (
    <BankNotFound />
  ) : (
    <UnlockWallet />
  );
};

const BankNotFound = () => {
  return <>bank not found</>;
};

export default Dashboard;
