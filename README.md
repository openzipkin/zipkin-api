# Zipkin API

[![Build Status](https://travis-ci.org/apache/incubator-zipkin-api.svg?branch=master)](https://travis-ci.org/apache/incubator-zipkin-api)

This repo includes an [OpenAPI Spec](./zipkin-api.yaml) and [Protocol Buffers interchange format](./zipkin.proto).

## Language independent interchange format for Zipkin transports
* [Protocol Buffers v3](./zipkin.proto) - Requires Zipkin 2.8+ or similar to parse it.

## OpenApi (Http endpoint of the zipkin server)
* [/api/v1](./zipkin-api.yaml) - Still supported on zipkin-server
* [/api/v2](./zipkin2-api.yaml) - Most recent and published [here](https://zipkin.apache.org/zipkin-api/#/)

Take a look at the [example repository](https://github.com/openzipkin/zipkin-api-example) for how to use this.
