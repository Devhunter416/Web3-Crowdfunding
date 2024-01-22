// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract CrowdFunding {
    struct Campaign{
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        address[] donators;
        uint256[] donations;
    }


    mapping(uint256 => Campaign) public campaigns;//mapping id to campaign

    uint256 public numberOfCampaigns = 0;
    
    //create a campaign
    //write public so accessibe from frontend, returns id of campaign
    function createCampaign(address _owner, string memory _title, string memory _description, uint256 _target, uint256 _deadline, string memory _image) public returns (uint256){
        //create a new campaign
        Campaign storage campaign = campaigns[numberOfCampaigns];
        //check if deadline is in the future
        require(campaign.deadline < block.timestamp, "The deadline should be a date in the future.");

        //fill in the campaign
        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.amountCollected = 0;//when creating a campaign, no money has been collected yet
        campaign.image = _image;

        //increment the number of campaigns
        numberOfCampaigns++;
        //return the id of the new currently created campaign
        return numberOfCampaigns-1;

    }

    //donate to a campaign with id of campaign we donate to
    //payable so we can send money to the campaign
    function donateToCampaign(uint256 _id) public payable{
        //get the amount of money we send
        uint256 amount = msg.value;
        //get campaign of the if from the mapping
        Campaign storage campaign = campaigns[_id];

        campaign.donators.push(msg.sender);
        campaign.donations.push(amount);

        (bool sent, ) //bool sent is true if the money is sent(status of transaction)
        = payable(campaign.owner).call{value: amount}("");
        //if the money is sent, add the amount to the amountCollected of the campaign
        if(sent){
            campaign.amountCollected += amount;
        }
    }

    //get donator address and donation
    //view = read only                                      donators,        donations
    function getDonaters(uint256 _id) view public returns (address[] memory, uint256[] memory){
        return (campaigns[_id].donators, campaigns[_id].donations);
    }

    //get all the campaigns created
    function getCampaign() public view returns (Campaign[] memory) {
        //create an array of campaigns with size of numberOfCampaigns
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);
        //populate the array with all the campaigns
        for(uint i = 0; i < numberOfCampaigns; i++){
            Campaign storage item = campaigns[i];
            allCampaigns[i] = item;
        }

        return allCampaigns;
    }

}