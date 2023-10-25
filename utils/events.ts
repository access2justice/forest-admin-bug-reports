import axios from 'axios';
import { signJWTToken } from './general';

export const EventTypes = {
  Legal_product_order: {
    Updated: 'legal_product_order.updated',
  },
  Lawyer: {
    Updated: 'lawyer.updated',
    Created: 'lawyer.created',
    Deleted: 'lawyer.deleted',
  },
  Firm: {
    Updated: 'firm.updated',
    Created: 'firm.created',
    Deleted: 'firm.deleted',
  },
};

export const triggerEvent = async (type: string, body: Object) => {
  try {
    const baseApiUrl = process.env.API_BASE_URL;
    const baseApiUrlSegments = baseApiUrl.split('api');
    await axios({
      url: `${baseApiUrlSegments[0]}webhooks/event`,
      method: 'POST',
      data: {
        type,
        body,
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `LAWYER-AUTH-TOKEN ${signJWTToken()}`,
      },
    });
  } catch (err) {
    console.log(
      JSON.stringify(
        {
          type,
          body,
        },
        undefined,
        2
      )
    );
    // console.error('Axios error');
    // console.error(err);
  }
};
