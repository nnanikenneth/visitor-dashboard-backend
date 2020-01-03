const express = require('express');
const routeValidator = require('express-route-validator');
let visitorList = require('../models/visitorList');

const api = new express.Router();

/**
* @api {get} /visitors
* @apiGroup returns a list of filtered visitors by query 
*
* @apiParam  {Integer} [page] page
* @apiParam  {Integer} [limit] limit
* @apiParam  {string} [order] order
* @apiParam  {string:field} [sort] sort
* @apiParam  {Integer} [q] search query param
* Example: queryParams: ?_page=3&_limit=10&_order=null&_sort=id&q=''
* @apiSuccess (200) {List/collection} a list of `visitors` objects
*/

api.get('/visitors',  routeValidator.validate({
    
    query: {
        _page: { isRequired: false, isInt: true },
        _limit: { isRequired: false, isInt: true },
        _order: { isRequired: false },
        _sort: { isRequired: false },
        q: { isRequired: false }, //query
    }}), (req, res) => {

    var myVisitorList = Object.assign({}, visitorList);

    let params = req.query;
    let page = parseInt(params._page, 10) || 1;
    let limit = parseInt(params._limit, 10) || 1000;
    let myOrder = params._order || "asc";
    let mySort =  params._sort || "id";
    let query = params.q || "";

    let skip =(page-1)*limit;
    let endLimit = limit;
    
    if(query){
        myVisitorList.visitors = myVisitorList.visitors.filter(function (item) {
            return item.visitorName.toLowerCase().indexOf(query.toLowerCase()) != -1;
        });
    }

    if(myOrder == "asc"){
        myVisitorList.visitors = myVisitorList.visitors.sort((a, b) => (a[mySort] < b[mySort]) ? 1 : -1).slice(skip, skip + endLimit)
        res.status(200).json(myVisitorList);
    }else{
        myVisitorList.visitors = myVisitorList.visitors.sort((a, b) => (a[mySort] > b[mySort]) ? 1 : -1).slice(skip, skip + endLimit)
        res.status(200).json(myVisitorList);    
    }
})

module.exports = api;
