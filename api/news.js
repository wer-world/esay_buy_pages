import request from "../util/request.js";

export function addNews(title,conotent){
    return request.post('/news/addNews',{
        title:title,
        content:conotent
    })
}
export function getNewsByTitle(title) {
    return request.post('/news/getNewsByTitle', {
        title: title,
    })
}

export function getNewsById(id) {
    return request.get('/news/getNewsById', {
        params:{
            id: id
        }
    })
}
export function modifyNewsById(id,title,content) {
    return request.post('/news/modifyNewsById', {
        id: id,
        title:title,
        content:content
    })
}

export function getNewsList(page,title) {
    return request.post('/news/getNewsList', {
        page:page,
        title:title
    })
}

export function delNewsById(id) {
    return request.get('/news/delNewsById', {
        params:{
            id: id
        }
    })
}

