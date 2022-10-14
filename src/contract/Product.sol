 // SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

interface IERC20Token {
    function transfer(address, uint256) external returns (bool);

    function approve(address, uint256) external returns (bool);

    function transferFrom(
        address,
        address,
        uint256
    ) external returns (bool);

    function totalSupply() external view returns (uint256);

    function balanceOf(address) external view returns (uint256);

    function allowance(address, address) external view returns (uint256);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

contract Marketplace {

    uint internal shoesLength = 0;
    address internal cUsdTokenAddress =  0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;

    
    struct Product {
        address payable owner;
        string image;
        string brand;
        string size;
        uint price;
        uint sold;

    }
    	mapping (uint => Product) internal products;

        //Modifier that allows only the owner of the product  to access the functions
    modifier onlyOwner(uint _index){
        require(msg.sender == products[_index].owner, "Only the owner can access this function");
        _;
    }


  function  addProduct(
        string memory _image, 
        string memory _brand,
         string memory _size,
        uint _price
        
        
    ) public {
         uint _sold = 0;

         products [shoesLength] =  Product(
            payable(msg.sender),
            
            _image,
            _brand,
            _size,
            _price,
            _sold
            
             
        );

        shoesLength++;
    }


    function readProduct(uint _index) public view returns (
		address payable,
		string memory, 
		string memory, 
		string memory, 
		uint, 
		uint
	) {
		return (
			products[_index].owner, 
			products[_index].image, 
			products[_index].brand, 
			products[_index].size,  
			products[_index].price,
			products[_index].sold
		);
	}


    function buyProduct(uint _index) public payable  {
		require(
		  IERC20Token(cUsdTokenAddress).transferFrom(
			msg.sender,
			products[_index].owner,
			products[_index].price
		  ),
		  "Transfer failed."
		);
		products[_index].sold++;
	}

	function getProductsLength() public view returns (uint) {
		return (shoesLength);
	}


    // to replace and old shoe with a knew shoe
    function update(uint _index, string memory _newImage, string memory _newBrand) public returns(string memory, string memory) {
        Product memory updateShoe = products[_index];
        updateShoe.image = _newImage;
        updateShoe.brand = _newBrand;
        // You can replace the old shoe at specific index to a new shoe.
        // You can do it, using the statement declared below this line  
        products[_index] = updateShoe;
        return(updateShoe.image, updateShoe.brand);
    }

}


