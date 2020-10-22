<template>
    <div id="winch">
        <p class="page-title">
            <!-- <span>绞车信息显示</span> -->
            <span style="display:inline-block;margin-left:60px" v-show="pageSize == false">
                <span class="legend-item" v-for="(item , $index) in legendArray" :key="$index">
                    <span class="legend-point" :style="{'background':item.color}" @click="showLine(item.id)">
                        <span :style="{'background':item.color}" class="legend-point-line"></span>
                    </span>
                    <span class="legend-title" @click="showYAxisAndWeightLine(item)">{{item.name}}</span>
                </span>
                <span class="contrlbtns">
                    <el-button type='primary' size="mini" @click="changeEchartsDataZoom(0)">&lt;&lt; 减少显示数据</el-button>
                    <!-- <el-input class="contrlbtnsinput" size="mini" v-model="echartsDataZoom" disabled></el-input> -->
                    <el-button type='primary' @click="changeEchartsDataZoom(1)" size="mini">增加显示数据 &gt;&gt;</el-button>
                </span>
                <!-- <span class="contrlbtns">
                    <el-button type='primary' @click="changeEchartsDataZoom(1)" size="mini">&lt;&lt; 增加显示数据</el-button>
                    <el-input class="contrlbtnsinput" size="mini" v-model="echartsDataZoom" disabled></el-input>
                    <el-button type='primary' size="mini" @click="changeEchartsDataZoom(0)">减少显示数据 &gt;&gt;</el-button>
                </span> -->
            </span>
            <span class="close-btn" style="right:20px" @click="handleSize('winch')" title="放大/缩小"><i :class="iconName"></i></span>
            <span class="close-btn" @click="closeItem('winch')"><i class="el-icon-circle-close"></i></span>
        </p>
        <div class="winch-content">
            <div v-show="pageSize == true">
                <div class="input-area-1">
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
            <div v-show="pageSize == false" style="height:100%;overflow:hidden">
                <div class="bigScreen">
                    <div class="leftScreen">
                        <div class="leftScreen-inside">
                            <!-- , height:'671px' -->
                            <div id="myChart1" :style="{ width: '100%',zIndex:'9' }"></div>
                            <div class="checkbox-content">
                                <el-collapse v-model="activeNames">
                                    <el-collapse-item class="checkbox-group" v-for="(item, $index) in checkboxarray" :key="$index" :title="item.name" :name="$index + 1">
                                        <div v-for="(it, is) in item.arr" :key="is" class="checkbox-box">
                                            <el-checkbox disabled v-for="(itt, iss) in it.array" :key="iss" :label="itt.dataValue" v-model="itt.checked" :name="itt.dataValue">{{itt.dataDescription}}</el-checkbox>
                                        </div>
                                        <!-- <el-checkbox disabled v-for="(it, is) in item.arr" :key="is" :label="it.dataValue" v-model="it.checked" :name="it.dataValue">{{it.dataDescription}}</el-checkbox> -->
                                    </el-collapse-item>
                                </el-collapse>

                                <!-- <div class="checkbox-group" v-for="(item, $index) in checkboxarray" :key="$index">
                                <el-checkbox v-for="(it, is) in item.arr" :key="is" :label="it.dataValue" v-model="it.checked" :name="it.dataValue">{{it.dataDescription}}</el-checkbox>
                            </div> -->
                            </div>
                        </div>

                    </div>
                    <div class="input-area-box">
                        <div class="top-input">
                            <div class="form-label-top">
                                <p>数据时间</p>
                                <span class="form-label-res">
                                    {{form.getDataTime}}
                                </span>
                            </div>
                        </div>
                        <div class="input-area">
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
            </div>
        </div>

    </div>
</template>

<script>
import request from "@/utils/request.js";
export default {
    name: 'winch',
    data() {
        return {
            activeNames: [1, 2, 3, 4],
            readyRenderCheckboxData: false,
            globelNum: 0,
            formArray: [],
            chartsArray: [],
            isEnter: false,
            echartsDataZoom: 100,
            colorArray: ['#0000FF', '#DC143C', '#800080', '#5F9EA0', '#FF8C00', '#48D1CC', '#696969', '#006400', '#8B4513', '#FFD700'],
            legendArray: [],
            checkvalueArray: [],
            checkList: [3, 5, 6],
            checkList1: [6],
            checkList2: [3],
            userlevel: 0,
            thisTimes: '',
            limit: 1,
            form: { getDataTime: '0' },
            iconName: 'el-icon-right',
            labelPosition: 'top',
            sizeForm: {
                ropeLengthMet: '',
                pullRopeSpeed: '',
                type: [1, 4],
                collectSpeed: '',
                ropeBar: '',
                fuelTmp: '',
                handleImport: '',
                proportionalExport: '',
                brakeBar: '',
            },
            checkboxarray: [{ arr: [] }],
            myChart1: "",
            option: {
                title: {
                    text: ''
                },
                tooltip: {
                    trigger: 'axis'
                },
                color: ['#0000FF', '#DC143C', '#800080', '#5F9EA0', '#FF8C00', '#48D1CC', '#696969', '#006400', '#8B4513', '#FFD700'],
                // legend: {
                //     data: ['深度(米)', '当前海深(米)', '温度(℃)', '导电率(S/m)', '压力(bar)', '盐度(psu)', '声速(m/s)', 'PH()', '浊度(ug/l)', '叶绿素(ug/l)']
                // },
                grid: {
                    left: '5%',
                    right: '5%',
                    bottom: '5%',
                    containLabel: false
                },
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
            clearEchartsInterval: null,
        }
    },
    watch: {
        pageSize(newVal, oldVal) {
            if (newVal == true) {
                this.iconName = 'el-icon-right'
            } else {
                this.iconName = 'el-icon-back'
            }
        }
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
    beforeMount() {
    },
    mounted() {
        this.getStatusDefine();
        this.getwshow();
        document.getElementsByClassName('input-area')[0].style.height = (document.getElementById('winch').clientHeight - 50) + 'px';
        document.getElementsByClassName('input-area-1')[0].style.height = (document.getElementById('winch').clientHeight - 50) + 'px';
        let _this = this;
        window.onresize = function () {
            _this.myChart1.resize()
        }
        this.getDataSec();
        this.clearEcharts()
    },
    methods: {
        clearEcharts() {
            let _this = this;
            window.clearInterval(this.clearEchartsInterval)
            this.clearEchartsInterval = setInterval(() => {
                let a = this.myChart1.getOption();
                this.myChart1.clear();
                this.myChart1.setOption(a);
                a = null;
            }, 1000 * 60 * 5)
        },
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
        },
        closeItem(ele) {
            this.$emit('sendEleName', ele);
        },
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
         * 点击legend  文字显示Y轴与线条加粗
         * */
        showYAxisAndWeightLine(row) {
            let _this = this;
            let options = _this.myChart1.getOption();
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
                            if (row.sameAs == options.yAxis[k].id) {
                                options.yAxis[k].show = true;
                                if (options.series[i].lineStyle.width == 2) {
                                    options.series[i].lineStyle.width = 4
                                } else {
                                    options.series[i].lineStyle.width = 2
                                }
                            }
                        }
                    }
                }
            }
            _this.myChart1.setOption(options);
        },
        /**
         * 点击圆点显示折线
         * */
        showLine(row) {
            let _this = this
            let options = _this.myChart1.getOption()
            for (let i in options.yAxis) {
                if (options.series[i].id == row) {
                    if (options.series[i].lineStyle.width == 0) {
                        options.series[i].lineStyle.width = 2;
                    } else {
                        options.series[i].lineStyle.width = 0;
                    }
                }
            }
            _this.myChart1.setOption(options);
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
         * 定时器
        */
        getDataSec() {
            let _this = this;
            window.clearInterval(_this.setInterval);
            _this.setInterval = setInterval(() => {
                _this.getWinchData({
                    thisTimes: _this.thisTimes,
                    limit: _this.limit
                })
            }, 1000)
        },
        /**
         * 动态更新Echarts的option
        */
        renderEcharts(result, isFirst) {
            let _this = this;
            if (!_this.myChart1) {
                return
            }
            let options = _this.myChart1.getOption();
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
                            seriesdata[i].data.push(resultdata[j])
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

            _this.myChart1.setOption(options)
        },
        async getWinchData(row) {
            let _this = this;
            let result = await request({
                url: "winch/get_realdata",
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
                    let resultUseCharts = JSON.parse(JSON.stringify(result))
                    let resultUseCharts1 = JSON.parse(JSON.stringify(result))
                    for (let i in resultUseCharts.data[0]) {
                        if (typeof resultUseCharts.data[0][i] == 'number') {
                            resultUseCharts.data[0][i] = resultUseCharts.data[0][i] == null ? 0 : resultUseCharts.data[0][i].toFixed(2)
                        }
                    }
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
                    for (let i in resultUseCharts1.data[0]) {
                        for (let j in _this.checkboxarray) {
                            for (let k in _this.checkboxarray[j].arr) {
                                if (i == _this.checkboxarray[j].arr[k].fieldName) {
                                    // value
                                    _this.checkboxarray[j].arr[k].value = resultUseCharts1.data[0][i]
                                }
                            }
                        }
                    }
                    for (let y = 0; y < _this.checkboxarray.length; y++) {
                        for (let u = 0; u < _this.checkboxarray[y].arr.length; u++) {
                            for (let p = 0; p < _this.checkboxarray[y].arr[u].array.length; p++) {
                                _this.checkboxarray[y].arr[u].array[p].checked = false;
                                if ((_this.checkboxarray[y].arr[u].value & _this.checkboxarray[y].arr[u].array[p].dataValue) > 0) {
                                    _this.checkboxarray[y].arr[u].array[p].checked = true
                                }
                            }
                            // _this.checkboxarray[y].arr[u].checked = false
                            // if ((_this.checkboxarray[y].value & _this.checkboxarray[y].arr[u].dataValue) > 0) {
                            //     _this.checkboxarray[y].arr[u].checked = true
                            // }
                        }
                    }
                    // console.log(_this.checkboxarray)
                }
            } catch (error) {
                console.error(error);
            }
        },
        /**
         * 获取wshow
         * */
        async getwshow() {
            let _this = this;
            let result = await request({
                url: "sys-define/get_wshow_define",
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
        },
        drawLine() {
            let _this = this;
            // 基于准备好的dom，初始化echarts实例
            // this.myChart1 = this.$echarts.init(document.getElementById("myChart1"));
            this.myChart1 = this.$echarts.getInstanceByDom(document.getElementById("myChart1"));
            if (this.myChart1 === undefined) {
                this.myChart1 = this.$echarts.init(document.getElementById("myChart1"));
            }
            this.myChart1.getZr().on('mousemove', params => {
                var pointInPixel = [params.offsetX, params.offsetY];
                if (this.myChart1.containPixel('grid', pointInPixel)) {
                    if (_this.isEnter == true) {
                        return
                    };
                    _this.isEnter = true;
                    window.clearInterval(_this.setInterval)
                }
            })
            this.myChart1.getZr().on('mouseout', function (ev) {
                _this.isEnter = false;
                window.clearInterval(_this.setInterval);
                _this.setInterval = setInterval(() => {
                    _this.getWinchData({
                        thisTimes: _this.thisTimes,
                        limit: '',
                        // limit: _this.limit
                    })
                }, 1000)
            })
            this.myChart1.setOption(this.option, true);
            let elementResizeDetectorMaker = require("element-resize-detector");//引入监听dom变化的组件
            let erd = elementResizeDetectorMaker();
            let winchContent = document.getElementsByClassName('winch-content')[0];
            erd.listenTo(winchContent, function (element) {  //执行监听 
                _this.$nextTick(function () {
                    document.getElementById("myChart1").style.width = '100%';
                    _this.myChart1.resize(); //变化重新渲染饼图
                })
            });

            // let winchContent = document.getElementsByClassName('winch-content')[0];
            /**
             * 监听任务内容框是否缩小
             * */
            erd.listenTo(winchContent, function (element) {  //执行监听 
                _this.$nextTick(function () {
                    document.getElementsByClassName('input-area')[0].style.height = element.clientHeight + 'px';
                    document.getElementsByClassName('input-area-1')[0].style.height = element.clientHeight + 'px';

                    document.getElementById('myChart1').style.height = element.clientHeight - document.getElementsByClassName('checkbox-content')[0].clientHeight + 'px';
                    if (document.getElementById('myChart1').clientHeight > 500) {
                        document.getElementById('myChart1').style.height = element.clientHeight - document.getElementsByClassName('checkbox-content')[0].clientHeight + 'px';
                    } else {
                        document.getElementById('myChart1').style.height = element.clientHeight - (49 * _this.checkboxarray.length) + 'px';
                    }
                    // document.getElementById('myChart1').style.height = element.clientHeight - 148 + 'px'
                    // document.getElementsByClassName('leftScreen')[0].style.height = document.getElementsByClassName('checkbox-content')[0].clientHeight + 671 + 'px'
                    _this.myChart1.resize(); //变化重新渲染饼图
                })
            });
        },

        async getStatusDefine() {
            let _this = this;
            let result = await request({
                url: "winch/get_status_define",
                method: "get"
            });
            try {
                _this.checkboxarray = [];
                let b = [];
                let c = [];
                // for (let i in result.data) {
                //     if (b.indexOf(result.data[i].fieldName) == -1) {
                //         b.push(result.data[i].fieldName)
                //     }
                // }
                for (let i in result.data) {
                    if (b.indexOf(result.data[i].dataType) == -1) {
                        b.push(result.data[i].dataType)
                    }
                    if (c.indexOf(result.data[i].fieldName) == -1) {
                        c.push(result.data[i].fieldName)
                    }
                }
                for (let o = 0; o < b.length; o++) {
                    let a = {
                        name: '',
                        arr: [],
                        dataType: '',
                    };
                    _this.checkboxarray.push(a)
                }
                // console.log(result.data)
                // console.log(b)
                // console.log(c)
                for (let i = 0; i < b.length; i++) {
                    for (let j = 0; j < result.data.length; j++) {
                        if (b[i] == result.data[j].dataType) {
                            _this.checkboxarray[i].dataType = result.data[j].dataType;
                            if (_this.checkboxarray[i].name == '') {
                                _this.checkboxarray[i].name = result.data[j].fieldName + ' System'
                            }
                            _this.checkboxarray[i].arr.push(result.data[j])
                        }
                    }
                }

                let aaa = [];
                for (let i in c) {
                    let bbb = {
                        name: c[i],
                        array: [],
                        value: 0,
                        dataType: '',
                    };
                    aaa.push(bbb)
                }
                for (let i = 0; i < _this.checkboxarray.length; i++) {
                    for (let j = 0; j < _this.checkboxarray[i].arr.length; j++) {
                        for (let k in aaa) {
                            if (aaa[k].name == _this.checkboxarray[i].arr[j].fieldName) {
                                aaa[k].array.push(_this.checkboxarray[i].arr[j]);
                                aaa[k].dataType = _this.checkboxarray[i].arr[j].dataType
                            }
                        }

                    }
                }
                // console.log(aaa);

                for (let i = 0; i < _this.checkboxarray.length; i++) {
                    _this.checkboxarray[i].arr = [];
                    for (let j = 0; j < aaa.length; j++) {
                        if (_this.checkboxarray[i].dataType == aaa[j].dataType) {
                            for (let k in aaa[j].array) {
                                aaa[j].array[k].checked = false
                            }
                            _this.checkboxarray[i].arr.push({
                                array: aaa[j].array,
                                value: 0,
                                fieldName: aaa[j].name,
                                dataType: aaa[j].dataType,
                                // checked: false,
                            })
                        }
                    }
                }

                // for (let i = 0; i < b.length; i++) {
                //     for (let j = 0; j < result.data.length; j++) {
                //         if (b[i] == result.data[j].fieldName) {
                //             result.data[j].checked = false;
                //             // result.data[j].dataType = 
                //             _this.checkboxarray[i].dataType = result.data[j].dataType;
                //             if (_this.checkboxarray[i].name == '') {
                //                 _this.checkboxarray[i].name = result.data[j].fieldName + ' System'
                //             }
                //             if (_this.checkboxarray[i].fieldName == '') {
                //                 _this.checkboxarray[i].fieldName = result.data[j].fieldName
                //             }
                //             _this.checkboxarray[i].arr.push(result.data[j])
                //         }
                //     }
                //     // checkboxarray
                // }
                // console.log(_this.checkboxarray)
                _this.readyRenderCheckboxData = true
            } catch (error) {
                console.error(error);
            }
        }

    }
}
</script>

<style scoped>
.winch-content {
    height: 94%;
}
.checkbox-box {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin: 10px 0;
}
.checkbox-box .el-checkbox {
    width: 220px;
}
.winch-from-content {
    margin-top: 10px;
    text-align: center;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
}
.el-radio {
    display: block;
    text-align: left;
    margin: 10px;
}
.el-checkbox {
    display: block;
    text-align: left;
    line-height: 20px;
    /* margin:2px 0px 2px 32px; */
}
.page-title {
    height: 32px;
    font-size: 16px;
    color: #409eff;
    position: relative;
    margin: 5px 10px;
    line-height: 32px;
    border-bottom: 1px solid #eee;
    cursor: default;
    z-index: 999;
}
.page-title .close-btn {
    position: absolute;
    right: 0px;
    top: 0px;
    cursor: pointer;
    color: #303133;
}
.form-1 {
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
}
.bigScreenCheckbox .el-checkbox {
    display: inline;
    margin-right: 10px;
}
.bigScreenTextarea {
    padding: 0 20px;
}
.bigScreenTextarea p {
    font-size: 14px;
    color: #303133;
    margin: 10px 0;
    font-weight: 600;
}
.bigScreen {
    height: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 0 20px;
    overflow: hidden;
}
.leftScreen-inside {
    display: flex;
    flex-direction: column;
    width: 100%;
}
.leftScreen {
    width: 85%;
    height: 100%;
    /* display: flex;
    flex-direction: column; */
    /* align-items: flex-start; */
    /* justify-content: flex-start; */
    overflow: auto;
}
.leftScreen::-webkit-scrollbar {
    display: none; /* Chrome Safari */
}
.input-area-box {
    width: 15%;
    height: 100%;
    overflow: auto;
    position: relative;
    border-left: 1px solid #eee;
}
.input-area {
    width: 100%;
    height: 100%;
    overflow: auto;
}
.input-area::-webkit-scrollbar {
    display: none; /* Chrome Safari */
}
.input-area-box::-webkit-scrollbar {
    display: none; /* Chrome Safari */
}
.input-area-1 {
    height: 100%;
    border-left: 1px solid #eee;
    overflow: auto;
    padding: 0 20px;
    position: relative;
}
.input-area-1::-webkit-scrollbar {
    display: none; /* Chrome Safari */
}
/* .checkbox-content .el-checkbox-group {
    margin: 20px 0;
    padding: 0 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
}
.checkbox-content .el-checkbox-group .el-checkbox {
    width: 100px;
} */
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
    /* padding: 0 20px; */
}
.top-input-1 p {
    font-size: 14px;
    color: #303133;
    line-height: 40px;
    box-sizing: border-box;
    font-weight: 600;
    margin: 0;
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
.el-collapse-item__content {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;
}
/* .el-collapse-item__content .el-checkbox {
    width: 220px;
} */
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