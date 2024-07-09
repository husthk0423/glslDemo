/**
 * @license
 * Cesium - https://github.com/CesiumGS/cesium
 * Version 1.97
 *
 * Copyright 2011-2022 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/CesiumGS/cesium/blob/main/LICENSE.md for full licensing details.
 */

define(['./createTaskProcessorWorker', './Resource-0c25a925', './defer-bfc6471e', './defined-a5305fd6', './_commonjsHelpers-89c9b271', './Check-0f680516', './combine-eceb7722', './Math-79d70b44', './RuntimeError-8d8b6ef6'], (function (createTaskProcessorWorker, Resource, defer, defined, _commonjsHelpers, Check, combine, Math, RuntimeError) { 'use strict';

    class IndexDBTool {
        /**
         * 根据数据库名创建数据库,创建表和索引
         * @param tName 表名
         * @param pKey 表的主键字段名
         * @param autoIncrement 是否主键自增长
         * @param indexName 索引名称
         * @param indexFiled 索引指定的字段名
         * @returns {Promise | Promise<unknown>}
         */
        static createDB(tName,pKey,autoIncrement,indexName,indexFiled){
            let deferred = defer.defer();
            let request = indexedDB.open(tName,1);
            request.onerror = function(){
                console.log(tName+"数据库创建失败或者异常~");
                deferred.reject();
            };
            request.onsuccess = function(e){
                console.log(tName+"数据库连接成功~");
                let db = e.target.result;
                deferred.resolve(db);
            };
            request.onupgradeneeded = function(e){
                let db = e.target.result;
                //创建表和索引
                let objectStore = db.createObjectStore(tName,{keyPath:pKey,autoIncrement: autoIncrement});
                objectStore.createIndex(indexName, indexFiled, { unique: true });
                // deferred.resolve(db);
            };
            return deferred.promise;
        }

        /**
         *  创建表和索引
         * @param db 数据库实例
         * @param tName 表名
         * @param pKey 表的主键字段名
         * @param autoIncrement 是否主键自增长
         * @param indexName 索引名称
         * @param indexFiled 索引指定的字段名
         */
        // static createTable(db,tName,pKey,autoIncrement,indexName,indexFiled){
        //     let objectStore = db.createObjectStore(tName,{keyPath:pKey,autoIncrement: autoIncrement});
        //     objectStore.createIndex(indexName, indexFiled, { unique: true });
        //     return objectStore;
        // }

        /**
         * 根据查询的主键查询数据
         * @param db 数据库实例
         * @param tName 表名
         * @param key 主键
         *  @returns {Promise | Promise<unknown>}
         */
        static getByPkey(db,tName,key){
            let deferred = defer.defer();
            let transaction = db.transaction([tName]);
            let objectStore = transaction.objectStore(tName);
            let request = objectStore.get(key);
            request.onerror = function(event) {
                deferred.resolve(null);
                // console.log(indexDbname + '_'+key + '数据查询报错');
            };

            request.onsuccess = function( event) {
                if (request.result) {
                    deferred.resolve(request.result);
                } else {
                    deferred.resolve(null);
                    // console.log(indexDbname + '_'+key + '数据查询为空！');
                }
            };
            return deferred.promise;
        }

        /**
         *
         * 根据key更新数据
         * @param db 数据库实例
         * @param tName 表名
         * @param key 主键
         * @param data
         * @returns {Promise | Promise<unknown>}
         */
        static setByKey(db,tName,key,data){
            let deferred = defer.defer();
            let transaction = db.transaction([tName],'readwrite');
            let objectStore = transaction.objectStore(tName);
            let request = objectStore.put({ key: key,data: data});

            request.onsuccess = function (event) {
                // console.log(indexDbName+'_'+key+'数据入库成功');
                deferred.resolve(true);
            };

            request.onerror = function (event) {
                // console.log(indexDbName+'_'+key + '数据入库失败');
                deferred.reject();
            };
            return deferred.promise;
        }
    }
    var IndexDBTool$1 = IndexDBTool;

    /**
     * 请求3dtiles瓦片，并将瓦片存到indexdb中
     */

    let isDbError = true;
    let keyMap = {};
    let db = null;
    let tName = '';

    //清理缓存后，重新获取indexdb的promise对象
    let catchPromise = null;
    //清理缓存后，出现indexdb异常的次数
    let catchCount = 0;

        /* global require */
      function request3dTiles(parameters, transferableObjects) {
            //初始化
            if(parameters.init == true){
                tName = parameters.tName;
                let defer1 = defer.defer();
                let useIndexDB = parameters.useIndexDB;
                if(!useIndexDB){
                    isDbError = true;
                    defer1.resolve();
                    return defer1.promise;
                }
                let promise = IndexDBTool$1.createDB(tName,'key',false,'keyIndex','key');
                promise.then(function(dbItem){
                  db = dbItem;
                  keyMap = {};
                  isDbError = false;
                  defer1.resolve();
                },function(e){
                  isDbError = true;
                  defer1.resolve();
                });
                return defer1.promise;
            }

            if(parameters.type == '3dtile'){
                //初次请求url
                let url = parameters.url;
                let resource = new Resource.Resource({url:url});
                resource.request.throttle = false;
                resource.request.throttleByServer = parameters.throttleByServer;
                resource.request.type = 2;
                resource.request.priorityFunction = createPriorityFunction(parameters.priority);

                return getTileData(resource,'arrayBuffer',transferableObjects);
            }

          if(parameters.type == 'image'){
              //初次请求url
              let url = parameters.url;
              let resource = new Resource.Resource({url:url});
              resource.request.throttle = false;
              resource.request.throttleByServer = true;
              resource.request.type = 2;
              return getTileData(resource,'image',transferableObjects);
          }
        }

        function createPriorityFunction(priority) {
            return function () {
                return priority;
            };
        }

        function getTileData(resource,type,transferableObjects){
            let defer1 = defer.defer();

            if(isDbError){
                return fetchArrayBufferAndSaveIndexDB(resource,defer1,type,transferableObjects).promise;
            }

            if(keyMap[resource._url]){// indexdb中没找到
                return fetchArrayBufferAndSaveIndexDB(resource,defer1,type,transferableObjects).promise;
            }

            let defer2 = defer.defer();
            try{
                defer2.promise = IndexDBTool$1.getByPkey(db,tName,resource._url);
            }catch (e) {
                let promise1 = catchIndexError();
                promise1.then(function (){
                    catchCount--;
                    if(catchCount == 0){
                        catchPromise = null;
                    }
                    defer2.promise = IndexDBTool$1.getByPkey(db,tName,resource._url);
                });
            }

            defer2.promise.then(function(result){
                if(result){
                    //返回从indexdb中取到的数据
                    transferableObjects.push(result.data);
                    // console.log('找到瓦片');
                    defer1.resolve(result.data);
                }else {
                    fetchArrayBufferAndSaveIndexDB(resource,defer1,type,transferableObjects);
                }
            });

            return defer1.promise;
        }


        function fetchArrayBufferAndSaveIndexDB(resource,defer1,type,transferableObjects){
            let promise1;
            if(type == 'image'){
                promise1 = resource.fetchImage({
                    skipColorSpaceConversion: true,
                    preferImageBitmap: true,
                    inWorker:true
                });
            }

            if(type == 'arrayBuffer'){
                promise1 = resource.fetchArrayBuffer();
            }

            if (!promise1) {
                defer1.resolve(null);
                keyMap[resource._url] = true;
                // console.log('重新请求： '+resource._url);
                return defer1;
            }

            // console.log('请求==========： '+resource._url);
            promise1.then(function(result1){
                if(isDbError){
                    delete keyMap[resource._url];
                    //返回从网络请求到的数据
                    transferableObjects.push(result1);
                    defer1.resolve(result1);
                    return;
                }

                // let promise2 = IndexDBTool.setByKey(db,tName,resource._url,result1);

                let defer2 = defer.defer();
                try{
                    defer2.promise = IndexDBTool$1.setByKey(db,tName,resource._url,result1);
                }catch (e) {
                    let promise1 = catchIndexError();
                    promise1.then(function (){
                        catchCount--;
                        if(catchCount == 0){
                            catchPromise = null;
                        }
                        defer2.promise = IndexDBTool$1.setByKey(db,tName,resource._url,result1);
                    });
                }

                defer2.promise.finally(function(){
                    delete keyMap[resource._url];
                    //返回从网络请求到的数据
                    transferableObjects.push(result1);
                    defer1.resolve(result1);
                });
            },function(e){
                defer1.reject(e);
            });

            return defer1;
        }


        function catchIndexError(){
            catchCount++;
            if (catchPromise){
                return catchPromise;
            }
            catchPromise = IndexDBTool$1.createDB(tName,'key',false,'keyIndex','key');
            catchPromise.then(function(dbItem){
                db = dbItem;
                keyMap = {};
            });
            return catchPromise;
        }

        var result = createTaskProcessorWorker(request3dTiles);

    return result;

}));
//# sourceMappingURL=Cesium3DtilesWorker.js.map
