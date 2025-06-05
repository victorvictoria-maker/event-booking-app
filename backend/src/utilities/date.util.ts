import * as dateFns from 'date-fns';


class DateUtil {
    private date = new Date()
    get_start_date(date: any) {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
    }
    get_end_date(date: any) {
        const d = new Date(date);
        d.setHours(23, 0, 0, 0);
        return d.getTime();
    }
    get_date_format(date: any, format: any) {
        return new Date(date);
    }
    get_today_date_range(payload?: {format?: string, date: Date}): {start_date: any, end_date: any} {
        const main_date = payload && payload.date ? new Date(payload.date) : this.date;
        return {
            start_date: dateFns.startOfDay(main_date),
            end_date: dateFns.endOfDay(main_date)
        }
    }
    get_date_range(payload?: {format?: string, date: Date, number_of_days?: number}): {start_date: any, end_date: any} {
        const main_date = payload && payload.date ? new Date(payload.date) : this.date;
        const number_of_days = payload?.number_of_days ? payload.number_of_days : 0;
        const start_date = dateFns.subDays(main_date, number_of_days)
        const end_date = dateFns.addDays(main_date, number_of_days)
        return {
            start_date: dateFns.startOfDay(start_date),
            end_date: dateFns.endOfDay(end_date)
        }
    }
    get_custom_date_range(dto: {start_date: any, end_date: any}) {
        return {
            start_date: dateFns.startOfDay(new Date(dto.start_date)),
            end_date: dateFns.endOfDay(new Date(dto.end_date))
        } 
    }
    this_week_date_range(): {start_date: Date, end_date: Date} {
        return {
            start_date: dateFns.startOfWeek(this.date),
            end_date: dateFns.endOfWeek(this.date)
        }
    }
    this_month_date_range(): {start_date: Date, end_date: Date} {
        return {
            start_date: dateFns.startOfMonth(this.date),
            end_date: dateFns.endOfMonth(this.date)
        }
    }
    this_year_date_range(): {start_date: Date, end_date: Date} {
        return {
            start_date: dateFns.startOfYear(this.date),
            end_date: dateFns.endOfYear(this.date)
        }
    }

}
export default new DateUtil;