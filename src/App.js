import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar";
import { useState, useEffect } from "react";

import Web3 from "web3";
import { newKitFromWeb3 } from "@celo/contractkit";
import BigNumber from "bignumber.js";
import IERC from "./contract/IERC.abi.json";
import Marketplace from "./contract/Marketplace.abi.json";
import AddProducts from "./components/AddProducts";
import Products from "./components/Products";

const ERC20_DECIMALS = 18;

const contractAddress = "0x0F24686FB2ed736b3683241Ba23501A416cE99fA";
const cUSDContractAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";

function App() {
	const [contract, setcontract] = useState(null);
	const [address, setAddress] = useState(null);
	const [kit, setKit] = useState(null);
	const [cUSDBalance, setcUSDBalance] = useState(0);
	const [products, setProducts] = useState([]);

	const connectToWallet = async () => {
		if (window.celo) {
			try {
				await window.celo.enable();
				const web3 = new Web3(window.celo);
				let kit = newKitFromWeb3(web3);

				const accounts = await kit.web3.eth.getAccounts();
				const user_address = accounts[0];

				kit.defaultAccount = user_address;

				await setAddress(user_address);
				await setKit(kit);
			} catch (error) {
				console.log(error);
			}
		} else {
			console.log("Error Occurred");
		}
	};

	useEffect(() => {
		connectToWallet();
	}, []);

	useEffect(() => {
		if (kit && address) {
			getBalance();
		}
	}, [kit, address]);

	useEffect(() => {
		if (contract) {
			getProducts();
		}
	}, [contract]);

	const getBalance = async () => {
		try {
			const balance = await kit.getTotalBalance(address);
			const USDBalance = balance.cUSD
				.shiftedBy(-ERC20_DECIMALS)
				.toFixed(2);
			const contract = new kit.web3.eth.Contract(
				Marketplace,
				contractAddress
			);
			setcontract(contract);
			setcUSDBalance(USDBalance);
		} catch (error) {
			console.log(error);
		}
	};

	const getProducts = async () => {
		const shoesLength = await contract.methods.getProductsLength().call();
		const _showe = [];
		for (let index = 0; index < shoesLength; index++) {
			let _products = new Promise(async (resolve, reject) => {
				let product = await contract.methods.readShoe(index).call();

				resolve({
					index: index,
					owner: product[0],
					image: product[1],
					brand: product[2],
					size: product[3],
					price: product[4],
					sold: product[5],
				});
			});
			_showe.push(_products);
		}
		const _products = await Promise.all(_showe);
		setProducts(_products);
	};

	const AddProduct = async (_image, _brand, _size, price) => {
		const _price = new BigNumber(price)
			.shiftedBy(ERC20_DECIMALS)
			.toString();
		try {
			await contract.methods
				.addShoe(_image, _brand, _size, _price)
				.send({ from: address });
			getProducts();
		} catch (error) {
			console.log(error);
		}
	};

	const UpdateShoe = async (_index,_newImage, _newBrand) => {

		try {
			await contract.methods
				.updateShoe(_index, _newImage, _newBrand)
				.send({ from: address });
			getProducts();
			getBalance();
		} catch (error) {
			console.log(error);
			
		}
	};

	const buyProduct = async (_index) => {
		try {
			const cUSDContract = new kit.web3.eth.Contract(
				IERC,
				cUSDContractAddress
			);

			await cUSDContract.methods
				.approve(contractAddress, products[_index].price)
				.send({ from: address });
			await contract.methods.buyShoe(_index).send({ from: address });
			getProducts();
			getBalance();
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div>
			<Navbar balance={cUSDBalance} />

			<Products
				products={products}
				buyProduct={buyProduct}
				updateShoe={UpdateShoe}
				onlyOwner={address}
			/>
			<AddProducts AddProduct={AddProduct} />
		</div>
	);
}

export default App;