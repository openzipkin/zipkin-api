# Rationale for api designs

## Get multiple traces: /api/v2/traceMulti?traceIds=id1,id2
Get by multiple trace IDs was added in [/api/v2](zipkin2-api.yaml) to support
more efficient requests when trace IDs are found by means besides the query api.

Here are some use cases:
* out-of-band aggregations, such histograms with attached representative IDs
* trace comparison views
* decoupled indexing and retrieval (Ex lucene over a blob store)
* 3rd party apis that offer stable pagination (via a cursor over trace IDs).

There were several design concerns to address when integrating another feature
into an existing api root. Most of these dealt with how to inform consumers that
the feature exists.

### Why /traceMulti instead of /trace/id,id2
A separate endpoint than /trace/ allows us to help consumers, such as the UI,
know the difference between unsupported (404) and empty (200 with empty list
response). /trace/{traceId}, on the other hand, returns 404 on not found. This
brings up a larger problems that a result of multiple traces is a list of
traces, which is a different data type than a list of spans.

### Why /traceMulti instead of /traces?traceIds=id1,id2
When search is disabled, `/trace/{traceId}` is still mounted, eventhough
`/traces` is not. Multi-get is an optimization of `/trace/{traceId}`, so needs
to be mounted when search-like mechanisms are disabled. It is still tempting to
re-use the same endpoint, but there is another problem. A new parameter will not
fail queries in most implementations.

For example, calling `/traces?traceIds=id1,id2` in an existing service is most
likely to return as if there was no `traceIds` parameter at all, resulting in
random results returned.

### Why /traceMulti
`/traceMulti` is most similar to `/trace/{traceId}` except for multiple IDs. It
has to be a different name to route properly. Other endpoints use lowerCamel
case format.

### Why a single traceIds parameter instead of multiple query parameters?
There are a lot of prior art on a single comma-separated query parameter. Using
this style will allow more frameworks vs those who can support multi-value via
redundant properties. Splitting on comma is of no risk as it is impossible to
have a trace ID with an embedded comma (trace IDs are lower-hex).

### Why minimum 2 trace IDs?
Minimum 2 trace IDs helps in a couple ways. Firstly, empty queries are bugs. The
more interesting question is why minimum 2 instead of 1. The most important
reason is that tools should use the oldest route that can satisfy a request. If
only passing a single ID, `/trace/{traceId}` is better. Moreover, that endpoint
is more likely to be cached properly.
