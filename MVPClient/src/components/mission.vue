<template>
    <div id="mission">
        <div class="mission-box">
            <p class="page-title">
                <span v-show="isMaxScreen == true">任务内容显示</span>
                <span v-show="isMaxScreen == false">
                    <span class="labelfont">当前任务状态：</span>
                    <el-radio-group disabled v-model="form.missionStatus">
                        <el-radio :label="3">等待执行</el-radio>
                        <el-radio :label="48">正在执行</el-radio>
                        <el-radio :label="51">投放间隔等待</el-radio>
                        <el-radio :label="768">执行完成</el-radio>
                        <el-radio :label="12288">已经取消</el-radio>
                    </el-radio-group>
                </span>

                <span class="close-btn" style="right:26px" @click="handleSize('mission')" title="放大/缩小"><i :class="iconName"></i></span>
                <span class="close-btn" @click="closeItem"><i class="el-icon-close"></i></span>
            </p>
            <div class="mission-content" v-show="isMaxScreen == true">
                <el-form ref="form" :model="form" inline class="from-content" size="mini">
                    <el-form-item label="当前任务名称：" label-width="120px">
                        <el-input disabled v-model="form.missionName" style="width:250px"></el-input>
                        <!-- <el-select v-model="form.missionCode" placeholder="请选择" style="width:300px" @change="selectMission">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" :disabled="hasRunningJob">
                            </el-option>
                        </el-select> -->
                    </el-form-item>
                    <br />
                    <el-form-item label="当前任务模式：" label-width="120px">
                        <el-radio-group disabled v-model="form.missionType">
                            <el-radio :label="5">定深投放</el-radio>
                            <el-radio :label="80">距底定距离投放</el-radio>
                            <!-- 80 -->
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="当前任务状态：" label-width="120px">
                        <el-radio-group disabled v-model="form.missionStatus">
                            <el-radio :label="3">等待执行</el-radio>
                            <el-radio :label="48">正在执行</el-radio>
                            <el-radio :label="51">投放间隔等待</el-radio>
                            <el-radio :label="768">执行完成</el-radio>
                            <el-radio :label="12288">已经取消</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <br />
                    <el-form-item label="每次投放间隔(秒)：" label-width="145px">
                        <el-input disabled v-model="form.timesThrowSec" style="width:70px"></el-input>
                    </el-form-item>
                    <el-form-item label="距底安全深度(米)：" label-width="145px">
                        <el-input disabled v-model="form.securityDeepMet" style="width:72px"></el-input>
                    </el-form-item>
                    <el-form-item label="设定深度(米)：" label-width="120px">
                        <el-input disabled v-model="form.settingDepth" style="width:70px"></el-input>
                    </el-form-item>
                    <el-form-item label="设定投放次数(次)：" label-width="145px">
                        <el-input disabled v-model="form.settingThrowTimes" style="width:65px"></el-input>
                    </el-form-item>
                    <el-form-item label="当前投放次数(次)：" label-width="145px">
                        <el-input disabled v-model="form.thisSettingThrowTimes" style="width:65px"></el-input>
                    </el-form-item>
                </el-form>
                <div class="btn-content" v-show="userlevel == 0">
                    <div class="left-btn-area">
                        <!--  v-show="userlevel == 0" -->
                        <el-button type="danger" @click="cancelMission" :disabled='cancelBtn'>取消当前任务</el-button>
                        <el-button type="success" @click="startingMission" :disabled='startBtn'>开始执行任务</el-button>
                    </div>
                    <!--  :disabled="userlevel == 0" -->
                    <el-button type="primary" class="create-btn" @click="createMission">增加任务</el-button>
                </div>
            </div>
            <div class="minScreen" v-show="isMaxScreen == false">
                <!-- <div class="form-content">
                    <span class="labelfont">当前任务状态：</span>
                    <el-radio-group disabled v-model="form.missionStatus">
                        <el-radio :label="3">等待执行</el-radio>
                        <el-radio :label="48">正在执行</el-radio>
                        <el-radio :label="51">投放间隔等待</el-radio>
                        <el-radio :label="768">执行完成</el-radio>
                        <el-radio :label="12288">已经取消</el-radio>
                    </el-radio-group>
                </div> -->
            </div>
        </div>

        <el-dialog title="新增任务" :visible.sync="dialogVisible" width="600px" :before-close="handleClose">
            <div>
                <!--  :rules="dialogFromRules" -->
                <el-form ref="dialogFrom" :model="dialogFrom" label-width="120px">
                    <el-form-item label="新任务名称">
                        <el-input v-model="dialogFrom.missionName"></el-input>
                    </el-form-item>
                    <el-form-item label="任务工作模式">
                        <el-radio-group v-model="dialogFrom.missionType">
                            <el-radio :label="5">定深投放</el-radio>
                            <!-- number 5 -->
                            <el-radio :label="80">距底定距投放</el-radio>
                            <!-- 80 -->
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="设定深度(米)">
                        <el-input type='number' v-model="dialogFrom.settingDeep"></el-input>
                    </el-form-item>
                    <el-form-item label="设定投放次数(次)">
                        <el-input type='number' v-model="dialogFrom.settingTimes" class="usedinput" v-show="isMaxTimes==false" style="width:90px;padding-right:20px"></el-input>
                        <el-checkbox v-model="dialogFrom.checkbox" @change="isSettingTimes">无限次投放</el-checkbox>
                    </el-form-item>
                    <el-form-item type='number' label="每次投放间隔(秒)">
                        <el-input v-model="dialogFrom.settingInterval"></el-input>
                    </el-form-item>
                    <el-form-item type='number' label="距底安全深度(米)">
                        <el-input v-model="dialogFrom.safeDepth"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false" style="margin-right:20px">取 消</el-button>
                <el-button type="primary" @click="createMissionDialogBtn">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import request from "@/utils/request.js";
export default {
    name: 'mission',
    data() {
        return {
            iconName: 'el-icon-top',
            isMaxScreen: true,
            userlevel: 0,
            options: [],
            startBtn: false,
            cancelBtn: false,
            dialogVisible: false,
            labelPosition: 'right',
            form: {
                missionName: '当前暂无任务',
                missionType: '',
                missionStatus: '',
                timesThrowSec: '',
                securityDeepMet: '',
                settingDepth: '',
                settingThrowTimes: '',
                thisSettingThrowTimes: ''
            },
            dialogFrom: {
                missionName: '',
                missionType: 5,
                settingDeep: '',
                settingTimes: '',
                settingInterval: '',
                safeDepth: '',
                checkbox: false
            },
            isMaxTimes: false,
            realTimeJobId: '',
            runningJob: [],
            hasRunningJob: false,
            waitingJob: [],
            setinterval: '',
            setinterval1: '',
            baseURL:'',
        }
    },
    created() {
        this.userlevel = localStorage.getItem('mvplevel');
        console.log(this.userlevel + '==>0:USE;1:READONLY;2PLAYBACK')
    },
    mounted() {
        this.baseURL = localStorage.getItem('mvpip');
        // console.log(this.baseURL)
        this.getCurrentJob();
    },
    methods: {
        handleSize(ele) {
            if (this.iconName == 'el-icon-top') {
                // 缩小
                this.iconName = 'el-icon-bottom';
                this.isMaxScreen = false;
            } else {
                // 放大
                this.iconName = 'el-icon-top'
                this.isMaxScreen = true;
            }
            this.$emit('sendEleName', ele);
        },
        closeItem() {
            // open(location, '_self').close();
            window.location.href = "about:blank";
            window.close();
        },
        startingMission() {
            this.$confirm('是否开始任务？', '提示', {
                confirmButtonText: '开始',
                cancelButtonText: '取消',
                type: 'info'
            }, 'info').then(() => {
                this.addCommand({
                    cmdId: 1280,
                    cmdContent: 0
                })
                this.$message({
                    type: 'success',
                    message: '任务开始指令已发送'
                });
            }).catch(() => {

            });
        },
        cancelMission() {
            this.$confirm('是否取消当前任务？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '关闭',
                type: 'warning'
            }).then(() => {
                this.addCommand({
                    cmdId: 1360,
                    cmdContent: 0
                })
                this.$message({
                    type: 'success',
                    message: '任务取消指令已发送'
                });
            }).catch(() => {

            });
        },
        createMission() {
            this.dialogVisible = true;
        },
        handleClose() {
            this.dialogVisible = false;
        },
        /**
         * 新增任务按钮 
        */
        createMissionDialogBtn() {
            const _this = this;
            let params = JSON.parse(JSON.stringify(this.dialogFrom));
            if (params.checkbox == true) {
                params.settingTimes = -1
            }
            if (!params.missionName) {
                _this.$message.error('请输入任务名称');
                return;
            }
            if (!params.missionType) {
                _this.$message.error('请选择工作模式');
                return;
            }
            if (!params.settingDeep) {
                _this.$message.error('请输入设定深度');
                return;
            }
            if (!params.settingTimes && params.checkbox == false) {
                _this.$message.error('请设定投放次数');
                return;
            }
            if (!params.settingInterval) {
                _this.$message.error('请输入投放间隔');
                return;
            }
            if (!params.safeDepth) {
                _this.$message.error('请输入距底安全深度');
                return;
            }
            if (params.missionName.length > 100) {
                _this.$message.error('任务名称过长');
                return
            }
            if (params.settingDeep > 10001 || params.settingDeep < 1) {
                _this.$message.error('设定深度格式错误请重新输入');
                return
            }
            if (params.checkbox == false) {
                if (params.settingTimes > 10001 || params.settingTimes < 1) {
                    _this.$message.error('投放次数格式错误请重新输入');
                    return
                }
            }
            if (params.settingInterval > 301 || params.settingInterval < 1) {
                _this.$message.error('投放间隔格式错误请重新输入');
                return
            }
            if (Number(params.safeDepth) > Number(params.settingDeep)) {
                _this.$message.error('距底安全深度格式错误请重新输入');
                return
            }
            params.safeDepth = Number(params.safeDepth);
            params.settingDeep = Number(params.settingDeep);
            params.settingInterval = Number(params.settingInterval);
            params.settingTimes = Number(params.settingTimes);
            // console.log(params);
            this.addJob(params);
        },
        isSettingTimes() {
            if (this.dialogFrom.checkbox == true) {
                this.isMaxTimes = true
            } else {
                this.isMaxTimes = false
            }
        },
        loopGetMission() {
            let _this = this;
            // this.setinterval = window.setInterval(() => {
            //     // _this.getCurrentJob()
            // }, 1000)
        },
        /**
         * 新增任务
        */
        async addJob(row) {
            let _this = this;
            let result = await request({
                url: "/job/add_job",
                method: "get",
                params: {
                    jobName: row.missionName,
                    jobMode: row.missionType,
                    jobDeep: row.settingDeep,
                    dropTimes: row.settingTimes,
                    intervalTime: row.settingInterval,
                    safeDeep: row.safeDepth,
                    operateMode: 0,
                    operateSpeed: 0
                }
            });
            try {
                // console.log(result.data);
                _this.dialogFrom = {
                    missionName: '',
                    missionType: 5,
                    settingDeep: '',
                    settingTimes: '',
                    settingInterval: '',
                    safeDepth: '',
                    checkbox: false
                };
                _this.isMaxTimes = false;
                _this.$message({
                    message: '已添加任务',
                    type: 'success'
                });
                this.dialogVisible = false;
            } catch (error) {
                console.error(error);
                _this.$message({
                    message: error,
                    type: 'success'
                });
                this.dialogVisible = false;
            }
        },
        /**
         * 获取当前任务信息
        */
        async getRealtimeJob(jobId) {
            let _this = this;
            let result = await request({
                url: "/job/get_job_realdata",
                method: "get",
                params: {
                    jobId: jobId,
                }
            });
            try {
                window.clearInterval(_this.setinterval1);
                if (result.data.length != 0) {
                    _this.form = {
                        missionName: result.data[0].jobName,
                        missionType: result.data[0].jobMode,
                        missionStatus: result.data[0].jobStatus,
                        timesThrowSec: result.data[0].intervalTime,
                        securityDeepMet: result.data[0].safeDeep,
                        settingDepth: result.data[0].setDeep,
                        settingThrowTimes: result.data[0].dropTimes == -1 ? '无限次' : result.data[0].dropTimes,
                        thisSettingThrowTimes: result.data[0].runTimes
                    }
                    if (result.data[0].jobStatus >= 768) {
                        if (_this.userlevel == 0) {
                            // 导出
                            _this.exportData(jobId)
                        }
                        _this.getCurrentJob();
                    } else {
                        _this.setinterval1 = window.setInterval(() => {
                            _this.getRealtimeJob(_this.realTimeJobId);
                        }, 1000)
                    }
                } else {

                }
            } catch (error) {
                console.error(error);
            }
        },

        /**
         * 获取最新任务信息
        */
        async getCurrentJob() {
            let _this = this;
            let result = await request({
                url: "/job/get_current_job",
                method: "get"
            });
            try {
                window.clearInterval(_this.setinterval);
                if (result.data.length > 0) {
                    _this.form = {
                        missionName: result.data[0].jobName,
                        missionType: result.data[0].jobMode,
                        missionStatus: result.data[0].jobStatus,
                        timesThrowSec: result.data[0].intervalTime,
                        securityDeepMet: result.data[0].safeDeep,
                        settingDepth: result.data[0].setDeep,
                        settingThrowTimes: result.data[0].dropTimes == -1 ? '无限次' : result.data[0].dropTimes,
                        thisSettingThrowTimes: result.data[0].runTimes
                    };
                    _this.realTimeJobId = result.data[0].jobId;
                    _this.getRealtimeJob(_this.realTimeJobId)
                    // _this.exportData(20200914133701744)
                    // if (result.data[0].jobStatus == 12288) {
                    //     _this.getRealtimeJob(result.data[0].jobId)
                    // }
                } else {
                    _this.setinterval = window.setInterval(() => {
                        _this.getCurrentJob()
                    }, 1000);
                }
            } catch (error) {
                console.error(error);
            }
        },
        /**
         * 导出
         * */
        async exportData(jobid) {
            let _this = this;
            let result = await request({
                url: "job/export_data",
                method: "get",
                params: {
                    jobId: jobid
                }
            });
            try {
                // console.log(result);
                window.open(_this.baseURL + `/api/job/download?file_name=` + result.data.fileName)
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * 增加控制指令
        */
        async addCommand(row) {
            let _this = this;
            let result = await request({
                url: "/sys-define/add_command",
                method: "get",
                params: {
                    cmdId: row.cmdId,
                    cmdContent: row.cmdContent,
                }
            });
            try {
                // console.log(result.data);
            } catch (error) {
                // console.log(error);
            }
        },
    }
}
</script>

<style scoped>
.mission-box {
    width: 100%;
    height: 100%;
}
.mission-content {
    overflow: hidden;
    /* min-width: 1320px; */
    display: flex;
    justify-content: space-between;
    border-top: 1px solid #eee;
    position: relative;
}
.from-content {
    margin-top: 10px;
    margin-left: 5px;
}
.btn-content {
    /* position: absolute; */
    /* top: 10px; */
    /* right: 20px; */
    padding: 15px 0;
    display: flex;
    justify-content: center;
    margin-right: 30px;
}
.page-title {
    font-size: 16px;
    color: #409eff;
    position: relative;
    margin: 5px 10px;
    line-height: 32px;
    height: 32px;
    /* border-bottom: 1px solid #eee; */
    cursor: default;
}
.page-title .close-btn {
    position: absolute;
    right: 5px;
    top: 0px;
    cursor: pointer;
    color: #303133;
}
.left-btn-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    margin-right: 12px;
}
.left-btn-area .el-button {
    display: block;
    height: 50px;
    width: 100px;
    white-space: normal;
}
.btn-content .create-btn {
    display: block;
    /* height: 120px; */
}
.el-button + .el-button {
    margin-left: 0;
}
.usedinput[disabled] {
    border-color: #e4e7ed;
    color: #e4e7ed;
}
.labelfont {
    font-size: 14px;
    font-weight: 600;
    color: #303133;
    display: inline-block;
    margin-left: 18px;
}
.form-content {
    margin: 10px 0 12px 0;
}
</style>