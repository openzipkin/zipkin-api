# Conventions

## Standard Tags

### HTTP_HOST (`http.host`)

The domain portion of the URL or host header. Ex. "mybucket.s3.amazonaws.com". Used to filter by host as opposed to IP address.

### HTTP_METHOD (`http.method`)

The HTTP method, or verb, such as "GET" or "POST". Used to filter against an http route.

### HTTP_PATH (`http.path`)

The absolute http path, without any query parameters. Ex. "/objects/abcd-ff"

Used as a filter or to clarify the request path for a given route. For example, the path for a route "/objects/:objectId" could be "/objects/abdc-ff". This does not limit cardinality like [HTTP_ROUTE](http.route) can, so is not a good input to a span name.

The Zipkin query api only supports equals filters. Dropping query parameters makes the number of distinct URIs less. For example, one can query for the same resource, regardless of signing parameters encoded in the query line. Dropping query parameters also limits the security impact of this tag.

Historical note: This was commonly expressed as "http.uri" in zipkin, even though it was most

### HTTP_ROUTE (`http.route`)

The route which a request matched or "" (empty string) if routing is supported, but there was no match. Ex "/users/{userId}"

Unlike HTTP_PATH("http.path"), this value is fixed cardinality, so is a safe input to a span name function or a metrics dimension. Different formats are possible. For example, the following are all valid route templates: `/users` `/users/:userId` `/users/{userId}` `/users/*`

Route-based span name generation often uses other tags, such as HTTP_METHOD("http.method") and HTTP_STATUS_CODE("http.status_code"). Route-based names can look like `get /users/{userId}`, `post /users`, `get not_found` or `get redirected`.
