/**
 * The copyright in this software is being made available under the BSD License,
 * included below. This software may be subject to other third party and contributor
 * rights, including patent rights, and no such rights are granted under this license.
 *
 * Copyright (c) 2013, Dash Industry Forum.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *  * Redistributions of source code must retain the above copyright notice, this
 *  list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above copyright notice,
 *  this list of conditions and the following disclaimer in the documentation and/or
 *  other materials provided with the distribution.
 *  * Neither the name of Dash Industry Forum nor the names of its
 *  contributors may be used to endorse or promote products derived from this software
 *  without specific prior written permission.
 *
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS AS IS AND ANY
 *  EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 *  WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
 *  IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
 *  INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
 *  NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 *  PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 *  WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 *  ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 *  POSSIBILITY OF SUCH DAMAGE.
 */

var StallionRule;

function StallionRuleClass(config) {

    let factory = dashjs.FactoryMaker;
    let SwitchRequest = factory.getClassFactoryByName('SwitchRequest');
    let context = this.context;

    config = config || {};
    const dashMetrics = config.dashMetrics;

    const THROUGHPUT_SAFETY_FACTOR = 1;
    const LATENCY_SAFETY_FACTOR = 1.25;

    let instance,
        logger;

    function setup() {
    }

    function checkConfig() {
        if (!dashMetrics || !dashMetrics.hasOwnProperty('getLatestBufferInfoVO')) {
            throw new Error('Missing config parameter(s)');
        }
    }

    function getMaxIndex(rulesContext) {
        const switchRequest = SwitchRequest(context).create();
        switchRequest.reason = {rule: "StallionRule"};

        if (!rulesContext || !rulesContext.hasOwnProperty('getMediaInfo') || !rulesContext.hasOwnProperty('getMediaType') || !rulesContext.hasOwnProperty('useBufferOccupancyABR') ||
            !rulesContext.hasOwnProperty('getAbrController') || !rulesContext.hasOwnProperty('getScheduleController')) {
            switchRequest.reason = {rule: "StallionRule", explanation: "No ruleContext, Location 1"}; 
            return switchRequest;
        }

        checkConfig();

        const mediaInfo = rulesContext.getMediaInfo();
        const mediaType = rulesContext.getMediaType();
        const scheduleController = rulesContext.getScheduleController();
        const abrController = rulesContext.getAbrController();
        const streamInfo = rulesContext.getStreamInfo();

        const bufferStateVO = dashMetrics.getLatestBufferInfoVO(mediaType, true, 'BufferState');
        const isDynamic = streamInfo && streamInfo.manifestInfo ? streamInfo.manifestInfo.isDynamic : null;

        const throughputHistory = abrController.getThroughputHistory();
        const throughput = throughputHistory.getAverageThroughput(mediaType);
        const throughput_std = throughputHistory.getSTDThroughput(mediaType);
        //calculate bitrate using throughput minus a factor of its standard deviation
        const bitrate = throughput - THROUGHPUT_SAFETY_FACTOR*throughput_std

        const latency = throughputHistory.getAverageLatency(mediaType);
        const std_latency = throughputHistory.getSTDLatency(mediaType);
        //calculate latency estimate using latency plus a factor of of its standard deviation
        const lat = latency + LATENCY_SAFETY_FACTOR*std_latency

        if (isNaN(throughput) || !bufferStateVO) {
            switchRequest.reason = {rule: "StallionRule", explanation: "No throughout or buffer, Location 2"};
            return switchRequest;
        }

        if (abrController.getAbandonmentStateFor(mediaType) !== 'abandonload') {
            if (bufferStateVO.state === 'bufferLoaded' || isDynamic) {
                switchRequest.quality = abrController.getQualityForBitrate(mediaInfo, bitrate, lat);
                scheduleController.setTimeToLoadDelay(0);

                switchRequest.reason = {bitrate: bitrate, latency: lat, rule: "StallionRule", quality: switchRequest.quality};
            }else {
                switchRequest.reason = {rule: "StallionRule", explanation: "Buffer not loaded, Location 4"};
            }
        }else {
            switchRequest.reason = {rule: "StallionRule", explanation: "No Abandonded Load, Location 3"};
        }

        return switchRequest;
    }

    function reset() {
    }

    instance = {
        getMaxIndex: getMaxIndex,
        reset: reset
    };

    setup();

    return instance;
}

StallionRuleClass.__dashjs_factory_name = 'StallionRule';
StallionRule = dashjs.FactoryMaker.getClassFactory(StallionRuleClass);