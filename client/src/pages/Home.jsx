import React, { useState, useEffect } from 'react'

import { DisplayCampaigns } from '../components';
import { useStateContext } from '../context'

/**
 * Home component displays all campaigns and manages the loading state.
 * @returns {JSX.Element} The rendered Home component.
 */
const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);

  // Take address, contract, and getCampaigns function from context
  const { address, contract, getCampaigns } = useStateContext();

  /**
   * Fetches campaigns and manages the loading state.
   * @returns {Promise<void>} A promise that resolves when the campaigns are fetched and loading state is managed.
   */
  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getCampaigns();
    setCampaigns(data);
    setIsLoading(false);
  }

  // Fetch campaigns on component mount, send address and contract as dependencies
  useEffect(() => {
    // We can't use async/await directly in useEffect, so we call the async function inside
    if(contract) fetchCampaigns();
  }, [address, contract]);

  return (
    <DisplayCampaigns 
      title="All Campaigns"
      isLoading={isLoading}
      campaigns={campaigns}
    />
  )
}

export default Home