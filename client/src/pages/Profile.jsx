import React, { useState, useEffect } from 'react'

import { DisplayCampaigns } from '../components';
import { useStateContext } from '../context'

/**
 * Profile component displays the user's campaigns.
 * It fetches the user's campaigns from the server and renders them using the DisplayCampaigns component.
 */
const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);

  const { address, contract, getUserCampaigns } = useStateContext();

  /**
   * Fetches the user's campaigns from the server.
   * Sets the fetched campaigns to the state variable 'campaigns'.
   * Sets the isLoading state variable to true while fetching the campaigns.
   * Sets the isLoading state variable to false after fetching the campaigns.
   */
  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getUserCampaigns();
    setCampaigns(data);
    setIsLoading(false);
  }

  useEffect(() => {
    if(contract) fetchCampaigns();
  }, [address, contract]);

  return (
    <DisplayCampaigns 
      title="User Campaigns"
      isLoading={isLoading}
      campaigns={campaigns}
    />
  )
}

export default Profile