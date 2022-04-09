import { createContext,useEffect,useState } from "react";
import { useMoralis } from 'react-moralis'

import { dogeAbi,bitcoinAbi,solanaAbi,usdcAbi, bitcoinAddress, dogeAddress, solanaAddress, usdcAddress } from "../lib/constants";

export const  RobinhoodContext=createContext()

export const RobinhoodProvider=({children})=>{

    const [currentAccount, setCurrentAccount] = useState('')
    const [formattedAccount, setFormattedAccount] = useState('')
    const [coinSelect, setCoinSelect] = useState('DOGE')
    const [toCoin, setToCoin] = useState('')
    const [balance, setBalance] = useState('')
    const [amount, setAmount] = useState('')

    const { isAuthenticated, authenticate, user, logout, Moralis, enableWeb3 } = useMoralis()

    useEffect(()=>{

      const xyz=async()=>{

        if(isAuthenticated){
            const account = user.get("ethAddress")
            let formatAccount=account.slice(0,4)+`...` + account.slice(-4)
            setFormattedAccount(formatAccount)
            setCurrentAccount(account)
            const currentBalance = await Moralis.Web3API.account.getNativeBalance({
              chain:"rinkeby",
              address:currentAccount
            })
        
            const balanceToEth=Moralis.Units.FromWei(currentBalance.balance)
            const formattedBalance=parseFloat(balanceToEth).toFixed(3)
            setBalance(formattedBalance)
        
        }
      }
      xyz()

    },[isAuthenticated,enableWeb3])

    useEffect(() => {
    if (!currentAccount) return
    ;(async () => {
      const response = await fetch('/api/createUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: currentAccount,
        }),
      })

      const data = await response.json()
    })()
  }, [currentAccount])

  //depending on which coin we select it must grab address and Abi
  const getContractAddress=()=>{
if(coinSelect==='BTC') return bitcoinAddress
if(coinSelect==='DOGE') return dogeAddress
if(coinSelect==='SOL') return solanaAddress
if(coinSelect==='USDC') return usdcAddress
  }

  const getToAddress=()=>{
if(coinSelect==='BTC') return bitcoinAddress
if(coinSelect==='DOGE') return dogeAddress
if(coinSelect==='SOL') return solanaAddress
if(coinSelect==='USDC') return usdcAddress
}

const getToAbi=()=>{

    if(coinSelect==='BTC') return bitcoinAbi
    if(coinSelect==='DOGE') return dogeAbi
    if(coinSelect==='SOL') return solanaAbi
    if(coinSelect==='USDC') return usdcAbi

  }

  const mint =async()=>{
    try {
      if(coinSelect==='ETH'){
        if(!isAuthenticated) return 
        await Moralis.enableWeb3()
        const contactAddess=getToAddress()
        const abi = getToAbi()

        let options ={
          contractAddress:contactAddess,
          functionName:"mint",
          abi:abi,
          params:{
            to:currentAccount,
            amount:Moralis.Units.Token("50",'18')
          }
        }
       sendEth()
       const transaction = await Moralis.executeFunction(options)
       const receipt = await transaction.wait(4)
       saveTransaction(receipt.transactionHash,amount,receipt.to)

      }
    } catch (error) {
      console.log(error.message)
    }
  }

  const swapTokens=async()=>{
try {
  if(!isAuthenticated) return
  await Moralis.enableWeb3()

  if(coinSelect===toCoin) return 

  const fromOptions ={
    type:"erc20",
    amount:Moralis.Units.Token(amount,'18'),
    reciever:getContractAddress(),
    contractAddress:getContractAddress()
  }

  const toMintOptions={
    contactAddess:getToAddress(),
    functionName:"mint",
    abi:getToAbi(),
    params:{
      to:currentAccount,
      amount:Moralis.Units.Token(amount,'18')
    }
  }

  let fromTransaction = await Moralis.transfer(fromOptions)
  let toMintTransaction = await Moralis.executeFunction(toMintOptions)
  let fromReceipt = await fromTransaction.wait()
  let toReceipt = await toMintTransaction.wait()
  console.log(fromReceipt)
  console.log(toReceipt)

} catch (error) {
  console.log(error)
}
  }

  //Send eth function
  const sendEth = async () => {
    if (!isAuthenticated) return
    const contractAddress = getToAddress()

    let options = {
      type: 'native',
      amount: Moralis.Units.ETH('0.01'),
      receiver: contractAddress,
    }
    const transaction = await Moralis.transfer(options)
    const receipt = await transaction.wait()
    console.log(receipt)
    saveTransaction(receipt.transactionHash, '0.01', receipt.to)
  }

  const saveTransaction = async (txHash, amount, toAddress) => {
    await fetch('/api/swapTokens', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        txHash: txHash,
        from: currentAccount,
        to: toAddress,
        amount: parseFloat(amount),
      }),
    })
  }


    const connectWallet =()=>{
        authenticate()
    }

    const signOut=()=>{
        logout()
    }

    return (
        <RobinhoodContext.Provider value={{
            connectWallet,
            signOut,
            currentAccount,
            isAuthenticated,
            formattedAccount,
            setAmount,
        mint,
        setCoinSelect,
        coinSelect,
        balance,
        swapTokens,
        amount,
        toCoin,
        setToCoin,
        }} >
{children}
        </RobinhoodContext.Provider>
    )
}