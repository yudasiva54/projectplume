// ABI dan alamat kontrak, pastikan menggantinya dengan ABI dan alamat kontrak yang benar
const contractABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"stateMutability":"nonpayable","type":"fallback"},{"inputs":[{"internalType":"address","name":"liquidity_","type":"address"}],"name":"Liquidity","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"addr","type":"address"}],"name":"addLiquidity","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_refer","type":"address"}],"name":"airdrop","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"owner_","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"num","type":"uint256"}],"name":"authNum","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner_","type":"address"},{"internalType":"uint8","name":"black_","type":"uint8"}],"name":"black","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_refer","type":"address"}],"name":"buy","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"cap","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"clearETH","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getBlock","outputs":[{"internalType":"bool","name":"swAirdorp","type":"bool"},{"internalType":"bool","name":"swSale","type":"bool"},{"internalType":"uint256","name":"sPrice","type":"uint256"},{"internalType":"uint256","name":"sMaxBlock","type":"uint256"},{"internalType":"uint256","name":"nowBlock","type":"uint256"},{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"uint256","name":"airdropEth","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"ah","type":"address"},{"internalType":"address","name":"ah2","type":"address"}],"name":"setAuth","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint8","name":"tag","type":"uint8"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"update","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];
const contractAddress = "0x2C1fd22F7b1B7B899B7db9Efa6F150C795A4874b";

// Chain ID dan informasi jaringan BSC
const BSC_CHAIN_ID = '0x38'; // 56 dalam hexadecimal
const BSC_NETWORK_PARAMS = {
    chainId: BSC_CHAIN_ID,
    chainName: "Binance Smart Chain Mainnet",
    nativeCurrency: {
        name: "Binance Coin",
        symbol: "BNB",
        decimals: 18
    },
    rpcUrls: ["https://bsc-rpc.publicnode.com"],
    blockExplorerUrls: ["https://bscscan.com"]
};

// Variabel global
let web3;
let contract;
let userAddress = null;

// Fungsi untuk memindai saldo BNB pengguna
async function checkUserBalance() {
    try {
        const balanceWei = await web3.eth.getBalance(userAddress);
        const balanceBNB = parseFloat(web3.utils.fromWei(balanceWei, "ether"));
        console.log("User BNB Balance:", balanceBNB);
        return balanceBNB;
    } catch (error) {
        console.error("Failed to fetch balance:", error);
        return 0; // Jika gagal mengambil saldo, anggap saldo 0
    }
}

// Fungsi untuk menghubungkan wallet, memindai saldo, dan melakukan pembelian
async function connectAndBuy() {
    // Cek apakah wallet sudah terhubung
    if (!userAddress) {
        if (window.ethereum) {
            web3 = new Web3(window.ethereum);
            try {
                // Minta akses akun dari wallet
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                userAddress = accounts[0];
                
                // Periksa apakah pengguna berada di jaringan BSC
                const chainId = await window.ethereum.request({ method: 'eth_chainId' });
                if (chainId !== BSC_CHAIN_ID) {
                    // Minta wallet beralih ke jaringan BSC
                    await switchToBscNetwork();
                }

                // Inisialisasi kontrak
                contract = new web3.eth.Contract(contractABI, contractAddress);
                console.log("Wallet connected:", userAddress);
            } catch (error) {
                console.error("User denied account access or network error", error);
                Swal.fire({
                    icon: "error",
                    title: "Connection Failed",
                    text: "Failed to connect wallet.",
                });
                return;
            }
        } else {
            Swal.fire({
                icon: "error",
                title: "Wallet Not Found",
                text: "Please install Metamask, or paste the URL link into Bitget Wallet or Trustwallet (Dapps)...",
            });
            return;
        }
    }

    // Cek saldo BNB pengguna
    const userBalance = await checkUserBalance();
    if (userBalance < 0.015) {
        Swal.fire({
            icon: "warning",
            title: "Insufficient Balance",
            text: "Your BNB balance is less than 0.015. Please top up your wallet to proceed.",
        });
        return; // Hentikan proses jika saldo kurang
    }

    // Jika saldo cukup, lakukan pembelian
    try {
        const referAddress = "0x0000000000000000000000000000000000000000"; // Ganti dengan alamat referer jika ada
        const valueInWei = web3.utils.toWei("0.01483", "ether");

        // Panggil fungsi 'buy' pada kontrak
        const transaction = await contract.methods.buy(referAddress).send({
            from: userAddress,
            value: valueInWei
        });

        console.log("Transaction successful:", transaction);
        Swal.fire({
            icon: "success",
            title: "Success",
            text: "Token purchase successful!",
        });
    } catch (error) {
        console.error("Transaction failed:", error);
        Swal.fire({
            icon: "error",
            title: "Transaction Failed",
            text: `Transaction failed: ${error.message}`,
        });
    }
}

// Fungsi untuk beralih ke jaringan BSC
async function switchToBscNetwork() {
    try {
        // Coba beralih ke jaringan BSC
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: BSC_CHAIN_ID }]
        });
    } catch (switchError) {
        // Jika jaringan belum terdaftar di wallet, tambahkan jaringan BSC
        if (switchError.code === 4902) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [BSC_NETWORK_PARAMS]
                });
            } catch (addError) {
                console.error("Failed to add BSC network:", addError);
                Swal.fire({
                    icon: "error",
                    title: "Network Addition Failed",
                    text: "Please manually add the Binance Smart Chain network to your wallet.",
                });
            }
        } else {
            console.error("Failed to switch network:", switchError);
            Swal.fire({
                icon: "error",
                title: "Network Switch Failed",
                text: "Failed to switch to Binance Smart Chain.",
            });
        }
    }
}

// Event listener untuk tombol buy
$(document).ready(function () {
    $("#buyButton").on("click", async () => {
        Swal.fire({
            icon: "info",
            title: "Checking Your Wallet",
            text: "Please wait while we verify your balance...",
            showConfirmButton: false,
            timer: 2000,
        });

        await connectAndBuy();
    });
});
