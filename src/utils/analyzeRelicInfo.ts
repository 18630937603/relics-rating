import { OcrResponse, BackTrackResult, AnalyzeResult } from "@/types";
import { uniqWith, isEqual } from "lodash";


function analyze(currentValue: number, dataModel: Array<number>, accuracy: number): Array<BackTrackResult> {
    let results: Array<BackTrackResult> = []

    function backTrack(currentValue: number, dataModel: Array<number>, currentResult: Array<number> = []) {
        for (let model of dataModel) {
            if (Math.abs(currentValue - model) < accuracy) { // 如果等于零了
                const result = [model, ...currentResult].sort((a, b) => a - b)
                let score = 0;
                for (let i = 0; i < result.length; i++) {
                    score += dataModel.indexOf(result[i]) * 100 / 3 / result.length
                }
                results.push({
                    times: result.length,
                    score: Math.floor(score),
                    values: result
                })
                return;
            } else if (currentValue - model > 0) {
                backTrack(currentValue - model, dataModel, [model, ...currentResult])
            }
        }
    }

    backTrack(currentValue, dataModel)
    results = uniqWith(results, isEqual)
    return results
}

export function analyzeRelicInfo(response: OcrResponse): Array<AnalyzeResult> {
    const results = []
    for (let obj of response.words_block_list) {
        let dataModel;
        if (obj.words.match(/暴击率\+/)) {
            dataModel = [2.7, 3.1, 3.5, 3.9]
        } else if (obj.words.match(/暴击伤害\+/)) {
            dataModel = [5.4, 6.2, 7.0, 7.8]
        } else if (obj.words.match(/(攻击力|生命值)\+/) && obj.words.includes('%')) { // 百分比攻击力、百分比生命
            dataModel = [4.1, 4.7, 5.3, 5.8]
        } else if (obj.words.match(/攻击力\+/) && !obj.words.includes('%')) { // 数值攻击力
            dataModel = [14, 16, 18, 19]
        } else if (obj.words.match(/防御力\+/) && obj.words.includes('%')) { // 百分比防御力
            dataModel = [5.1, 5.8, 6.6, 7.3]
        } else if (obj.words.match(/(防御力|元素精通)\+/) && !obj.words.includes('%')) { // 数值防御力、元素精通
            dataModel = [16, 19, 21, 23]
        } else if (obj.words.match(/元素充能效率\+/)) {
            dataModel = [4.5, 5.2, 5.8, 6.5]
        } else if (obj.words.match(/生命值\+/) && !obj.words.includes('%')) { // 数值生命值
            dataModel = [209, 239, 269, 299]
        } else {
            continue
        }
        let [subStatName, subStatValue] = obj.words.replace('%', '').split('+')
        let result = analyze(+subStatValue, dataModel,0.0000001)
        if(!result.length) {
            result = analyze(+subStatValue, dataModel,0.1)
        }
        results.push({
            name: subStatName,
            total: +subStatValue,
            result
        })
    }
    return results
}

