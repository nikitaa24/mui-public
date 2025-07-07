/**
 * Toolpad Studio handlers file.
 */
import dotenv from "dotenv";
dotenv.config();

type TicketMetric = {
  ticket_id: number;
  created_at: string;
  resolution_time_in_minutes?: {
    calendar?: number;
    business?: number;
  };
};

type TicketMetricsResponse = {
  ticket_metrics: TicketMetric[];
  meta: {
    has_more: boolean;
  };
  links: {
    next?: string;
  };
};

type SimplifiedMetric = {
  ticket_id: number;
  created_at: string;
  resolution_time: number | null;
};

export default async function getRecentTicketMetrics(
  daysAgo: number = 7
): Promise<SimplifiedMetric[]> {
  const domain = process.env.ZENDESK_DOMAIN;
  const email = process.env.ZENDESK_EMAIL;
  const apiToken = process.env.ZENDESK_API_TOKEN;

  if (!domain || !email || !apiToken) {
    throw new Error("Missing Zendesk credentials in environment variables.");
  }

  const auth = Buffer.from(`${email}/token:${apiToken}`).toString("base64");
  const headers = { Authorization: `Basic ${auth}` };

  const cutoffDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
  let url = `https://${domain}/api/v2/ticket_metrics.json?page[size]=100`;

  const allMetrics: TicketMetric[] = [];

  while (url) {
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`Error fetching data: ${res.statusText}`);

    const data: TicketMetricsResponse = await res.json();
    allMetrics.push(...data.ticket_metrics);

    if (data.meta.has_more && data.links.next) {
      url = data.links.next;
    } else {
      break;
    }
  }

  const recentMetrics = allMetrics.filter((metric) => {
    const createdAt = new Date(metric.created_at);
    return createdAt >= cutoffDate;
  });

  return recentMetrics.map((metric) => ({
    ticket_id: metric.ticket_id,
    created_at: metric.created_at,
    resolution_time: metric.resolution_time_in_minutes?.calendar ?? null,
  }));
}