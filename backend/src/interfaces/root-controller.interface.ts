export interface FetchAllQuery {
    filter?: any;
    limit?: number 
    skip?: number 
    sort?: any;
}
export interface ModelPopulateI {
    path: any, 
    select?: any, 
    model?: string
}
export interface FetchWithPaginationDataI {
    records?: any[]
    total_records?: number
}