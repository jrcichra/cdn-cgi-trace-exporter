# cdn-cgi-trace-exporter

A worker that transforms /cdn-cgi/trace to a scrapable prometheus endpoint

# Usage

https://cdn-cgi-trace-exporter.jrcichra.workers.dev/https://jrcichra.dev

# NOTE

When using logic within a worker on the edge, it's going to show the /cdn-cgi/trace from the worker's perspective.

# TODO

Possibly provide the same data from the context of the worker instead of /cdn-cgi/trace...
