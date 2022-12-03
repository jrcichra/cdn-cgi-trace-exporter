export interface Env {}

const metricName = "cloudflare_cdn_cgi_trace";
const kvToLabel = (key: string, value: string): string => {
  return `${key}="${value}"`;
};

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    // the path after the domain is the website we want to scrape
    let path: string;
    try {
      path = new URL(request.url).pathname;
      path = path.slice(1, path.length);
    } catch (e) {
      return new Response("path must be URL!");
    }
    if (path.trim() === "") {
      return new Response("path must be URL!");
    }
    const resp = await fetch(`${path}/cdn-cgi/trace`);
    const text = await resp.text();
    // each line is its own metric
    const lines = text.split(/\r?\n/);
    const labels: string[] = [];
    // process
    let promValue = "0";
    for (const line of lines) {
      // get key and value for each line
      const kv = line.split("=");
      const key = kv[0];
      const value = kv.slice(1, kv.length).join("=");
      // skip empties
      if (!key || !value) {
        continue;
      }
      // set ts as the value and continue
      if (key === "ts") {
        promValue = value;
        continue;
      }
      const label = kvToLabel(key, value);
      labels.push(label);
    }
    // convert to a metric line
    const metric = `${metricName}\{${labels.join(",")}\} ${promValue}`;
    return new Response(metric);
  },
};
