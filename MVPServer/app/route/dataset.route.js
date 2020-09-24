module.exports = app => {
    const realtime_ctl = require("../controller/realtime.controller");

    var router = require("express").Router();
    router.get("/", realtime_ctl.findAll);
    router.post("/export", realtime_ctl.exportRealtimeData);
    router.get("/crtJobHis", realtime_ctl.crtJobHis);
    app.use('/api/realtime', router);
};
