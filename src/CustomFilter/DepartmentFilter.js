import React from "react";
import { TeamsView } from "@twilio/flex-ui";
import { FiltersListItemType } from "@twilio/flex-ui";
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

var dept = new Set()
var deptList = [];
var departments;
var selectedDept = [];
var deptLabel = '';

var hier = new Set()
var hierList = [];
var hierarchys;
var selectedHierarchys = [];
var hierarchyLabel = ''

var departmentQuery = ''
var queryString ='';
var queryStringHier ='';

var agent = new Set()
var agentList = [];
var agents;

var flexConstant
var managerConstant

export const DepartmentFilterList = (flex, manager) => {
  //store flex and manager value 
  flexConstant = flex
  managerConstant = manager

  // fetch team id of worker from worker attributes
  const worker_team_id = flex.Manager.getInstance().workerClient.attributes.team_id;

  // search department present in that team 
  manager.insightsClient.instantQuery('tr-worker').then((q) => {
      q.on('searchResult', (items) => {
        function department(item,callback){
          for (const [key, value] of Object.entries(item)) {
            var data = value.attributes['department'].replace(/["\[\]]/g, '')
            var array = data.split(",")
            array.forEach(i => {
              dept.add(i)
            })            
          }
          callback(dept);
        }
        //callback function
        function departmentList(data){
          deptList = [...data];
          departments = (deptList).filter((item)=>{
            return item;
          }).map((item) => ({
              value: item,
              isChecked: false,
              
          }));
        }

        // function call
        department(items,departmentList);
      });
      q.search('data.attributes.team_id=="'+worker_team_id+'"');
  });
}

const CustomFieldDepartment = ({handleChange,options}) =>{

  const onHandleChange = (i) => (e) => {
    e.preventDefault();
    departmentQuery = ''
    selectedDept = []
    deptLabel = ''
    queryString = ''

    departments[i].isChecked = !departments[i].isChecked
    
    departments.map(i => {
      if(i.isChecked == true)
      {
        selectedDept.push(i.value)
      }
    })
    
    
    selectedDept?.map((element)=>{
      deptLabel = deptLabel 
                  ? deptLabel+ ' , ' + element 
                  : element
      if(departmentQuery =='' )
      {
        departmentQuery = element
      }
      else
      {
        departmentQuery = departmentQuery + '\"'+' OR '+ 'data.attributes.department CONTAINS \"' + element 
      }
      if(queryString !='')
      {
        queryString = queryString + ' OR '
      }
      queryString = queryString + 'data.attributes.department CONTAINS "'+element+'" ';
    })
    
    hierarchyFilterHandler(flexConstant,managerConstant)
    AgentFilterHandler(flexConstant,managerConstant)
    
    handleChange(departmentQuery);
    
  }
  return (
    <FormGroup>
      {
        options?.map((opt,i) =>{
          return(
              <FormControlLabel
              control={
                <Checkbox
                  key={i+1}
                  onChange={onHandleChange(i)}
                  value={opt.value}
                  name={opt.value}
                  checked={opt.isChecked}
                />
              }
              label={opt.value}/>
          )
        })
      }
    </FormGroup>
  )
}

export const HierarchyFilterList = (flex, manager) => {
  hierarchyFilterHandler(flex,manager)
}

const hierarchyFilterHandler = (flex,manager) =>{
  // fetch team id of worker from worker attributes
  const worker_team_id = flex.Manager.getInstance().workerClient.attributes.team_id;

    hier = new Set();
    manager.insightsClient.instantQuery('tr-worker').then((q) => {
        q.on('searchResult', (items) => {
          function hierarchy(item,callback){
            for (const [key, value] of Object.entries(item)) {
              hier.add(value.attributes['team_name_in_hierarchy'])
            }
            callback(hier);
          }
          function hierarchyList(data){
            hierList = [...data];
            hierarchys = (hierList).filter((item)=>{
                return item;
            }).map((item) => ({
                value: item,
                isChecked: false,
            }));
          }
          hierarchy(items,hierarchyList);
        });
        if(queryString=='')
        {
          q.search('data.attributes.team_id=="'+worker_team_id+'"');
        }
        else
        {
          q.search('data.attributes.team_id=="'+worker_team_id+'" AND '+'(' +queryString + ')');
        }  
    });
}

const CustomFieldHierarchy = ({handleChange,options,currentValue}) =>{

  const onHandleChange = (i) => (e) => {
    e.preventDefault();
    selectedHierarchys = []
    queryStringHier = ''
    hierarchyLabel = ''

    hierarchys[i].isChecked = !hierarchys[i].isChecked
    
    hierarchys.map(i => {
      if(i.isChecked == true)
      {
        selectedHierarchys.push(i.value)
      }
    })
   
    
    selectedHierarchys?.map((element)=>{
      hierarchyLabel = hierarchyLabel 
                  ? hierarchyLabel+ ' , ' + element 
                  : element
      if(queryStringHier!='')
      {
        queryStringHier = queryStringHier + ' OR '
      }
      queryStringHier = queryStringHier + 'data.attributes.team_name_in_hierarchy=="'+element+'" ';
    })
    AgentFilterHandler(flexConstant,managerConstant)
    handleChange(selectedHierarchys);
  }
  return (
    <FormGroup>
      {
        options?.map((opt,i) =>{
          return(
              <FormControlLabel
              control={
                <Checkbox
                  key={i+1}
                  onChange={onHandleChange(i)}
                  value={opt.value}
                  name={opt.value}
                  checked={opt.isChecked}
                />
              }
              label={opt.value}/>
          )
        })
      }
    </FormGroup>
  )
}

export const AgentFilterList = (flex,manager) => {
  AgentFilterHandler(flex,manager)
}

const AgentFilterHandler = (flex,manager) => {
  const worker_team_id = flex.Manager.getInstance().workerClient.attributes.team_id;
  agent = new Set();
  manager.insightsClient.instantQuery('tr-worker').then((q) => {
      q.on('searchResult', (items) => {
        function agentName(item,callback){
          for (const [key, value] of Object.entries(item)) {
            agent.add(value.attributes['full_name'])
          }
          callback(agent);
        }
        function agentNameList(data){
          agentList = [...data];
          agents = (agentList).filter((item)=>{
            return item;
          }).map((item) => ({
              value: item,
              label: item,
          }));
        }
        agentName(items,agentNameList);
      });
      if(queryString=='' && queryStringHier=='')
      {
        q.search('data.attributes.team_id=="'+worker_team_id+'"');
      }
      else if(queryString!='' && queryStringHier=='')
      {
        q.search('data.attributes.team_id=="'+worker_team_id+'" AND '+queryString);
      }
      else if(queryStringHier!='' && queryString=='')
      {
        q.search('data.attributes.team_id=="'+worker_team_id+'" AND '+queryStringHier);
      }
      else
      {
        q.search('data.attributes.team_id=="'+worker_team_id+'" AND ('+queryString+ ') AND ('+ queryStringHier+')');
      }
      
  });
}

const CustomDeptLabel = ({ currentValue }) => (
  <>{deptLabel? deptLabel : "Any"}</>
);

const CustomHierLabel = ({ currentValue }) => (
  <>{hierarchyLabel?hierarchyLabel : "Any"}</>
);

export const DepartmentFilter = (appState, teamFiltersPanelProps) =>{
  return {
      id: "data.attributes.department",
      fieldName: "department",
      title: "Department",
      customStructure: {
      label: <CustomDeptLabel/>,
        field: <CustomFieldDepartment/>
      },
      options: departments,
      condition: "CONTAINS"
  }    
};

export const HierarchyFilter = (appState, teamFiltersPanelProps) =>{
  return {
      id: "data.attributes.team_name_in_hierarchy",
      fieldName: "team_name_in_hierarchy",
      title: "Team Name In Hierarchy",
      customStructure: {
      label: <CustomHierLabel/>,
        field: <CustomFieldHierarchy/>
      },
      options: hierarchys,
      condition: "IN"
  }    
};

export const AgentFilter = () =>{
  return {
      id: "data.attributes.full_name",
      fieldName: "full_name",
      title: "Name",
      type: FiltersListItemType.multiValue,
      options: agents,
      condition: "IN"
  } 
};

export const ResetFunction = () => {
  
}

export const ExtendFilter = (flex, manager) => {
    
  const worker_team_id = flex.Manager.getInstance().workerClient.attributes.team_id;
  flex.TeamsView.defaultProps.hiddenFilter = 'data.attributes.team_id=="'+worker_team_id+'"'
  // console.log(flex.TeamsView.defaultProps,"1000000000000000000000000000")
  // flex.Supervisor.TeamFiltersPanel = [{
    
  // }]

  manager.updateConfig({
      componentProps: {
          TeamsView: {
              filters:[
                  TeamsView.activitiesFilter,
                  DepartmentFilter,
                  HierarchyFilter,
                  AgentFilter,
              ],                
          },
      }
  })
  // manager.updateConfig({
  //   Supervisor:{
  //     TeamFiltersPanel:{
        
          
          
  //           handleResetFilters : ()=>{
  //             console.log("inside reset function")
  //           hierarchys.forEach(element,i => {
  //             hierarchys[i].isChecked = false
  //           });
  //           departments.forEach(element,i =>{
  //             departments[i].isChecked = false
  //           })
  //           queryString = ''
  //           queryStringHier = ''
  //           console.log(hierarchys,departments,"200000000000000000000")
  //           } 
          
        
  //     }
  //   }
  // })
};
