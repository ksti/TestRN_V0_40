/**
 * 帐号变更清除数据
 * Created by Mike on 2016/9/23.
 */
import {
    Platform,
} from 'react-native'

import SQLTransaction from '../../../common/SQLTransaction'
import DBStorage from '../../../common/DBStorage'
import GlobalSize from '../Global/GlobalSize'
import PublicToast from '../../../components/PublicToast'
import FileUtil from '../../../common/FileUtil'
var RNFS = FileUtil.RNFS;
var DocumentPath = RNFS.DocumentDirectoryPath;

var LoginNameUpdateClear = {
    clear(userName){
        // 预验收
        //清理数据库
        DBStorage.getValue(GlobalSize.Global_UserName,(result)=>{
            if(userName == result){

            }else{
                PreValideClear();
                ProjectAcceptanceRealMeasure();
            }
        });
    }
};
// 预验收
function PreValideClear() {
    // body...
    SQLTransaction.selectData("select * from sqlite_master where type = 'table'",(bol,result)=>{
        if(bol){
            for(let i=0;i<result.length;i++){
                let row = result.item(i);
                if(row.tbl_name=== 'KEYVALUE'){
                    SQLTransaction.deleteAllDataFromTable(row.tbl_name,(bol,result)=>{
                        PublicToast.logMessage('LoginNameUpdateClear==>'+row.tbl_name+'=='+bol+'=='+result);
                        DBStorage.setKeyValue(GlobalSize.Global_UserName,userName,()=>{});
                    });
                }else{
                    SQLTransaction.deleteAllDataFromTable(row.tbl_name,(bol,result)=>{PublicToast.logMessage('LoginNameUpdateClear==>'+row.tbl_name+'=='+bol+'=='+result);});
                }
            }
        }else{
            PublicToast.logMessage('LoginNameUpdateClear==>清理数据失败');
        }
    });
    //清理下载到本地的问题图片
    let downloadFilePath = DocumentPath + '/downloadImages/PreValideImage'
    FileUtil.deleteFile(downloadFilePath, (error,response)=>{
        if (error) {
            PublicToast.logMessage('清除附件图片成功');
        }else{
            PublicToast.logMessage('清除文件夹内容失败'+error);
        }
    });
    //删除本地验收时拍的照片
    if (Platform.OS === 'android') {
        let uploadImagesAndroid = RNFS.CachesDirectoryPath;
        uploadImagesAndroid = uploadImagesAndroid.slice(0,-1);
        PublicToast.logMessage('uploadImagesAndroid'+uploadImagesAndroid);
        FileUtil.readFile(uploadImagesAndroid,'utf8',(response,error)=>{
            PublicToast.logMessage('error:'+error);
            PublicToast.logMessage('response:'+response);
            if (response && response.length>0) {
                for (var i = 0; i < response.length; i++) {
                    let imgObj = response[i];
                    let path = imgObj.path;
                    FileUtil.deleteFile(path, (error,response)=>{
                        if (error) {
                            PublicToast.logMessage('清除验收图片成功');
                        }else{
                            PublicToast.logMessage('清除验收图片失败'+error);
                        }
                    });
                };
            };
        })
    }else{
        let uploadImagesIOS = RNFS.TemporaryDirectoryPath;
        uploadImagesIOS = uploadImagesIOS.slice(0,-1);
        PublicToast.logMessage('uploadImagesIOS'+uploadImagesIOS);
        FileUtil.readFile(uploadImagesIOS,'utf8',(response,error)=>{
            PublicToast.logMessage('error:'+error);
            PublicToast.logMessage('response:'+response);
            if (response) {
                for (var i = 0; i < response.length; i++) {
                    let imgObj = response[i];
                    let path = imgObj.path;
                    FileUtil.deleteFile(path, (error,response)=>{
                        if (error) {
                            PublicToast.logMessage('清除验收图片成功');
                        }else{
                            PublicToast.logMessage('清除验收图片失败'+error);
                        }
                    });
                };
            };
            
        })
    }
}
function ProjectAcceptanceRealMeasure() {
    SQLTransaction.deleteTable('PARMeasureUploadProcessTable',(isSuccess,result)=>{
        PublicToast.logMessage('删除实测实量在线层测量内容表'+isSuccess+'/'+result);
    });
    SQLTransaction.deleteTable('PARMeasureUploadImagesTable',(isSuccess,result)=>{
        PublicToast.logMessage('删除实测实量实测层附件表'+isSuccess+'/'+result);
    });
    SQLTransaction.deleteTable('PARMeasureDownFloorTable',(isSuccess,result)=>{
        PublicToast.logMessage('删除实测实量离线层信息表'+isSuccess+'/'+result);
    });
}

module.exports = LoginNameUpdateClear;
