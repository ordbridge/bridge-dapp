import axios from "axios";

export const tickerList = async ({ limit, page }) => {
  try {
    const data = await axios.get(
      `https://api.ordbridge.io/bapi/bridge/tokens?limit=${limit}&offset=${page}`,
    );
    return data?.data;
  } catch (error) {
    throw error;
  }
};
export const updateAddress = async (payload) => {
  try {
    const data = await axios.post(
      `https://api.ordbridge.io/bapi/bridge/update_user_details`,
      payload,
    );
    return data;
  } catch (error) {
    throw error;
  }
};
export const initiateBridge = async ({ body, session_key }) => {
  try {
    const data = await axios.post(
      `https://api.ordbridge.io/bapi/bridge/init_payment`,
      body,
    );
    // const data = await axios.post(`https://api.ordbridge.io/bapi/bridge/init_payment`, body, {
    //   headers: {
    //     xid: session_key
    //   }
    // });
    return data?.data?.data;
  } catch (error) {
    throw error;
  }
};
export const pendingEntryService = async ({
  session_key,
  unisatAddress,
  metaMaskAddress,
}) => {
  try {
    const data = await axios.post(
      `https://api.ordbridge.io/bapi/bridge/pending_entries`,
      {
        unisat_address: unisatAddress,
        metamask_address: metaMaskAddress,
      },
    );
    return data?.data;
  } catch (error) {
    throw error;
  }
};
export const inscribeService = async ({
  res,
  metaMaskAddress,
  unisatAddress,
}) => {
  try {
    const data = await axios.post(
      `https://api.ordbridge.io/bapi/bridge/inscribe`,
      {
        inscribe_json: {
          amt: res?.inscribe?.amt,
          ethchain: res?.inscribe?.ethchain,
          avaxchain: res?.inscribe?.avaxchain,
          arbichain: res?.inscribe?.arbichain,
          basechain: res?.inscribe?.basechain,
          op: res?.inscribe?.op,
          p: res?.inscribe?.p,
          tick: res?.inscribe?.tick,
        },
        unisat_address: unisatAddress,
        metamask_address: metaMaskAddress,
      },
    );
    return data?.data?.data;
  } catch (error) {
    throw error;
  }
};
export const transferService = async ({ session_key, InscriptionId }) => {
  try {
    const data = await axios.post(
      `https://api.ordbridge.io/bapi/bridge/transfer`,
      {
        inscription_id: InscriptionId,
      },
    );
    return data?.data?.data;
  } catch (error) {
    throw error;
  }
};
export const deleteEntry = async ({ session_key, reference_id }) => {
  try {
    const data = await axios.delete(
      `https://api.ordbridge.io/bapi/bridge/delete_entries`,
      {
        reference_id: reference_id,
      },
    );
    return data?.data;
  } catch (error) {
    throw error;
  }
};
export const fetchFeeRate = async () => {
  try {
    const data = await axios.get(`https://api.blockchain.info/mempool/fees`);
    return data?.data;
  } catch (error) {
    throw error;
  }
};
