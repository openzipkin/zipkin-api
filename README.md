# Zipkin API

Zipkin API includes service and model definitions used for
Zipkin-compatible services.

This repository includes [OpenAPI Spec](./zipkin2-api.yam) as well
[Protocol Buffers](./zipkin.proto) and [Thrift](thrift) interchange formats. As these
IDL files are languagage agnostic, there are no compilation instructions needed or included.

## Language independent interchange format for Zipkin transports
* [Protocol Buffers v3](./zipkin.proto) - Requires Zipkin 2.8+ or similar to parse it.
* [Thrift](./thrift) - Deprecated as new clients should not generate this format

## OpenApi (Http endpoint of the zipkin server)
* [/api/v1](./zipkin-api.yaml) - Still supported on zipkin-server
* [/api/v2](./zipkin2-api.yaml) - Most recent and published [here](https://zipkin.apache.org/zipkin-api/#/)

Take a look at the [example repository](https://github.com/openzipkin/zipkin-api-example) for how to use this.
