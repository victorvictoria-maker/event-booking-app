import { FiltersQueryI } from '../interfaces/interface';
import dateUtil from '../utilities/date.util';

class QueryHelper {
    private str_to_obj(string: string) {
        return JSON.parse(string);
    }
    private obj_to_str(object: any) {
        return JSON.stringify(object)
    }
    build_query(query: any): {sort: any, limit: number, skip: number, filter: any} {
        if(!query) query = {};
        const { sort, filter, limit, page, filterRange, date_range, date_type, search } = query;        
        let range = filterRange ?  this.str_to_obj(filterRange) : null;
        const filterx = filter ? this.str_to_obj(filter) : ({} as any);
        let searchx = search ? this.str_to_obj(search) :  ({} as any);
        const date_rangex = date_range ? this.str_to_obj(date_range) : ({} as any);        
        const { key, value } = sort ? this.str_to_obj(sort) : ({} as any);
        const sortx = {[key || 'createdAt']: value || '-1'}
        const skipx = page ? ((Number(page) - 1) * limit) : 0; 
        const limitx = Number(limit) || 20;        
        if(range) {
            const {field, ranges:{from, to} } = range;
            range = {[field]: {$gte: from, $lt: to }}
        }
        searchx = searchx.key && searchx.value ? searchx : null;
        const filterResult =  range || filterx || {};
        const  date_range_ = this.get_date_range({date_type, date_range: date_rangex});
        const search_ =  searchx ? {[searchx.key]: {$regex: new RegExp(`${searchx.value}`, 'i')}} : {};      
          
        const filters = this.process_filters(query)
        const filter_result = {...filterResult, ...date_range_, ...search_, ...filters};
        return { sort: sortx, limit: limitx, filter: filter_result, skip: skipx};
    }
    get_date_range(payload: {date_type: string, date_range: {start_date: any, end_date: any}}) {
        let date_filter_range: {start_date: any, end_date: any} = (null as any);
        const { date_type , date_range } = payload;
        if(date_type === 'today') {
            date_filter_range = dateUtil.get_today_date_range();
        }else if(date_type === 'this_week') {
            date_filter_range = dateUtil.this_week_date_range();
        } else if(date_type === 'this_month') {
            date_filter_range = dateUtil.this_month_date_range();
        } else if(date_type === 'this_year') {
            date_filter_range = dateUtil.this_year_date_range();
        } else if(date_type === 'custom' && date_range && (date_range.start_date && date_range.end_date)) {   
            date_filter_range = dateUtil.get_custom_date_range(date_range)
        }
        let filter = {};
        if(date_filter_range) {
            filter = {createdAt: {$gte: date_filter_range.start_date, $lt: date_filter_range.end_date}}
        }
        return filter;
    }

    process_filters = (query: any) => {
        try {
            const { filters } = query;
            let result: any[] = [];
            let filter_query = {};
            const filters_: FiltersQueryI = filters ? this.str_to_obj(filters) : ({} as any);
            if(filters_ && filters_.filterSet && filters_.filterSet.length && filters_.conjunction) {
                const logical_operator = filters_.conjunction == 'and' ? '$and' : '$or';
                filters_.filterSet.forEach(fit => {
                    if(fit.operator === 'contains') {
                        result.push({[fit.field]: {$regex: fit.value, $options: 'i'} })
                    } else if(fit.operator === 'does_not_contain') {
                        result.push({[fit.field]: {$not: { $regex: fit.value, $options: 'i' }} })
                    } else if(fit.operator === 'is') {
                        result.push({[fit.field]: { $eq: fit.value} })
                    } else if(fit.operator === 'is_not') {
                        result.push({[fit.field]: { $ne: fit.value} })
                    }
                })
                filter_query = {[logical_operator]: result}
            }
            return filter_query;
        } catch (error) {
            console.log(error);
        }
    }
}
export default new QueryHelper;