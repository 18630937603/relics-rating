export interface OcrResponse {
    words_block_count: number;
    words_block_list: Words_block_list[];
    direction: number;
}

export interface Words_block_list {
    words: string;
    location: Array<number[]>;
}

// 单个副词条的一个可能结果
export interface BackTrackResult {
    times: number; // 强化到该属性的次数
    score: number; // 评分
    values: number[]; // 具体每一次强化加的数值
}

// 单个副词条的分析结果
export interface AnalyzeResult {
    name: string;
    total: number; // 该词条的总数值
    result: Array<BackTrackResult>
}

// 单个圣遗物的分析结果
export interface ArtifactAnalysis {
    imageSrc: string;
    result: Array<AnalyzeResult>
}
