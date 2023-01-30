const { create } = require("axios");
const https = require("https");
const {
  parseDescribeDomainsResponse,
  parseGetDomainValuesResponse,
} = require("./ogcParser");

const BASE_URL = "https://view.eumetsat.int/geoserver";
const TIMEOUT = 3000;

const geoserverRequest = create({
  timeout: TIMEOUT,
  baseURL: BASE_URL,
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

class MetsatService {
  static async wmtsDescribeDomains(layer) {
    const url = "/gwc/service/wmts";

    const params = {
      service: "WMTS",
      version: "1.0.0",
      request: "DescribeDomains",
      layer: layer,
    };

    return geoserverRequest
      .get(url, { params })
      .then((res) => {
        return parseDescribeDomainsResponse(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static async wmtsGetTimeDomainValues(layer, fromValue = null, limit = 10000) {
    const url = "/gwc/service/wmts";

    const params = {
      service: "WMTS",
      version: "1.0.0",
      request: "GetDomainValues",
      tileMatrix: "EPSG:4326",
      domain: "time",
      limit: limit,
      layer: layer,
    };

    if (fromValue) {
      params.FromValue = fromValue;
    }

    return geoserverRequest
      .get(url, { params })
      .then((res) => {
        
        return parseGetDomainValuesResponse(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = MetsatService;
