
export default async function ticketMetrics_func() {
  const apiUrl = 'https://mui.zendesk.com/api/v2/ticket_metrics';

  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: process.env.ZENDESK,
    },
  };

  async function fetchAllPages(url: string, accumulated: any[] = []): Promise<any> {
    try {
      const res = await fetch(url, options);
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const data = await res.json();
      const combined = accumulated.concat(data.ticket_metrics || []);
      if (data.next_page) {
        return fetchAllPages(data.next_page, combined);
      }
      return combined;
    } catch (error) {
      console.log('Fetch error:', error);
      return { error: error instanceof Error ? error.message : String(error) };
    }
  }

  return fetchAllPages(apiUrl);
}

