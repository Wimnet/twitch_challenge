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
import ThroughputRule from './ThroughputRule';
import InsufficientBufferRule from './InsufficientBufferRule';
import AbandonRequestsRule from './AbandonRequestsRule';
import DroppedFramesRule from './DroppedFramesRule';
import SwitchHistoryRule from './SwitchHistoryRule';
import BolaRule from './BolaRule';
import FactoryMaker from '../../../core/FactoryMaker';
import SwitchRequest from '../SwitchRequest';

const QUALITY_SWITCH_RULES = 'qualitySwitchRules';
const ABANDON_FRAGMENT_RULES = 'abandonFragmentRules';

function ABRRulesCollection(config) {

    config = config || {};
    const context = this.context;

    const mediaPlayerModel = config.mediaPlayerModel;
    const dashMetrics = config.dashMetrics;
    const settings = config.settings;

    let instance,
        qualitySwitchRules,
        abandonFragmentRules;

    function initialize() {
        qualitySwitchRules = [];
        abandonFragmentRules = [];

        if (settings.get().streaming.abr.useDefaultABRRules) {
            // Only one of BolaRule and ThroughputRule will give a switchRequest.quality !== SwitchRequest.NO_CHANGE.
            // This is controlled by useBufferOccupancyABR mechanism in AbrController.

            //We comment out BOLA, ThroughputRule, and InsufficientBufferRule as Stallion replaces their functionality

            //qualitySwitchRules.push(
            //     BolaRule(context).create({
            //         dashMetrics: dashMetrics,
            //         mediaPlayerModel: mediaPlayerModel,
            //         settings: settings
            //     })
            // );
            // qualitySwitchRules.push(
            //     ThroughputRule(context).create({
            //         dashMetrics: dashMetrics
            //     })
            // );
            // qualitySwitchRules.push(
            //     InsufficientBufferRule(context).create({
            //         dashMetrics: dashMetrics
            //     })
            // );
            qualitySwitchRules.push(
                SwitchHistoryRule(context).create()
            );
            qualitySwitchRules.push(
                DroppedFramesRule(context).create()
            );
            abandonFragmentRules.push(
                AbandonRequestsRule(context).create({
                    dashMetrics: dashMetrics,
                    mediaPlayerModel: mediaPlayerModel,
                    settings: settings
                })
            );
        }

        // add custom ABR rules if any
        const customRules = mediaPlayerModel.getABRCustomRules();
        customRules.forEach(function (rule) {
            if (rule.type === QUALITY_SWITCH_RULES) {
                qualitySwitchRules.push(rule.rule(context).create({dashMetrics: dashMetrics, settings: settings}));
            }

            if (rule.type === ABANDON_FRAGMENT_RULES) {
                abandonFragmentRules.push(rule.rule(context).create());
            }
        });
    }

    //Main Logging function for plot scripts
    function getActiveRules(srArray) {
        let allRules = {};
          srArray.forEach(function (thisRule) {
              console.log(thisRule.reason);
              allRules[thisRule.reason.rule] = thisRule.reason
          });

        if (allRules['BolaRule'] != undefined) {

        let bola_throughput, bola_latency, bola_quality
        bola_throughput = allRules['BolaRule']['throughput'];
        bola_latency = allRules['BolaRule']['latency']
        bola_quality = allRules['BolaRule']['quality']
        if (bola_throughput == undefined){bola_throughput = -2;}
        if (bola_latency == undefined){bola_latency = -2;}
        if (bola_quality == undefined){bola_quality = -2;}
        console.log("bola Throughput: ", bola_throughput, Date.now());
        console.log("bola Latency: ", bola_latency, Date.now());
        console.log("bola Quality: ", bola_quality, Date.now());
        }

        if (allRules['ThroughputRule'] != undefined) {

        let throurule_throughput, throurule_latency, throughput_quality
        throurule_throughput = allRules['ThroughputRule']['throughput'];
        throurule_latency = allRules['ThroughputRule']['latency']
        throughput_quality = allRules['ThroughputRule']['quality']
        if (throurule_throughput == undefined){throurule_throughput = -2}
        if (throurule_latency == undefined){throurule_latency = -2;}
        if (throughput_quality == undefined){throughput_quality = -2;}
        console.log("ThroughputRule Throughput: ", throurule_throughput, Date.now());
        console.log("ThroughputRule Latency: ", throurule_latency, Date.now());
        console.log("ThroughputRule Quality: ", throughput_quality, Date.now());
        }
        
        if (allRules['InsufficientBufferRule'] != undefined) {
        let isbfr_bitrate, isbfr_latency, isbfr_quality
        isbfr_bitrate = allRules['InsufficientBufferRule']['bitrate'];
        isbfr_latency = allRules['InsufficientBufferRule']['latency'];
        isbfr_quality = allRules['InsufficientBufferRule']['quality']
        if (isbfr_bitrate == undefined){isbfr_bitrate = -2;}
        if (isbfr_latency == undefined){isbfr_latency = -2;}
        if (isbfr_quality == undefined){isbfr_quality = -2;}
        console.log("InsufficientBufferRule Bitrate: ", isbfr_bitrate, Date.now());
        console.log("InsufficientBufferRule Latency: ", isbfr_latency, Date.now());
        console.log("InsufficientBufferRule Quality: ", isbfr_quality, Date.now());
        }

        if (allRules['StallionRule'] != undefined) {
        let isbfr_bitrate, isbfr_latency, isbfr_quality
        isbfr_bitrate = allRules['StallionRule']['bitrate'];
        isbfr_latency = allRules['StallionRule']['latency'];
        isbfr_quality = allRules['StallionRule']['quality']
        if (isbfr_bitrate == undefined){isbfr_bitrate = -2;}
        if (isbfr_latency == undefined){isbfr_latency = -2;}
        if (isbfr_quality == undefined){isbfr_quality = -2;}
        console.log("StallionRule Bitrate: ", isbfr_bitrate, Date.now());
        console.log("StallionRule Latency: ", isbfr_latency, Date.now());
        console.log("StallionRule Quality: ", isbfr_quality, Date.now());
        }
        

        return srArray.filter(sr => sr.quality > SwitchRequest.NO_CHANGE);
    }

    function getMinSwitchRequest(srArray) {
        let activeRules = {};
          srArray.forEach(function (thisRule) {
              activeRules[thisRule.reason.rule] = thisRule.reason
          });

        console.log("Active Rules: ", activeRules, Date.now());

        const values = {};
        let i,
            len,
            req,
            newQuality,
            quality,
            valueQuality,
            reason;

        if (srArray.length === 0) {
            return;
        }

        values[SwitchRequest.PRIORITY.STRONG] = {quality: SwitchRequest.NO_CHANGE, reason: null};
        values[SwitchRequest.PRIORITY.WEAK] = {quality: SwitchRequest.NO_CHANGE, reason: null};
        values[SwitchRequest.PRIORITY.DEFAULT] = {quality: SwitchRequest.NO_CHANGE, reason: null};

        for (i = 0, len = srArray.length; i < len; i += 1) {
            req = srArray[i];
            if (req.quality !== SwitchRequest.NO_CHANGE) {
                if (values[req.priority].quality > SwitchRequest.NO_CHANGE){
                  reason = values[req.priority].quality < req.quality ? values[req.priority].reason : req.reason;
                }else {
                  reason = req.reason;
                }

                valueQuality = values[req.priority].quality > SwitchRequest.NO_CHANGE ? Math.min(values[req.priority].quality, req.quality) : req.quality;

                values[req.priority] = {quality: valueQuality, reason: reason};
            }
        }

        if (values[SwitchRequest.PRIORITY.WEAK].quality !== SwitchRequest.NO_CHANGE) {
            newQuality = values[SwitchRequest.PRIORITY.WEAK];
        }

        if (values[SwitchRequest.PRIORITY.DEFAULT].quality !== SwitchRequest.NO_CHANGE) {
            newQuality = values[SwitchRequest.PRIORITY.DEFAULT];
        }

        if (values[SwitchRequest.PRIORITY.STRONG].quality !== SwitchRequest.NO_CHANGE) {
            newQuality = values[SwitchRequest.PRIORITY.STRONG];
        }

        if (newQuality.quality !== SwitchRequest.NO_CHANGE) {
            quality = newQuality.quality;
            reason = newQuality.reason
        }

        const newSwitchRequest = SwitchRequest(context).create(quality);
        newSwitchRequest.reason = reason;

        return newSwitchRequest;
    }

    function getMaxQuality(rulesContext) {
        const switchRequestArray = qualitySwitchRules.map(rule => rule.getMaxIndex(rulesContext));
        const activeRules = getActiveRules(switchRequestArray);
        const maxQuality = getMinSwitchRequest(activeRules);

        if (maxQuality){
          console.log("Chosen Rule: ", maxQuality.reason.rule.replace( /[\r\n]+/gm, "" ), Date.now());
        }
        return maxQuality || SwitchRequest(context).create();
    }

    function shouldAbandonFragment(rulesContext) {
        const abandonRequestArray = abandonFragmentRules.map(rule => rule.shouldAbandon(rulesContext));
        const activeRules = getActiveRules(abandonRequestArray);
        const shouldAbandon = getMinSwitchRequest(activeRules);
        if (shouldAbandon != undefined){
            console.log("shouldAbandonFragment", Date.now());
        }
        
        return shouldAbandon || SwitchRequest(context).create();
    }

    function reset() {
        [qualitySwitchRules, abandonFragmentRules].forEach(rules => {
            if (rules && rules.length) {
                rules.forEach(rule => rule.reset && rule.reset());
            }
        });
        qualitySwitchRules = [];
        abandonFragmentRules = [];
    }

    instance = {
        initialize: initialize,
        reset: reset,
        getMaxQuality: getMaxQuality,
        shouldAbandonFragment: shouldAbandonFragment
    };

    return instance;
}

ABRRulesCollection.__dashjs_factory_name = 'ABRRulesCollection';
const factory = FactoryMaker.getClassFactory(ABRRulesCollection);
factory.QUALITY_SWITCH_RULES = QUALITY_SWITCH_RULES;
factory.ABANDON_FRAGMENT_RULES = ABANDON_FRAGMENT_RULES;
FactoryMaker.updateSingletonFactory(ABRRulesCollection.__dashjs_factory_name, factory);

export default factory;
