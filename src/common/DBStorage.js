import SQLTransaction from './SQLTransaction'
import PublicToast from '../components/PublicToast'

var DBStorage = {

    getValue(myKey: string, callBack: Function) {
        SQLTransaction.openDatabase((isOpen, msg)=> {
            PublicToast.logMessage('DBStorage=getValue=打开数据库' + isOpen);
            if (isOpen) {
                PublicToast.logMessage('DBStorage=getValue=打开数据库成功');
                SQLTransaction.selectData("select 1 from sqlite_master where name = 'KEYVALUE' and type = 'table'", (checkTable, checkResult)=> {
                    PublicToast.logMessage('DBStorage=getValue=检查表结构是否成功' + checkTable + checkResult);
                    if (checkTable) {
                        if (checkResult && checkResult.length > 0) {
                            let sql = "select MY_VALUE from KEYVALUE where MY_KEY = '" + myKey + "'";
                            SQLTransaction.selectData(sql, (checkValue, valueResults)=> {
                                PublicToast.logMessage('DBStorage=getValue=' + checkValue + '==' + valueResults);
                                if (checkValue) {
                                    if (valueResults.length > 0) {
                                        if (callBack) {
                                            callBack(valueResults.item(0).MY_VALUE);
                                        }
                                    } else {
                                        if (callBack) {
                                            callBack(null);
                                        }
                                    }
                                } else {
                                    if (callBack) {
                                        callBack(null);
                                    }
                                }
                            });
                        } else {
                            SQLTransaction.createTable('CREATE TABLE IF NOT EXISTS KEYVALUE( MY_KEY VARCHAR(200) NOT NULL,MY_VALUE VARCHAR(500) NOT NULL)', (isCreate, createResult1)=> {
                                PublicToast.logMessage('DBStorage=getValue=创建表结构' + isCreate);
                                if (callBack) {
                                    callBack(null);
                                }
                            });
                        }
                    } else {
                        if (callBack) {
                            callBack(null);
                        }
                    }
                });
            } else {
                PublicToast.logMessage('DBStorage=getValue=打开数据库失败');
                if (callBack) {
                    callBack(null);
                }
            }
        });
    },

    setKeyValue(myKey: string, myValue: Object, callBack: Function) {
        SQLTransaction.openDatabase((isOpen, msg)=> {
            PublicToast.logMessage('DBStorage=setKeyValue=打开数据库' + isOpen);
            if (isOpen) {
                PublicToast.logMessage('DBStorage=setKeyValue=打开数据库成功');
                PublicToast.logMessage('DBStorage=setKeyValue=检查表结构是否存在');
                // select 1 from sqlite_master where name = 'person' and type = 'table'
                SQLTransaction.selectData("select 1 from sqlite_master where name = 'KEYVALUE' and type = 'table'", (checkTable, checkResult)=> {
                    PublicToast.logMessage('DBStorage=setKeyValue=检查表结构是否成功' + checkTable);
                    if (checkTable) {
                        PublicToast.logMessage('DBStorage=setKeyValue=检查表结构是否成功' + checkTable + checkResult.length);
                        if (checkResult && checkResult.length > 0) {
                            SQLTransaction.selectData("select 1 from KEYVALUE where MY_KEY = '" + myKey + "'", (checkRow, checkRowResult)=> {
                                PublicToast.logMessage('DBStorage=setKeyValue=检查是否存在' + checkRow);
                                if (checkRow) {
                                    if (checkRowResult.length > 0) {
                                        SQLTransaction.selectData("update KEYVALUE set MY_VALUE = '" + myValue + "' where MY_KEY = '" + myKey + "'", (isUpdate, updateResult)=> {
                                            PublicToast.logMessage('DBStorage=setKeyValue=修改数据结果' + isUpdate);
                                            if (callBack) {
                                                callBack(isUpdate);
                                            }
                                        });
                                    } else {
                                        SQLTransaction.selectData("insert into KEYVALUE values('" + myKey + "','" + myValue + "')", (isInsert, insertResult)=> {
                                            PublicToast.logMessage('DBStorage=setKeyValue=插入数据结果' + isInsert);
                                            if (callBack) {
                                                callBack(isInsert);
                                            }
                                        });
                                    }
                                } else {
                                    if (callBack) {
                                        callBack(false);
                                    }
                                }
                            });
                        } else {
                            SQLTransaction.createTable('CREATE TABLE IF NOT EXISTS KEYVALUE( MY_KEY VARCHAR(200) NOT NULL,MY_VALUE VARCHAR(500) NOT NULL)', (isCreate, createResult1)=> {
                                PublicToast.logMessage('DBStorage=setKeyValue=创建表结构' + isCreate);
                                if (isCreate) {
                                    SQLTransaction.selectData("insert into KEYVALUE values('" + myKey + "','" + myValue + "')", (isInsert, insertResult)=> {
                                        PublicToast.logMessage('DBStorage=setKeyValue=插入数据结果' + isInsert);
                                        if (callBack) {
                                            callBack(isInsert);
                                        }
                                    });
                                } else {
                                    if (callBack) {
                                        callBack(false);
                                    }
                                }
                            });
                        }
                    } else {
                        if (callBack) {
                            callBack(false);
                        }
                    }
                });
            } else {
                //创建数据失败
                PublicToast.logMessage('DBStorage=setKeyValue=打开数据库失败');
                if (callBack) {
                    callBack(false);
                }
            }
        });
    },
}
module.exports = DBStorage;
