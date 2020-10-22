<template>
    <div id="apparatus">
        <p class="page-title">
            <!-- <span class="page-title-span">仪器数据显示</span> -->
            <span class="tool-box" v-show="pageSize == true">
                <i title="重置视图" class="el-icon-refresh refreshbtn" @click="resetEcharts"></i>
                <span class="legend-item" v-for="(item , $index) in legendArray" :key="$index">
                    <span class="legend-point" :style="{'background':item.color}" @click="showLine(item.id)">
                        <span :style="{'background':item.color}" class="legend-point-line"></span>
                    </span>
                    <span class="legend-title" @click="showYAxisAndWeightLine(item)">{{item.name}}</span>
                </span>
                <!-- <el-button @click="resetEcharts" size="mini">重置视图</el-button> -->

                <span class="contrlbtns">
                    <el-button type='primary' size="mini" @click="changeEchartsDataZoom(0)">&lt;&lt; 减少显示数据</el-button>
                    <!-- <el-input class="contrlbtnsinput" size="mini" v-model="echartsDataZoom" disabled></el-input> -->
                    <el-button type='primary' @click="changeEchartsDataZoom(1)" size="mini">增加显示数据 &gt;&gt;</el-button>
                </span>
            </span>
            <span class="close-btn" style="right:20px" @click="handleSize('apparatus')" title="放大/缩小"><i :class="iconName"></i></span>
            <span class="close-btn" @click="closeItem('apparatus')"><i class="el-icon-circle-close"></i></span>
        </p>
        <div class="apparatus-content">
            <div class="bigScreen" v-show="pageSize == true">
                <div id="myChart" :style="{ width: '85%', height: '500px',zIndex:'9' }"></div>
                <div class="apparatus-from-content">
                    <div class="apparatus-from-content-1">
                        <div class="top-input">
                            <div class="form-label-top">
                                <p>数据时间</p>
                                <span class="form-label-res">
                                    {{form.getDataTime}}
                                </span>
                            </div>
                        </div>
                        <div class="from-content">
                            <div class="form-label" v-for="(item, $index) in formArray" :key="$index" :label="item.dataName + '(' + item.dataUnit + ')'">
                                <p>{{item.dataName}} <span v-if="item.dataUnit!= null">({{item.dataUnit}})</span></p>
                                <span class="form-label-res">
                                    {{item.vals | formatterDecimals}}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-show="pageSize == false" class="smellScreen">
                <div class="top-input-1">
                    <div class="form-label">
                        <p>数据时间</p>
                        <span class="form-label-res" style="max-width: 200px;">
                            {{form.getDataTime}}
                        </span>
                    </div>
                </div>
                <div class="grid-content">
                    <div style="width:100%;height:84px"></div>
                    <div class="form-label" v-for="(item, $index) in formArray" :key="$index" :label="item.dataName + '(' + item.dataUnit + ')'">
                        <p>{{item.dataName}} <span v-if="item.dataUnit!= null">({{item.dataUnit}})</span></p>
                        <span class="form-label-res">
                            {{item.vals | formatterDecimals}}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import request from "@/utils/request.js";
export default {
    name: 'apparatus',
    data() {
        return {
            setInterval: null,
            thisTimes: '',
            limit: 1,
            iconName: 'el-icon-right',
            colorArray: ['#0000FF', '#DC143C', '#800080', '#5F9EA0', '#FF8C00', '#48D1CC', '#696969', '#006400', '#8B4513', '#FFD700'],
            legendArray: [],
            form: {
                getDataTime: '0',
            },
            myChart: "",
            option: {
                title: {
                    text: ''
                },
                grid: {
                    left: '5%',
                    right: '2%',
                    bottom: '5%',
                    containLabel: false
                },
                tooltip: {
                    trigger: 'axis'
                },
                color: ['#0000FF', '#DC143C', '#800080', '#5F9EA0', '#FF8C00', '#48D1CC', '#696969', '#006400', '#8B4513', '#FFD700'],
                dataZoom: [
                    {
                        type: 'inside',
                    },
                ],
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: [],
                    axisLine: { show: true },
                    axisTick: { show: false },
                    splitLine: { show: false },
                    axisLabel: {
                        show: false
                    }
                },
                yAxis: [],
                series: []
            },
            globelNum: 0,
            formArray: [],
            chartsArray: [],
            isEnter: false,
            echartsDataZoom: 100,
            clearEchartsInterval: null,
        }
    },
    beforeMount() {
    },
    mounted() {
        this.getishow()
        document.getElementsByClassName('apparatus-from-content')[0].style.height = (document.getElementById('apparatus').clientHeight - 50) + 'px';
        document.getElementsByClassName('grid-content')[0].style.height = (document.getElementById('apparatus').clientHeight - 50) + 'px';
        document.getElementById('myChart').style.height = (document.getElementById('apparatus').clientHeight - 50) + 'px';
        let _this = this;
        window.onresize = function () {
            _this.myChart.resize()
        }
        this.getDataSec();
        this.clearEcharts()
    },
    filters: {
        formatterDecimals(val) {
            if (val == null) {
                return 0
            } else if (val == 0) {
                return 0
            } else if (typeof val == 'string') {
                return val
            } else {
                return val.toFixed(4)
            }
        }
    },
    props: {
        pageSize: Boolean,
    },
    watch: {
        pageSize(newVal, oldVal) {
            if (newVal == false) {
                this.iconName = 'el-icon-back'
            } else {
                this.iconName = 'el-icon-right'
            }
        }
    },
    methods: {
        changeEchartsDataZoom(type) {
            let _this = this;
            if (type == 1) {
                this.echartsDataZoom += 100
                if (this.echartsDataZoom > 3000) {
                    this.echartsDataZoom = 3000
                }
            } else {
                this.echartsDataZoom -= 100
                if (this.echartsDataZoom < 100) {
                    this.echartsDataZoom = 100
                }
            }
            let a = _this.myChart.getOption();
            // console.log(a.series[0].data.length)
            // console.log(a.xAxis[0].data.length)
            // console.log(this.echartsDataZoom)
        },
        resetEcharts() {
            let _this = this;
            let options = _this.myChart.getOption();
            for (let i in options.yAxis) {
                options.yAxis[i].show = false;
            }
            for (let i in options.series) {
                options.series[i].lineStyle.width = 2;
            }
            options.yAxis[0].show = true;
            _this.myChart.setOption(options);
        },
        /**
         * 点击legend  文字显示Y轴与线条加粗
         * */
        showYAxisAndWeightLine(row) {
            let _this = this;
            // return
            let options = _this.myChart.getOption();
            for (let i in options.yAxis) {
                options.yAxis[i].show = false;
                // options.series[i].lineStyle.width = 2
                if (options.yAxis[i].id == row.id) {
                    if (row.sameAs == null) {
                        options.yAxis[i].show = true;
                        if (options.series[i].lineStyle.width == 2) {
                            options.series[i].lineStyle.width = 4
                        } else {
                            options.series[i].lineStyle.width = 2
                        }
                    } else {
                        for (let k in options.yAxis) {
                            if (options.yAxis[k].id == row.sameAs) {
                                options.yAxis[k].show = true;
                                // options.series[i].lineStyle.width = 4
                                if (options.series[i].lineStyle.width == 4) {
                                    options.series[i].lineStyle.width = 2
                                } else {
                                    options.series[i].lineStyle.width = 4
                                }
                            }
                        }
                    }
                }
            }
            _this.myChart.setOption(options);
        },
        /**
         * 点击圆点显示折线
         * */
        showLine(row) {
            let _this = this
            let options = _this.myChart.getOption()
            for (let i in options.yAxis) {
                if (options.series[i].id == row) {
                    if (options.series[i].lineStyle.width == 0) {
                        options.series[i].lineStyle.width = 2;
                    } else {
                        options.series[i].lineStyle.width = 0;
                    }
                }
            }
            _this.myChart.setOption(options);
        },

        /**
         * 定时器
        */
        getDataSec() {
            let _this = this;
            window.clearInterval(_this.setInterval);
            _this.setInterval = setInterval(() => {
                _this.getApparatusData({
                    thisTimes: _this.thisTimes,
                    // limit: _this.limit
                    limit: '',
                })
            }, 1000)
        },
        /**
         * 关闭当前组件窗口
        */
        closeItem(ele) {
            this.$emit('sendEleName', ele);
        },
        /**
         * 放大缩小当前组件窗口
        */
        handleSize(ele) {
            if (this.pageSize == true) {
                this.pageSize = false;
            } else {
                this.pageSize = true;
            }
            this.$emit('contrlEleName', {
                ele: ele,
                switch: this.pageSize
            });
        },
        /**
         * 动态更新Echarts的option
        */
        renderEcharts(result, isFirst) {
            let _this = this;
            if (!_this.myChart) {
                return
            }
            let options = _this.myChart.getOption();
            let useRollData = result.data;
            if (useRollData.length > 1) {
                useRollData.reverse();
            }
            for (let kk in useRollData) {
                if (isFirst == true) {
                    for (let i = 0; i < _this.echartsDataZoom; i++) {
                        options.xAxis[0].data.push(_this.formatterTimes(useRollData[kk].timeTag, i))
                    }
                }
                // 初始化 X 轴数量
                if (options.xAxis[0].data.indexOf(useRollData[kk].timeTag) == -1) {
                    options.xAxis[0].data.push(useRollData[kk].timeTag)
                }
                let resultdata = useRollData[kk];
                let seriesdata = options.series;
                for (let i in seriesdata) {
                    for (let j in resultdata) {
                        if (seriesdata[i].labelName == j) {
                            seriesdata[i].data.push(resultdata[j]);
                        }
                    }
                }
                /**
                 *  固定X轴数量与series的数量
                */
                if (options.xAxis[0].data.length > _this.echartsDataZoom) {
                    options.xAxis[0].data.splice(0, (options.xAxis[0].data.length - _this.echartsDataZoom));
                }
                for (let i = 0; i < options.series.length; i++) {
                    // console.log(options.series[i].data.length - _this.echartsDataZoom)
                    if (options.series[i].data.length > _this.echartsDataZoom) {
                        options.series[i].data.splice(0, (options.series[i].data.length - _this.echartsDataZoom));
                    }
                }
            }
            // console.log(result.data.length)
            // console.log(options.xAxis)
            // console.log(options.series)
            _this.myChart.setOption(options);

        },
        clearEcharts() {
            let _this = this;
            window.clearInterval(this.clearEchartsInterval)
            this.clearEchartsInterval = setInterval(() => {
                let a = this.myChart.getOption();
                this.myChart.clear();
                this.myChart.setOption(a);
                a = null;
            }, 1000 * 60 * 5)
        },
        /**
         * 获取Echarts数据
        */
        async getApparatusData(row) {
            let _this = this;
            // console.log(row.thisTimes + '|' + row.limit)
            let result = await request({
                url: "realtime",
                method: "get",
                params: {
                    start_time: row.thisTimes,
                    limit: row.limit,
                }
            });
            try {
                /**
                 * 初始化Echarts  X轴
                */
                if (result.data.length > 0) {
                    let resultUseCharts = JSON.parse(JSON.stringify(result));
                    // console.log(resultUseCharts)
                    // if (resultUseCharts.data.length > 1) {
                    for (let kk in resultUseCharts.data) {
                        for (let i in resultUseCharts.data[kk]) {
                            if (typeof resultUseCharts.data[kk][i] == 'number') {
                                resultUseCharts.data[kk][i] = resultUseCharts.data[kk][i] == null ? 0 : resultUseCharts.data[kk][i].toFixed(2)
                                // resultUseCharts.data[kk][i] == null ? 0 : resultUseCharts.data[0][i].toFixed(2)
                            }
                        }
                    }
                    // } 
                    // else {
                    //     for (let i in resultUseCharts.data[0]) {
                    //         if (typeof resultUseCharts.data[0][i] == 'number') {
                    //             resultUseCharts.data[0][i] = resultUseCharts.data[0][i] == null ? 0 : resultUseCharts.data[0][i].toFixed(2)
                    //             // resultUseCharts.data[0][i] == null ? 0 : resultUseCharts.data[0][i].toFixed(2)
                    //         }
                    //     }
                    // }

                    // console.log(resultUseCharts.data)
                    if (_this.globelNum == 0) {
                        _this.renderEcharts(resultUseCharts, true)
                    } else {
                        _this.renderEcharts(resultUseCharts, false)
                    }
                    _this.globelNum += 1;
                    // 获取时间
                    _this.form = {
                        getDataTime: result.data[0].timeTag,
                    };
                    _this.thisTimes = result.data[0].timeTag;

                    let resultdata = result.data[0]
                    // input框赋值
                    for (let i in _this.formArray) {
                        for (let j in resultdata) {
                            if (_this.formArray[i].fieldName == j) {
                                _this.formArray[i].vals = resultdata[j];
                            }

                        }
                    };
                }
            } catch (error) {
                console.error(error);
            }
        },
        /**
         * 格式化时间+1s
        */
        formatterTimes(time, sum) {
            let date = time;
            date = date.substring(0, 19);
            date = date.replace(/-/g, '/');
            let timestamp = new Date(date).getTime();
            if (sum == 0) {
                timestamp = timestamp;
            } else {
                timestamp = timestamp += (sum * 1000);
            }
            var d = new Date(timestamp);
            var dates = (d.getFullYear()) + "-" +
                (d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1) + "-" +
                (d.getDate() < 10 ? '0' + d.getDate() : d.getDate()) + " " +
                (d.getHours() < 10 ? '0' + d.getHours() : d.getHours()) + ":" +
                (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()) + ":" +
                (d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds());
            return dates
        },
        /**
         * 初始化Echarts，监听父容器大小自适应宽度、高度
        */
        drawLine() {
            let _this = this;
            // 基于准备好的dom，初始化echarts实例
            // this.myChart = this.$echarts.init(document.getElementById("myChart"));
            this.myChart = this.$echarts.getInstanceByDom(document.getElementById("myChart"));
            if (this.myChart === undefined) {
                this.myChart = this.$echarts.init(document.getElementById("myChart"));
            }
            // console.log(this.option)
            this.myChart.getZr().on('mousemove', params => {
                var pointInPixel = [params.offsetX, params.offsetY];
                if (this.myChart.containPixel('grid', pointInPixel)) {
                    if (_this.isEnter == true) {
                        return
                    };
                    _this.isEnter = true;
                    window.clearInterval(_this.setInterval)
                }
            })
            this.myChart.getZr().on('mouseout', function (ev) {
                _this.isEnter = false;
                window.clearInterval(_this.setInterval);
                _this.setInterval = setInterval(() => {
                    _this.getApparatusData({
                        thisTimes: _this.thisTimes,
                        // limit: _this.limit
                        limit: ''
                    })
                }, 1000)
            })

            this.myChart.setOption(this.option, true);

            let elementResizeDetectorMaker = require("element-resize-detector");//引入监听dom变化的组件
            let erd = elementResizeDetectorMaker();
            let worldMapContainer = document.getElementById('apparatus');
            erd.listenTo(worldMapContainer, function (element) {  //执行监听 
                _this.$nextTick(function () {
                    document.getElementById("myChart").style.width = element.offsetWidth + 'px';
                    _this.myChart.resize(); //变化重新渲染饼图
                })
            });
            let apparatusContent = document.getElementsByClassName('apparatus-content')[0];
            /**
             * 监听任务内容框是否缩小
             * */
            erd.listenTo(apparatusContent, function (element) {  //执行监听 
                _this.$nextTick(function () {
                    document.getElementsByClassName('apparatus-from-content')[0].style.height = element.clientHeight + 'px';
                    document.getElementsByClassName('grid-content')[0].style.height = element.clientHeight + 'px';
                    document.getElementById('myChart').style.height = element.clientHeight + 'px';
                    document.getElementById("myChart").style.width = element.offsetWidth + 'px';
                    _this.myChart.resize(); //变化重新渲染饼图
                })
            });
        },
        /**
         * 获取ishow  初始化Echarts的option的yAxis与series
         * */
        async getishow() {
            let _this = this;
            let result = await request({
                url: "sys-define/get_ishow_define",
                method: "get"
            });
            try {
                // console.log(result.data);
                _this.formArray = JSON.parse(JSON.stringify(result.data));

                if (_this.formArray.length > 0) {
                    for (let i in _this.formArray) {
                        if (_this.formArray[i].showInChart == 1) {
                            _this.chartsArray.push(_this.formArray[i])
                        }
                    }
                    for (let i in _this.chartsArray) {
                        _this.option.series.push({
                            id: _this.chartsArray[i].serialNo,
                            name: _this.chartsArray[i].dataName,
                            type: 'line',
                            yAxisIndex: i,
                            symbol: 'none',
                            smooth: true,
                            data: [],
                            labelName: _this.chartsArray[i].fieldName,
                            sameAs: _this.chartsArray[i].sameAs
                        });
                        _this.option.yAxis.push({
                            id: _this.chartsArray[i].serialNo,
                            name: _this.chartsArray[i].dataName,
                            position: 'left',
                            type: 'value',
                            show: i == 0 ? true : false,
                            inverse: _this.chartsArray[i].topLeft == 1 ? true : false,
                            axisLine: { show: true },
                            axisTick: { show: false },
                            splitLine: { show: true },
                            nameLocation: _this.chartsArray[i].topLeft == 1 ? 'start' : 'end',
                            min: _this.chartsArray[i].lowerLimit == null ? 'dataMin' : _this.chartsArray[i].lowerLimit,
                            max: _this.chartsArray[i].upperLimit == null ? 'dataMax' : _this.chartsArray[i].upperLimit,
                        });
                        _this.legendArray.push({
                            color: '',
                            name: _this.chartsArray[i].dataName + '(' + _this.chartsArray[i].dataUnit + ')',
                            id: _this.chartsArray[i].serialNo,
                            sameAs: _this.chartsArray[i].sameAs
                        })

                    }

                    for (let i in _this.option.yAxis) {
                        for (let j in _this.option.series) {
                            if (_this.option.series[j].sameAs == _this.option.yAxis[i].id) {
                                _this.option.series[j].yAxisIndex = i
                            }
                        }
                    }
                    for (let i in _this.colorArray) {
                        for (let j in _this.legendArray) {
                            _this.legendArray[j].color = _this.colorArray[j]
                        }
                    }

                    _this.drawLine()
                }


            } catch (error) {
                console.error(error);
            }
        }
        // async getJsonDate() {
        //      let _this = this;
        //     let result = await request({
        //         url: "/json/index.json",
        //         method: "get"
        //     });
        //     try {
        //         console.log(result);
        //     } catch (error) {
        //         console.log(error);
        //     }
        // }

    }
}
</script>

<style scoped>
.apparatus-content {
    height: 94%;
}

.bigScreen {
    height: 100%;
    position: relative;
    display: flex;
    justify-content: space-around;
}
.smellScreen {
    height: 100%;
    position: relative;
}
.from-content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0 20px;
    margin-top: 96px;
    z-index: 99;
    /* overflow: auto; */
}
.apparatus-from-content {
    height: 100%;
    overflow: hidden;
    width: 15%;
    border-left: 1px solid #eee;
    position: relative;
}
.apparatus-from-content::-webkit-scrollbar {
    display: none; /* Chrome Safari */
}
.apparatus-from-content-1 {
    height: 100%;
    overflow: auto;
    width: 100%;
    border-left: 1px solid #eee;
    /* position: relative; */
}
.apparatus-from-content-1::-webkit-scrollbar {
    display: none; /* Chrome Safari */
}

.page-title {
    height: 32px;
    position: relative;
    margin: 5px 10px;
    line-height: 32px;
    border-bottom: 1px solid #eee;
    cursor: default;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    z-index: 9999;
    /* overflow: auto; */
}
.page-title .page-title-span {
    font-size: 16px;
    color: #409eff;
}
.page-title .close-btn {
    position: absolute;
    right: 0px;
    top: 0px;
    cursor: pointer;
    color: #303133;
}
.grid-content {
    /* margin-top:60px; */
    overflow: auto;
    padding: 0 20px;
    z-index: 99;
    position: relative;
    /* width: 100%; */
}
.grid-content::-webkit-scrollbar {
    display: none; /* Chrome Safari */
}
.from-content-1 {
    margin-top: 85px;
}
.from-content-1 .el-form-item {
    margin-bottom: 6px;
}
.myChart {
    border-right: 1px solid #ccc;
}
/* 68 */
.top-input {
    cursor: default;
    margin-bottom: 18px;
    background: #fff;
    position: absolute;
    top: 0;
    z-index: 100;
    width: 100%;
}
.top-input p {
    font-size: 14px;
    color: #303133;
    line-height: 40px;
    box-sizing: border-box;
    font-weight: 600;
    margin: 0;
}
.top-input-1 {
    width: 100%;
    cursor: default;
    background: #fff;
    position: absolute;
    top: 0;
    z-index: 100;
    padding: 0 20px;
}
.top-input-1 p {
    font-size: 14px;
    color: #303133;
    line-height: 40px;
    box-sizing: border-box;
    font-weight: 600;
    margin: 0;
}
.legend-item {
    display: inline-block;
    padding: 0 4px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
.legend-item .legend-point {
    display: inline-block;
    height: 12px;
    width: 12px;
    background: #ccc;
    border-radius: 50%;
    position: relative;
    margin: 0 5px 0 5px;
    vertical-align: middle;
    cursor: pointer;
}
.legend-point-line {
    display: inline-block;
    position: absolute;
    width: 24px;
    height: 1px;
    top: 6px;
    left: -6px;
    background: #ccc;
}
.legend-item .legend-title {
    font-size: 12px;
    display: inline-block;
    padding: 0 3px;
    line-height: 24px;
    cursor: pointer;
}

.form-label {
    width: 100%;
    cursor: default;
    margin: 10px 0;
}
.form-label p {
    margin: 0;
    color: #303133;
    font-size: 14px;
    font-weight: 600;
}
.form-label .form-label-res {
    display: inline-block;
    border: 1px solid #dcdfe6;
    color: #606266;
    font-size: 14px;
    padding: 4px 3px;
    border-radius: 4px;
    width: 100%;
    max-width: 200px;
    text-indent: 3px;
    white-space: nowrap;
}
.form-label-top {
    cursor: default;
    margin: 10px 0;
    padding: 0 20px;
}
.form-label-top p {
    margin: 0;
    color: #303133;
    font-size: 14px;
    font-weight: 600;
}
.form-label-top .form-label-res {
    display: inline-block;
    border: 1px solid #dcdfe6;
    color: #606266;
    font-size: 14px;
    padding: 4px 3px;
    border-radius: 4px;
    width: 100%;
    text-indent: 3px;
    /* white-space: nowrap; */
}
.contrlbtns {
    display: inline-block;
    margin-left: 20px;
    z-index: 999;
}
.contrlbtns .contrlbtnsinput {
    display: inline-block;
    width: 35px;
    vertical-align: middle;
    margin: 0 10px;
    text-align: center;
}
.refreshbtn {
    display: inline-block;
    margin-right: 10px;
    vertical-align: middle;
    cursor: pointer;
}
.tool-box {
    display: inline-block;
    margin-left: 20px;
    /* width: 100%; */
    /* display: flex; */
    /* flex-wrap: nowrap; */
}
</style>