export interface OcrResponse {
    words_block_count: number;
    words_block_list: Words_block_list[];
    direction: number;
}

export interface Words_block_list {
    words: string;
    location: Array<number[]>;
}
