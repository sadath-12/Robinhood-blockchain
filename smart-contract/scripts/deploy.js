const {ethers } =require("hardhat")
//taking and deploying all contracts

const main = async () => {
    const dogeFactory = await ethers.getContractFactory('DogeCoin')
    const dogeContract = await dogeFactory.deploy()
    await dogeContract.deployed()
    console.log('Dogecoin deployed to:', dogeContract.address)
  
    
    const BitcoinFactory = await ethers.getContractFactory('Bitcoin')
    const BitcoinContract = await BitcoinFactory.deploy()
    await BitcoinContract.deployed()
    console.log('BitcoinToken deployed to:', BitcoinContract.address)
    
    const usdcFactory = await ethers.getContractFactory('Usdc')
    const usdcContract = await usdcFactory.deploy()
    await usdcContract.deployed()
    console.log('UsdcToken deployed to:', usdcContract.address)
    
    const solanaFactory = await ethers.getContractFactory('Solana')
    const solanaContract = await solanaFactory.deploy()
    await solanaContract.deployed()
    console.log('solanaToken deployed to:', solanaContract.address)
}
  
  ;(async () => {
    try {
      await main()
      process.exit(0)
    } catch (error) {
      console.error(error)
      process.exit(1)
    }
  })()