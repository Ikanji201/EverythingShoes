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
    uint256 internal shoesLength = 0;

    address internal cUsdTokenAddress =
        0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;

    struct Shoe {
        address payable owner;
        string image;
        string brand;
        string size;
        uint256 price;
        uint256 sold;
    }
    mapping(uint256 => Shoe) private shoes;

    mapping(uint256 => bool) private _exists;

    // check if a shoe with id of _index exists
    modifier exists(uint256 _index) {
        require(_exists[_index], "Query of nonexistent shoe");
        _;
    }
    // checks if the input data for image and brand are non-empty values
    modifier checkInputData(string calldata _image, string calldata _brand) {
        require(bytes(_image).length > 0, "Empty image");
        require(bytes(_brand).length > 0, "Empty brand");
        _;
    }

    /**
     * @dev allow users to add and sell a shoe on the platform
     * @notice input needs to contain only valid/non-empty values
     */
    function addShoe(
        string calldata _image,
        string calldata _brand,
        string calldata _size,
        uint256 _price
    ) public checkInputData(_image, _brand) {
        require(bytes(_size).length > 0, "Empty size");
        uint256 _sold = 0;
        uint256 index = shoesLength;
        shoesLength++;
        shoes[index] = Shoe(
            payable(msg.sender),
            _image,
            _brand,
            _size,
            _price,
            _sold
        );
        _exists[index] = true;
    }

    function readShoe(uint256 _index)
        public
        view
        exists(_index)
        returns (
            address payable,
            string memory,
            string memory,
            string memory,
            uint256,
            uint256
        )
    {
        return (
            shoes[_index].owner,
            shoes[_index].image,
            shoes[_index].brand,
            shoes[_index].size,
            shoes[_index].price,
            shoes[_index].sold
        );
    }

    /**
     * @dev allow users to buy a shoe
     */
    function buyShoe(uint256 _index) public payable exists(_index) {
        Shoe storage currentShoe = shoes[_index];
        require(currentShoe.owner != msg.sender, "You can't buy your own shoe");
        require(
            IERC20Token(cUsdTokenAddress).transferFrom(
                msg.sender,
                currentShoe.owner,
                currentShoe.price
            ),
            "Transfer failed."
        );
        currentShoe.sold++;
    }

    function getProductsLength() public view returns (uint256) {
        return (shoesLength);
    }

    /**
     * @dev allow the owner of a shoe with id of _index to update the image and brand of the shoe
     * @notice Input data needs to contain only non-empty values
     */
    function updateShoe(
        uint256 _index,
        string calldata _newImage,
        string calldata _newBrand
    ) public exists(_index) checkInputData(_newImage, _newBrand) {
        require(
            msg.sender == shoes[_index].owner,
            "Only the shoe owner can update the shoe's details"
        );
        Shoe storage currentShoe = shoes[_index];
        currentShoe.image = _newImage;
        currentShoe.brand = _newBrand;
    }
}
