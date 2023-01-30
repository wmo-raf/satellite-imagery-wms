const DOMParser = require("xmldom").DOMParser;

function createDocument(xml) {
  if (typeof xml === "object") return xml;
  if (typeof xml !== "string")
    throw new Error("xml must be a string or Document");
  return new DOMParser().parseFromString(xml, "application/xml");
}

const parseDescribeDomainsResponse = function (xml) {
  const xmlNamespaces = {
    ows: "http://www.opengis.net/ows/1.1",
    wmts_md:
      "http://demo.geo-solutions.it/share/wmts-multidim/wmts_multi_dimensional.xsd",
    wmts: "http://www.opengis.net/wmts/1.0",
  };

  try {
    const doc = createDocument(xml);

    const domainEl = doc.getElementsByTagNameNS(
      xmlNamespaces.wmts_md,
      "Domains"
    )[0];

    const describe = {};

    const spaceDomainEl = domainEl.getElementsByTagNameNS(
      xmlNamespaces.wmts_md,
      "SpaceDomain"
    )[0];

    if (spaceDomainEl) {
      var bboxEl = spaceDomainEl.getElementsByTagNameNS(
        xmlNamespaces.wmts_md,
        "BoundingBox"
      )[0];

      describe.bbox = {
        minx: parseFloat(bboxEl.getAttribute("minx")),
        maxx: parseFloat(bboxEl.getAttribute("maxx")),
        miny: parseFloat(bboxEl.getAttribute("miny")),
        maxy: parseFloat(bboxEl.getAttribute("maxy")),
      };
    }

    var dimensionsListEl = domainEl.getElementsByTagNameNS(
      xmlNamespaces.wmts_md,
      "DimensionDomain"
    );

    describe.domains = Array.from(dimensionsListEl).map(function (dimEl) {
      const domainContentEl = dimEl.getElementsByTagNameNS(
        xmlNamespaces.wmts_md,
        "Domain"
      )[0].childNodes[0];

      return {
        dimension: dimEl.getElementsByTagNameNS(
          xmlNamespaces.ows,
          "Identifier"
        )[0].childNodes[0].nodeValue,
        range: domainContentEl ? domainContentEl.nodeValue : null,
        size: parseInt(
          dimEl.getElementsByTagNameNS(xmlNamespaces.wmts_md, "Size")[0]
            .childNodes[0].nodeValue
        ),
      };
    });

    return describe;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const parseGetDomainValuesResponse = function (xml) {
  const xmlNamespaces = {
    ows: "http://www.opengis.net/ows/1.1",
    wmts_md:
      "http://demo.geo-solutions.it/share/wmts-multidim/wmts_multi_dimensional.xsd",
    wmts: "http://www.opengis.net/wmts/1.0",
  };

  try {
    const doc = createDocument(xml);

    const domainValuesEl = doc.getElementsByTagNameNS(
      xmlNamespaces.wmts_md,
      "DomainValues"
    )[0];

    const domainEl = domainValuesEl.getElementsByTagNameNS(
      xmlNamespaces.wmts_md,
      "Domain"
    )[0];

    const data = {};

    let values = domainEl.childNodes[0].nodeValue;
    data.values = values.split(",");

    return data;
  } catch (e) {
    console.log(e);
    return null;
  }
};

module.exports = { parseDescribeDomainsResponse, parseGetDomainValuesResponse };
