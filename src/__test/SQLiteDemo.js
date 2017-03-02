/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ListView
} from 'react-native';
import BaseContainer from '../containers/BaseContainer'
import { Actions } from 'react-native-router-flux';
import SQLTransaction from '../common/SQLTransaction';
import PublicToast from '../components/PublicToast'

var SQLite = require('react-native-sqlite-storage');
SQLite.DEBUG(true);
SQLite.enablePromise(true);
SQLite.enablePromise(false);

var database_name = "Test.db";
var database_version = "1.0";
var database_displayname = "SQLite Test Database";
var database_size = 200000;
var db;

let initOfficeArr = [
    {
        name:'陕西',
        longtitude:59.8,
        latitude:34,
    },{
        name:'河南',
        longtitude:59.8,
        latitude:34,
    },{
        name:'四川',
        longtitude:59.8,
        latitude:34,
    },{
        name:'山西',
        longtitude:59.8,
        latitude:34,
    },{
        name:'北京',
        longtitude:59.8,
        latitude:34,
    },
];
let initDepartmentArr = [
    {
        name:'军情六处',
    },{
        name:'克格勃',
    },{
        name:'CIA',
    },{
        name:'啥东西',
    }
];
let initEmployeeArr = [
    {
        name:'王高',
        office:1,
        department:2,
    },{
        name:'王瑞华',
        office:1,
        department:2,
    },{
        name:'赵立峰',
        office:1,
        department:3,
    },{
        name:'李萌',
        office:1,
        department:3,
    },{
        name:'郭军帅',
        office:1,
        department:1,
    },{
        name:'高洁',
        office:1,
        department:1,
    }
]
export default class SQLiteDemo extends BaseContainer {

  runDemo=()=>{
    this.state.progress = ["Starting SQLite Demo"];
    this.setState(this.state);
    this.loadAndQueryDB();
  }

  loadAndQueryDB=()=>{
    this.state.progress.push("Opening database ...");
    this.setState(this.state);
    //1.打开数据库
    // db = SQLite.openDatabase(database_name, database_version, database_displayname, database_size, this.openCB, this.errorCB);
    SQLTransaction.openDatabase(
        function(isSuccess,result){
            if (isSuccess==true) {
                this.state.progress.push("Open database success...");
                this.setState(this.state);
            }else {
                this.state.progress.push("Open database fail...");
                this.setState(this.state);
            }
        }.bind(this)
    );
    this.populateDatabase(db);
  }

  constructor(props){
    super(props);
    this.state={
      progress: [],
      dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2,})
    }
  }

  componentWillUnmount=()=>{
    SQLTransaction.closeDatabase();
  }

  errorCB=(err)=> {
    PublicToast.logMessage("error: ",err);
    this.state.progress.push("Error: "+ (err.message || err));
    this.setState(this.state);
    return false;
  }

  successCB=()=> {
    PublicToast.logMessage("SQL executed ...");
  }

  openCB=()=> {
    this.state.progress.push("Database OPEN");
    this.setState(this.state);
  }

  closeCB=()=> {
    this.state.progress.push("Database CLOSED");
    this.setState(this.state);
  }

  deleteCB=()=> {
    PublicToast.logMessage("Database DELETED");
    this.state.progress.push("Database DELETED");
    this.setState(this.state);
  }

  populateDatabase=(db)=>{
    var that = this;
    that.state.progress.push("Database integrity check");
    that.setState(that.state);
    SQLTransaction.selectData('SELECT 1 FROM Version LIMIT 1',
        function(isSuccess,response){
            if (isSuccess==true) {
                that.state.progress.push("Database is ready ... executing query ...");
                that.setState(that.state);

                this.queryEmployees();
            }else {
                that.state.progress.push("version 中没有任何数据=数据库中应该没有内容");
                that.setState(that.state);
                that.newPopulateDB();
            }
        }.bind(this)
    )
  }

  newPopulateDB=()=>{
      this.state.progress.push("数据库中建表");
      this.state.progress.push("1.先清理数据库中可能的坏表");
      this.setState(this.state);

      // tx.executeSql('DROP TABLE IF EXISTS Employees;');
      SQLTransaction.deleteTable('Employees',function(isSuccess,result){
          if (isSuccess) {
            //   PublicToast.logMessage('drop Employees success');
          }else {
              PublicToast.logMessage('drop Employees failure');
          }
      });
      SQLTransaction.deleteTable('Offices',function(isSuccess,result){
          if (isSuccess) {
              PublicToast.logMessage('drop Offices success');
          }else {
              PublicToast.logMessage('drop Offices failure');
          }
      });
      SQLTransaction.deleteTable('Departments',function(isSuccess,result){
          if (isSuccess) {
            //   PublicToast.logMessage('drop Departments success');
          }else {
              PublicToast.logMessage('drop Departments failure');
          }
      });

      this.state.progress.push("2.建新表");
      this.setState(this.state);

      let createVersion = 'CREATE TABLE IF NOT EXISTS Version (version_id INTEGER PRIMARY KEY NOT NULL); ';
      let createDepartments = 'CREATE TABLE IF NOT EXISTS Departments( '
          + 'department_id INTEGER PRIMARY KEY NOT NULL, '
          + 'name VARCHAR(30) ); ';
      let createOffice = 'CREATE TABLE IF NOT EXISTS Offices( '
          + 'office_id INTEGER PRIMARY KEY NOT NULL, '
          + 'name VARCHAR(20), '
          + 'longtitude FLOAT, '
          + 'latitude FLOAT ) ; ';
      let createEmployees = 'CREATE TABLE IF NOT EXISTS Employees( '
          + 'employe_id INTEGER PRIMARY KEY NOT NULL, '
          + 'name VARCHAR(55), '
          + 'office INTEGER, '
          + 'department INTEGER, '
          + 'FOREIGN KEY ( office ) REFERENCES Offices ( office_id ) '
          + 'FOREIGN KEY ( department ) REFERENCES Departments ( department_id ));';

      SQLTransaction.createTable(createVersion,
          function(isSuccess,result){
              if (isSuccess == false) {
                  PublicToast.logMessage('表Version创建失败',result);
              }else {
                //   PublicToast.logMessage('表Version创建成功',result);
              }
          }
      )
      //建表并插入初始数据
      SQLTransaction.createTable(createDepartments,
          function(isSuccess,result){
              if (isSuccess == false) {
                  PublicToast.logMessage('表Department创建失败',result);
              }else {
                  PublicToast.logMessage('表Department创建成功',result);
              }
          }
      )

      SQLTransaction.createTable(createOffice,
          function(isSuccess,result){
              if (isSuccess == false) {
                  PublicToast.logMessage('表Office创建失败',result);
              }else {
                  PublicToast.logMessage('表Office创建成功',result);
              }
          }
      )

      SQLTransaction.createTable(createEmployees,
          function(isSuccess,result){
              if (isSuccess == false) {
                  PublicToast.logMessage('表Employees创建失败',result);
              }else {
                  PublicToast.logMessage('表Employees创建成功',result);
              }
          }
      )

      this.state.progress.push("3.在表中插入数据");
      this.setState(this.state);

      SQLTransaction.insertData('Offices',{office_id:1, name:'西点',longtitude:132.99,latitude:90.99});

      SQLTransaction.insertData('Departments',{department_id:1,name:'iOS开发'});
      SQLTransaction.insertData('Departments',{name:'android开发'});
      SQLTransaction.insertData('Departments',{name:'UI设计'});

      SQLTransaction.insertData('Version',{version_id:1},function(isSuccess,result){
          if (isSuccess) {
            //   PublicToast.logMessage('数据version插入成功');
          }else {
              PublicToast.logMessage('数据插入失败:',result);
          }
      })
      initEmployeeArr.map((item,index)=>{
          SQLTransaction.insertData('Employees',item,function(isSuccess,result){
              if (!isSuccess) {
                  PublicToast.logMessage('数据item:',item,'插入失败');
              }else {
                //   PublicToast.logMessage('数据item:',item,'插入成功');
              }
          });
      });
      //查
      this.queryEmployees();
      //改
      this.updateEmployees();

  }

  queryEmployees=()=> {
    this.state.progress.push("查询员工数据queryEmployees");
    SQLTransaction.selectData('SELECT emp.name,dep.name as deptname FROM Employees emp,Departments dep WHERE emp.department=dep.department_id',(isSuccess,result)=>{
        if (isSuccess) {
            this.state.progress.push('查询结果:');
            this.setState(this.state);
            let len = result.length;
            PublicToast.logMessage('search result.length'+len);

            for (var i = 0; i < result.length; i++) {
                let row = result.item(i);
                PublicToast.logMessage('result.item-'+i+':'+row.name);
                this.state.progress.push(i+':'+row.name+'-'+row.deptname);
            }
            this.setState(this.state);
        }else {
            this.state.progress.push('search failed:'+result);
            this.setState(this.state);
        }
    });
  }
  updateEmployees=()=>{
      let sqlStr = 'UPDATE Employees SET department=2 WHERE department=1 AND name="赵立峰"';
      SQLTransaction.updateData(sqlStr,(isSuccess,results)=>{
          if (isSuccess) {
              this.state.progress.push("更新成功");
              this.setState(this.state);

              for (var i = 0; i < result.length; i++) {
                  let row = result.item(i);
                  PublicToast.logMessage('result.item-'+i+':'+row.name);
                  this.state.progress.push(i+':'+row.name+'-'+row.deptname);
              }
          }
      })
  }
  queryEmployeesSuccess=(tx,results)=> {
    this.state.progress.push("Query completed");
    this.setState(this.state);
    var len = results.rows.length;
    for (let i = 0; i < len; i++) {
      let row = results.rows.item(i);
      this.state.progress.push(`Empl Name: ${row.name}, Dept Name: ${row.deptName}`);

    }
    this.setState(this.state);
  }

  deleteDatabase=()=>{
    this.state.progress = ["Deleting database"];
    this.setState(this.state);
    SQLTransaction.deleteDatabase();
  }

  closeDatabase=()=>{
    var that = this;
    if (db) {
      PublicToast.logMessage("Closing database ...");
      that.state.progress.push("Closing database");
      that.setState(that.state);
      db.close(that.closeCB,that.errorCB);
    } else {
      that.state.progress.push("Database was not OPENED");
      that.setState(that.state);
    }
  }

  renderProgressEntry=(entry)=>{
    return (
        <View style={listStyles.li}>
          <View>
            <Text style={listStyles.title}>{entry}</Text>
          </View>
        </View>
    )
  }
  pushDetailDemo=()=>{
    //   Actions.projectReady({title:'数据存储演示'});
      Actions.detailDemo();
  }
  render=()=>{
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return (
        <View style={styles.mainContainer}>
            {this.defaultRenderNavigationBar()}
            <View style={styles.toolbar}>
            <Text style={styles.toolbarButton} onPress={this.runDemo}>
              Run Demo
            </Text>
            <Text style={styles.toolbarButton} onPress={this.closeDatabase}>
              Close DB
            </Text>
            <Text style={styles.toolbarButton} onPress={this.deleteDatabase}>
              Delete DB
            </Text>
            <Text style={styles.toolbarButton} onPress={()=>this.pushDetailDemo()}>
              Detail
            </Text>
          </View>
          <ListView
            dataSource={ds.cloneWithRows(this.state.progress)}
            renderRow={this.renderProgressEntry}
            style={listStyles.liContainer}/>
        </View>
    );
  }
};

var listStyles = StyleSheet.create({
  li: {
    borderBottomColor: '#c8c7cc',
    borderBottomWidth: 0.5,
    paddingTop: 15,
    paddingRight: 15,
    paddingBottom: 15,
  },
  liContainer: {
    backgroundColor: '#fff',
    flex: 1,
    paddingLeft: 15,
  },
  liIndent: {
    flex: 1,
  },
  liText: {
    color: '#333',
    fontSize: 17,
    fontWeight: '400',
    marginBottom: -3.5,
    marginTop: -3.5,
  },
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  toolbar: {
    backgroundColor: '#51c04d',
    paddingTop: 30,
    paddingBottom: 10,
    flexDirection: 'row'
  },
  toolbarButton: {
    color: 'blue',
    textAlign: 'center',
    flex: 1
  },
  mainContainer: {
    flex: 1,
    backgroundColor:'white',
  }
});
