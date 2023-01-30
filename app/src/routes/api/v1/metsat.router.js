const Router = require("koa-router");
const MetsatService = require("services/metsatService");
const proxy = require("koa-proxies");

const router = new Router({
  prefix: "/metsat",
});

class MetSatRouter {
  static async wmtsDescribeDomains(ctx) {
    ctx.assert(ctx.params.layer, 400, "layer required");

    ctx.body = await MetsatService.wmtsDescribeDomains(ctx.params.layer);
  }
  static async wmtsGetTimeDomanValues(ctx) {
    ctx.assert(ctx.params.layer, 400, "layer required");

    let fromValue = ctx.query.fromValue;

    ctx.body = await MetsatService.wmtsGetTimeDomainValues(
      ctx.params.layer,
      fromValue
    );
  }
}

router.get("/describe/:layer", MetSatRouter.wmtsDescribeDomains);
router.get("/time/:layer", MetSatRouter.wmtsGetTimeDomanValues);
router.get(
  "/wms",
  proxy("/", {
    target: "https://view.eumetsat.int/geoserver/wms",
    changeOrigin: true,
  })
);

module.exports = router;
