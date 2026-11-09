
export interface HistoryDto {
    event_type: string;
    reason: string | null;
    updated_at: string; //date
    username: string;
    before: any; //es objeto
    after: any; //es objeto
};

export interface HistoryRespDto {
    data: HistoryDto[];
}