//This file is used to run web3 functions and store the data in a context. This is a good way to keep the data in one place and make it accessible to all components. We will use this context in the next step to display the data in the UI.
import React, { useContext, createContext } from 'react';

import { useAddress, useContract, useConnect, useContractWrite} from '@thirdweb-dev/react';
import { ethers } from 'ethers';
//createContext is used to create a context. We will use this context to store the data.
const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  //useContract is a custom hook that we created to get the contract instance. We will use this instance to call the contract functions.
  const { contract } = useContract('0x24106A32BB68aebFc843fd6b5D3531907569E8C8');

  //hold write functions from contract
  //                                                  contract instance, function name
  const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign');

  //address is used to get the user's address. We will use this address to check if the user is the owner of the campaign.
  const address = useAddress();
  const connect = useConnect();

  const publishCampaign = async (form) => {
    try {
      const data = await createCampaign({
				args: [
                    //need to follow the order of the function in the contract
					address, // owner
					form.title, // title
					form.description, // description
					form.target,
					new Date(form.deadline).getTime(), // deadline,
					form.image,
				],
			});

      console.log("contract call success", data)
    } catch (error) {
      console.log("contract call failure", error)
    }
  }

  const getCampaigns = async () => {
    const campaigns = await contract.call('getCampaign');
    //we are only passing the data that we need to the UI
    const parsedCampaings = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
      image: campaign.image,
      pId: i
    }));

    return parsedCampaings;
  }

  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();
    //filtering the campaigns based on the owner's address
    const filteredCampaigns = allCampaigns.filter((campaign) => campaign.owner === address);

    return filteredCampaigns;
  }

  const donate = async (pId, amount) => {
    // call the donateToCampaign function from the contract, pid = campaign id, amount = amount to donate
    //ethers.utils is the library that we use to convert the amount
    const data = await contract.call('donateToCampaign', [pId], { value: ethers.utils.parseEther(amount)});

    return data;
  }

  const getDonations = async (pId) => {
    //call the getDonaters function from the contract, pid = campaign id
    const donations = await contract.call('getDonaters', [pId]);
    const numberOfDonations = donations[0].length;

    const parsedDonations = [];

    for(let i = 0; i < numberOfDonations; i++) {
      //we are only passing the data that we need to the UI
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString())
      })
    }

    return parsedDonations;
  }


  return (
    <StateContext.Provider
      value={{ 
        address,
        contract,
        connect,
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations
      }}
    >
      {children}
    </StateContext.Provider>
  )
};

export const useStateContext = () => useContext(StateContext);