const db = require('../config/db.config.js').winchdb;

const fastcsv = require("fast-csv");
const fs = require("fs");
const export_file = "winch-realtime-data.csv";
const ws = fs.createWriteStream(export_file);


exports.init_winch = (req, res) => {
    const dptId = req.query.dptId;
    var execStmt = "CALL sp_winchInit_";
    const defaultDptId = "MVP4000";
    if (dptId)
        execStmt += dptId + "();";
    else
        execStmt += defaultDptId + "();";

    db.query(execStmt)
       .then(data => {
        res.send(data);
        console.log("Init winch successfully!")
        }
        )
        .catch(error => {
            res.json({ error: error });
        });
};


exports.data_prepare = (req, res) => {
    const dptId = req.query.dptId;
    const startTime = req.query.startTime;
    const endTime = req.query.endTime;

    var execStmt = "CALL sp_dataPrepare_";
    const defaultDptId = "MVP4000";
    if (dptId)
        execStmt += dptId + "(:start_time, :end_time);";
    else
        execStmt += defaultDptId + "(:start_time, :end_time);";

    db.query(execStmt,
        { replacements: { start_time: startTime, end_time: endTime } })
        .then(data => {
            res.send(data);
            console.log("Prepare winch data successfully!")
        }
        )
        .catch(error => {
            res.json({ error: error });
        });
};

exports.get_real_data = (req, res) => {
    const startTime = req.query.start_time;
    const limitCount = req.query.limit;
    var query_stmt = "SELECT * FROM VW_WINCH_REALTIME";
    if (startTime)
        query_stmt += " where timeTag >= $start_time";
    if (limitCount)
        query_stmt += " limit $limit_count"
    db.query(query_stmt, {
        //model: RealTime,
        //mapToModel: false // ������κ�ӳ���ֶΣ��������ﴫ��true
        bind: {
            start_time: startTime,
            limit_count: limitCount
        },
        type: db.QueryTypes.SELECT
    })
        .then(real_data => {
            res.send(real_data);
            // Each record will now be an instance of Project
        })
};

exports.export_realtime_data = (req, res) => {
  
    var query_stmt = "SELECT * FROM VW_WINCH_REALTIME";
    db.query(query_stmt, {
        type: db.QueryTypes.SELECT
    })
        .then(real_data => {
            const jsonData = JSON.parse(JSON.stringify(real_data));
            console.log("jsonData", jsonData);

            fastcsv
                .write(jsonData, { headers: true })
                .on("finish", function () {
                    console.log("Write to csv successfully!");
                    res.json({ fileName: export_file });
                })
                .pipe(ws);
        })
};

/*
 * sequelize
  .query('CALL login (:email, :pwd, :device)',
        {replacements: { email: "me@jsbot.io", pwd: 'pwd', device: 'android', }})
  .then(v=>console.log(v));
 * 
 * /


/*
models.sequelize.query('DECLARE @outParam1 INT, @outParam2 INT EXEC procedureName @param1=:param, @outParam1 = @outParam1 output, @outParam2 = @outParam2 output SELECT @outParam1 AS "outParam1", @outParam2 AS "outParam2"',
    {
    replacements:
    {
        param: 123
        },
        type: models.sequelize.QueryTypes.EXEC
    }).spread(result => {
    if (result)
    {
        console.log("\nInside result : " + JSON.stringify(result));
        //return response here
    }

*/


/*
exports.exportRealtimeData = (req, res) => {
    const startTime = req.query.start_time;
    const limitCount = req.query.limit;
    var query_stmt = "SELECT * FROM VW_DATA_REALTIME";
    db.query(query_stmt, {
        type: db.QueryTypes.SELECT
    })
        .then(real_data => {
            const jsonData = JSON.parse(JSON.stringify(real_data));
            console.log("jsonData", jsonData);

            fastcsv
                .write(jsonData, { headers: true })
                .on("finish", function () {
                    console.log("Write to csv successfully!");
                    res.json({ fileName: export_file });
                })
                .pipe(ws);
        })
};
*/
