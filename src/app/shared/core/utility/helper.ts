/**
 * Created by chamakh on 12/03/2017.
 */
import {HttpParams} from "@angular/common/http";

export const objToSearchParams = (obj: any): URLSearchParams => {
    const params = new URLSearchParams();
    for (const k in obj) {
        if (obj[k]) params.append(k, obj[k]);
    }
    return params;
};

export const convertToCSV = (objArray: any): any => {
    const array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = "";
    
    for (var index in objArray[0]) {
        //Now convert each value to string and comma-separated
        row += index + ';';
    }
    row = row.slice(0, -1);
    //append Label row with line break
    str += row + '\r\n';
    
    for (let i = 0; i < array.length; i++) {
        let line = '';
        for (var index in array[i]) {
            if (line != '') line += ';'
            
            line += array[i][index];
        }
        str += line + '\r\n';
    }
    return str;
}