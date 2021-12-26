import {OcrResponse} from "@/types";
import {res} from "@/mock/api_response"

function analyzeRelicInfo(response: OcrResponse) {
    for (let obj of response.words_block_list) {
        if (obj.words.match(/(暴击(率|伤害)|(攻击|防御)力)\+/)) {
            console.log(obj.words)
        }
    }
}


analyzeRelicInfo(res)
