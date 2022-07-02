let currentAccount = null;
let web3;
let abi;
let contractAddress;
let jpyccontractAddress;
let jpycabii;


$.getJSON("contract.json", function (result) {
     contractAddress = result.giftnftcontract;
     jpyccontractAddress = result.jpyccontract;
     abi = result.giftabi;
     jpycabii = result.jpycabi;
    console.log(contractAddress);
    console.log(jpyccontractAddress);
    console.log(jpycabii);
    console.log(abi);
    $("#contractAddress").text(contractAddress);
  });

  function handleAccountsChanged(accounts) {
  
    if (accounts.length == 0) {
      console.log("Please connect to MetaMask.");
      $("#connect").html("Connect with Metamask");
    } else if (accounts[0] !== currentAccount) {
      currentAccount = accounts[0];
      var accountsubstr = currentAccount.substr( 29 );
      $("#connect").html(`...  ${accountsubstr}`);
  
      if (currentAccount != null) {
  

        try {
          web3 = new Web3(ethereum);
        } catch (error) {
          alert(error);
        }
      }
    }
    console.log("WalletAddress in HandleAccountChanged =" + currentAccount);
  }

  function connect() {
    ethereum
      .request({ method: "eth_requestAccounts" })
      .then(handleAccountsChanged)
      .catch((err) => {
        if (err.code === 4001) {
          console.log("Please connect to MetaMask.");
        } else {
          console.error(err);
        }
      });
      window.ethereum.request({method: "wallet_addEthereumChain",
      params: [{
          chainId: "0x89",
          rpcUrls: ["https://rpc-mainnet.matic.network/"],
          chainName: "Matic Mainnet",
          nativeCurrency: {
              name: "MATIC",
              symbol: "MATIC",
              decimals: 18
          },
          blockExplorerUrls: ["https://polygonscan.com/"]
      }]
    })
  }
  function detectMetaMask() {
    if (typeof window.ethereum !== "undefined") {
      return true;
    } else {
      return false;
    }
  }
  
  function mint() { 
    const contract = new web3.eth.Contract(abi, contractAddress);
   
    try {
      web3 = new Web3(ethereum);
    } catch (error) {
      alert(error);
    }
    return new Promise((resolve,reject)=>{
     contract.methods
    .safeMint()
    .send({from:currentAccount})
    .then((receipt) => {
        console.log(receipt);
        resolve();
      })
      .catch((err) => reject(err));
    });
  }

  function approve() {
    var approveprice = "1000000000000000000000000000";
    var approveprices = parseFloat(approveprice);
    console.log(approveprices);
  const jpyccontract = new web3.eth.Contract(jpycabii, jpyccontractAddress);
  try {
    web3 = new Web3(ethereum);
  } catch (error) {
    alert(error);
  }
  return new Promise((resolve,reject)=>{
   jpyccontract.methods
    .approve(contractAddress,approveprice)
    .send({from:currentAccount})
    .then((receipt) => {
      console.log(receipt);
      resolve();
    })
    .catch((err) => reject(err));
  });
}
  function burn(){
    var tokenId = document.getElementById("burntoken").value;
    var tokenId = Number(tokenId);
    console.log(tokenId);
    const contract = new web3.eth.Contract(abi, contractAddress);
    try {
        web3 = new Web3(ethereum);
      } catch (error) {
        alert(error);
      }
      return new Promise((resolve,reject)=>{
       contract.methods
        .safeburn(tokenId)
        .send({from:currentAccount})
        .then((receipt) => {
          console.log(receipt);
          resolve();
        })
        .catch((err) => reject(err));
      });

  }
  
  

  $(document).ready(function () {
    m = detectMetaMask();
    if (m) {
      $("#connect").attr("disabled", false);
      connect();
    } else {
    }
    $("#burn").click(function () {
        burn();
      });

   $("#connect").click(function () {
      connect();
    });
  
    $("#mint").click(function () {
      mint();
    });
    $("#approve").click(function () {
        approve();
      });
  });
