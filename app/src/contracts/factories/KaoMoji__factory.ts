/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { KaoMoji, KaoMojiInterface } from "../KaoMoji";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "previousAdmin",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "newAdmin",
        type: "address",
      },
    ],
    name: "AdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "beacon",
        type: "address",
      },
    ],
    name: "BeaconUpgraded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "previousAdminRole",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "newAdminRole",
        type: "bytes32",
      },
    ],
    name: "RoleAdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleRevoked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "implementation",
        type: "address",
      },
    ],
    name: "Upgraded",
    type: "event",
  },
  {
    inputs: [],
    name: "ADDRESS_UPDATER",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "BALANCE_BURNER_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MINTER_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "UPGRADER_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "getDataOf",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getProposerPercentageFor",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
    ],
    name: "getRoleAdmin",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "hasRole",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
      {
        internalType: "address",
        name: "_proposer",
        type: "address",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC721Received",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "auctionAddress",
        type: "address",
      },
    ],
    name: "setAuctionAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "kaoStaking",
        type: "address",
      },
    ],
    name: "setKaoStakingAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "kaoToken",
        type: "address",
      },
    ],
    name: "setKaoTokenAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newImplementation",
        type: "address",
      },
    ],
    name: "upgradeTo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newImplementation",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "upgradeToAndCall",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];

const _bytecode =
  "0x60a06040523060601b60805234801561001757600080fd5b5060805160601c612fdb61004b60003960008181610b5f01528181610b9f01528181610d310152610d710152612fdb6000f3fe6080604052600436106101895760003560e01c806301ffc9a71461018e57806306fdde03146101c3578063081812fc146101e5578063095ea7b3146102125780630cae37f114610234578063150b7a0214610254578063185f57d51461028d57806323b872dd146102ad578063248a9ca3146102cd5780632f2ff15d146102fb57806336568abe1461031b5780633659cfe61461033b57806342842e0e1461035b57806344df8e701461037b5780634f1ef2861461039057806356779068146103a35780636352211e146103c357806370a08231146103e35780637cc533b8146104035780638129fc1c14610425578063878632451461043a57806391d148541461045c57806393ac36381461047c57806395d89b411461049c578063a217fddf146104b1578063a22cb465146104c6578063b88d4fde146104e6578063b9cab03f14610506578063c87b56dd14610526578063d02dab9614610546578063d539139314610578578063d547741f1461059a578063e985e9c5146105ba578063f72c0d8b146105da575b600080fd5b34801561019a57600080fd5b506101ae6101a93660046128a7565b6105fc565b60405190151581526020015b60405180910390f35b3480156101cf57600080fd5b506101d861060d565b6040516101ba9190612a91565b3480156101f157600080fd5b5061020561020036600461286d565b61069f565b6040516101ba9190612a40565b34801561021e57600080fd5b5061023261022d366004612844565b61072c565b005b34801561024057600080fd5b5061023261024f3660046128df565b61083d565b34801561026057600080fd5b5061027461026f36600461275a565b610a25565b6040516001600160e01b031990911681526020016101ba565b34801561029957600080fd5b506102326102a83660046126d3565b610a36565b3480156102b957600080fd5b506102326102c836600461271f565b610a73565b3480156102d957600080fd5b506102ed6102e836600461286d565b610aa4565b6040519081526020016101ba565b34801561030757600080fd5b50610232610316366004612885565b610ab9565b34801561032757600080fd5b50610232610336366004612885565b610ad6565b34801561034757600080fd5b506102326103563660046126d3565b610b54565b34801561036757600080fd5b5061023261037636600461271f565b610c1d565b34801561038757600080fd5b50610232610c38565b61023261039e3660046127f9565b610d26565b3480156103af57600080fd5b506102326103be3660046126d3565b610ddc565b3480156103cf57600080fd5b506102056103de36600461286d565b610e19565b3480156103ef57600080fd5b506102ed6103fe3660046126d3565b610e90565b34801561040f57600080fd5b506102ed600080516020612e5f83398151915281565b34801561043157600080fd5b50610232610f17565b34801561044657600080fd5b506102ed600080516020612f8683398151915281565b34801561046857600080fd5b506101ae610477366004612885565b611029565b34801561048857600080fd5b506102326104973660046126d3565b611054565b3480156104a857600080fd5b506101d8611091565b3480156104bd57600080fd5b506102ed600081565b3480156104d257600080fd5b506102326104e13660046127bf565b6110a0565b3480156104f257600080fd5b5061023261050136600461275a565b611161565b34801561051257600080fd5b506101d861052136600461286d565b611199565b34801561053257600080fd5b506101d861054136600461286d565b61123c565b34801561055257600080fd5b506105666105613660046126d3565b611307565b60405160ff90911681526020016101ba565b34801561058457600080fd5b506102ed600080516020612f4683398151915281565b3480156105a657600080fd5b506102326105b5366004612885565b611542565b3480156105c657600080fd5b506101ae6105d53660046126ed565b61155f565b3480156105e657600080fd5b506102ed600080516020612e9f83398151915281565b60006106078261158d565b92915050565b60606065805461061c90612d9c565b80601f016020809104026020016040519081016040528092919081815260200182805461064890612d9c565b80156106955780601f1061066a57610100808354040283529160200191610695565b820191906000526020600020905b81548152906001019060200180831161067857829003601f168201915b5050505050905090565b60006106aa826115b2565b6107105760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a20617070726f76656420717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b60648201526084015b60405180910390fd5b506000908152606960205260409020546001600160a01b031690565b600061073782610e19565b9050806001600160a01b0316836001600160a01b031614156107a55760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e656044820152603960f91b6064820152608401610707565b336001600160a01b03821614806107c157506107c1813361155f565b61082e5760405162461bcd60e51b815260206004820152603860248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f74206f776044820152771b995c881b9bdc88185c1c1c9bdd995908199bdc88185b1b60421b6064820152608401610707565b61083883836115cf565b505050565b600080516020612f46833981519152610856813361163d565b61012e8054908190600061086983612dd7565b91905055506108793082866116a1565b600081815261012d60209081526040909120855161089992870190612598565b5061012f546108b1906001600160a01b0316826115cf565b610130546040805163313ce56760e01b815290516000926001600160a01b03169163313ce567916004808301926020929190829003018186803b1580156108f757600080fd5b505afa15801561090b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061092f9190612939565b61012f549091506001600160a01b03166375e9249f8330603c61095386600a612c78565b61095e906001612d23565b896109688b611307565b6101305460405160e089901b6001600160e01b031916815260048101979097526001600160a01b039586166024880152604487019490945260648601929092528316608485015260ff1660a48401521660c482015260e401602060405180830381600087803b1580156109da57600080fd5b505af11580156109ee573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a129190612921565b50610a1e6000836115cf565b5050505050565b630a85bd0160e11b5b949350505050565b600080516020612f86833981519152610a4f813361163d565b5061013080546001600160a01b0319166001600160a01b0392909216919091179055565b610a7d33826116d4565b610a995760405162461bcd60e51b815260040161070790612bb8565b610838838383611796565b600090815260fb602052604090206001015490565b610ac282610aa4565b610acc813361163d565b6108388383611924565b6001600160a01b0381163314610b465760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b6064820152608401610707565b610b5082826119aa565b5050565b306001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161415610b9d5760405162461bcd60e51b815260040161070790612af6565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316610bcf611a11565b6001600160a01b031614610bf55760405162461bcd60e51b815260040161070790612b30565b610bfe81611a2d565b60408051600080825260208201909252610c1a91839190611a46565b50565b61083883838360405180602001604052806000815250611161565b600080516020612e5f833981519152610c51813361163d565b610130546040516370a0823160e01b81526001600160a01b03909116906342966c689082906370a0823190610c8a903090600401612a40565b60206040518083038186803b158015610ca257600080fd5b505afa158015610cb6573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610cda9190612921565b6040518263ffffffff1660e01b8152600401610cf891815260200190565b600060405180830381600087803b158015610d1257600080fd5b505af1158015610a1e573d6000803e3d6000fd5b306001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161415610d6f5760405162461bcd60e51b815260040161070790612af6565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316610da1611a11565b6001600160a01b031614610dc75760405162461bcd60e51b815260040161070790612b30565b610dd082611a2d565b610b5082826001611a46565b600080516020612f86833981519152610df5813361163d565b5061013180546001600160a01b0319166001600160a01b0392909216919091179055565b6000818152606760205260408120546001600160a01b0316806106075760405162461bcd60e51b815260206004820152602960248201527f4552433732313a206f776e657220717565727920666f72206e6f6e657869737460448201526832b73a103a37b5b2b760b91b6064820152608401610707565b60006001600160a01b038216610efb5760405162461bcd60e51b815260206004820152602a60248201527f4552433732313a2062616c616e636520717565727920666f7220746865207a65604482015269726f206164647265737360b01b6064820152608401610707565b506001600160a01b031660009081526068602052604090205490565b600054610100900460ff1680610f30575060005460ff16155b610f4c5760405162461bcd60e51b815260040161070790612b6a565b600054610100900460ff16158015610f6e576000805461ffff19166101011790555b610fb2604051806040016040528060078152602001664b616f4d6f6a6960c81b8152506040518060400160405280600381526020016225a6a560e91b815250611b86565b610fba611c0d565b610fc2611c7c565b610fcd600033611cda565b610fe5600080516020612f4683398151915233611cda565b610ffd600080516020612f8683398151915233611cda565b611015600080516020612e9f83398151915233611cda565b8015610c1a576000805461ff001916905550565b600091825260fb602090815260408084206001600160a01b0393909316845291905290205460ff1690565b600080516020612f8683398151915261106d813361163d565b5061012f80546001600160a01b0319166001600160a01b0392909216919091179055565b60606066805461061c90612d9c565b6001600160a01b0382163314156110f55760405162461bcd60e51b815260206004820152601960248201527822a9219b99189d1030b8383937bb32903a379031b0b63632b960391b6044820152606401610707565b336000818152606a602090815260408083206001600160a01b03871680855290835292819020805460ff191686151590811790915590519081529192917f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a35050565b61116b33836116d4565b6111875760405162461bcd60e51b815260040161070790612bb8565b61119384848484611ce4565b50505050565b600081815261012d602052604090208054606091906111b790612d9c565b80601f01602080910402602001604051908101604052809291908181526020018280546111e390612d9c565b80156112305780601f1061120557610100808354040283529160200191611230565b820191906000526020600020905b81548152906001019060200180831161121357829003601f168201915b50505050509050919050565b6060611247826115b2565b6112ab5760405162461bcd60e51b815260206004820152602f60248201527f4552433732314d657461646174613a2055524920717565727920666f72206e6f60448201526e3732bc34b9ba32b73a103a37b5b2b760891b6064820152608401610707565b60006112b5611d17565b905060008151116112d55760405180602001604052806000815250611300565b806112df84611d37565b6040516020016112f09291906129a2565b6040516020818303038152906040525b9392505050565b60006001600160a01b0382166113515760405162461bcd60e51b815260206004820152600f60248201526e496e76616c6964204164647265737360881b6044820152606401610707565b61013154604080516318160ddd60e01b815290516000926001600160a01b0316916318160ddd916004808301926020929190829003018186803b15801561139757600080fd5b505afa1580156113ab573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906113cf9190612921565b610131546040516370a0823160e01b81529192506000916001600160a01b03909116906370a0823190611406908790600401612a40565b60206040518083038186803b15801561141e57600080fd5b505afa158015611432573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906114569190612921565b610131546040516340c6b5df60e11b81529192506000916001600160a01b039091169063818d6bbe9061148d908890600401612a40565b60206040518083038186803b1580156114a557600080fd5b505afa1580156114b9573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906114dd9190612921565b9050826114ef57506000949350505050565b816114ff57506000949350505050565b6000818461150e856064612d23565b6115189190612c21565b6115229190612d23565b905060648111156115395750606495945050505050565b95945050505050565b61154b82610aa4565b611555813361163d565b61083883836119aa565b6001600160a01b039182166000908152606a6020908152604080832093909416825291909152205460ff1690565b60006001600160e01b03198216637965db0b60e01b1480610607575061060782611e50565b6000908152606760205260409020546001600160a01b0316151590565b600081815260696020526040902080546001600160a01b0319166001600160a01b038416908117909155819061160482610e19565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b6116478282611029565b610b505761165f816001600160a01b03166014611ea0565b61166a836020611ea0565b60405160200161167b9291906129d1565b60408051601f198184030181529082905262461bcd60e51b825261070791600401612a91565b6116ab8383612081565b6116b860008484846121a1565b6108385760405162461bcd60e51b815260040161070790612aa4565b60006116df826115b2565b6117405760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a206f70657261746f7220717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b6064820152608401610707565b600061174b83610e19565b9050806001600160a01b0316846001600160a01b031614806117865750836001600160a01b031661177b8461069f565b6001600160a01b0316145b80610a2e5750610a2e818561155f565b826001600160a01b03166117a982610e19565b6001600160a01b0316146118115760405162461bcd60e51b815260206004820152602960248201527f4552433732313a207472616e73666572206f6620746f6b656e2074686174206960448201526839903737ba1037bbb760b91b6064820152608401610707565b6001600160a01b0382166118735760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f206164646044820152637265737360e01b6064820152608401610707565b61187e6000826115cf565b6001600160a01b03831660009081526068602052604081208054600192906118a7908490612d42565b90915550506001600160a01b03821660009081526068602052604081208054600192906118d5908490612c09565b909155505060008181526067602052604080822080546001600160a01b0319166001600160a01b038681169182179092559151849391871691600080516020612f6683398151915291a4505050565b61192e8282611029565b610b5057600082815260fb602090815260408083206001600160a01b03851684529091529020805460ff191660011790556119663390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b6119b48282611029565b15610b5057600082815260fb602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b600080516020612ebf833981519152546001600160a01b031690565b600080516020612e9f833981519152610b50813361163d565b6000611a50611a11565b9050611a5b846122ab565b600083511180611a685750815b15611a7957611a77848461233e565b505b7f4910fdfa16fed3260ed0e7147f7cc6da11a60208b5b9406d12a635614ffd9143805460ff16610a1e57805460ff19166001178155604051611af4908690611ac5908590602401612a40565b60408051601f198184030181529190526020810180516001600160e01b0316631b2ce7f360e11b17905261233e565b50805460ff19168155611b05611a11565b6001600160a01b0316826001600160a01b031614611b7d5760405162461bcd60e51b815260206004820152602f60248201527f45524331393637557067726164653a207570677261646520627265616b73206660448201526e75727468657220757067726164657360881b6064820152608401610707565b610a1e85612420565b600054610100900460ff1680611b9f575060005460ff16155b611bbb5760405162461bcd60e51b815260040161070790612b6a565b600054610100900460ff16158015611bdd576000805461ffff19166101011790555b611be5612460565b611bed612460565b611bf783836124ca565b8015610838576000805461ff0019169055505050565b600054610100900460ff1680611c26575060005460ff16155b611c425760405162461bcd60e51b815260040161070790612b6a565b600054610100900460ff16158015611c64576000805461ffff19166101011790555b611c6c612460565b611c74612460565b611015612460565b600054610100900460ff1680611c95575060005460ff16155b611cb15760405162461bcd60e51b815260040161070790612b6a565b600054610100900460ff16158015611c6c576000805461ffff1916610101179055611c74612460565b610b508282611924565b611cef848484611796565b611cfb848484846121a1565b6111935760405162461bcd60e51b815260040161070790612aa4565b6060604051806060016040528060408152602001612edf60409139905090565b606081611d5b5750506040805180820190915260018152600360fc1b602082015290565b8160005b8115611d855780611d6f81612dd7565b9150611d7e9050600a83612c21565b9150611d5f565b6000816001600160401b03811115611dad57634e487b7160e01b600052604160045260246000fd5b6040519080825280601f01601f191660200182016040528015611dd7576020820181803683370190505b5090505b8415610a2e57611dec600183612d42565b9150611df9600a86612df2565b611e04906030612c09565b60f81b818381518110611e2757634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a905350611e49600a86612c21565b9450611ddb565b60006001600160e01b031982166380ac58cd60e01b1480611e8157506001600160e01b03198216635b5e139f60e01b145b8061060757506301ffc9a760e01b6001600160e01b0319831614610607565b60606000611eaf836002612d23565b611eba906002612c09565b6001600160401b03811115611edf57634e487b7160e01b600052604160045260246000fd5b6040519080825280601f01601f191660200182016040528015611f09576020820181803683370190505b509050600360fc1b81600081518110611f3257634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a905350600f60fb1b81600181518110611f6f57634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a9053506000611f93846002612d23565b611f9e906001612c09565b90505b6001811115612032576f181899199a1a9b1b9c1cb0b131b232b360811b85600f1660108110611fe057634e487b7160e01b600052603260045260246000fd5b1a60f81b82828151811061200457634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a90535060049490941c9361202b81612d85565b9050611fa1565b5083156113005760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152606401610707565b6001600160a01b0382166120d75760405162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f20616464726573736044820152606401610707565b6120e0816115b2565b1561212c5760405162461bcd60e51b815260206004820152601c60248201527b115490cdcc8c4e881d1bdad95b88185b1c9958591e481b5a5b9d195960221b6044820152606401610707565b6001600160a01b0382166000908152606860205260408120805460019290612155908490612c09565b909155505060008181526067602052604080822080546001600160a01b0319166001600160a01b0386169081179091559051839290600080516020612f66833981519152908290a45050565b60006001600160a01b0384163b156122a357604051630a85bd0160e11b81526001600160a01b0385169063150b7a02906121e5903390899088908890600401612a54565b602060405180830381600087803b1580156121ff57600080fd5b505af192505050801561222f575060408051601f3d908101601f1916820190925261222c918101906128c3565b60015b612289573d80801561225d576040519150601f19603f3d011682016040523d82523d6000602084013e612262565b606091505b5080516122815760405162461bcd60e51b815260040161070790612aa4565b805181602001fd5b6001600160e01b031916630a85bd0160e11b149050610a2e565b506001610a2e565b803b61230f5760405162461bcd60e51b815260206004820152602d60248201527f455243313936373a206e657720696d706c656d656e746174696f6e206973206e60448201526c1bdd08184818dbdb9d1c9858dd609a1b6064820152608401610707565b600080516020612ebf83398151915280546001600160a01b0319166001600160a01b0392909216919091179055565b6060823b61239d5760405162461bcd60e51b815260206004820152602660248201527f416464726573733a2064656c65676174652063616c6c20746f206e6f6e2d636f6044820152651b9d1c9858dd60d21b6064820152608401610707565b600080846001600160a01b0316846040516123b89190612986565b600060405180830381855af49150503d80600081146123f3576040519150601f19603f3d011682016040523d82523d6000602084013e6123f8565b606091505b50915091506115398282604051806060016040528060278152602001612f1f6027913961255f565b612429816122ab565b6040516001600160a01b038216907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a250565b600054610100900460ff1680612479575060005460ff16155b6124955760405162461bcd60e51b815260040161070790612b6a565b600054610100900460ff16158015611015576000805461ffff19166101011790558015610c1a576000805461ff001916905550565b600054610100900460ff16806124e3575060005460ff16155b6124ff5760405162461bcd60e51b815260040161070790612b6a565b600054610100900460ff16158015612521576000805461ffff19166101011790555b8251612534906065906020860190612598565b508151612548906066906020850190612598565b508015610838576000805461ff0019169055505050565b6060831561256e575081611300565b82511561257e5782518084602001fd5b8160405162461bcd60e51b81526004016107079190612a91565b8280546125a490612d9c565b90600052602060002090601f0160209004810192826125c6576000855561260c565b82601f106125df57805160ff191683800117855561260c565b8280016001018555821561260c579182015b8281111561260c5782518255916020019190600101906125f1565b5061261892915061261c565b5090565b5b80821115612618576000815560010161261d565b80356001600160a01b038116811461264857600080fd5b919050565b600082601f83011261265d578081fd5b81356001600160401b038082111561267757612677612e32565b604051601f8301601f19908116603f0116810190828211818310171561269f5761269f612e32565b816040528381528660208588010111156126b7578485fd5b8360208701602083013792830160200193909352509392505050565b6000602082840312156126e4578081fd5b61130082612631565b600080604083850312156126ff578081fd5b61270883612631565b915061271660208401612631565b90509250929050565b600080600060608486031215612733578081fd5b61273c84612631565b925061274a60208501612631565b9150604084013590509250925092565b6000806000806080858703121561276f578081fd5b61277885612631565b935061278660208601612631565b92506040850135915060608501356001600160401b038111156127a7578182fd5b6127b38782880161264d565b91505092959194509250565b600080604083850312156127d1578182fd5b6127da83612631565b9150602083013580151581146127ee578182fd5b809150509250929050565b6000806040838503121561280b578182fd5b61281483612631565b915060208301356001600160401b0381111561282e578182fd5b61283a8582860161264d565b9150509250929050565b60008060408385031215612856578182fd5b61285f83612631565b946020939093013593505050565b60006020828403121561287e578081fd5b5035919050565b60008060408385031215612897578182fd5b8235915061271660208401612631565b6000602082840312156128b8578081fd5b813561130081612e48565b6000602082840312156128d4578081fd5b815161130081612e48565b600080604083850312156128f1578182fd5b82356001600160401b03811115612906578283fd5b6129128582860161264d565b92505061271660208401612631565b600060208284031215612932578081fd5b5051919050565b60006020828403121561294a578081fd5b815160ff81168114611300578182fd5b60008151808452612972816020860160208601612d59565b601f01601f19169290920160200192915050565b60008251612998818460208701612d59565b9190910192915050565b600083516129b4818460208801612d59565b8351908301906129c8818360208801612d59565b01949350505050565b76020b1b1b2b9b9a1b7b73a3937b61d1030b1b1b7bab73a1604d1b815260008351612a03816017850160208801612d59565b7001034b99036b4b9b9b4b733903937b6329607d1b6017918401918201528351612a34816028840160208801612d59565b01602801949350505050565b6001600160a01b0391909116815260200190565b6001600160a01b0385811682528416602082015260408101839052608060608201819052600090612a879083018461295a565b9695505050505050565b602081526000611300602083018461295a565b60208082526032908201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560408201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b606082015260800190565b6020808252602c90820152600080516020612e7f83398151915260408201526b19195b1959d85d1958d85b1b60a21b606082015260800190565b6020808252602c90820152600080516020612e7f83398151915260408201526b6163746976652070726f787960a01b606082015260800190565b6020808252602e908201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160408201526d191e481a5b9a5d1a585b1a5e995960921b606082015260800190565b60208082526031908201527f4552433732313a207472616e736665722063616c6c6572206973206e6f74206f6040820152701ddb995c881b9bdc88185c1c1c9bdd9959607a1b606082015260800190565b60008219821115612c1c57612c1c612e06565b500190565b600082612c3057612c30612e1c565b500490565b600181815b80851115612c70578160001904821115612c5657612c56612e06565b80851615612c6357918102915b93841c9390800290612c3a565b509250929050565b600061130060ff841683600082612c9157506001610607565b81612c9e57506000610607565b8160018114612cb45760028114612cbe57612cda565b6001915050610607565b60ff841115612ccf57612ccf612e06565b50506001821b610607565b5060208310610133831016604e8410600b8410161715612cfd575081810a610607565b612d078383612c35565b8060001904821115612d1b57612d1b612e06565b029392505050565b6000816000190483118215151615612d3d57612d3d612e06565b500290565b600082821015612d5457612d54612e06565b500390565b60005b83811015612d74578181015183820152602001612d5c565b838111156111935750506000910152565b600081612d9457612d94612e06565b506000190190565b600181811c90821680612db057607f821691505b60208210811415612dd157634e487b7160e01b600052602260045260246000fd5b50919050565b6000600019821415612deb57612deb612e06565b5060010190565b600082612e0157612e01612e1c565b500690565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052601260045260246000fd5b634e487b7160e01b600052604160045260246000fd5b6001600160e01b031981168114610c1a57600080fdfe9c020a0271ff5a0691d094fb7b1dc55f2be3dae219b93bc91fed04a868b758e146756e6374696f6e206d7573742062652063616c6c6564207468726f75676820189ab7a9244df0848122154315af71fe140f3db0fe014031783b0946b8c9d2e3360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc68747470733a2f2f736f6d65636f6f6c7374756666736f6f7468657270656f706c6563616e67657470726572656e646572732e696f2f746f6b656e2f7b69647d416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c65649f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3eff0e519adfa92b08162a7a5fb116ac5cc83e9e7105e2ec4ca98c50726b178375ca2646970667358221220e5971d8802b4de729a1e792b0cd3d6436062bd3da4051e3d909cdcf60f09c45364736f6c63430008040033";

export class KaoMoji__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<KaoMoji> {
    return super.deploy(overrides || {}) as Promise<KaoMoji>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): KaoMoji {
    return super.attach(address) as KaoMoji;
  }
  connect(signer: Signer): KaoMoji__factory {
    return super.connect(signer) as KaoMoji__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): KaoMojiInterface {
    return new utils.Interface(_abi) as KaoMojiInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): KaoMoji {
    return new Contract(address, _abi, signerOrProvider) as KaoMoji;
  }
}
